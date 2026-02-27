import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
} from "../Controller/generalController.js";

const router = express.Router();

router.get("/userprofile", protect, getUserProfile);

export default router;
