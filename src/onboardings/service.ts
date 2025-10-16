import { OnboardingModel } from "./model";
import { onboardingRepository as OnboardingRepository } from "./repository";
import { CreateOnboardingData, UpdateOnboardingData } from "./types";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../util/errors/customErrors";

export class OnboardingService {
  // Create new onboarding
  public async createOnboarding(
    data: CreateOnboardingData
  ): Promise<OnboardingModel> {
    // Validate required fields
    if (!data.monthly_income || data.monthly_income <= 0) {
      throw new ValidationError("Monthly income must be greater than 0");
    }

    if (data.initial_balance === undefined || data.initial_balance < 0) {
      throw new ValidationError("Initial balance must be 0 or greater");
    }

    // Check if user already has an onboarding
    const existingOnboarding = await OnboardingRepository.getOnboardingByUserId(
      data.user_id!
    );
    if (existingOnboarding) {
      throw new ConflictError("User already has an onboarding process");
    }

    // Create onboarding
    const newOnboarding = await OnboardingRepository.createOnboarding(data);
    return newOnboarding;
  }

  // Get onboarding by user ID
  public async getOnboardingByUserId(userId: number): Promise<OnboardingModel> {
    const onboarding = await OnboardingRepository.getOnboardingByUserId(userId);
    if (!onboarding) {
      throw new NotFoundError("Onboarding not found for this user");
    }
    return onboarding;
  }

  // Update onboarding
  public async updateOnboarding(
    id: number,
    data: UpdateOnboardingData
  ): Promise<OnboardingModel> {
    // Check if onboarding exists
    const existingOnboarding = await OnboardingRepository.getOnboardingById(id);
    if (!existingOnboarding) {
      throw new NotFoundError("Onboarding not found");
    }

    // Validate data if provided
    if (data.monthly_income !== undefined && data.monthly_income <= 0) {
      throw new ValidationError("Monthly income must be greater than 0");
    }

    if (data.initial_balance !== undefined && data.initial_balance < 0) {
      throw new ValidationError("Initial balance must be 0 or greater");
    }

    // Update onboarding
    await OnboardingRepository.updateOnboarding(id, data);

    // Return updated onboarding
    const updatedOnboarding = await OnboardingRepository.getOnboardingById(id);
    return updatedOnboarding!;
  }

  // Complete onboarding
  public async completeOnboarding(userId: number): Promise<OnboardingModel> {
    const onboarding = await OnboardingRepository.getOnboardingByUserId(userId);
    if (!onboarding) {
      throw new NotFoundError("Onboarding not found for this user");
    }

    // Mark as completed
    await OnboardingRepository.updateOnboarding(onboarding.id, {
      completed: true,
    });

    // Return updated onboarding
    const completedOnboarding = await OnboardingRepository.getOnboardingById(
      onboarding.id
    );
    return completedOnboarding!;
  }

  // Check if user completed onboarding
  public async isUserOnboardingCompleted(userId: number): Promise<boolean> {
    return await OnboardingRepository.isOnboardingCompleted(userId);
  }

  // Get onboarding by ID
  public async getOnboardingById(id: number): Promise<OnboardingModel> {
    const onboarding = await OnboardingRepository.getOnboardingById(id);
    if (!onboarding) {
      throw new NotFoundError("Onboarding not found");
    }
    return onboarding;
  }
}

export const onboardingService = new OnboardingService();
