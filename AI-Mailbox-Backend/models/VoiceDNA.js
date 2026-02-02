import mongoose from 'mongoose';

const voiceDNASchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  voiceDNA: {
    vocabulary: mongoose.Schema.Types.Mixed,
    sentence_structure: mongoose.Schema.Types.Mixed,
    tone: mongoose.Schema.Types.Mixed,
    language_patterns: mongoose.Schema.Types.Mixed,
    communication_style: mongoose.Schema.Types.Mixed,
    insights: mongoose.Schema.Types.Mixed
  },
  createdAt: { type: Date, default: Date.now }
});

// Using Mixed types because the AI output structure can vary slightly
export const VoiceDNA = mongoose.model('VoiceDNA', voiceDNASchema);