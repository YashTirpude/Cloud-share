import path from "path";
import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import DBConnection from "./database/db.js";
import cleanupJob from "./models/cleanupJob.js";

const app = express();

const __dirname = path.resolve();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
DBConnection();
cleanupJob();

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
