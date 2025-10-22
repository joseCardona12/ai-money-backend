import { Router } from "express";
import { CategoryController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const categoryRouter: Router = Router();

// All category routes require authentication
categoryRouter.use(authMiddleware);

// POST /api/categories - Create new category
categoryRouter.post("/", CategoryController.createCategory);

// GET /api/categories - Get all categories
categoryRouter.get("/", CategoryController.getAllCategories);

// GET /api/categories/:id - Get category by ID
categoryRouter.get("/:id", CategoryController.getCategoryById);

// PUT /api/categories/:id - Update category
categoryRouter.put("/:id", CategoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
categoryRouter.delete("/:id", CategoryController.deleteCategory);

