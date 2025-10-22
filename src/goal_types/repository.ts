import { GoalTypeModel } from "./model";
import { CreateGoalTypeData, UpdateGoalTypeData } from "./types";

export class GoalTypeRepository {
  // Get goal type by ID
  public async getGoalTypeById(id: number): Promise<GoalTypeModel | null> {
    return await GoalTypeModel.findByPk(id);
  }

  // Get all goal types
  public async getAllGoalTypes(): Promise<GoalTypeModel[]> {
    return await GoalTypeModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new goal type
  public async createGoalType(data: CreateGoalTypeData): Promise<GoalTypeModel> {
    const goalTypeData = {
      name: data.name,
      description: data.description,
    };

    return await GoalTypeModel.create(goalTypeData);
  }

  // Update goal type
  public async updateGoalType(
    id: number,
    data: UpdateGoalTypeData
  ): Promise<[number]> {
    return await GoalTypeModel.update(data, {
      where: { id },
    });
  }

  // Delete goal type
  public async deleteGoalType(id: number): Promise<number> {
    return await GoalTypeModel.destroy({
      where: { id },
    });
  }

  // Get goal type by name
  public async getGoalTypeByName(name: string): Promise<GoalTypeModel | null> {
    return await GoalTypeModel.findOne({
      where: { name },
    });
  }
}

export const goalTypeRepository = new GoalTypeRepository();

