import Notification from "../models/Notification.js";

export async function addNotification(data) {
  return await Notification.create(data);
}

export function listNotificationsByFilter(filter, query) {
  return Notification.find(filter, "", query).sort({ updatedAt: -1 });
}

export function findNotification(id) {
  return Notification.findById(id);
}

export async function updateNotificationById(id, data) {
  return await Notification.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteNotification(id) {
  return await Notification.findByIdAndDelete(id);
}
