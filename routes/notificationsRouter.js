import express from "express";
import authenticate from "../middlewares/authenticate.js";
import notificationsControllers from "../controllers/notificationsControllers.js";
import validateBody from "../decorators/validateBody.js";
import { notificationsSchema } from "../schemas/notificationsSchema.js";

const notificationsRouter = express.Router();

notificationsRouter.use(authenticate);

const { createNotification } = notificationsControllers;

notificationsRouter.post(
  "/:residential_complex_id",
  validateBody(notificationsSchema),
  createNotification
);

export default notificationsRouter;
