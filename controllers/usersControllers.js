import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { findUserById, updateUser } from "../services/userServices.js";

const addUserAddresses = async (req, res) => {
  const { _id } = req.user;
  const { residential_complex, building, entrance, apartment } = req.body;
  const { buildings } = await findUserById(_id);
  console.log(buildings);
  const existedAddress = buildings.find(
    (userAddress) =>
      userAddress.residential_complex === residential_complex &&
      userAddress.building === building &&
      userAddress.entrance === entrance &&
      userAddress.apartment === apartment
  );
  if (existedAddress) {
    throw HttpError(
      403,
      `This address already exists, so you can't write down this address once more`
      //   `You don't have access to this action, because you have already voted!`
    );
  }
  buildings.push({ ...req.body });
  console.log(buildings);
  const result = await updateUser(_id, { buildings });
  res.status(200).json(result);
};

export default { addUserAddresses: ctrlWrapper(addUserAddresses) };
