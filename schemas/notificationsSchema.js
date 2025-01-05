import Joi from "joi";

export const notificationsSchema = Joi.object({
  text: Joi.string().required(),
  type: Joi.string().valid("Events", "Emergency").required(),
  building_id: Joi.string(),
});
