import Joi from "joi";

export const notificationsSchema = Joi.object({
  text: Joi.string().required(),
  type: Joi.string().valid("events", "emergency").required(),
  building_id: Joi.string(),
});

export const updatenotificationsSchema = Joi.object({
  text: Joi.string(),
  type: Joi.string().valid("events", "emergency"),
});
