import express from "express";
import authenticate from "../middlewares/authenticate.js";
import usersControllers from "../controllers/usersControllers.js";
import validateBody from "../decorators/validateBody.js";
import { addUserAddressesSchema } from "../schemas/usersSchemas.js";

const usersRouter = express.Router();

usersRouter.use(authenticate);

const { addUserAddresses, deleteUserAddress, approveUserAddress } =
  usersControllers;

usersRouter.put(
  "/addresses",
  validateBody(addUserAddressesSchema),
  addUserAddresses
);
usersRouter.delete(
  "/addresses",
  validateBody(addUserAddressesSchema),
  deleteUserAddress
);
usersRouter.patch("/addresses/:userId", approveUserAddress);

export default usersRouter;
