import { Router } from "express";
import { GoalController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const goalRouter: Router = Router();

// All goal routes require authentication
goalRouter.use(authMiddleware);

// POST /api/goals - Create goal
goalRouter.post("/", GoalController.createGoal);

// GET /api/goals - Get user's goals
goalRouter.get("/", GoalController.getUserGoals);

// GET /api/goals/active - Get active goals
goalRouter.get("/active", GoalController.getActiveGoals);

// GET /api/goals/near-completion - Get goals near completion
goalRouter.get("/near-completion", GoalController.getGoalsNearCompletion);

// GET /api/goals/:id - Get goal by ID
goalRouter.get("/:id", GoalController.getGoalById);

// PUT /api/goals/:id - Update goal
goalRouter.put("/:id", GoalController.updateGoal);

// DELETE /api/goals/:id - Delete goal
goalRouter.delete("/:id", GoalController.deleteGoal);

// PATCH /api/goals/:id/progress - Update goal progress
goalRouter.patch("/:id/progress", GoalController.updateGoalProgress);
