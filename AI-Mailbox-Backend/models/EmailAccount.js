import mongoose from "mongoose";

const emailAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    imapHost: { type: String, required: true },
    imapPort: { type: Number, default: 993 },
    security: { type: String, default: "SSL" },
    // In a real app, you should encrypt this password before saving!
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "error", "pending"],
      default: "active",
    },
    lastSynced: { type: Date, default: Date.now },
    // 🔥 Per-folder UID tracking
    lastSyncedUIDs: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    collection: "UserEmailAccounts",
  },
);

export const EmailAccount = mongoose.model("EmailAccount", emailAccountSchema);
