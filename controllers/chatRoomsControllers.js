import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { getChatRooms } from "../services/chatRoomservices.js";

const getUserChatRooms = async (req, res) => {
  const { _id } = req.user;
  const result = await getChatRooms({
    users: {
      $elemMatch: { _id },
    },
  });
  res.status(200).json(result);
};

export default {
  getUserChatRooms: ctrlWrapper(getUserChatRooms),
};
