import { Router } from "express";
import { SettingController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const settingRouter: Router = Router();

// All setting routes require authentication
settingRouter.use(authMiddleware);

// POST /api/settings - Create or update user settings
settingRouter.post("/", SettingController.createOrUpdateUserSettings);

// GET /api/settings - Get user's settings
settingRouter.get("/", SettingController.getUserSettings);

// PUT /api/settings - Update user settings
settingRouter.put("/", SettingController.updateUserSettings);

// POST /api/settings/toggle-notifications - Toggle notifications
settingRouter.post("/toggle-notifications", SettingController.toggleNotifications);

// PATCH /api/settings/notifications - Update notification preference
settingRouter.patch("/notifications", SettingController.updateNotificationPreference);

// PATCH /api/settings/timezone - Update timezone
settingRouter.patch("/timezone", SettingController.updateTimezone);

// PATCH /api/settings/language - Update language preference
settingRouter.patch("/language", SettingController.updateLanguagePreference);

// GET /api/settings/:id - Get setting by ID (admin)
settingRouter.get("/:id", SettingController.getSettingById);
