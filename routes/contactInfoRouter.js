import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import contactInfoControllers from "../controllers/contactInfoControllers.js";
import validateBody from "../decorators/validateBody.js";
import { createContactInfoSchema } from "../schemas/contactInfoSchemas.js";

const contactInfoRouter = Router();

contactInfoRouter.use(authenticate);

contactInfoRouter.post(
  "/:residential_complex_id/:building_id?",
  validateBody(createContactInfoSchema),
  contactInfoControllers.createContactInfo
);

export default contactInfoRouter;
