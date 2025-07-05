//Imports:
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

//create app using express:
const app = express();

//port set up:
const PORT = process.env.PORT || 5000;

//Middleware: tell server to expect json data as incoming req
app.use(express.json());

//get url of file where you run node i.e server.js and convert it into local path
//Note we did this so server.js become starting point to find other files path locally
const __filename = fileURLToPath(import.meta.url);

//find directory name of the file server.js
const __dirname = dirname(__filename);
//Routers:
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

//tells server to direct to public folder to get static assests i.e CSS files/imgs
app.use(express.static(path.join(__dirname, "../public")));

//setting up app response to send back HTML:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use((req, res) => {
  res.status(404).send("Routes dont found");
});

//listen to incoming request:
app.listen(PORT, () => {
  console.log(`server has started at PORT : ${PORT}`);
});
