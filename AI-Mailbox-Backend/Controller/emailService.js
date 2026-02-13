import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { EmailAccount } from "../models/EmailAccount.js";
import nodemailer from "nodemailer";
import { saveFetchEmail } from "../training.js";
import { EmailMemory } from "../models/EmailMemory.js";
import MailComposer from "nodemailer/lib/mail-composer/index.js";

// function groupByThread(emails) {
//   const threads = {};
//   const messageMap = {};

//   // Index by Message-ID
//   emails.forEach((email) => {
//     if (email.messageId) {
//       messageMap[email.messageId] = email;
//     }
//   });

//   emails.forEach((email) => {
//     let threadId =
//       email.inReplyTo ||
//       (Array.isArray(email.references) && email.references[0]) ||
//       email.messageId ||
//       email.uid;

//     if (!threads[threadId]) {
//       threads[threadId] = [];
//     }

//     threads[threadId].push(email);
//   });

//   // Sort messages inside each thread by date
//   Object.values(threads).forEach((thread) =>
//     thread.sort((a, b) => new Date(a.date) - new Date(b.date)),
//   );

//   return threads;
// }

function getThreadId(email) {
  console.log("0");
  if (Array.isArray(email.references) && email.references.length > 0) {
    console.log("1");
    return email.references[0];
  }

  if (email.inReplyTo) {
    console.log("2");
    return email.inReplyTo;
  }
  console.log("3");
  return email.messageId;
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
      to: group[0].to,
      bilal: group[0].inReplyTo,
      subject: group[0].subject,
      sender: group[0].from.replace(/"/g, ""),
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

export async function fetchEmails(userId) {
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

    let emails = [];
    const folders = ["Inbox", "Sent"];

    try {
      for (const foldervalue of folders) {
        const mailbox = await client.mailboxOpen(foldervalue);

        // 2. SAFETY CHECK: If the folder has 0 messages, skip it
        if (mailbox.exists === 0) {
          console.log(`ℹ️ Folder "${foldervalue}" is empty. Skipping fetch.`);
          continue;
        }

        for await (let message of client.fetch("1:*", {
          source: true,
          envelope: true,
          uid: true,
        })) {
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
        }
      }
    } finally {
      inboxLock.release();
      sentLock.release();
    }

    await client.logout();

    // Step 1: Build threads from all fetched emails

    let threads = buildThreads(emails).map((thread) => {
      console.log(thread.to);
      return {
        ...thread,
        to: thread.to, // fallback if `to` is missing
        folder: "Inbox", // first message folder
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(thread.sender)}`, // avatar
      };
    });

    // Step 2: Save each thread to DB
    threads.forEach((thread) => {
      console.log("In reply to = " + thread.bilal);
      saveFetchEmail(
        userId,
        thread.folder,
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

export async function fetchInboxEmails(userId) {
  const account = await EmailMemory.find({ userId });
  if (!account) throw new Error("Account not found");
  return account;
}

export async function sentEmail(to, subject, body, userId, inReplyToId) {
  const transporter = nodemailer.createTransport({
    host: "mail.emaily.uk",
    port: 465,
    secure: true,
    auth: {
      user: "info@emaily.uk",
      pass: "Pakistan123!@#",
    },
  });

  console.log(inReplyToId);

  const mailOptions = {
    from: "info@emaily.uk",
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
    console.log("Email Sent vis SMTP ID = "+finalMessageId)

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
      host: "mail.emaily.uk",
      port: 993,
      secure: true,
      auth: {
        user: "info@emaily.uk",
        pass: "Pakistan123!@#",
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
