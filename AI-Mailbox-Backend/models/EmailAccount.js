import mongoose from 'mongoose';

const emailAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imapHost: { type: String, required: true },
  imapPort: { type: Number, default: 993 },
  security: { type: String, default: "SSL" },
  // In a real app, you should encrypt this password before saving!
  password: { type: String, required: true }, 
  status: { type: String, enum: ['active', 'error', 'pending'], default: 'active' },
  lastSynced: { type: Date, default: Date.now }
}, { 
  collection: 'UserEmailAccounts' 
});

export const EmailAccount = mongoose.model('EmailAccount', emailAccountSchema);