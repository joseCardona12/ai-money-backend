import { Response } from "express";
import { analyticsService as AnalyticsService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class AnalyticsController {
  // Get all analytics for user (current user)
  public static async getUserAnalytics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      const analytics = await AnalyticsService.getUserAnalytics(userId);
      res.status(200).json({
        message: "User analytics retrieved successfully",
        status: 200,
        data: analytics,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserAnalytics:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get all analytics for specific user by ID (admin)
  public static async getAnalyticsByUserId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const parsedUserId = parseInt(userId, 10);

      if (isNaN(parsedUserId)) {
        res.status(400).json({
          message: "Invalid user ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const analytics = await AnalyticsService.getUserAnalytics(parsedUserId);
      res.status(200).json({
        message: "User analytics retrieved successfully",
        status: 200,
        data: analytics,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAnalyticsByUserId:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get analytics by ID
  public static async getAnalyticsById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const analyticsId = parseInt(id, 10);

      const analytics = await AnalyticsService.getAnalyticsById(analyticsId);
      res.status(200).json({
        message: "Analytics retrieved successfully",
        status: 200,
        data: analytics,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAnalyticsById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Create analytics
  public static async createAnalytics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        total_income,
        total_expenses,
        total_savings,
        savings_rate,
        net_cash_flow,
        period,
      } = req.body;

      const analytics = await AnalyticsService.createAnalytics(userId, {
        total_income,
        total_expenses,
        total_savings,
        savings_rate,
        net_cash_flow,
        period: new Date(period),
      });

      res.status(201).json({
        message: "Analytics created successfully",
        status: 201,
        data: analytics,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createAnalytics:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update analytics
  public static async updateAnalytics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const analyticsId = parseInt(id, 10);
      const {
        total_income,
        total_expenses,
        total_savings,
        savings_rate,
        net_cash_flow,
        period,
      } = req.body;

      const analytics = await AnalyticsService.updateAnalytics(analyticsId, {
        total_income,
        total_expenses,
        total_savings,
        savings_rate,
        net_cash_flow,
        period: period ? new Date(period) : undefined,
      });

      res.status(200).json({
        message: "Analytics updated successfully",
        status: 200,
        data: analytics,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateAnalytics:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get analytics trends
  public static async getAnalyticsTrends(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { months } = req.query;
      const monthsParam = months ? parseInt(months as string, 10) : 12;

      const trends = await AnalyticsService.getAnalyticsTrends(
        userId,
        monthsParam
      );
      res.status(200).json({
        message: "Analytics trends retrieved successfully",
        status: 200,
        data: trends,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAnalyticsTrends:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get financial health metrics
  public static async getFinancialHealthMetrics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      const metrics = await AnalyticsService.getFinancialHealthMetrics(userId);
      res.status(200).json({
        message: "Financial health metrics retrieved successfully",
        status: 200,
        data: metrics,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getFinancialHealthMetrics:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
