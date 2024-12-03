import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { updateUser } from "../services/userServices.js";

const addUserAddresses = async (req, res) => {
  const { _id } = req.user;
  const result = await updateUser(_id, req.body, "-password");
  res.status(200).json(result);
};

export default { addUserAddresses: ctrlWrapper(addUserAddresses) };
