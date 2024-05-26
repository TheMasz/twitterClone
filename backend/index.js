import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import crypto from "crypto";

import authRoute from "./routes/authRoute.js";
import feedRoute from "./routes/feedRoute.js";
import profileRoute from "./routes/profileRoute.js";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const secretKey = crypto.randomBytes(64).toString("hex");
app.use(
  session({
    name: "auth",
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
    },
  })
);

app.get("/", (req, res) => {
  return res.status(200).send("this home page");
});

app.use("/auth", authRoute);
app.use("/feed", feedRoute);
app.use("/profile", profileRoute);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWRD}@db.ca2ih.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`
  )
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
