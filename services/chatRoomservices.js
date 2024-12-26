import ChatRoom from "../models/ChatRoom.js";

export async function getChatRooms(filter) {
  return await ChatRoom.find(filter);
}
