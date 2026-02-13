import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    messageId: String,
    sender: String,
    folder: String,
    time: String,
    body: String,
    avatar: String,
    date: Date,
    role: String
  },
  { _id: false }
);

const emailMemorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  uid: {
    type: String,
  },
  folder: {
    type: String,
  },
  account: {
    type: String,
  },
  sender: {
    type: String,
  },
  subject: {
    type: String,
  },
  time: {
    type: String,
  },
  unread: {
  type: Boolean,
  default: true
},
  avatar: {
    type: String,
  },
  messages: [MessageSchema],
  threadId: {
    type: String,
    required: true,
    index: true,
  }, // Group emails by conversation
  role: {
    type: String,
    required: true,
    enum: ["user", "assistant"], // 'user' = incoming email, 'assistant' = your reply
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optimization: Create a compound index for fast thread retrieval per user
emailMemorySchema.index( { userId: 1, threadId: 1 },  { unique: true });

export const EmailMemory = mongoose.model("EmailMemory", emailMemorySchema);
