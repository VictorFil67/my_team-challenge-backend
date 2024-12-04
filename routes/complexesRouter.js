import express from "express";
import authenticate from "../middlewares/authenticate.js";
import complexesControllers from "../controllers/complexesControllers.js";

const complexesRouter = express.Router();

complexesRouter.use(authenticate);

const { createComplex } = complexesControllers;

complexesRouter.post("/", createComplex);

export default complexesRouter;
