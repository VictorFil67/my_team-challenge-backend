import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidIdInBody = (req, res, next) => {
  console.log(req.body);
  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    if (!isValidObjectId(req.body[key])) {
      throw HttpError(404, `${req.body[key]} is not valid id`);
    }
  });
  next();
};

export default isValidIdInBody;
