import newsControllers from "../controllers/newsControllers.js";
import authenticate from "../middlewares/authenticate.js";
import express from "express";

const newsRouter = express.Router();

newsRouter.use(authenticate);

const { createNews } = newsControllers;

newsRouter.post("/:newsChannelId", createNews);

export default newsRouter;
