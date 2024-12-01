import express from "express";
import authController from "../controllers/authControllers.js";

const authRouter = express.Router();

const { signup } = authController;

authRouter.post("/register", signup);

export default authRouter;
