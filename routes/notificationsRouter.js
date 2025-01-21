import express from "express";
import authenticate from "../middlewares/authenticate.js";
import notificationsControllers from "../controllers/notificationsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  notificationsSchema,
  updatenotificationsSchema,
} from "../schemas/notificationsSchema.js";
import isValidId from "../middlewares/isValidId.js";

const notificationsRouter = express.Router();

notificationsRouter.use(authenticate);

const {
  createNotification,
  getNotifications,
  updateNotification,
  removeNotification,
} = notificationsControllers;

notificationsRouter.post(
  "/:residential_complex_id/:building_id?",
  validateBody(notificationsSchema),
  isValidId,
  createNotification
);
notificationsRouter.get(
  "/:residential_complex_id",
  validateBody(updatenotificationsSchema),
  isValidId,
  getNotifications
);
notificationsRouter.put("/:_id", isValidId, updateNotification);
notificationsRouter.delete("/:_id", isValidId, removeNotification);

export default notificationsRouter;
