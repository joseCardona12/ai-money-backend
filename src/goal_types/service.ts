import { GoalTypeModel } from "./model";
import { goalTypeRepository as GoalTypeRepository } from "./repository";
import { CreateGoalTypeData, UpdateGoalTypeData, GoalTypeResponse } from "./types";
import { NotFoundError, ValidationError, ConflictError } from "../util/errors/customErrors";

export class GoalTypeService {
  // Get all goal types
  public async getAllGoalTypes(): Promise<GoalTypeResponse[]> {
    const goalTypes = await GoalTypeRepository.getAllGoalTypes();
    return goalTypes.map(goalType => this.transformToGoalTypeResponse(goalType));
  }

  // Get goal type by ID
  public async getGoalTypeById(id: number): Promise<GoalTypeResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid goal type ID");
    }

    const goalType = await GoalTypeRepository.getGoalTypeById(id);
    if (!goalType) {
      throw new NotFoundError("Goal type not found");
    }

    return this.transformToGoalTypeResponse(goalType);
  }

  // Create new goal type
  public async createGoalType(data: CreateGoalTypeData): Promise<GoalTypeResponse> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("Goal type name is required");
    }

    if (data.name.length > 200) {
      throw new ValidationError("Goal type name cannot exceed 200 characters");
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new ValidationError("Goal type description is required");
    }

    if (data.description.length > 200) {
      throw new ValidationError("Goal type description cannot exceed 200 characters");
    }

    // Check if goal type already exists
    const existingGoalType = await GoalTypeRepository.getGoalTypeByName(data.name.trim());
    if (existingGoalType) {
      throw new ConflictError("Goal type with this name already exists");
    }

    const newGoalType = await GoalTypeRepository.createGoalType({
      name: data.name.trim(),
      description: data.description.trim(),
    });

    return this.transformToGoalTypeResponse(newGoalType);
  }

  // Update goal type
  public async updateGoalType(
    id: number,
    data: UpdateGoalTypeData
  ): Promise<GoalTypeResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid goal type ID");
    }

    // Check if goal type exists
    const existingGoalType = await GoalTypeRepository.getGoalTypeById(id);
    if (!existingGoalType) {
      throw new NotFoundError("Goal type not found");
    }

    // Validate name if provided
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new ValidationError("Goal type name cannot be empty");
      }

      if (data.name.length > 200) {
        throw new ValidationError("Goal type name cannot exceed 200 characters");
      }

      // Check if another goal type with the same name exists
      const goalTypeWithSameName = await GoalTypeRepository.getGoalTypeByName(data.name.trim());
      if (goalTypeWithSameName && goalTypeWithSameName.id !== id) {
        throw new ConflictError("Goal type with this name already exists");
      }
    }

    // Validate description if provided
    if (data.description !== undefined) {
      if (data.description.trim().length === 0) {
        throw new ValidationError("Goal type description cannot be empty");
      }

      if (data.description.length > 200) {
        throw new ValidationError("Goal type description cannot exceed 200 characters");
      }
    }

    await GoalTypeRepository.updateGoalType(id, {
      name: data.name?.trim(),
      description: data.description?.trim(),
    });

    const updatedGoalType = await GoalTypeRepository.getGoalTypeById(id);
    return this.transformToGoalTypeResponse(updatedGoalType!);
  }

  // Delete goal type
  public async deleteGoalType(id: number): Promise<{ message: string }> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid goal type ID");
    }

    const existingGoalType = await GoalTypeRepository.getGoalTypeById(id);
    if (!existingGoalType) {
      throw new NotFoundError("Goal type not found");
    }

    await GoalTypeRepository.deleteGoalType(id);
    return { message: "Goal type deleted successfully" };
  }

  // Transform GoalTypeModel to GoalTypeResponse
  private transformToGoalTypeResponse(goalType: GoalTypeModel): GoalTypeResponse {
    return {
      id: goalType.id,
      name: goalType.name,
      description: goalType.description,
    };
  }
}

export const goalTypeService = new GoalTypeService();

