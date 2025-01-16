import express from "express";
import authenticate from "../middlewares/authenticate.js";
import votingsControllers from "../controllers/votingsControllers.js";
import validateBody from "../decorators/validateBody.js";
import { createVotingSchema } from "../schemas/votingsSchemas.js";

const votingsRouter = express.Router();

votingsRouter.use(authenticate);

const { createVoting } = votingsControllers;

votingsRouter.post(
  "/:residential_complex_id",
  validateBody(createVotingSchema),
  createVoting
);

export default votingsRouter;
