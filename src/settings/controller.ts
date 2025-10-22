import { Response } from "express";
import { settingService as SettingService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class SettingController {
  // Create or update user settings
  public static async createOrUpdateUserSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        region,
        timezone,
        notification_enabled,
        plan_id,
        security_level_id,
        currency_id,
        language_id,
      } = req.body;
      const userId = req.user!.id; // User ID from JWT token

      // Validate required fields for creation
      if (!region || typeof region !== "string") {
        res.status(400).json({
          message: "Region is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!timezone || typeof timezone !== "string") {
        res.status(400).json({
          message: "Timezone is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      // Create or update setting data
      const settingData = {
        region,
        timezone,
        notification_enabled: notification_enabled ?? true,
        plan_id,
        security_level_id,
        currency_id,
        language_id,
      };

      const setting = await SettingService.createOrUpdateUserSetting(
        userId,
        settingData
      );

      res.status(200).json({
        message: "Settings saved successfully",
        status: 200,
        data: setting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createOrUpdateUserSettings:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get user's settings
  public static async getUserSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const settings = await SettingService.getSettingByUserId(userId);

      res.status(200).json({
        message: "Settings retrieved successfully",
        status: 200,
        data: settings,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserSettings:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update user settings
  public static async updateUserSettings(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const {
        region,
        timezone,
        notification_enabled,
        plan_id,
        security_level_id,
        currency_id,
        language_id,
      } = req.body;

      // Update data
      const updateData: any = {};
      if (region !== undefined) updateData.region = region;
      if (timezone !== undefined) updateData.timezone = timezone;
      if (notification_enabled !== undefined)
        updateData.notification_enabled = notification_enabled;
      if (plan_id !== undefined) updateData.plan_id = plan_id;
      if (security_level_id !== undefined)
        updateData.security_level_id = security_level_id;
      if (currency_id !== undefined) updateData.currency_id = currency_id;
      if (language_id !== undefined) updateData.language_id = language_id;

      const updatedSetting = await SettingService.updateSettingByUserId(
        userId,
        updateData
      );

      res.status(200).json({
        message: "Settings updated successfully",
        status: 200,
        data: updatedSetting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateUserSettings:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Toggle notifications
  public static async toggleNotifications(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const updatedSetting = await SettingService.toggleNotifications(userId);

      res.status(200).json({
        message: "Notification settings updated successfully",
        status: 200,
        data: updatedSetting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in toggleNotifications:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get setting by user ID (admin only)
  public static async getSettingByUserId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const parsedUserId = parseInt(userId);

      if (isNaN(parsedUserId)) {
        res.status(400).json({
          message: "Invalid user ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const setting = await SettingService.getSettingByUserId(parsedUserId);

      res.status(200).json({
        message: "Setting retrieved successfully",
        status: 200,
        data: setting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getSettingByUserId:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get setting by ID (admin only)
  public static async getSettingById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const settingId = parseInt(id);

      if (isNaN(settingId)) {
        res.status(400).json({
          message: "Invalid setting ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const setting = await SettingService.getSettingById(settingId);

      res.status(200).json({
        message: "Setting retrieved successfully",
        status: 200,
        data: setting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getSettingById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update notification preference only
  public static async updateNotificationPreference(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { notification_enabled } = req.body;

      if (typeof notification_enabled !== "boolean") {
        res.status(400).json({
          message: "notification_enabled must be a boolean value",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updatedSetting = await SettingService.updateSettingByUserId(
        userId,
        {
          notification_enabled,
        }
      );

      res.status(200).json({
        message: "Notification preference updated successfully",
        status: 200,
        data: updatedSetting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error(
          "Unexpected error in updateNotificationPreference:",
          error
        );
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update timezone only
  public static async updateTimezone(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { timezone } = req.body;

      if (!timezone || typeof timezone !== "string") {
        res.status(400).json({
          message: "Timezone is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updatedSetting = await SettingService.updateSettingByUserId(
        userId,
        {
          timezone,
        }
      );

      res.status(200).json({
        message: "Timezone updated successfully",
        status: 200,
        data: updatedSetting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateTimezone:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update language preference
  public static async updateLanguagePreference(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { language_id } = req.body;

      if (!language_id || typeof language_id !== "number") {
        res.status(400).json({
          message: "Language ID is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updatedSetting = await SettingService.updateSettingByUserId(
        userId,
        {
          language_id,
        }
      );

      res.status(200).json({
        message: "Language preference updated successfully",
        status: 200,
        data: updatedSetting,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateLanguagePreference:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
