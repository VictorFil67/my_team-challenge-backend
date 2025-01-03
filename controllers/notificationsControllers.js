import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { findComplex } from "../services/complexServices.js";

const createNotification = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { residential_complex_id, building_id } = req.params;
  const { text, type } = req.body;

  const { moderator } = buildings.find(
    (elem) => (elem.residential_complex_id = residential_complex_id)
  );

  if (!is_admin && !moderator) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const complex = await findComplex({
    _id: residential_complex_id,
    buildings: {
      $elemMatch: {
        _id: building_id,
      },
    },
  });

  const result = complex
    ? await addNotification({
        text,
        type,
        residential_complex_id,
        building_id,
      })
    : await addNotification({ text, type, residential_complex_id });

  //   let complex;
  //   const { residential_complex: complexAdmin } = req.query;
  //   const { residential_complex: complexModerator } = user;
  //   const { text, type, section } = req.body;
  //   if (complexAdmin) {
  //     complex = complexAdmin;
  //   } else {
  //     complex = complexModerator;
  //   }
  res.status(201).json(result);
};

export default {
  createNotification: ctrlWrapper(createNotification),
};
