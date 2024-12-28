import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidIdInBody = (req, res, next) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) {
    throw HttpError(404, `${id} is not valid id`);
  }
  next();
};

export default isValidIdInBody;
