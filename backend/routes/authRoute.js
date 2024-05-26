import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { checkEmail } from "../utils.js";

const router = express.Router();

router.get("/checkSession", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ logged: true, user: req.session.user });
  }
  {
    return res.status(401).json({ logged: false });
  }
});

router.post("/signin", async (req, res) => {
  const { email_username, password } = await req.body;
  try {
    let user;
    if (email_username.includes("@")) {
      user = await User.findOne({ email: email_username }).exec();
    } else {
      user = await User.findOne({ username: email_username }).exec();
    }
    if (!user) {
      return res.status(404).send("email or username don't found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      req.session.user = { id: user._id, username: user.username };
      return res.status(200).json({
        user: { id: user._id, username: user.username },
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, cf_password } = await req.body;
  try {
    if (!email || !password || !cf_password) {
      return res.status(400).send({
        message: "Send all required fields: email, password.",
      });
    }
    if (password !== cf_password) {
      return res.status(400).send({
        message: "Password not match",
      });
    }

    if (checkEmail(email) === true) {
      return res.status(400).send({
        message: "Email has already.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const username = email.split("@")[0];
    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Logout failed");
    } else {
      res.clearCookie("auth");
      console.log(req.session);
      res.send("Logout successful");
    }
  });
});

export default router;
