import { Router } from "express";
// import authenticate from "../middlewares/authenticate.js";
import googleAuthControllers from "../controllers/googleAuthControllers.js";

const googleAuthRouter = Router();

// googleAuthRouter.use(authenticate);

const { passportAuth, passportAuthCallback, generateTokens } =
  googleAuthControllers;

googleAuthRouter.get("/auth/google", passportAuth);
googleAuthRouter.get(
  "/v1/auth/register/google/callback",
  passportAuthCallback,
  generateTokens
);

export default googleAuthRouter;
