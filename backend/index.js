import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import DBConnection from "./database/db.js";
import cleanupJob from "./models/cleanupJob.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;
DBConnection();
cleanupJob();

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
