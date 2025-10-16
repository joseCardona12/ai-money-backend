import { GoalModel } from "./model";
import { goalRepository as GoalRepository } from "./repository";
import { CreateGoalData, UpdateGoalData, GoalResponse } from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class GoalService {
  // Create new goal
  public async createGoal(data: CreateGoalData): Promise<GoalModel> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("Goal name is required");
    }

    if (!data.target_amount || data.target_amount <= 0) {
      throw new ValidationError("Target amount must be greater than 0");
    }

    if (!data.start_date) {
      throw new ValidationError("Start date is required");
    }

    if (!data.end_date) {
      throw new ValidationError("End date is required");
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const currentDate = new Date();

    if (endDate <= startDate) {
      throw new ValidationError("End date must be after start date");
    }

    if (endDate <= currentDate) {
      throw new ValidationError("End date must be in the future");
    }

    // Validate current amount
    if (data.current_amount && data.current_amount < 0) {
      throw new ValidationError("Current amount cannot be negative");
    }

    if (data.current_amount && data.current_amount > data.target_amount) {
      throw new ValidationError("Current amount cannot exceed target amount");
    }

    // Create goal
    const newGoal = await GoalRepository.createGoal(data);
    return newGoal;
  }

  // Get goal by ID
  public async getGoalById(id: number): Promise<GoalResponse> {
    const goal = await GoalRepository.getGoalById(id);
    
    if (!goal) {
      throw new NotFoundError("Goal not found");
    }

    return this.transformToGoalResponse(goal);
  }

  // Get goals by user ID
  public async getGoalsByUserId(userId: number): Promise<GoalResponse[]> {
    const goals = await GoalRepository.getGoalsByUserId(userId);
    return goals.map(goal => this.transformToGoalResponse(goal));
  }

  // Update goal
  public async updateGoal(id: number, data: UpdateGoalData): Promise<GoalModel> {
    // Check if goal exists
    const existingGoal = await GoalRepository.getGoalById(id);
    if (!existingGoal) {
      throw new NotFoundError("Goal not found");
    }

    // Validate updated data
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError("Goal name cannot be empty");
    }

    if (data.target_amount !== undefined && data.target_amount <= 0) {
      throw new ValidationError("Target amount must be greater than 0");
    }

    if (data.current_amount !== undefined && data.current_amount < 0) {
      throw new ValidationError("Current amount cannot be negative");
    }

    // Validate dates if provided
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (endDate <= startDate) {
        throw new ValidationError("End date must be after start date");
      }
    }

    // Update goal
    await GoalRepository.updateGoal(id, data);
    
    // Return updated goal
    const updatedGoal = await GoalRepository.getGoalById(id);
    return updatedGoal!;
  }

  // Delete goal
  public async deleteGoal(id: number): Promise<void> {
    const existingGoal = await GoalRepository.getGoalById(id);
    if (!existingGoal) {
      throw new NotFoundError("Goal not found");
    }

    await GoalRepository.deleteGoal(id);
  }

  // Get active goals for user
  public async getActiveGoalsForUser(userId: number): Promise<GoalResponse[]> {
    const goals = await GoalRepository.getActiveGoalsForUser(userId);
    return goals.map(goal => this.transformToGoalResponse(goal));
  }

  // Update goal progress
  public async updateGoalProgress(id: number, currentAmount: number): Promise<GoalModel> {
    const existingGoal = await GoalRepository.getGoalById(id);
    if (!existingGoal) {
      throw new NotFoundError("Goal not found");
    }

    if (currentAmount < 0) {
      throw new ValidationError("Current amount cannot be negative");
    }

    if (currentAmount > existingGoal.target_amount) {
      throw new ValidationError("Current amount cannot exceed target amount");
    }

    await GoalRepository.updateGoalProgress(id, currentAmount);
    
    const updatedGoal = await GoalRepository.getGoalById(id);
    return updatedGoal!;
  }

  // Get goals near completion
  public async getGoalsNearCompletion(userId: number): Promise<GoalResponse[]> {
    const goals = await GoalRepository.getGoalsNearCompletion(userId);
    return goals.map(goal => this.transformToGoalResponse(goal));
  }

  // Transform GoalModel to GoalResponse with calculated fields
  private transformToGoalResponse(goal: GoalModel): GoalResponse {
    const progressPercentage = goal.target_amount > 0 
      ? Math.round((goal.current_amount / goal.target_amount) * 100)
      : 0;

    const currentDate = new Date();
    const endDate = new Date(goal.end_date);
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      id: goal.id,
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      start_date: goal.start_date,
      end_date: goal.end_date,
      created_at: goal.created_at,
      state_id: goal.state_id,
      goal_type_id: goal.goal_type_id,
      user_id: goal.user_id,
      progress_percentage: progressPercentage,
      days_remaining: daysRemaining > 0 ? daysRemaining : 0,
    };
  }
}

export const goalService = new GoalService();
