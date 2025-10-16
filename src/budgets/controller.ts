import { Response } from "express";
import { budgetService as BudgetService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class BudgetController {
  // Create new budget
  public static async createBudget(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { month, budgeted_amount, category_id } = req.body;
      const userId = req.user!.id; // User ID from JWT token

      // Validate required fields
      if (!month) {
        res.status(400).json({
          message: "Month is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!budgeted_amount || typeof budgeted_amount !== "number") {
        res.status(400).json({
          message: "Budgeted amount is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!category_id || typeof category_id !== "number") {
        res.status(400).json({
          message: "Category ID is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const budgetData = {
        month: new Date(month),
        budgeted_amount,
        category_id,
        user_id: userId,
      };

      const budget = await BudgetService.createBudget(budgetData);

      res.status(201).json({
        message: "Budget created successfully",
        status: 201,
        data: budget,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createBudget:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get user's budgets
  public static async getUserBudgets(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { page = 1, limit = 20, month } = req.query;

      const monthFilter = month ? new Date(month as string) : undefined;

      const result = await BudgetService.getBudgetsByUserId(
        userId,
        monthFilter,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        message: "Budgets retrieved successfully",
        status: 200,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserBudgets:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get budget by ID
  public static async getBudgetById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const budgetId = parseInt(id);

      if (isNaN(budgetId)) {
        res.status(400).json({
          message: "Invalid budget ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const budget = await BudgetService.getBudgetById(budgetId);

      res.status(200).json({
        message: "Budget retrieved successfully",
        status: 200,
        data: budget,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getBudgetById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update budget
  public static async updateBudget(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const budgetId = parseInt(id);

      if (isNaN(budgetId)) {
        res.status(400).json({
          message: "Invalid budget ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { month, budgeted_amount, spent_amount, category_id } = req.body;

      // Build update data
      const updateData: any = {};
      if (month !== undefined) updateData.month = new Date(month);
      if (budgeted_amount !== undefined) updateData.budgeted_amount = budgeted_amount;
      if (spent_amount !== undefined) updateData.spent_amount = spent_amount;
      if (category_id !== undefined) updateData.category_id = category_id;

      const updatedBudget = await BudgetService.updateBudget(budgetId, updateData);

      res.status(200).json({
        message: "Budget updated successfully",
        status: 200,
        data: updatedBudget,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateBudget:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete budget
  public static async deleteBudget(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const budgetId = parseInt(id);

      if (isNaN(budgetId)) {
        res.status(400).json({
          message: "Invalid budget ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      await BudgetService.deleteBudget(budgetId);

      res.status(200).json({
        message: "Budget deleted successfully",
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
        console.error("Unexpected error in deleteBudget:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get budget summary
  public static async getBudgetSummary(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { month } = req.query;

      const monthFilter = month ? new Date(month as string) : undefined;
      const summary = await BudgetService.getBudgetSummary(userId, monthFilter);

      res.status(200).json({
        message: "Budget summary retrieved successfully",
        status: 200,
        data: summary,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getBudgetSummary:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get monthly budget overview
  public static async getMonthlyBudgetOverview(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { month } = req.query;

      if (!month) {
        res.status(400).json({
          message: "Month is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const overview = await BudgetService.getMonthlyBudgetOverview(
        userId,
        new Date(month as string)
      );

      res.status(200).json({
        message: "Monthly budget overview retrieved successfully",
        status: 200,
        data: overview,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getMonthlyBudgetOverview:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get budgets with alerts
  public static async getBudgetsWithAlerts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const budgets = await BudgetService.getBudgetsWithAlerts(userId);

      res.status(200).json({
        message: "Budgets with alerts retrieved successfully",
        status: 200,
        data: budgets,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getBudgetsWithAlerts:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get over-budget budgets
  public static async getOverBudgetBudgets(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const budgets = await BudgetService.getOverBudgetBudgets(userId);

      res.status(200).json({
        message: "Over-budget budgets retrieved successfully",
        status: 200,
        data: budgets,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getOverBudgetBudgets:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
