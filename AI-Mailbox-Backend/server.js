import app from "./app.js";
import { setupDatabase } from "./db.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await setupDatabase(); // Connect DB first
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Email AI Lab running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
