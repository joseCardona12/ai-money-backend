import { Response } from "express";
import { goalTypeService as GoalTypeService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class GoalTypeController {
  // Get all goal types
  public static async getAllGoalTypes(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const goalTypes = await GoalTypeService.getAllGoalTypes();
      res.status(200).json({
        message: "Goal types retrieved successfully",
        status: 200,
        data: goalTypes,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAllGoalTypes:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get goal type by ID
  public static async getGoalTypeById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const goalTypeId = parseInt(id, 10);

      const goalType = await GoalTypeService.getGoalTypeById(goalTypeId);
      res.status(200).json({
        message: "Goal type retrieved successfully",
        status: 200,
        data: goalType,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getGoalTypeById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Create new goal type
  public static async createGoalType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name, description } = req.body;

      const newGoalType = await GoalTypeService.createGoalType({ name, description });
      res.status(201).json({
        message: "Goal type created successfully",
        status: 201,
        data: newGoalType,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createGoalType:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update goal type
  public static async updateGoalType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const goalTypeId = parseInt(id, 10);

      const updatedGoalType = await GoalTypeService.updateGoalType(goalTypeId, { name, description });
      res.status(200).json({
        message: "Goal type updated successfully",
        status: 200,
        data: updatedGoalType,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateGoalType:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete goal type
  public static async deleteGoalType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const goalTypeId = parseInt(id, 10);

      const result = await GoalTypeService.deleteGoalType(goalTypeId);
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
        console.error("Unexpected error in deleteGoalType:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}

