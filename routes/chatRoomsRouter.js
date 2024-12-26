import express from "express";
import chatRoomsControllers from "../controllers/chatRoomsControllers.js";
import authenticate from "../middlewares/authenticate.js";

const chatRoomsRouter = express.Router();

const { getUserChatRooms, getActiveChat } = chatRoomsControllers;

chatRoomsRouter.get("/", authenticate, getUserChatRooms);
chatRoomsRouter.get("/:chatId", authenticate, getActiveChat);

export default chatRoomsRouter;
