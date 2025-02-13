import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import contactInfoControllers from "../controllers/contactInfoControllers.js";
import validateBody from "../decorators/validateBody.js";
import { createContactInfoSchema } from "../schemas/contactInfoSchemas.js";
import isValidId from "../middlewares/isValidId.js";

const contactInfoRouter = Router();

contactInfoRouter.use(authenticate);

contactInfoRouter.post(
  "/:residential_complex_id/:building_id?",
  isValidId,
  validateBody(createContactInfoSchema),
  contactInfoControllers.createContactInfo
);
contactInfoRouter.delete(
  "/:contactInfoId",
  isValidId,
  contactInfoControllers.deleteContactInfo
);

export default contactInfoRouter;
