import User from "../models/User.js";

export function findUser(filter) {
  return User.findOne(filter);
}
