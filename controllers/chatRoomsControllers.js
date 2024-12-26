import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import { getChatRoom, getChatRooms } from "../services/chatRoomservices.js";
import { findUserById } from "../services/userServices.js";

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

const getActiveChat = async (req, res) => {
  const { _id: userId } = req.user;
  console.log(userId);
  const { chatId: _id } = req.params;
  const chat = await getChatRoom({
    _id,
    users: userId,
  });

  if (!chat) {
    throw HttpError(404, `Sorry, such a chat doesn't exist`);
  }
  const result = await findUserById(userId);
  res.status(200).json(result);
};

export default {
  getUserChatRooms: ctrlWrapper(getUserChatRooms),
  getActiveChat: ctrlWrapper(getActiveChat),
};
