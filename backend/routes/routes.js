import express from "express";
import { downloadImage, uploadImage } from "../controller/image-controller.js";
import upload from "../utils/upload.js";
import File from "../models/file.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadImage);

router.get("/file/:fileId", downloadImage);
router.post("/file/:fileId", downloadImage);
// In your routes file (backend)
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
  else return (bytes / 1073741824).toFixed(2) + " GB";
}
// In your routes file (backend)
router.get("/download/:fileId", async (req, res) => {
  const file = await File.findById(req.params.fileId);
  if (!file) return res.status(404).send("File not found");

  const now = new Date();
  const expirationTime = new Date(file.expiresAt);

  console.log("Current time:", now);
  console.log("Expiration time:", expirationTime);

  const remainingTime = Math.max(0, Math.floor((expirationTime - now) / 1000));
  console.log("Remaining time (seconds):", remainingTime);

  if (remainingTime <= 0) {
    return res.status(410).send("Link has expired");
  }

  res.render("download", {
    fileId: req.params.fileId,
    isProtected: file.isProtected,
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    remainingTime: remainingTime,
  });
});
export default router;
