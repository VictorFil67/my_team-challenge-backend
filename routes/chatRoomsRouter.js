import express from "express";
import chatRoomsControllers from "../controllers/chatRoomsControllers";

const chatRoomsRouter = express.Router();

const { getUserChatRooms } = chatRoomsControllers;

chatRoomsRouter.post("/", getUserChatRooms);

export default chatRoomsRouter;
