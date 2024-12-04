import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { findUserById, updateUser } from "../services/userServices.js";

const addUserAddresses = async (req, res) => {
  const { _id } = req.user;
  const { buildings } = await findUserById(_id);
  console.log(buildings);
  buildings.push({ ...req.body });
  console.log(buildings);
  const result = await updateUser(_id, { buildings });
  res.status(200).json(result);
};

export default { addUserAddresses: ctrlWrapper(addUserAddresses) };
