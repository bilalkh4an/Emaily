import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; 

// 1. Native Client (for your existing vector/collection logic)
const client = new MongoClient(MONGO_URI);
const db = client.db("email_training_lab");
const collection = db.collection("email_memory");

async function setupDatabase() {
  try {
    console.log(`🔌 Connecting to MongoDB at: ${MONGO_URI}`);
    
    // 2. Connect Mongoose (This fixes the VoiceDNA error)
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 
    });
    console.log("🚀 Mongoose Connected!");

    // 3. Connect Native Client
    await client.connect();
    console.log("✅ Native MongoClient Connected!");
    
  } catch (err) {
    console.error("❌ Database setup failed:", err);
    process.exit(1); // Stop the server if we can't connect
  }
}

export { collection, setupDatabase };