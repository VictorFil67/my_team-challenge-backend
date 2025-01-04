import Notification from "../models/Notification.js";

export async function addNotification(data) {
  return await Notification.create(data);
}
