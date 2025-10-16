import { SettingModel } from "./model";
import { settingRepository as SettingRepository } from "./repository";
import { CreateSettingData, UpdateSettingData, SettingResponse } from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class SettingService {
  // Create new setting
  public async createSetting(data: CreateSettingData): Promise<SettingModel> {
    // Validate required fields
    if (!data.region || data.region.trim().length === 0) {
      throw new ValidationError("Region is required");
    }

    if (!data.timezone || data.timezone.trim().length === 0) {
      throw new ValidationError("Timezone is required");
    }

    if (data.region.length > 250) {
      throw new ValidationError("Region cannot exceed 250 characters");
    }

    if (data.timezone.length > 250) {
      throw new ValidationError("Timezone cannot exceed 250 characters");
    }

    // Check if user already has settings
    if (data.user_id) {
      const existingSetting = await SettingRepository.getSettingByUserId(data.user_id);
      if (existingSetting) {
        throw new ConflictError("User already has settings configured");
      }
    }

    // Create setting
    const newSetting = await SettingRepository.createSetting(data);
    return newSetting;
  }

  // Get setting by ID
  public async getSettingById(id: number): Promise<SettingResponse> {
    const setting = await SettingRepository.getSettingById(id);
    
    if (!setting) {
      throw new NotFoundError("Setting not found");
    }

    return this.transformToSettingResponse(setting);
  }

  // Get setting by user ID
  public async getSettingByUserId(userId: number): Promise<SettingResponse> {
    const setting = await SettingRepository.getSettingByUserId(userId);
    
    if (!setting) {
      throw new NotFoundError("Settings not found for this user");
    }

    return this.transformToSettingResponse(setting);
  }

  // Update setting
  public async updateSetting(id: number, data: UpdateSettingData): Promise<SettingModel> {
    // Check if setting exists
    const existingSetting = await SettingRepository.getSettingById(id);
    if (!existingSetting) {
      throw new NotFoundError("Setting not found");
    }

    // Validate updated data
    if (data.region !== undefined && data.region.trim().length === 0) {
      throw new ValidationError("Region cannot be empty");
    }

    if (data.timezone !== undefined && data.timezone.trim().length === 0) {
      throw new ValidationError("Timezone cannot be empty");
    }

    if (data.region !== undefined && data.region.length > 250) {
      throw new ValidationError("Region cannot exceed 250 characters");
    }

    if (data.timezone !== undefined && data.timezone.length > 250) {
      throw new ValidationError("Timezone cannot exceed 250 characters");
    }

    // Update setting
    await SettingRepository.updateSetting(id, data);
    
    // Return updated setting
    const updatedSetting = await SettingRepository.getSettingById(id);
    return updatedSetting!;
  }

  // Update setting by user ID
  public async updateSettingByUserId(userId: number, data: UpdateSettingData): Promise<SettingModel> {
    // Get user's setting
    const existingSetting = await SettingRepository.getSettingByUserId(userId);
    if (!existingSetting) {
      throw new NotFoundError("Settings not found for this user");
    }

    return await this.updateSetting(existingSetting.id, data);
  }

  // Delete setting
  public async deleteSetting(id: number): Promise<void> {
    const existingSetting = await SettingRepository.getSettingById(id);
    if (!existingSetting) {
      throw new NotFoundError("Setting not found");
    }

    await SettingRepository.deleteSetting(id);
  }

  // Toggle notifications
  public async toggleNotifications(userId: number): Promise<SettingModel> {
    const existingSetting = await SettingRepository.getSettingByUserId(userId);
    if (!existingSetting) {
      throw new NotFoundError("Settings not found for this user");
    }

    const newNotificationStatus = !existingSetting.notification_enabled;
    
    await SettingRepository.updateSetting(existingSetting.id, {
      notification_enabled: newNotificationStatus,
    });

    const updatedSetting = await SettingRepository.getSettingById(existingSetting.id);
    return updatedSetting!;
  }

  // Get settings by plan
  public async getSettingsByPlan(planId: number): Promise<SettingResponse[]> {
    const settings = await SettingRepository.getSettingsByPlan(planId);
    return settings.map(setting => this.transformToSettingResponse(setting));
  }

  // Get settings by security level
  public async getSettingsBySecurityLevel(securityLevelId: number): Promise<SettingResponse[]> {
    const settings = await SettingRepository.getSettingsBySecurityLevel(securityLevelId);
    return settings.map(setting => this.transformToSettingResponse(setting));
  }

  // Get settings by language
  public async getSettingsByLanguage(languageId: number): Promise<SettingResponse[]> {
    const settings = await SettingRepository.getSettingsByLanguage(languageId);
    return settings.map(setting => this.transformToSettingResponse(setting));
  }

  // Get users with notifications enabled
  public async getUsersWithNotificationsEnabled(): Promise<SettingResponse[]> {
    const settings = await SettingRepository.getSettingsWithNotificationsEnabled();
    return settings.map(setting => this.transformToSettingResponse(setting));
  }

  // Create or update setting for user
  public async createOrUpdateUserSetting(userId: number, data: CreateSettingData | UpdateSettingData): Promise<SettingModel> {
    const existingSetting = await SettingRepository.getSettingByUserId(userId);
    
    if (existingSetting) {
      // Update existing setting
      return await this.updateSetting(existingSetting.id, data as UpdateSettingData);
    } else {
      // Create new setting
      const createData: CreateSettingData = {
        region: (data as CreateSettingData).region || "UTC",
        timezone: (data as CreateSettingData).timezone || "UTC",
        notification_enabled: data.notification_enabled ?? true,
        user_id: userId,
        plan_id: data.plan_id,
        security_level_id: data.security_level_id,
        currency_id: data.currency_id,
        language_id: data.language_id,
      };
      
      return await this.createSetting(createData);
    }
  }

  // Transform SettingModel to SettingResponse
  private transformToSettingResponse(setting: SettingModel): SettingResponse {
    return {
      id: setting.id,
      region: setting.region,
      timezone: setting.timezone,
      notification_enabled: setting.notification_enabled,
      created_at: setting.created_at,
      user_id: setting.user_id,
      plan_id: setting.plan_id,
      security_level_id: setting.security_level_id,
      currency_id: setting.currency_id,
      language_id: setting.language_id,
      plan: setting.plan ? {
        id: setting.plan.id,
        name: setting.plan.name,
      } : undefined,
      securityLevel: setting.securityLevel ? {
        id: setting.securityLevel.id,
        name: setting.securityLevel.name,
      } : undefined,
      currency: setting.currency ? {
        id: setting.currency.id,
        name: setting.currency.name,
      } : undefined,
      language: setting.language ? {
        id: setting.language.id,
        name: setting.language.name,
      } : undefined,
    };
  }
}

export const settingService = new SettingService();
