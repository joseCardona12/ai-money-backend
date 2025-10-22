import { CategoryModel } from "./model";
import { categoryRepository as CategoryRepository } from "./repository";
import {
  CreateCategoryData,
  UpdateCategoryData,
  CategoryResponse,
} from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class CategoryService {
  // Get all categories
  public async getAllCategories(): Promise<CategoryResponse[]> {
    const categories = await CategoryRepository.getAllCategories();
    return categories.map((category) => this.transformToCategoryResponse(category));
  }

  // Get category by ID
  public async getCategoryById(id: number): Promise<CategoryResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid category ID");
    }

    const category = await CategoryRepository.getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return this.transformToCategoryResponse(category);
  }

  // Create new category
  public async createCategory(data: CreateCategoryData): Promise<CategoryModel> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("Category name is required");
    }

    if (data.name.length > 250) {
      throw new ValidationError("Category name cannot exceed 250 characters");
    }

    // Check if category already exists
    const existingCategory = await CategoryRepository.getCategoryByName(
      data.name.trim()
    );
    if (existingCategory) {
      throw new ConflictError("Category with this name already exists");
    }

    return await CategoryRepository.createCategory({
      name: data.name.trim(),
    });
  }

  // Update category
  public async updateCategory(
    id: number,
    data: UpdateCategoryData
  ): Promise<CategoryModel> {
    // Check if category exists
    const existingCategory = await CategoryRepository.getCategoryById(id);
    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    // Validate updated data
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new ValidationError("Category name cannot be empty");
      }

      if (data.name.length > 250) {
        throw new ValidationError("Category name cannot exceed 250 characters");
      }

      // Check if new name already exists (and it's not the same category)
      const categoryWithName = await CategoryRepository.getCategoryByName(
        data.name.trim()
      );
      if (categoryWithName && categoryWithName.id !== id) {
        throw new ConflictError("Category with this name already exists");
      }
    }

    await CategoryRepository.updateCategory(id, {
      name: data.name?.trim(),
    });

    const updatedCategory = await CategoryRepository.getCategoryById(id);
    if (!updatedCategory) {
      throw new NotFoundError("Category not found after update");
    }

    return updatedCategory;
  }

  // Delete category
  public async deleteCategory(id: number): Promise<{ message: string }> {
    // Check if category exists
    const existingCategory = await CategoryRepository.getCategoryById(id);
    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    await CategoryRepository.deleteCategory(id);
    return { message: "Category deleted successfully" };
  }

  // Transform to response format
  private transformToCategoryResponse(category: CategoryModel): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
    };
  }
}

export const categoryService = new CategoryService();

