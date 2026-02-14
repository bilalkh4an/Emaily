import {
  fetchMailbox,
  fetchSentEmails,
  sentEmail,
  EmailAccounts,
} from "../Services/emailService.js";

export const getEmailAccounts = async (req, res) => {
  try {
    const emails = await EmailAccounts(req.params.userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const emails = await fetchSentEmails(req.params.userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendEmailHandler = async (req, res) => {
  const { to, subject, body, userId, inReplyToId } = req.body;
  try {
    const result = await sentEmail(to, subject, body, userId, inReplyToId);
    res.json(result);
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getMailBox = async (req, res) => {
  const { userId } = req.params;
  try {
    const emails = await fetchMailbox(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
