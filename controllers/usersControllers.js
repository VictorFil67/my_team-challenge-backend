import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { findUserById, updateUser } from "../services/userServices.js";

const addUserAddresses = async (req, res) => {
  const { _id } = req.user;
  const { buildings } = await findUserById(_id);
  buildings.push(req.body);
  const result = await updateUser(_id, buildings, "-password");
  res.status(200).json(result);
};

export default { addUserAddresses: ctrlWrapper(addUserAddresses) };
