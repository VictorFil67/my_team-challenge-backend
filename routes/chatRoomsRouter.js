import express from "express";
import chatRoomsControllers from "../controllers/chatRoomsControllers.js";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";

const chatRoomsRouter = express.Router();

chatRoomsRouter.use(authenticate);

const { getUserChatRooms, getActiveChat, createChatForTwo } =
  chatRoomsControllers;

chatRoomsRouter.get("/", getUserChatRooms);
chatRoomsRouter.get("/:chatId", isValidId, getActiveChat);
chatRoomsRouter.post("/", createChatForTwo);

export default chatRoomsRouter;
