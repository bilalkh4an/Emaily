import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEmailAccounts,
  getMailBox,
  getConversation,
  updateConversationFolder,
  updateConversationRead,
  sendEmailHandler,
  addImapAccount,
  getGoogleAuthUrl, 
  handleGoogleCallback,
} from "../Controller/emailController.js";


const router = express.Router();

router.get("/emailaccounts", protect, getEmailAccounts);
router.get("/emails/fetch/", protect, getMailBox);
router.get("/emails/conversation/", protect, getConversation);
router.post("/emails/update-conversation-folder/", protect, updateConversationFolder);
router.post("/emails/update-conversation-read/", protect, updateConversationRead);

router.post("/sentemail", protect, sendEmailHandler);
router.post("/create/imapaccount", protect, addImapAccount);

// Frontend hits this to get the link for the "Connect Google" button
router.post('/google/auth-url',protect, getGoogleAuthUrl);

// Google hits this automatically after the user logs in
router.get('/google/callback', handleGoogleCallback);




export default router;
