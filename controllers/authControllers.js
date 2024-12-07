import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import { register, setTokens } from "../services/authServices.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../helpers/sendEmail.js";
import { findUser } from "../services/userServices.js";
import bcrypt from "bcrypt";

dotenv.config();

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, name } = req.body;

  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "This email is already in use");
  }

  const newUser = await register(req.body);

  const payload = { id: newUser._id };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  const tokens = await setTokens(newUser._id, accessToken, refreshToken);
  console.log(tokens);

  const loggedInUser = await User.findById({ _id: newUser._id }, "-password");

  const userEmail = {
    to: email,
    subject: "Registration",
    html: `<h1>Hello, ${name}!</h1>
        <p>Congratulations!</p><p>You have registered successfully.</p>
         <p>Your next step is to add your address(addresses) to your profile by filling out the necessary form.</p>
         <p>If you have any questions, you can always contact our support team.</p>
        <p style="margin-top: 10px;">Best regards,</p>
        <p style="margin-top: 10px;">The Teamchallenge Chat Team</p>`,
  };

  await sendEmail(userEmail);

  res.status(201).json({
    loggedInUser,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong");
  }
  const { password: hashPassword, _id } = user;
  const compare = await bcrypt.compare(password, hashPassword);
  if (!compare) {
    throw HttpError(401, "Password is wrong");
  }

  const payload = { id: _id };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  await setTokens(_id, accessToken, refreshToken);

  const loggedInUser = await findUser({ _id });

  res.status(200).json(loggedInUser);
};

const logout = async (req, res) => {
  const { _id: id } = req.user;
  await setTokens(id);
  res.status(204).json();
  // res.json("Log out successful");
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  logout: ctrlWrapper(logout),
};
