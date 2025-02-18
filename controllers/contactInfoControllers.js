import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { CheckAccess } from "../helpers/checkAccess.js";
import HttpError from "../helpers/HttpError.js";
import { findComplex } from "../services/complexServices.js";
import {
  findContactInfo,
  findContactInfoById,
  makeContactInfo,
  removeContactInfo,
  updateContactInfoById,
} from "../services/contactInfoservices.js";

const createContactInfo = async (req, res) => {
  const user = req.user;
  const params = req.params;
  const { residential_complex_id, building_id } = params;

  await CheckAccess(params, user);

  const contactInfo = building_id
    ? await findContactInfo({ residential_complex_id, building_id })
    : await findContactInfo({
        residential_complex_id,
        building_id: { $exists: false },
      });
  console.log("contactInfo: ", contactInfo);
  if (contactInfo) {
    throw HttpError(
      409,
      `This contact information already exists, so you can't write down this contact information once more`
    );
  }

  const complex = await findComplex({
    _id: residential_complex_id,
    buildings: {
      $elemMatch: {
        _id: building_id,
      },
    },
  });

  const data = complex
    ? { ...req.body, residential_complex_id, building_id }
    : { ...req.body, residential_complex_id };

  const result = await makeContactInfo(data);
  res.status(201).json(result);
};

const deleteContactInfo = async (req, res) => {
  const { contactInfoId: _id } = req.params;

  await CheckAccess(_id, req.user);

  const result = await removeContactInfo(_id);
  res.json(result);
};

const updateContactInfo = async (req, res) => {
  // console.log("Date: ", new Date(1739739139508));
  // console.log("Date now: ", new Date());

  const params = req.params;
  const { contactInfoId: _id } = params;
  const keys = Object.keys(req.body);
  if (keys.length === 0) {
    throw HttpError(400, "At least one field must not be empty!");
  }

  await CheckAccess(params, req.user);

  const result = await updateContactInfoById(_id, req.body);
  res.json(result);
};

const getContactInfo = async (req, res) => {
  const { contactInfoId } = req.params;
  const result = await findContactInfoById(contactInfoId);
  res.json(result);
};

export default {
  createContactInfo: ctrlWrapper(createContactInfo),
  deleteContactInfo: ctrlWrapper(deleteContactInfo),
  updateContactInfo: ctrlWrapper(updateContactInfo),
  getContactInfo: ctrlWrapper(getContactInfo),
};
