import express from "express";
import authenticate from "../middlewares/authenticate.js";
import usersControllers from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.use(authenticate);

const { addUserAddresses } = usersControllers;

usersRouter.put("/addresses", addUserAddresses);

export default usersRouter;
