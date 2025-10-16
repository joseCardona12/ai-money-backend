import { Router } from "express";
import { BudgetController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const budgetRouter: Router = Router();

// All budget routes require authentication
budgetRouter.use(authMiddleware);

// POST /api/budgets - Create new budget
budgetRouter.post("/", BudgetController.createBudget);

// GET /api/budgets - Get user's budgets with optional filters
budgetRouter.get("/", BudgetController.getUserBudgets);

// GET /api/budgets/summary - Get budget summary
budgetRouter.get("/summary", BudgetController.getBudgetSummary);

// GET /api/budgets/monthly-overview - Get monthly budget overview
budgetRouter.get("/monthly-overview", BudgetController.getMonthlyBudgetOverview);

// GET /api/budgets/alerts - Get budgets with alerts
budgetRouter.get("/alerts", BudgetController.getBudgetsWithAlerts);

// GET /api/budgets/over-budget - Get over-budget budgets
budgetRouter.get("/over-budget", BudgetController.getOverBudgetBudgets);

// GET /api/budgets/:id - Get budget by ID
budgetRouter.get("/:id", BudgetController.getBudgetById);

// PUT /api/budgets/:id - Update budget
budgetRouter.put("/:id", BudgetController.updateBudget);

// DELETE /api/budgets/:id - Delete budget
budgetRouter.delete("/:id", BudgetController.deleteBudget);
