import express from "express";
import authController from "../controllers/authControllers.js";

const authRouter = express.Router();

const { signup, signin } = authController;

authRouter.post("/register", signup);
authRouter.post("/login", signin);

export default authRouter;
