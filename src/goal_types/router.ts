import { Router } from "express";
import { GoalTypeController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const goalTypeRouter: Router = Router();

// All routes require authentication
goalTypeRouter.use(authMiddleware);

// Get all goal types
goalTypeRouter.get("/", GoalTypeController.getAllGoalTypes);

// Get goal type by ID
goalTypeRouter.get("/:id", GoalTypeController.getGoalTypeById);

// Create new goal type
goalTypeRouter.post("/", GoalTypeController.createGoalType);

// Update goal type
goalTypeRouter.put("/:id", GoalTypeController.updateGoalType);

// Delete goal type
goalTypeRouter.delete("/:id", GoalTypeController.deleteGoalType);

