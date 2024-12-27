import express from "express";
import chatRoomsControllers from "../controllers/chatRoomsControllers.js";
import authenticate from "../middlewares/authenticate.js";

const chatRoomsRouter = express.Router();

chatRoomsRouter.use(authenticate);

const { getUserChatRooms, getActiveChat } = chatRoomsControllers;

chatRoomsRouter.get("/", getUserChatRooms);
chatRoomsRouter.get("/:chatId", getActiveChat);

export default chatRoomsRouter;
