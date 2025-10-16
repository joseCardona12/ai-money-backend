import { CategoryModel } from "./model";
import { CreateCategoryData, UpdateCategoryData } from "./types";

export class CategoryRepository {
  // Get category by ID
  public async getCategoryById(id: number): Promise<CategoryModel | null> {
    return await CategoryModel.findByPk(id);
  }

  // Get all categories
  public async getAllCategories(): Promise<CategoryModel[]> {
    return await CategoryModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new category
  public async createCategory(data: CreateCategoryData): Promise<CategoryModel> {
    const categoryData = {
      name: data.name,
    };

    return await CategoryModel.create(categoryData);
  }

  // Update category
  public async updateCategory(
    id: number,
    data: UpdateCategoryData
  ): Promise<[number]> {
    return await CategoryModel.update(data, {
      where: { id },
    });
  }

  // Delete category
  public async deleteCategory(id: number): Promise<number> {
    return await CategoryModel.destroy({
      where: { id },
    });
  }

  // Get category by name
  public async getCategoryByName(name: string): Promise<CategoryModel | null> {
    return await CategoryModel.findOne({
      where: { name },
    });
  }
}

export const categoryRepository = new CategoryRepository();
