import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEmailAccounts,
  getMailBox,
  getConversation,
  sendEmailHandler,
} from "../Controller/emailController.js";

const router = express.Router();

router.get("/emailaccounts/:userId", getEmailAccounts);
router.get("/emails/fetch/:userId", getMailBox);
router.get("/emails/conversation/:userId", protect, getConversation);
router.post("/sentemail", sendEmailHandler);

export default router;
