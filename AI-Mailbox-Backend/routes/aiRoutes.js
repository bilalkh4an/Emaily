import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  setupVoice,
  generateDraft,
} from "../Controller/aiController.js";

const router = express.Router();

router.post("/setup-voice", protect, setupVoice);
router.post("/draft", protect, generateDraft);

export default router;
