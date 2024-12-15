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

export async function updateUser(filter, data, config) {
  if (data.newPassword || data.password) {
    // const { newPassword: password } = data;
    const hashPassword = await bcrypt.hash(
      data.newPassword ? data.newPassword : data.password,
      10
    ); // const salt = await bcrypt.genSalt(10);
    return User.findOneAndUpdate(
      filter,
      { ...data, password: hashPassword },
      config,
      { new: true }
    );
  } else {
    return User.findOneAndUpdate(filter, data, config, { new: true });
  }
}

export async function recoverPassword(tempCode, data) {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.findOneAndUpdate(
    { tempCode },
    {
      password: hashPassword,
      $unset: { tempCode: "", tempCodeTime: "" },
      // $unset: { tempCode },
    } //$unset — оператор, который удаляет указанное поле из документа. Значение в $unset не имеет значения (можно использовать пустую строку или null), главное указать имя поля.MongoDB ожидает, что объект $unset будет единым, и все поля для удаления должны быть указаны в нем.
  );
}
// "password": "$2b$10$dCij5bXMhJPwK.6y2fqrdOoB0wRCqBGNCDxPgR//YBknQEqxIVRkS"
// "password": "$2b$10$aPUhFwz.em4j9tEIXg7eeexUuXyV4d13cPP0InaV0Cdzr8F2mJFd2"
