import User from "../models/User.js";

export function findUser(filter) {
  return User.findOne(filter);
}

export function findUserById(id) {
  return User.findById(id);
}

export function updateUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true });
}

export function updateUserAddress(filter, data, array) {
  return User.updateOne(filter, data, array);
}
// export function updateUserAddress(filter, data) {
//   return User.findByIdAndUpdate(filter, data, { new: true });
// }
