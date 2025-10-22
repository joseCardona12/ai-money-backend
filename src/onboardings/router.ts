import { Router } from "express";
import { OnboardingController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const onboardingRouter: Router = Router();

// All onboarding routes require authentication
onboardingRouter.use(authMiddleware);

// POST /api/onboardings - Create onboarding
onboardingRouter.post("/", OnboardingController.createOnboarding);

// GET /api/onboardings - Get user's onboarding
onboardingRouter.get("/", OnboardingController.getUserOnboarding);

// PUT /api/onboardings - Update user's onboarding
onboardingRouter.put("/", OnboardingController.updateOnboarding);

// POST /api/onboardings/complete - Complete onboarding
onboardingRouter.post("/complete", OnboardingController.completeOnboarding);

// GET /api/onboardings/status - Check onboarding status
onboardingRouter.get("/status", OnboardingController.getOnboardingStatus);

// GET /api/onboardings/check - Check if user has onboarding record
onboardingRouter.get("/check", OnboardingController.checkUserHasOnboarding);
