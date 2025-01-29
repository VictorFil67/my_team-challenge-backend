import newsControllers from "../controllers/newsControllers.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import express from "express";
import { createNewsSchema } from "../schemas/newsSchema.js";

const newsRouter = express.Router();

newsRouter.use(authenticate);

const { createNews, getNews } = newsControllers;

newsRouter.post("/:newsChannelId", validateBody(createNewsSchema), createNews);
newsRouter.get("/:newsChannelId", getNews);

export default newsRouter;
