import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import { findUserById, updateUser } from "../services/userServices.js";

const addUserAddresses = async (req, res) => {
  const { _id, email, name } = req.user;
  const { residential_complex, building, entrance, apartment } = req.body;
  const { buildings } = await findUserById(_id);
  //   console.log(buildings);
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
  //   console.log(buildings);
  const result = await updateUser(_id, { buildings });
  const userEmail = {
    to: email,
    subject: "Your addresses",
    html: `<h1>Hello, ${name}!</h1>
        <p>Congratulations!</p><p>Your addresses have been successfully added to your profile.</p>
         <p>Now you need to wait for the moderator's approval</p>
         <p>You will be notified of this by email</p>
         <p>If you have any questions, you can always contact our support team.</p>
        <p style="margin-top: 10px;">Best regards,</p>
        <p style="margin-top: 10px;">The Teamchallenge Chat Team</p>`,
  };
  await sendEmail(userEmail);
  res.status(200).json(result);
};

export default { addUserAddresses: ctrlWrapper(addUserAddresses) };
