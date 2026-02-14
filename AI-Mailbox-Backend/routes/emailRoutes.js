import express from "express";
import {
  getEmailAccounts,
  getMailBox,
  getConversation,
  sendEmailHandler,
} from "../Controller/emailController.js";

const router = express.Router();

router.get("/emailaccounts/:userId", getEmailAccounts);
router.get("/emails/fetch/:userId", getMailBox);
router.get("/emails/conversation/:userId", getConversation);
router.post("/sentemail", sendEmailHandler);

export default router;
