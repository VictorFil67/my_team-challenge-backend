import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import { findComplex } from "../services/complexServices.js";
import {
  findUser,
  findUserById,
  updateUser,
  updateUserAddress,
} from "../services/userServices.js";
import "dotenv/config";

const { DEPLOY_HOST } = process.env;

const addUserAddresses = async (req, res) => {
  const { _id, email, name } = req.user;
  const { residential_complex, building, entrance, apartment } = req.body;

  const existedAddress = await findComplex({
    buildings: {
      $elemMatch: {
        address: building,
        apartments: { $elemMatch: { number: apartment, entrance: entrance } },
      },
    },
  });
  if (!existedAddress) {
    throw HttpError(
      400,
      `The address: residential complex - ${residential_complex}, building - ${building}, entrance - ${entrance}, apartment - ${apartment} does not exist! Enter the correct data`
    );
  }
  console.log(existedAddress);
  const { buildings } = await findUserById(_id);

  const existedUserAddress = buildings.find(
    (userAddress) =>
      userAddress.residential_complex === residential_complex &&
      userAddress.building === building &&
      userAddress.entrance === entrance &&
      userAddress.apartment === apartment
  );
  if (existedUserAddress) {
    throw HttpError(
      403,
      `This address already exists, so you can't write down this address once more`
    );
  }
  buildings.push({ ...req.body });

  const result = await updateUser(_id, { buildings });

  const { email: adminEmail } = await findUser({ is_admin: true });
  console.log(`adminEmail: ${adminEmail}`);
  // xegoxa5375sw@cantozil.com
  const userEmail = {
    to: email,
    subject: "Your addresses",
    html: `<h1>Hello, ${name}!</h1>
        <p>Congratulations!</p><p>Your addresses <span style='font-weight: bold; color: green;'>(residential complex - ${residential_complex}, building - ${building}, entrance - ${entrance}, apartment - ${apartment})</span> have been successfully added to your profile.</p>
         <p>Now you need to wait for the moderator's approval.</p>
         <p>You will be notified of this by email.</p>
         <p>If you have any questions, you can always contact our support team.</p>
        <p style="margin-top: 10px;">Best regards,</p>
        <p style="margin-top: 10px;">The Teamchallenge Chat Team</p>`,
  };

  const emailOfAdmin = {
    to: adminEmail,
    subject: "For approving",
    html: `<p>The user ${name} has applied for approving his address <span style='font-weight: bold; color: green;'>(residential complex - ${residential_complex}, building - ${building}, entrance - ${entrance}, apartment - ${apartment})</span></p>
    <p>Please follow the link below to approve</p>
    <a href='${DEPLOY_HOST}/approve/${_id}?residential_complex=${residential_complex}&building=${building}&entrance=${entrance}&apartment=${apartment}' style='margin-top: 20px; font-size:18px; font-weight:bold; color:red' target='_blank'>Click to approve</a>
    `,
  };

  await sendEmail(userEmail);
  await sendEmail(emailOfAdmin);
  res.status(200).json(result);
};

const deleteUserAddress = async (req, res) => {
  const { _id, email, name } = req.user;
  const { residential_complex, building, entrance, apartment } = req.body;

  const { buildings } = await findUserById(_id);

  const existedUserAddress = buildings.find(
    (userAddress) =>
      userAddress.residential_complex === residential_complex &&
      userAddress.building === building &&
      userAddress.entrance === entrance &&
      userAddress.apartment === apartment
  );
  if (!existedUserAddress) {
    throw HttpError(
      400,
      `Sorry, but this address doesn't exist in your addresses list, so you have to enter the correct address`
    );
  }
  const newBuildings = await buildings.filter(
    (userAddress) =>
      userAddress.residential_complex !== residential_complex ||
      userAddress.building !== building ||
      userAddress.entrance !== entrance ||
      userAddress.apartment !== apartment
  );
  const result = await updateUser(_id, { buildings: newBuildings });

  res.json(result);
};

const approveUserAddress = async (req, res) => {
  const { userId } = req.params;
  const { residential_complex, building, entrance, apartment } = req.query;
  const { _id } = req.user;

  const { is_admin } = await findUserById(_id);
  console.log(is_admin);
  if (!is_admin) {
    throw HttpError(
      403,
      "Sorry, you must be an administrator to perform this action."
    );
  }

  const { modifiedCount, matchedCount } = await updateUserAddress(
    { _id: userId },
    {
      $set: { "buildings.$[elem].approved": true },
    },
    {
      arrayFilters: [
        {
          "elem.residential_complex": residential_complex,
          "elem.building": building,
          "elem.apartment": apartment,
          "elem.entrance": entrance,
        },
      ],
    }
  );
  if ((modifiedCount !== 1 && matchedCount === 1) || matchedCount === 0) {
    throw HttpError(400, "The wrong request data");
  }
  res.json("User address data was approved");
};

export default {
  addUserAddresses: ctrlWrapper(addUserAddresses),
  deleteUserAddress: ctrlWrapper(deleteUserAddress),
  approveUserAddress: ctrlWrapper(approveUserAddress),
};
