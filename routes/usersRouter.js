import express from "express";
import authenticate from "../middlewares/authenticate.js";

const usersRouter = express.Router();

usersRouter.use(authenticate);

export default usersRouter;
