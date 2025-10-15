import { Router } from "express";
import { AuthController } from "./controller";

export const authRouter: Router = Router();
authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);
authRouter.post("/forgot-password", AuthController.forgotPasswordByEmail);
authRouter.post("/reset-password", AuthController.resetPassword);
