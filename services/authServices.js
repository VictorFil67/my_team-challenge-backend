import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const setTokens = (id, accessToken = "", refreshToken = "") => {
  return User.findByIdAndUpdate(
    id,
    { accessToken, refreshToken },
    { new: true }
  );
};

// export function setTokens(id, accessToken = "", refreshToken = "") {
//   return User.findByIdAndUpdate(
//     id,
//     { accessToken, refreshToken },
//     { new: true }
//   );
// }
