import { Response } from "express";
import { onboardingService as OnboardingService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class OnboardingController {
  // Create onboarding
  public static async createOnboarding(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        currency_id,
        monthly_income,
        initial_balance,
        goal_type_id,
        budget_preference_id,
      } = req.body;
      const userId = req.user!.id; // User ID from JWT token

      // Validate required fields
      if (!monthly_income || typeof monthly_income !== "number") {
        res.status(400).json({
          message: "Monthly income is required and must be a number",
          status: 400,
          data: {
            error: "Monthly income is required and must be a number",
          },
        });
        return;
      }

      if (
        initial_balance === undefined ||
        typeof initial_balance !== "number"
      ) {
        res.status(400).json({
          message: "Initial balance is required and must be a number",
          status: 400,
          data: {
            error: "Initial balance is required and must be a number",
          },
        });
        return;
      }

      // Create onboarding data
      const onboardingData = {
        currency_id,
        monthly_income,
        initial_balance,
        goal_type_id,
        budget_preference_id,
        user_id: userId, // Use authenticated user ID
        completed: false,
      };

      const newOnboarding = await OnboardingService.createOnboarding(
        onboardingData
      );

      res.status(201).json({
        message: "Onboarding created successfully",
        status: 201,
        data: newOnboarding,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          data: {
            error: error.message,
          },
        });
      } else {
        console.error("Unexpected error in createOnboarding:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          data: {
            error: "Internal server error",
          },
        });
      }
    }
  }

  // Get user's onboarding
  public static async getUserOnboarding(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const onboarding = await OnboardingService.getOnboardingByUserId(userId);

      res.status(200).json({
        message: "Onboarding retrieved successfully",
        status: 200,
        data: onboarding,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserOnboarding:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update onboarding
  public static async updateOnboarding(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const {
        currency_id,
        monthly_income,
        initial_balance,
        goal_type_id,
        budget_preference_id,
      } = req.body;

      // First get the user's onboarding to get the ID
      const existingOnboarding = await OnboardingService.getOnboardingByUserId(
        userId
      );

      // Update data
      const updateData = {
        currency_id,
        monthly_income,
        initial_balance,
        goal_type_id,
        budget_preference_id,
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const updatedOnboarding = await OnboardingService.updateOnboarding(
        existingOnboarding.id,
        updateData
      );

      res.status(200).json({
        message: "Onboarding updated successfully",
        status: 200,
        data: updatedOnboarding,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateOnboarding:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Complete onboarding
  public static async completeOnboarding(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const completedOnboarding = await OnboardingService.completeOnboarding(
        userId
      );

      res.status(200).json({
        message: "Onboarding completed successfully",
        status: 200,
        data: completedOnboarding,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in completeOnboarding:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Check onboarding status
  public static async getOnboardingStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const isCompleted = await OnboardingService.isUserOnboardingCompleted(
        userId
      );

      res.status(200).json({
        message: "Onboarding status retrieved successfully",
        status: 200,
        data: {
          completed: isCompleted,
          user_id: userId,
        },
      });
    } catch (error: unknown) {
      console.error("Unexpected error in getOnboardingStatus:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  // Check if user has onboarding record
  public static async checkUserHasOnboarding(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const hasOnboarding = await OnboardingService.hasUserOnboarding(userId);

      res.status(200).json({
        message: "Onboarding existence checked successfully",
        status: 200,
        data: {
          has_onboarding: hasOnboarding,
          user_id: userId,
        },
      });
    } catch (error: unknown) {
      console.error("Unexpected error in checkUserHasOnboarding:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}
