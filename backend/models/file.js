import mongoose from "mongoose";
import bcrypt from "bcrypt";

const FileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
  },
  password: String,
  isProtected: Boolean,
  size: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "10m", // This will delete the document after 10 minutes
  },
  expiresAt: Date,
});

FileSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }

  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  }

  next();
});

const File = mongoose.model("file", FileSchema);

export default File;
