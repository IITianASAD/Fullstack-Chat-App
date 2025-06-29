import express from "express";
// const express = require("express");
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import {app,server} from "./lib/socket.js";
import path from "path"; //built in

dotenv.config();
// const app = express();  

const PORT = process.env.PORT;
const __dirname = path.resolve();

// app.use(express.json());
app.use(express.json({ limit: '10mb' })); //If your image exceeds this size limit, as it did in my case, the server throws a 413 Payload Too Large error
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin : "http://localhost:5173",
  credentials:true,
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
  console.log("Server is running on Port: "+PORT);
  connectDB();
});
