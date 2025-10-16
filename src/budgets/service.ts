import { BudgetModel } from "./model";
import { budgetRepository as BudgetRepository } from "./repository";
import { 
  CreateBudgetData, 
  UpdateBudgetData, 
  BudgetResponse, 
  BudgetSummary,
  MonthlyBudgetOverview
} from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class BudgetService {
  // Create new budget
  public async createBudget(data: CreateBudgetData): Promise<BudgetModel> {
    // Validate required fields
    if (!data.month) {
      throw new ValidationError("Month is required");
    }

    if (!data.budgeted_amount || data.budgeted_amount <= 0) {
      throw new ValidationError("Budgeted amount must be greater than 0");
    }

    if (!data.category_id) {
      throw new ValidationError("Category ID is required");
    }

    // Check if budget already exists for this user, category, and month
    if (data.user_id) {
      const existingBudget = await BudgetRepository.getBudgetByUserCategoryMonth(
        data.user_id,
        data.category_id,
        data.month
      );
      
      if (existingBudget) {
        throw new ConflictError("Budget already exists for this category and month");
      }
    }

    // Calculate remaining amount
    const spentAmount = data.spent_amount || 0;
    const remaining = data.budgeted_amount - spentAmount;

    const budgetData: CreateBudgetData = {
      ...data,
      spent_amount: spentAmount,
      remaining: remaining,
      alert_triggered: remaining < 0 || (remaining / data.budgeted_amount) < 0.1,
    };

    // Create budget
    const newBudget = await BudgetRepository.createBudget(budgetData);
    return newBudget;
  }

  // Get budget by ID
  public async getBudgetById(id: number): Promise<BudgetResponse> {
    const budget = await BudgetRepository.getBudgetById(id);
    
    if (!budget) {
      throw new NotFoundError("Budget not found");
    }

    return this.transformToBudgetResponse(budget);
  }

  // Get budgets by user ID
  public async getBudgetsByUserId(
    userId: number,
    month?: Date,
    page: number = 1,
    limit: number = 20
  ): Promise<{ budgets: BudgetResponse[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    
    const budgets = await BudgetRepository.getBudgetsByUserId(
      userId,
      month,
      limit,
      offset
    );

    const total = await BudgetRepository.countBudgetsByUser(userId, month);
    const totalPages = Math.ceil(total / limit);

    return {
      budgets: budgets.map(budget => this.transformToBudgetResponse(budget)),
      total,
      page,
      totalPages,
    };
  }

  // Update budget
  public async updateBudget(id: number, data: UpdateBudgetData): Promise<BudgetModel> {
    // Check if budget exists
    const existingBudget = await BudgetRepository.getBudgetById(id);
    if (!existingBudget) {
      throw new NotFoundError("Budget not found");
    }

    // Validate updated data
    if (data.budgeted_amount !== undefined && data.budgeted_amount <= 0) {
      throw new ValidationError("Budgeted amount must be greater than 0");
    }

    // Recalculate remaining if amounts change
    if (data.budgeted_amount !== undefined || data.spent_amount !== undefined) {
      const budgetedAmount = data.budgeted_amount || Number(existingBudget.budgeted_amount);
      const spentAmount = data.spent_amount !== undefined ? data.spent_amount : Number(existingBudget.spent_amount);
      
      data.remaining = budgetedAmount - spentAmount;
      data.alert_triggered = data.remaining < 0 || (data.remaining / budgetedAmount) < 0.1;
    }

    // Update budget
    await BudgetRepository.updateBudget(id, data);
    
    // Return updated budget
    const updatedBudget = await BudgetRepository.getBudgetById(id);
    return updatedBudget!;
  }

  // Delete budget
  public async deleteBudget(id: number): Promise<void> {
    const existingBudget = await BudgetRepository.getBudgetById(id);
    if (!existingBudget) {
      throw new NotFoundError("Budget not found");
    }

    await BudgetRepository.deleteBudget(id);
  }

  // Get budget summary for user
  public async getBudgetSummary(userId: number, month?: Date): Promise<BudgetSummary> {
    const budgets = await BudgetRepository.getBudgetsByUserId(userId, month);

    let totalBudgeted = 0;
    let totalSpent = 0;
    let totalRemaining = 0;
    let categoriesOverBudget = 0;
    let categoriesWithAlerts = 0;

    budgets.forEach(budget => {
      totalBudgeted += Number(budget.budgeted_amount);
      totalSpent += Number(budget.spent_amount);
      totalRemaining += Number(budget.remaining);
      
      if (Number(budget.remaining) < 0) {
        categoriesOverBudget++;
      }
      
      if (budget.alert_triggered) {
        categoriesWithAlerts++;
      }
    });

    const percentageUsed = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    return {
      total_budgeted: totalBudgeted,
      total_spent: totalSpent,
      total_remaining: totalRemaining,
      percentage_used: percentageUsed,
      categories_over_budget: categoriesOverBudget,
      categories_with_alerts: categoriesWithAlerts,
    };
  }

  // Get monthly budget overview
  public async getMonthlyBudgetOverview(
    userId: number,
    month: Date
  ): Promise<MonthlyBudgetOverview> {
    const budgets = await BudgetRepository.getBudgetsByUserId(userId, month);
    const summary = await this.getBudgetSummary(userId, month);

    return {
      month,
      total_budgeted: summary.total_budgeted,
      total_spent: summary.total_spent,
      total_remaining: summary.total_remaining,
      percentage_used: summary.percentage_used,
      budgets: budgets.map(budget => this.transformToBudgetResponse(budget)),
    };
  }

  // Get budgets with alerts
  public async getBudgetsWithAlerts(userId: number): Promise<BudgetResponse[]> {
    const budgets = await BudgetRepository.getBudgetsWithAlerts(userId);
    return budgets.map(budget => this.transformToBudgetResponse(budget));
  }

  // Get over-budget budgets
  public async getOverBudgetBudgets(userId: number): Promise<BudgetResponse[]> {
    const budgets = await BudgetRepository.getOverBudgetBudgets(userId);
    return budgets.map(budget => this.transformToBudgetResponse(budget));
  }

  // Update spent amount (called when transactions are created)
  public async updateSpentAmount(
    userId: number,
    categoryId: number,
    month: Date,
    additionalSpent: number
  ): Promise<void> {
    const budget = await BudgetRepository.getBudgetByUserCategoryMonth(userId, categoryId, month);
    
    if (budget) {
      const newSpentAmount = Number(budget.spent_amount) + additionalSpent;
      await BudgetRepository.updateSpentAmount(budget.id, newSpentAmount);
    }
  }

  // Create or update budget for category and month
  public async createOrUpdateBudget(
    userId: number,
    categoryId: number,
    month: Date,
    budgetedAmount: number
  ): Promise<BudgetModel> {
    const existingBudget = await BudgetRepository.getBudgetByUserCategoryMonth(
      userId,
      categoryId,
      month
    );

    if (existingBudget) {
      // Update existing budget
      return await this.updateBudget(existingBudget.id, {
        budgeted_amount: budgetedAmount,
      });
    } else {
      // Create new budget
      return await this.createBudget({
        month,
        budgeted_amount: budgetedAmount,
        category_id: categoryId,
        user_id: userId,
      });
    }
  }

  // Transform BudgetModel to BudgetResponse
  private transformToBudgetResponse(budget: BudgetModel): BudgetResponse {
    const percentageUsed = Number(budget.budgeted_amount) > 0 
      ? (Number(budget.spent_amount) / Number(budget.budgeted_amount)) * 100 
      : 0;

    const isOverBudget = Number(budget.remaining) < 0;

    // Calculate days remaining in month
    const budgetMonth = new Date(budget.month);
    const lastDayOfMonth = new Date(budgetMonth.getFullYear(), budgetMonth.getMonth() + 1, 0);
    const today = new Date();
    const daysRemainingInMonth = Math.max(0, Math.ceil((lastDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      id: budget.id,
      month: budget.month,
      budgeted_amount: Number(budget.budgeted_amount),
      spent_amount: Number(budget.spent_amount),
      remaining: Number(budget.remaining),
      alert_triggered: budget.alert_triggered,
      created_at: budget.created_at,
      category_id: budget.category_id,
      user_id: budget.user_id,
      category: budget.category ? {
        id: budget.category.id,
        name: budget.category.name,
      } : undefined,
      percentage_used: percentageUsed,
      is_over_budget: isOverBudget,
      days_remaining_in_month: daysRemainingInMonth,
    };
  }
}

export const budgetService = new BudgetService();
