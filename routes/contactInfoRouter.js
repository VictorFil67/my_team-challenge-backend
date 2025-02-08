import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import contactInfoControllers from "../controllers/contactInfoControllers.js";

const contactInfoRouter = Router();

contactInfoRouter.use(authenticate);

contactInfoRouter.post(
  "/:residential_complex_id/:building_id?",
  contactInfoControllers.createContactInfo
);

export default contactInfoRouter;
