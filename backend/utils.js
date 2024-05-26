import { User } from "./models/userModel.js";

export const checkSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const checkEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user && user !== null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};

export const checkUsername = async (username) => {
  try {
    const user = await User.findOne({ username: username }).exec();
    if (user && user !== null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
};