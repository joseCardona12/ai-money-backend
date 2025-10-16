import { Response } from "express";
import { goalService as GoalService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class GoalController {
  // Create goal
  public static async createGoal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name, target_amount, current_amount, start_date, end_date, state_id, goal_type_id } = req.body;
      const userId = req.user!.id; // User ID from JWT token

      // Validate required fields
      if (!name || typeof name !== "string") {
        res.status(400).json({
          message: "Goal name is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!target_amount || typeof target_amount !== "number") {
        res.status(400).json({
          message: "Target amount is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!start_date) {
        res.status(400).json({
          message: "Start date is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!end_date) {
        res.status(400).json({
          message: "End date is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      // Create goal data
      const goalData = {
        name,
        target_amount,
        current_amount: current_amount || 0,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        state_id,
        goal_type_id,
        user_id: userId, // Use authenticated user ID
      };

      const newGoal = await GoalService.createGoal(goalData);

      res.status(201).json({
        message: "Goal created successfully",
        status: 201,
        data: newGoal,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createGoal:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get user's goals
  public static async getUserGoals(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const goals = await GoalService.getGoalsByUserId(userId);

      res.status(200).json({
        message: "Goals retrieved successfully",
        status: 200,
        data: goals,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserGoals:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get goal by ID
  public static async getGoalById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const goalId = parseInt(id);

      if (isNaN(goalId)) {
        res.status(400).json({
          message: "Invalid goal ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const goal = await GoalService.getGoalById(goalId);

      res.status(200).json({
        message: "Goal retrieved successfully",
        status: 200,
        data: goal,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getGoalById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update goal
  public static async updateGoal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const goalId = parseInt(id);

      if (isNaN(goalId)) {
        res.status(400).json({
          message: "Invalid goal ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { name, target_amount, current_amount, start_date, end_date, state_id, goal_type_id } = req.body;

      // Update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (target_amount !== undefined) updateData.target_amount = target_amount;
      if (current_amount !== undefined) updateData.current_amount = current_amount;
      if (start_date !== undefined) updateData.start_date = new Date(start_date);
      if (end_date !== undefined) updateData.end_date = new Date(end_date);
      if (state_id !== undefined) updateData.state_id = state_id;
      if (goal_type_id !== undefined) updateData.goal_type_id = goal_type_id;

      const updatedGoal = await GoalService.updateGoal(goalId, updateData);

      res.status(200).json({
        message: "Goal updated successfully",
        status: 200,
        data: updatedGoal,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateGoal:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete goal
  public static async deleteGoal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const goalId = parseInt(id);

      if (isNaN(goalId)) {
        res.status(400).json({
          message: "Invalid goal ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      await GoalService.deleteGoal(goalId);

      res.status(200).json({
        message: "Goal deleted successfully",
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
        console.error("Unexpected error in deleteGoal:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get active goals
  public static async getActiveGoals(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const goals = await GoalService.getActiveGoalsForUser(userId);

      res.status(200).json({
        message: "Active goals retrieved successfully",
        status: 200,
        data: goals,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getActiveGoals:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update goal progress
  public static async updateGoalProgress(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { current_amount } = req.body;
      const goalId = parseInt(id);

      if (isNaN(goalId)) {
        res.status(400).json({
          message: "Invalid goal ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (current_amount === undefined || typeof current_amount !== "number") {
        res.status(400).json({
          message: "Current amount is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updatedGoal = await GoalService.updateGoalProgress(goalId, current_amount);

      res.status(200).json({
        message: "Goal progress updated successfully",
        status: 200,
        data: updatedGoal,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateGoalProgress:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get goals near completion
  public static async getGoalsNearCompletion(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const goals = await GoalService.getGoalsNearCompletion(userId);

      res.status(200).json({
        message: "Goals near completion retrieved successfully",
        status: 200,
        data: goals,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getGoalsNearCompletion:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
