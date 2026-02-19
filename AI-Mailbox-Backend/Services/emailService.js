import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { EmailAccount } from "../models/EmailAccount.js";
import nodemailer from "nodemailer";
import { EmailMemory } from "../models/EmailMemory.js";
import MailComposer from "nodemailer/lib/mail-composer/index.js";

export async function fetchMailbox(userId) {
  const account = await EmailAccount.findOne({ userId });
  if (!account) throw new Error("Account not found");

  const client = new ImapFlow({
    host: account.imapHost,
    port: account.imapPort || 993,
    secure: true,
    auth: { user: account.email, pass: account.password },
  });

  try {
    await client.connect();

    const inboxLock = await client.getMailboxLock("INBOX");
    const sentLock = await client.getMailboxLock("Sent");    
    const folders = ["Inbox", "Sent"];
    let emails = [];

    try {
      for (const foldervalue of folders) {

        const mailbox = await client.mailboxOpen(foldervalue);

        if (mailbox.exists === 0) {
          console.log(`ℹ️ Folder "${foldervalue}" is empty. Skipping fetch.`);
          continue;
        }

        const lastUID = account.lastSyncedUIDs.get(foldervalue) || 0;
        const highestUID = mailbox.uidNext;
        const fetchRange = lastUID > 0 ? `${lastUID + 1}:${highestUID}` : "1:*";
        let maxUID = lastUID;

        for await (let message of client.fetch(
          { uid: fetchRange },
          {
            source: true,
            envelope: true,
            uid: true,
          },
        )) {
          const parsed = await simpleParser(message.source);
          emails.push({
            uid: message.uid,
            messageId: parsed.messageId,
            inReplyTo: parsed.inReplyTo,
            references: parsed.references,
            subject: parsed.subject,
            from: parsed.from?.text,
            to: parsed.to?.text,
            date: parsed.date,
            text: parsed.text,
            folder: foldervalue, // keep folder per email
          });

          if (message.uid > maxUID) maxUID = message.uid;
        }

        if (maxUID > lastUID) {
          account.lastSyncedUIDs.set(foldervalue, maxUID);
          await account.save();
        }
      }
    } finally {
      inboxLock.release();
      sentLock.release();
    }

    await client.logout();

    // Step 1: Build threads from all fetched emails

    let threads = buildThreads(emails).map((thread) => {
      return {
        ...thread,
        to: thread.to, // fallback if `to` is missing
        folder: "Inbox", // first message folder
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(thread.sender)}`, // avatar
      };
    });

    // Step 2: Save each thread to DB
    threads.forEach((thread) => {
      saveFetchEmail(
        userId,
        thread.folder,
        account.email,
        thread.sender,
        thread.to,
        thread.subject,
        thread.time,
        thread.messages.some((m) => m.unread), // unread flag
        thread.avatar,
        thread.messages,
        thread.threadId,
        "user",
      );
    });

    return emails; // return to caller
  } catch (error) {
    console.error("IMAP Error:", error);
    throw error;
  }
}

export async function fetchSentEmails(userId) {
  const account = await EmailMemory.find({ userId });
  if (!account) throw new Error("Account not found");
  return account;
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

  const transporter = nodemailer.createTransport({
    host: accountDetails.imapHost,
    port: 465,
    secure: true,
    auth: {
      user: accountDetails.email,
      pass: accountDetails.password,
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
        pass: accountDetails.password,
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
  const account = await EmailAccount.findOneAndUpdate(
    { email }, // Find by email
    { userId, email, imapHost, imapPort, password }, // Update these fields
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
        sender: email.from.replace(/"/g, ""),
        folder: email.folder,
        time: new Date(email.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        body: email.text,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email.from)}`,
        date: email.date,
      })),
      subject: group[0].subject,
      sender: displayRecipient.replace(/"/g, ""),
      time: new Date(group[group.length - 1].date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: group.some((e) => e.unread), // optional
    };
  });

  // Sort threads by last message time descending
  return threads.sort((a, b) => new Date(b.time) - new Date(a.time));
}
