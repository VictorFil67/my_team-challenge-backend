import Joi from "joi";

export const createContactInfoSchema = Joi.object({
  title: Joi.string().required(),
  titleUA: Joi.string().required(),
  description: Joi.string().required(),
  descriptionUA: Joi.string().required(),
  location: Joi.string(),
});
