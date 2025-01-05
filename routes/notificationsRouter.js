import express from "express";
import authenticate from "../middlewares/authenticate.js";
import notificationsControllers from "../controllers/notificationsControllers.js";

const notificationsRouter = express.Router();

notificationsRouter.use(authenticate);

const { createNotification } = notificationsControllers;

notificationsRouter.post("/:residential_complex_id", createNotification);

export default notificationsRouter;
