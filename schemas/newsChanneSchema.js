import Joi from "joi";

export const newsChanneSchema = Joi.object({
  picture: Joi.string(),
  title: Joi.string().required(),
});
