import { Router } from "express";
import { UserController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter: Router = Router();

// All routes require authentication
userRouter.use(authMiddleware);

// GET /api/users/me - Get current user profile
userRouter.get("/me", UserController.getCurrentUser);

// GET /api/users/:id - Get user by ID
userRouter.get("/:id", UserController.getUserById);

// PUT /api/users - Update current user
userRouter.put("/", UserController.updateUser);

// PUT /api/users/:id - Update user by ID (admin)
userRouter.put("/:id", UserController.updateUserById);

