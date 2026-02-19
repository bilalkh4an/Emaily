import cron from "node-cron";
import { fetchMailbox } from "../Services/emailService.js";
import { User } from "../models/User.js";

let isRunning = false;

export const startMailboxCron = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    if (isRunning) {
      console.log("Previous job still running...");
      return;
    }
    isRunning = true;
    //console.log("Cron has Initiated");

    try {
      const userAccounts = await User.find();
      for (const userAccount of userAccounts) {
        await fetchMailbox(userAccount._id);
      }
    } catch (err) {
      console.error("Cron Error:", err);
    }

    isRunning = false;
    console.log(
      "Cron Job has Completed Successfully at",
      new Date().toLocaleString(),
    );
  });
};
