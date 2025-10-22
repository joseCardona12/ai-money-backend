import { Response } from "express";
import { categoryService as CategoryService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class CategoryController {
  // Get all categories
  public static async getAllCategories(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        message: "Categories retrieved successfully",
        status: 200,
        data: categories,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAllCategories:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get category by ID
  public static async getCategoryById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id, 10);

      if (isNaN(categoryId)) {
        res.status(400).json({
          message: "Invalid category ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const category = await CategoryService.getCategoryById(categoryId);
      res.status(200).json({
        message: "Category retrieved successfully",
        status: 200,
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getCategoryById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Create new category
  public static async createCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || typeof name !== "string") {
        res.status(400).json({
          message: "Category name is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const category = await CategoryService.createCategory({ name });
      res.status(201).json({
        message: "Category created successfully",
        status: 201,
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createCategory:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update category
  public static async updateCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id, 10);

      if (isNaN(categoryId)) {
        res.status(400).json({
          message: "Invalid category ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { name } = req.body;

      // Build update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;

      const updatedCategory = await CategoryService.updateCategory(
        categoryId,
        updateData
      );

      res.status(200).json({
        message: "Category updated successfully",
        status: 200,
        data: updatedCategory,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateCategory:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete category
  public static async deleteCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id, 10);

      if (isNaN(categoryId)) {
        res.status(400).json({
          message: "Invalid category ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await CategoryService.deleteCategory(categoryId);
      res.status(200).json({
        message: result.message,
        status: 200,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in deleteCategory:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}

