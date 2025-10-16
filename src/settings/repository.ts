import { SettingModel } from "./model";
import { CreateSettingData, UpdateSettingData } from "./types";
import { UserModel } from "../users/model";
import { PlanModel } from "../plans/model";
import { SecurityLevelModel } from "../security_levels/model";
import { CurrencyModel } from "../currencies/model";
import { LanguageModel } from "../languages/model";

export class SettingRepository {
  // Get setting by ID
  public async getSettingById(id: number): Promise<SettingModel | null> {
    return await SettingModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
    });
  }

  // Get setting by user ID
  public async getSettingByUserId(userId: number): Promise<SettingModel | null> {
    return await SettingModel.findOne({
      where: { user_id: userId },
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
    });
  }

  // Create new setting
  public async createSetting(data: CreateSettingData): Promise<SettingModel> {
    const settingData = {
      region: data.region,
      timezone: data.timezone,
      notification_enabled: data.notification_enabled ?? true,
      user_id: data.user_id,
      plan_id: data.plan_id,
      security_level_id: data.security_level_id,
      currency_id: data.currency_id,
      language_id: data.language_id,
      created_at: new Date(),
    };

    return await SettingModel.create(settingData);
  }

  // Update setting
  public async updateSetting(
    id: number,
    data: UpdateSettingData
  ): Promise<[number]> {
    return await SettingModel.update(data, {
      where: { id },
    });
  }

  // Delete setting
  public async deleteSetting(id: number): Promise<number> {
    return await SettingModel.destroy({
      where: { id },
    });
  }

  // Get all settings (for admin purposes)
  public async getAllSettings(): Promise<SettingModel[]> {
    return await SettingModel.findAll({
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get settings by plan
  public async getSettingsByPlan(planId: number): Promise<SettingModel[]> {
    return await SettingModel.findAll({
      where: { plan_id: planId },
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get settings by security level
  public async getSettingsBySecurityLevel(securityLevelId: number): Promise<SettingModel[]> {
    return await SettingModel.findAll({
      where: { security_level_id: securityLevelId },
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get settings by language
  public async getSettingsByLanguage(languageId: number): Promise<SettingModel[]> {
    return await SettingModel.findAll({
      where: { language_id: languageId },
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get settings with notifications enabled
  public async getSettingsWithNotificationsEnabled(): Promise<SettingModel[]> {
    return await SettingModel.findAll({
      where: { notification_enabled: true },
      include: [
        { model: UserModel, as: "user" },
        { model: PlanModel, as: "plan" },
        { model: SecurityLevelModel, as: "securityLevel" },
        { model: CurrencyModel, as: "currency" },
        { model: LanguageModel, as: "language" },
      ],
      order: [["created_at", "DESC"]],
    });
  }
}

export const settingRepository = new SettingRepository();
