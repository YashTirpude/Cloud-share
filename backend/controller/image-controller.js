import File from "../models/file.js";
import bcrypt from "bcrypt";

export const uploadImage = async (request, response) => {
  const { password } = request.body;
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  const fileObj = {
    path: request.file.path,
    name: request.file.originalname,
    size: request.file.size,
    isProtected: !!password,
    password: password || undefined,
    createdAt: new Date(),
  };

  try {
    const file = await File.create(fileObj);
    response.status(200).json({
      fileId: file._id,
      isProtected: file.isProtected,
      expiresAt: new Date(file.createdAt.getTime() + 10 * 60 * 1000),
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: error.message });
  }
};
export const downloadImage = async (request, response) => {
  try {
    const file = await File.findById(request.params.fileId);

    if (!file) {
      return response.status(404).send("File not found");
    }

    // Check if the file has expired
    if (file.expiresAt && file.expiresAt < new Date()) {
      return response.status(410).send("Link has expired");
    }

    if (file.isProtected) {
      let password;
      if (request.method === "POST") {
        password = request.body.password;
      } else if (request.method === "GET") {
        password = request.query.password;
      }

      if (!password) {
        return response.status(400).json({ message: "Password required" });
      }
      const isMatch = await bcrypt.compare(password, file.password);
      if (!isMatch) {
        return response.status(401).json({ message: "Incorrect password" });
      }
    }

    file.downloadCount++;
    await file.save();

    response.download(file.path, file.name);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ msg: error.message });
  }
};
