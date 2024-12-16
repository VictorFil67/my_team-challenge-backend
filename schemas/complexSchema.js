import Joi from "joi";

export const createComplexSchema = Joi.object({
  name: Joi.string().required().trim(),
  images: Joi.array().items(Joi.string()),
  //   properties: Joi.object({
  parking: Joi.boolean().default(false),
  security: Joi.boolean().default(false),
  access_control: Joi.boolean().default(false),
  concierge: Joi.boolean().default(false),
  playground: Joi.boolean().default(false),
  closed_area: Joi.boolean().default(false),
  video_surveillance: Joi.boolean().default(false),
  floors: Joi.number().default(1),
  entrances: Joi.number().default(1),
  //   }),
  addresses: Joi.array().items(Joi.string().required().trim()),
});
