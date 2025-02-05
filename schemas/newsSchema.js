import Joi from "joi";

export const createNewsSchema = Joi.object({
  picture: Joi.string(),
  title: Joi.string().required(),
  titleUA: Joi.string().required(),
  text: Joi.string().required(),
  textUA: Joi.string().required(),
});
