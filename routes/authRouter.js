import express from "express";
import authController from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

const { signup, signin, logout } = authController;

authRouter.post("/register", signup);
authRouter.post("/login", signin);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
