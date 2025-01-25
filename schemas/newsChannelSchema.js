import Joi from "joi";

export const newsChannelSchema = Joi.object({
  picture: Joi.string(),
  title: Joi.string().required(),
});
