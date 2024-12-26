import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { getChatRooms } from "../services/chatRoomservices.js";

const getUserChatRooms = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  const result = await getChatRooms({
    users: {
      $all: [_id], //The $all operator selects the documents where the value of a field is an array that contains all the specified elements.
    },
  });
  res.status(200).json(result);
};

export default {
  getUserChatRooms: ctrlWrapper(getUserChatRooms),
};
