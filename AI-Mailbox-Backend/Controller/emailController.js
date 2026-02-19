import {
  fetchMailbox,
  fetchSentEmails,
  sentEmail,
  EmailAccounts,
  createImapAccount,
} from "../Services/emailService.js";

export const getEmailAccounts = async (req, res) => {
  try {
    const userId = req.user.id; // comes from protect middleware
    const emails = await EmailAccounts(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id; // comes from protect middleware
    const emails = await fetchSentEmails(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendEmailHandler = async (req, res) => {
  const { from, to, subject, body, inReplyToId } = req.body;
  try {
    const userId = req.user.id; // comes from protect middleware
    const result = await sentEmail( from, to, subject, body, userId, inReplyToId); 
    res.json(result);
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getMailBox = async (req, res) => {
  const userId = req.user.id; // comes from protect middleware
  try {
    const emails = await fetchMailbox(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addImapAccount = async (req, res) => {
  try {
    const userId = req.user.id; // comes from protect middleware
    const { email, imapHost, imapPort, password } = req.body;

    // 1. Basic Validation
    if (!email || !password || !imapHost) {
      return res.status(400).json({ error: "Missing required IMAP fields." });
    }

    // 2. Save or Update the account settings
    const addAccount = await createImapAccount(
      userId,
      email,
      imapHost,
      imapPort,
      password,
    );

    console.log(`📧 IMAP Account linked: ${email} for user ${userId}`);
    res.json({
      success: true,
      message: "Email account linked successfully!",
      addAccount,
    });
  } catch (error) {
    console.error("IMAP Save Error:", error);
    res.status(500).json({ error: "Failed to link email account." });
  }
};
