// import express from 'express'

import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import newsChannelControllers from "../controllers/newsChannelControllers.js";
import upload from "../middlewares/upload.js";
import validateBody from "../decorators/validateBody.js";
import { newsChannelSchema } from "../schemas/newsChannelSchema.js";
import isValidId from "../middlewares/isValidId.js";

const newsChannelRouter = Router();

newsChannelRouter.use(authenticate);

const { createNewsChannel, getNewsChannels } = newsChannelControllers;

newsChannelRouter.post(
  "/:residential_complex_id/:building_id?",
  upload.single("picture"),
  validateBody(newsChannelSchema),
  isValidId,
  createNewsChannel
);

newsChannelRouter.get(
  "/:residential_complex_id/:building_id?",
  isValidId,
  getNewsChannels
);

export default newsChannelRouter;
