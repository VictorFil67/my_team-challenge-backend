import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const setTokens = (id, accessToken = "", refreshToken = "") => {
  const tokens = { accessToken, refreshToken };
  return User.findByIdAndUpdate(id, { tokens }, { new: true });
};

export async function updateUser(filter, data) {
  if (data.newPassword) {
    const { newPassword: password } = data;
    const hashPassword = await bcrypt.hash(password, 10); // const salt = await bcrypt.genSalt(10);
    return User.findOneAndUpdate(
      filter,
      { ...data, password: hashPassword },
      { new: true }
    );
  } else {
    return User.findOneAndUpdate(filter, data, { new: true });
  }
}
