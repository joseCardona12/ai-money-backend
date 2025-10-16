import { GoalModel } from "./model";
import { CreateGoalData, UpdateGoalData } from "./types";
import { UserModel } from "../users/model";
import { GoalTypeModel } from "../goal_types/model";

export class GoalRepository {
  // Get goal by ID
  public async getGoalById(id: number): Promise<GoalModel | null> {
    return await GoalModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
    });
  }

  // Get goals by user ID
  public async getGoalsByUserId(userId: number): Promise<GoalModel[]> {
    return await GoalModel.findAll({
      where: { user_id: userId },
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Create new goal
  public async createGoal(data: CreateGoalData): Promise<GoalModel> {
    const goalData = {
      name: data.name,
      target_amount: data.target_amount,
      current_amount: data.current_amount || 0.00,
      start_date: data.start_date,
      end_date: data.end_date,
      state_id: data.state_id,
      goal_type_id: data.goal_type_id,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await GoalModel.create(goalData);
  }

  // Update goal
  public async updateGoal(
    id: number,
    data: UpdateGoalData
  ): Promise<[number]> {
    return await GoalModel.update(data, {
      where: { id },
    });
  }

  // Delete goal
  public async deleteGoal(id: number): Promise<number> {
    return await GoalModel.destroy({
      where: { id },
    });
  }

  // Get all goals (for admin purposes)
  public async getAllGoals(): Promise<GoalModel[]> {
    return await GoalModel.findAll({
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get goals by state
  public async getGoalsByState(stateId: number): Promise<GoalModel[]> {
    return await GoalModel.findAll({
      where: { state_id: stateId },
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get goals by goal type
  public async getGoalsByType(goalTypeId: number): Promise<GoalModel[]> {
    return await GoalModel.findAll({
      where: { goal_type_id: goalTypeId },
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get active goals for user (goals that haven't ended yet)
  public async getActiveGoalsForUser(userId: number): Promise<GoalModel[]> {
    const currentDate = new Date();
    return await GoalModel.findAll({
      where: { 
        user_id: userId,
        end_date: {
          [require('sequelize').Op.gte]: currentDate
        }
      },
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
      order: [["end_date", "ASC"]],
    });
  }

  // Update goal progress (current amount)
  public async updateGoalProgress(
    id: number,
    currentAmount: number
  ): Promise<[number]> {
    return await GoalModel.update(
      { current_amount: currentAmount },
      { where: { id } }
    );
  }

  // Get goals near completion (90% or more progress)
  public async getGoalsNearCompletion(userId: number): Promise<GoalModel[]> {
    return await GoalModel.findAll({
      where: { 
        user_id: userId,
        current_amount: {
          [require('sequelize').Op.gte]: require('sequelize').literal('target_amount * 0.9')
        }
      },
      include: [
        { model: UserModel, as: "user" },
        { model: GoalTypeModel, as: "goalType" },
      ],
      order: [["end_date", "ASC"]],
    });
  }
}

export const goalRepository = new GoalRepository();
