import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { findComplex } from "../services/complexServices.js";
import {
  findContactInfo,
  makeContactInfo,
  removeContactInfo,
} from "../services/contactInfoservices.js";

const createContactInfo = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { residential_complex_id, building_id } = req.params;

  const searchComplex = buildings.find((elem) => {
    return (
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
    );
  });

  if (!is_admin && !searchComplex) {
    throw HttpError(403, `The user is not related to the specified complex.`);
  }

  const moderator = is_admin ? false : searchComplex.moderator;
  console.log(moderator);
  if (!is_admin && !moderator) {
    throw HttpError(403, "You don't have access to this action!");
  }

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
  const { is_admin, buildings } = req.user;
  const { residential_complex_id, building_id } = req.params;

  const searchComplex = buildings.find((elem) => {
    return (
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
    );
  });

  if (!is_admin && !searchComplex) {
    throw HttpError(403, `The user is not related to the specified complex.`);
  }

  const moderator = is_admin ? false : searchComplex.moderator;
  console.log(moderator);
  if (!is_admin && !moderator) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const result = await removeContactInfo(_id);
  res.json(result);
};

export default { createContactInfo: ctrlWrapper(createContactInfo) };
