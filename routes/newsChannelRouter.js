// import express from 'express'

import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import newsChannelControllers from "../controllers/newsChannelControllers.js";

const newsChannelRouter = Router();

newsChannelRouter.use(authenticate);

const { createNewsChannel } = newsChannelControllers;

newsChannelRouter.post(
  "/:residential_complex_id/:building_id?",
  createNewsChannel
);

export default newsChannelRouter;
