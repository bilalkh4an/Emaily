import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { EmailAccount } from '../models/EmailAccount.js';
import nodemailer from 'nodemailer';



function groupByThread(emails) {
    const threads = {};
    const messageMap = {};

    // Index by Message-ID
    emails.forEach(email => {
        if (email.messageId) {
            messageMap[email.messageId] = email;
        }
    });

    emails.forEach(email => {
        let threadId =
            email.inReplyTo ||
            (Array.isArray(email.references) && email.references[0]) ||
            email.messageId ||
            email.uid;

        if (!threads[threadId]) {
            threads[threadId] = [];
        }

        threads[threadId].push(email);
    });

    // Sort messages inside each thread by date
    Object.values(threads).forEach(thread =>
        thread.sort((a, b) => new Date(a.date) - new Date(b.date))
    );

    return threads;
}

export async function fetchEmails(userId) {
    
    const account = await EmailAccount.findOne({ userId });
    if (!account) throw new Error("Account not found");

    const client = new ImapFlow({
        host: account.imapHost,
        port: account.imapPort || 993,
        secure: true,
        auth: { user: account.email, pass: account.password }
    });

    try {
        await client.connect();

        let lock = await client.getMailboxLock('INBOX');
        let emails = [];

        try {
            for await (let message of client.fetch('1:*', { source: true, envelope: true, uid: true })) {
                const parsed = await simpleParser(message.source);
                emails.push({
                    uid: message.uid,
                    messageId: parsed.messageId,
                    inReplyTo: parsed.inReplyTo,
                    references: parsed.references,
                    subject: parsed.subject,
                    from: parsed.from?.text,
                    date: parsed.date,
                    text: parsed.text
                });
            }
        } finally {
            lock.release();
        }

        await client.logout();

        const threads = groupByThread(emails);
        
       // return threads;   //for threaded conversation only

       return emails;





    } catch (error) {
        console.error("IMAP Error:", error);
        throw error;
    }
}

export async function sentEmail() {



const transporter = nodemailer.createTransport({
    host: 'mail.emaily.uk',
    port: 465,
    secure: true,
    auth: {
        user: 'info@emaily.uk',
        pass: 'Pakistan123!@#'
    }
});

// Example usage
const mailOptions = {
    from: 'info@emaily.uk',
    to: 'bilal.kh4an@gmail.com',
    subject: 'Hello from React!',
    text: 'This email was sent via SMTP through Node.js.'
};

transporter.sendMail(mailOptions);
    
}
