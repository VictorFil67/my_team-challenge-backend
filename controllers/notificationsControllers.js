import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { findComplex } from "../services/complexServices.js";
import {
  addNotification,
  deleteNotification,
  findNotification,
  listNotificationsByFilter,
} from "../services/notificationsServices.js";

const createNotification = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { residential_complex_id } = req.params;
  const { text, type, building_id } = req.body;

  const searchComplex = buildings.find((elem) => {
    return (
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
    );
  });

  if (!is_admin && !searchComplex) {
    throw HttpError(404, `The user is not related to the specified complex.`);
  }

  const moderator = is_admin ? false : searchComplex.moderator;
  console.log(moderator);
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

  res.status(201).json(result);
};

const getNotifications = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { residential_complex_id } = req.params;
  const { page = 1, limit = 20, type = "", building_id = "" } = req.query;
  const skip = (page - 1) * limit;

  const complex = buildings.find(
    (elem) =>
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
  );

  if (!is_admin && !complex) {
    throw HttpError(403, "You don't have access to this action!");
  }
  let building;
  if (building_id) {
    building = complex.addresses.find((elem) => {
      if (elem.building_id) {
        return elem.building_id.toString() === building_id.toString();
      }
    });
  }

  if (!is_admin && building_id && !building) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const result = building_id
    ? type
      ? await listNotificationsByFilter(
          { residential_complex_id, type, building_id },
          { skip, limit }
        )
      : await listNotificationsByFilter(
          { residential_complex_id, building_id },
          { skip, limit }
        )
    : type
    ? await listNotificationsByFilter(
        { residential_complex_id, type, building_id: { $exists: false } },
        { skip, limit }
      )
    : await listNotificationsByFilter(
        { residential_complex_id, building_id: { $exists: false } },
        { skip, limit }
      );
  res.status(200).json(result);
};

const removeNotification = async (req, res) => {
  const { _id } = req.params;
  const { is_admin, buildings } = req.user;

  const { residential_complex_id } = await findNotification(_id);
  const complex = buildings.find(
    (elem) =>
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
  );

  const hasRight = complex ? complex.moderator : is_admin;
  if (!hasRight) {
    throw HttpError(
      403,
      `Sorry, but if you want to delete a notification you must have the rights of the administrator or complex moderator`
    );
  }

  const result = await deleteNotification(_id);

  res.status(200).json(result);
};

export default {
  createNotification: ctrlWrapper(createNotification),
  getNotifications: ctrlWrapper(getNotifications),
  removeNotification: ctrlWrapper(removeNotification),
};
