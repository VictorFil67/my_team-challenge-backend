import ctrlWrapper from "../decorators/ctrlWrapper";
import { getChatRooms } from "../services/chatRoomservices";

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
