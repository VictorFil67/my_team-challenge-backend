import express from "express";
import authController from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";
import { signupSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();

const { signup, signin, logout } = authController;

authRouter.post("/register", validateBody(signupSchema), signup);
authRouter.post("/login", signin);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
