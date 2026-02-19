import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEmailAccounts,
  getMailBox,
  getConversation,
  sendEmailHandler,
  addImapAccount,
} from "../Controller/emailController.js";

const router = express.Router();

router.get("/emailaccounts", protect, getEmailAccounts);
router.get("/emails/fetch/", protect, getMailBox);
router.get("/emails/conversation/", protect, getConversation);
router.post("/create/imapaccount", protect, addImapAccount);
router.post("/sentemail", protect, sendEmailHandler);

export default router;
