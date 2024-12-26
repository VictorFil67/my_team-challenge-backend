import express from "express";
import chatRoomsControllers from "../controllers/chatRoomsControllers.js";
import authenticate from "../middlewares/authenticate.js";

const chatRoomsRouter = express.Router();

const { getUserChatRooms } = chatRoomsControllers;

chatRoomsRouter.post("/", authenticate, getUserChatRooms);

export default chatRoomsRouter;
