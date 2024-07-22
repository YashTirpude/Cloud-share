import schedule from "node-schedule";
import fs from "fs/promises";
import path from "path";
import File from "./file.js";

const cleanupJob = () => {
  schedule.scheduleJob("*/10 * * * *", async function () {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const expiredFiles = await File.find({
        createdAt: { $lt: tenMinutesAgo },
      });

      for (let file of expiredFiles) {
        // Delete the file from storage
        await fs.unlink(path.join(__dirname, file.path));

        // Delete the database entry
        await File.findByIdAndDelete(file._id);
      }

      console.log("Cleanup job completed");
    } catch (error) {
      console.error("Error in cleanup job:", error);
    }
  });
};

export default cleanupJob;
