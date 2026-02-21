import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { EmailAccount } from "../models/EmailAccount.js";
import nodemailer from "nodemailer";
import { EmailMemory } from "../models/EmailMemory.js";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import EmailReplyParser from "email-reply-parser";
import { encrypt,decrypt } from "../utils/crypto.js";

export async function fetchMailbox(userId) {
  const accounts = await EmailAccount.find({ userId });
  //if (!accounts.length) throw new Error("Account not found");
  if (!accounts.length) {
  console.log(`No accounts found for user ${userId}`);
  return;
}

  for (const account of accounts) {
    try {
      // Step 1: Fetch raw emails for THIS account only
      const emails = await fetchRawEmails(account);
      if (emails.length === 0) continue;

      // Step 2: Group them into local threads
      const threads = groupEmailsIntoThreads(emails);

      // Step 3: Link with Database and Save
      for (const thread of threads) {
        await linkAndSaveThread(userId, account.email, thread);
      }

      console.log(`✅ Sync complete for: ${account.email}`);
    } catch (error) {
      console.error(`❌ IMAP Error for ${account.email}:`, error);
    }
  }
  return "Sync Finished";
}

export async function fetchSentEmails(userId) {
  const account = await EmailMemory.find({ userId }).sort({ date: -1 });
  if (!account) throw new Error("Account not found");
  return account;

  // sort threads as per latest inbox message

  // const threads = await EmailMemory.aggregate([
  //   // Step 1: Compute latest Inbox message date per thread
  //   {
  //     $addFields: {
  //       latestInboxMessageDate: {
  //         $max: {
  //           $map: {
  //             input: "$messages",
  //             as: "msg",
  //             in: {
  //               $cond: [{ $eq: ["$$msg.folder", "Inbox"] }, "$$msg.date", null],
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   // Step 2: Sort threads by latestInboxMessageDate descending
  //   { $sort: { latestInboxMessageDate: -1 } },
  // ]);
  // return threads;
}

export async function EmailAccounts(userId) {
  const accounts = await EmailAccount.find({ userId }).populate("userId"); // automatically fetch user data
  return accounts;
}

export async function sentEmail(from, to, subject, body, userId, inReplyToId) {
  const accountDetails = await EmailAccount.findOne({
    userId,
    email: from,
  }).populate("userId");  

  const decryptedPassword = decrypt(accountDetails.password);

  const transporter = nodemailer.createTransport({
    host: accountDetails.imapHost,
    port: 465,
    secure: true,
    auth: {
      user: accountDetails.email,
      pass: decryptedPassword,
    },
  });

  console.log(inReplyToId);

  const mailOptions = {
    from: from,
    to,
    subject,
    text: body,
    // --- THREADING HEADERS ---
    // If inReplyToId exists, add it to the headers
    ...(inReplyToId && {
      inReplyTo: inReplyToId,
    }),
  };

  try {
    // 1️⃣ Send via SMTP
    const info = await transporter.sendMail(mailOptions);
    const finalMessageId = info.messageId; // This is the 'Real' ID the receiver sees
    console.log("Email Sent vis SMTP ID = " + finalMessageId);

    // 2️⃣ Build the IMAP copy using that EXACT same ID
    const composer = new MailComposer({
      ...mailOptions,
      messageId: finalMessageId, // 👈 THIS IS THE FIX: It forces both to be the same
    });

    const rawMessage = await new Promise((resolve, reject) => {
      composer.compile().build((err, message) => {
        if (err) reject(err);
        else resolve(message);
      });
    });

    // 3️⃣ Connect to IMAP and append to Sent
    const client = new ImapFlow({
      host: accountDetails.imapHost,
      port: 993,
      secure: true,
      auth: {
        user: accountDetails.email,
        pass: decryptedPassword,
      },
      logger: false,
    });

    await client.connect();
    try {
      await client.append("INBOX.Sent", rawMessage, ["\\Seen"]);
      console.log("📁 Saved to Roundcube Sent folder");
    } finally {
      await client.logout();
    }
  } catch (error) {
    console.error("Send email error:", error);
    throw error;
  }
}

