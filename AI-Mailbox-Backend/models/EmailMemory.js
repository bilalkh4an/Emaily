import mongoose from 'mongoose';

const emailMemorySchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  threadId: { 
    type: String, 
    required: true, 
    index: true 
  }, // Group emails by conversation
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'assistant'] // 'user' = incoming email, 'assistant' = your reply
  },
  content: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Optimization: Create a compound index for fast thread retrieval per user
emailMemorySchema.index({ userId: 1, threadId: 1, createdAt: 1 });

export const EmailMemory = mongoose.model('EmailMemory', emailMemorySchema);