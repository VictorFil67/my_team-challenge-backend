import express from "express";
import authenticate from "../middlewares/authenticate.js";
import complexesControllers from "../controllers/complexesControllers.js";

const complexesRouter = express.Router();

complexesRouter.use(authenticate);

const { createComplex, updateComplex } = complexesControllers;

complexesRouter.post("/", createComplex);
complexesRouter.put("/:complexId", updateComplex);

export default complexesRouter;
