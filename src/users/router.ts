import { Router } from "express";
import { UserController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter: Router = Router();

// All routes require authentication
userRouter.use(authMiddleware);

// POST /api/users - Create a new user
userRouter.post("/", UserController.createUser);

// GET /api/users - Get all users with pagination
userRouter.get("/", UserController.getAllUsers);

// ===== SPECIFIC ROUTES FIRST =====

// GET /api/users/me - Get current user profile
userRouter.get("/me", UserController.getCurrentUser);

// ===== GENERIC ROUTES =====

// PUT /api/users - Update current user
userRouter.put("/", UserController.updateUser);

// GET /api/users/:id - Get user by ID
userRouter.get("/:id", UserController.getUserById);

// PUT /api/users/:id - Update user by ID (admin)
userRouter.put("/:id", UserController.updateUserById);

// DELETE /api/users/:id - Delete user by ID (admin)
userRouter.delete("/:id", UserController.deleteUserById);
