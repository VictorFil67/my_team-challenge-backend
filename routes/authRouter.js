import express from "express";
import authController from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";
import {
  forgotPasswordSchema,
  signinSchema,
  signupSchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

const {
  signup,
  signin,
  logout,
  getCurrent,
  getRefreshCurrent,
  forgotPassword,
  updatePassword,
} = authController;

authRouter.post("/register", validateBody(signupSchema), signup);
authRouter.post("/login", validateBody(signinSchema), signin);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, getCurrent);
authRouter.get("/refresh", authenticate, getRefreshCurrent);
authRouter.put(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword
);

export default authRouter;