export async function createImapAccount(
  userId,
  email,
  imapHost,
  imapPort,
  password,
) {
  const encryptedPassword = encrypt(password);

  const account = await EmailAccount.findOneAndUpdate(
    { email }, // Find by email
    { userId, email, imapHost, imapPort, password:encryptedPassword, }, // Update these fields
    { upsert: true, new: true }, // Create if doesn't exist
  );

  if (!account) throw new Error("Account not found");
  return account;
}

async function saveFetchEmail(
  userId,
  folder,
  account,
  sender,
  to,
  subject,
  time,
  unread,
  avatar,
  messages,
  threadId,
  role,
  date,
) {
  try {
    if (!threadId) {
      console.error("Skipping save: No threadId provided");
      return;
    }
    // 2. Sort messages descending by date (latest first)
    const sortedMessages = messages.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const result = await EmailMemory.findOneAndUpdate(
      { userId: userId, threadId: threadId },
      {
        $set: {
          folder,
          account,
          sender,
          subject,
          time,
          unread,
          avatar,
          messages: sortedMessages, // Use the sorted array here
          role: "user",
          date,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log(
      `💾 Sync Successful: Thread ${threadId} saved with ${sortedMessages.length} messages in order.`,
    );
  } catch (error) {
    console.error("❌ MongoDB Update Error:", error);
  }
}

function buildThreads(emails) {
  const emailMap = {};
  const parentMap = {}; // For union-find

  // Initialize maps
  emails.forEach((email) => {
    emailMap[email.messageId] = email;
    parentMap[email.messageId] = email.messageId;
  });

  // Union-Find helpers
  function find(x) {
    if (parentMap[x] !== x) parentMap[x] = find(parentMap[x]);
    return parentMap[x];
  }

  function union(x, y) {
    if (!parentMap[x] || !parentMap[y]) return;
    const px = find(x);
    const py = find(y);
    if (px !== py) parentMap[py] = px;
  }

  // Step 1: union emails based on references and inReplyTo
  emails.forEach((email) => {
    if (Array.isArray(email.references)) {
      email.references.forEach((ref) => {
        if (parentMap[ref]) union(email.messageId, ref);
      });
    }
    if (email.inReplyTo && parentMap[email.inReplyTo]) {
      union(email.messageId, email.inReplyTo);
    }
  });

  // Step 2: assign threadId based on earliest message in the group
  const threadGroups = {};
  emails.forEach((email) => {
    const root = find(email.messageId);
    if (!threadGroups[root]) threadGroups[root] = [];
    threadGroups[root].push(email);
  });

  const threads = Object.values(threadGroups).map((group) => {
    // Sort by date ascending
    group.sort((a, b) => new Date(a.date) - new Date(b.date));
    const threadId = group[0].messageId;

    // --- LOGIC TO FIND THE CORRECT "TO" ---
    // We want the email address of the OTHER person, not our own.
    // 1. Look for the first message in the Inbox (sent by them)
    const inboxMsg = group.find((m) => m.folder === "Inbox");
    // 2. Look for the first message in Sent (sent to them)
    const sentMsg = group.find((m) => m.folder === "Sent");

    // Logic: If there is an Inbox message, use its 'From' as the thread contact.
    // If only Sent exists, use the 'To' of that Sent message.
    const displayRecipient = inboxMsg
      ? inboxMsg.from
      : sentMsg
        ? sentMsg.to
        : group[0].to;
    // ---------------------------------------

    return {
      threadId,
      messages: group.map((email) => ({
        messageId: email.messageId,
        inReplyTo: email.inReplyTo, // <--- ADD THIS
        references: email.references, // <--- ADD THIS
        sender: email.from.replace(/"/g, ""),
        folder: email.folder,
        time: new Date(email.date).toLocaleString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        body: email.text,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email.from)}`,
        date: email.date,
      })),
      subject: group[0].subject,
      sender: displayRecipient.replace(/"/g, ""),
      time: new Date(group[group.length - 1].date).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: group.some((e) => e.unread), // optional
      date: group[group.length - 1].date,
    };
  });

  // Sort threads by last message time descending
  return threads.sort((a, b) => new Date(b.time) - new Date(a.time));
}

async function fetchRawEmails(account) {
  const decryptedPassword = decrypt(account.password);
  const client = new ImapFlow({
    host: account.imapHost,
    port: account.imapPort || 993,
    secure: true,
    auth: { user: account.email, pass: decryptedPassword },
    logger: false,
  });

  const emails = [];
  await client.connect();

  try {
    const folders = ["Inbox", "Sent"];
    for (const folder of folders) {
      const mailbox = await client.mailboxOpen(
        folder == "Inbox" ? "INBOX" : folder,
      );
      if (mailbox.exists === 0) continue;

      const lastUID = account.lastSyncedUIDs.get(folder) || 0;
      const highestUID = mailbox.uidNext;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const fetchRange =
        lastUID > 0
          ? { uid: `${lastUID + 1}:${highestUID}` }
          : { since: thirtyDaysAgo };
      let maxUID = lastUID;

      // Below Code to fetch last 500 Emaily if new account

      // const HighestUID = mailbox.uidNext - 1;
      // const windowSize = 500;
      // const minUID = Math.max(1, HighestUID - windowSize + 1);
      // const fetchRange = lastUID > 0 ? { uid: `${lastUID + 1}:${highestUID}`}: {uid: `${minUID}:${HighestUID}` };

      for await (let message of client.fetch(fetchRange, {
        source: true,
        uid: true,
      })) {
        const parsed = await simpleParser(message.source);
        const parser = new EmailReplyParser();
        const lastMessage = parser.read(parsed.text).getVisibleText();

        emails.push({
          uid: message.uid,
          messageId: parsed.messageId,
          inReplyTo: parsed.inReplyTo,
          references: parsed.references,
          subject: parsed.subject,
          from: parsed.from?.text,
          to: parsed.to?.text,
          date: parsed.date,
          text: lastMessage,
          folder: folder,
        });
        if (message.uid > maxUID) maxUID = message.uid;
      }

      if (maxUID > lastUID) {
        account.lastSyncedUIDs.set(folder, maxUID);
        await account.save();
      }
    }
  } finally {
    await client.logout();
  }
  return emails;
}

function groupEmailsIntoThreads(emails) {
  return buildThreads(emails).map((thread) => ({
    ...thread,
    folder: "Inbox",
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(thread.sender)}`,
  }));
}

async function linkAndSaveThread(userId, accountEmail, thread) {
  const newBatchIds = thread.messages.map((m) => m.messageId).filter(Boolean);
  const newBatchParents = thread.messages
    .map((m) => m.inReplyTo)
    .filter(Boolean);

  // Check if thread exists in DB
  const existingRecord = await EmailMemory.findOne({
    userId,
    $or: [
      { "messages.messageId": { $in: newBatchIds } },
      { "messages.messageId": { $in: newBatchParents } },
      { subject: thread.subject, sender: thread.sender },
    ],
  });

  let finalMessages = thread.messages;
  let threadIdToUse = thread.threadId;

  if (existingRecord) {
    threadIdToUse = existingRecord.threadId;
    const existingIds = new Set(
      existingRecord.messages.map((m) => m.messageId),
    );
    const trulyNew = thread.messages.filter(
      (m) => !existingIds.has(m.messageId),
    );

    // Merge history with new emails
    finalMessages = [...existingRecord.messages, ...trulyNew];
  }

  await saveFetchEmail(
    userId,
    thread.folder,
    accountEmail,
    thread.sender,
    thread.to,
    thread.subject,
    thread.time,
    thread.messages.some((m) => m.unread),
    thread.avatar,
    finalMessages,
    threadIdToUse,
    "user",
    thread.date,
  );
}
