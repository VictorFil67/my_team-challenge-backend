import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/User.js";
import { register, setTokens } from "../services/authServices.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { email, password } = req.body;
  // console.log(`*${password}*`);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "This email is already in use");
  }
  const newUser = await register(req.body);
  const payload = { id: newUser._id };
  console.log("payload: ", newUser._id);
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  console.log(token);
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  console.log(refreshToken);
  const tokens = setTokens(newUser._id, token, refreshToken);
  console.log(tokens);
  const loggedInUser = await User.findById({ _id: newUser._id }, "-password");
  res.status(201).json({
    loggedInUser,
  });
};

export default { signup: ctrlWrapper(signup) };
