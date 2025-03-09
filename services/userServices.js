import User from "../models/User.js";

export function findUser(filter) {
  return User.findOne(filter);
}

export function findUserById(id, config) {
  return User.findById(id, config);
}

export function updateUser(id, data, config) {
  return User.findByIdAndUpdate(id, data, config, { new: true });
}

export function updateUserAddress(filter, data, array) {
  return User.updateOne(filter, data, array);
}

export function updateUserByFilter(filter, data) {
  return User.findOneAndUpdate(filter, data, { new: true });
}

export function createUser(data) {
  return User.create(data);
}

export function findUsers(filter) {
  return User.find(filter);
}
