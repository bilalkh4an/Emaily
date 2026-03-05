import {
  fetchMailbox,
  fetchSentEmails,
  sentEmail,
  EmailAccounts,
  createImapAccount,
} from "../Services/emailService.js";
import { google } from "googleapis";
import { EmailAccount } from "../models/EmailAccount.js";
import { encrypt } from "../utils/crypto.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI, 
);

// Google Email Add - Generate Auth URL ---
export const getGoogleAuthUrl = (req, res) => {
  const scopes = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // Essential for Refresh Token
    prompt: "consent", // Forces Google to provide refresh token every time
    scope: scopes,
    state: req.user.id, // Pass the internal DB userId to identify them on return
  });

  res.json({ url });
};

//  Google Email Add -: Handle Callback & Save to DB ---
export const handleGoogleCallback = async (req, res) => {
  const { code, state } = req.query; // 'state' is the userId we passed above
  const userId = state;

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get the user's email address from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const userEmail = userInfo.data.email;

    const account = await EmailAccount.findOneAndUpdate(
      { userId, email: userEmail },
      {
        userId,
        email: userEmail,
        authType: "google",
        refreshToken: encrypt(tokens.refresh_token), // Securely store
        imapHost: "imap.gmail.com",
        imapPort: 993,
      },
      { upsert: true, new: true },
    );

    // Redirect back to your frontend dashboard
    res.redirect(`${process.env.FRONTEND_URL}/settings?status=success`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?status=error`);
  }
};

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
    // Get page and limit from query, or use defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const emails = await fetchSentEmails(userId, page, limit);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendEmailHandler = async (req, res) => {
  const { from, to, subject, body, inReplyToId } = req.body;
  try {
    const userId = req.user.id; // comes from protect middleware
    const result = await sentEmail(
      from,
      to,
      subject,
      body,
      userId,
      inReplyToId,
    );
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
