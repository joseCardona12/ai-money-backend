import { OnboardingModel } from "./model";
import { CreateOnboardingData, UpdateOnboardingData } from "./types";

export class OnboardingRepository {
  // Get onboarding by user ID
  public async getOnboardingByUserId(
    userId: number
  ): Promise<OnboardingModel | null> {
    return await OnboardingModel.findOne({
      where: { user_id: userId },
    });
  }

  // Get onboarding by ID
  public async getOnboardingById(id: number): Promise<OnboardingModel | null> {
    return await OnboardingModel.findByPk(id);
  }

  // Create new onboarding
  public async createOnboarding(
    data: CreateOnboardingData
  ): Promise<OnboardingModel> {
    const onboardingData = {
      currency_id: data.currency_id,
      monthly_income: data.monthly_income,
      initial_balance: data.initial_balance,
      completed: data.completed || false,
      user_id: data.user_id,
      goal_type_id: data.goal_type_id,
      budget_preference_id: data.budget_preference_id,
    };

    return await OnboardingModel.create(onboardingData);
  }

  // Update onboarding
  public async updateOnboarding(
    id: number,
    data: UpdateOnboardingData
  ): Promise<[number]> {
    return await OnboardingModel.update(data, {
      where: { id },
    });
  }

  // Delete onboarding
  public async deleteOnboarding(id: number): Promise<number> {
    return await OnboardingModel.destroy({
      where: { id },
    });
  }

  // Check if user has completed onboarding
  public async isOnboardingCompleted(userId: number): Promise<boolean> {
    const onboarding = await OnboardingModel.findOne({
      where: { user_id: userId, completed: true },
    });
    return !!onboarding;
  }

  // Get all onboardings (for admin purposes)
  public async getAllOnboardings(): Promise<OnboardingModel[]> {
    return await OnboardingModel.findAll();
  }
}

export const onboardingRepository = new OnboardingRepository();
