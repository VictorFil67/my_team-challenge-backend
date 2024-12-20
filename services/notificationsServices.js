import Notification from "../models/Notification.js";

export async function addNotification(data) {
  await Notification.create(data);
}
