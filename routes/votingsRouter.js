import express from "express";
import authenticate from "../middlewares/authenticate.js";
import votingsControllers from "../controllers/votingsControllers.js";

const votingsRouter = express.Router();

votingsRouter.use(authenticate);

const { createVoting } = votingsControllers;

votingsRouter.post("/", createVoting);

export default votingsRouter;
