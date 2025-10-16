import { BudgetModel } from "./model";
import { CreateBudgetData, UpdateBudgetData } from "./types";
import { UserModel } from "../users/model";
import { CategoryModel } from "../categories/model";
import { Op } from "sequelize";

export class BudgetRepository {
  // Get budget by ID
  public async getBudgetById(id: number): Promise<BudgetModel | null> {
    return await BudgetModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: CategoryModel, as: "category" },
      ],
    });
  }

  // Get budgets by user ID
  public async getBudgetsByUserId(
    userId: number,
    month?: Date,
    limit?: number,
    offset?: number
  ): Promise<BudgetModel[]> {
    const whereClause: any = { user_id: userId };

    if (month) {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      whereClause.month = {
        [Op.between]: [startOfMonth, endOfMonth],
      };
    }

    return await BudgetModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: CategoryModel, as: "category" },
      ],
      order: [["month", "DESC"], ["category_id", "ASC"]],
      limit,
      offset,
    });
  }

  // Create new budget
  public async createBudget(data: CreateBudgetData): Promise<BudgetModel> {
    const budgetData = {
      month: data.month,
      budgeted_amount: data.budgeted_amount,
      spent_amount: data.spent_amount || 0,
      remaining: data.remaining || data.budgeted_amount,
      alert_triggered: data.alert_triggered || false,
      category_id: data.category_id,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await BudgetModel.create(budgetData);
  }

  // Update budget
  public async updateBudget(
    id: number,
    data: UpdateBudgetData
  ): Promise<[number]> {
    return await BudgetModel.update(data, {
      where: { id },
    });
  }

  // Delete budget
  public async deleteBudget(id: number): Promise<number> {
    return await BudgetModel.destroy({
      where: { id },
    });
  }

  // Get budget by user, category and month
  public async getBudgetByUserCategoryMonth(
    userId: number,
    categoryId: number,
    month: Date
  ): Promise<BudgetModel | null> {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    return await BudgetModel.findOne({
      where: {
        user_id: userId,
        category_id: categoryId,
        month: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: CategoryModel, as: "category" },
      ],
    });
  }

  // Get budgets with alerts triggered
  public async getBudgetsWithAlerts(userId: number): Promise<BudgetModel[]> {
    return await BudgetModel.findAll({
      where: {
        user_id: userId,
        alert_triggered: true,
      },
      include: [
        { model: UserModel, as: "user" },
        { model: CategoryModel, as: "category" },
      ],
      order: [["month", "DESC"]],
    });
  }

  // Get over-budget budgets
  public async getOverBudgetBudgets(userId: number): Promise<BudgetModel[]> {
    return await BudgetModel.findAll({
      where: {
        user_id: userId,
        remaining: {
          [Op.lt]: 0,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: CategoryModel, as: "category" },
      ],
      order: [["month", "DESC"]],
    });
  }

  // Get budgets by category
  public async getBudgetsByCategory(
    categoryId: number,
    userId?: number,
    limit?: number,
    offset?: number
  ): Promise<BudgetModel[]> {
    const whereClause: any = { category_id: categoryId };
    if (userId) {
      whereClause.user_id = userId;
    }

    return await BudgetModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: CategoryModel, as: "category" },
      ],
      order: [["month", "DESC"]],
      limit,
      offset,
    });
  }

  // Count budgets by user
  public async countBudgetsByUser(userId: number, month?: Date): Promise<number> {
    const whereClause: any = { user_id: userId };

    if (month) {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      whereClause.month = {
        [Op.between]: [startOfMonth, endOfMonth],
      };
    }

    return await BudgetModel.count({
      where: whereClause,
    });
  }

  // Update spent amount for budget
  public async updateSpentAmount(
    id: number,
    spentAmount: number
  ): Promise<[number]> {
    const budget = await this.getBudgetById(id);
    if (!budget) {
      throw new Error("Budget not found");
    }

    const remaining = Number(budget.budgeted_amount) - spentAmount;
    const alertTriggered = remaining < 0 || (remaining / Number(budget.budgeted_amount)) < 0.1; // Alert if less than 10% remaining

    return await BudgetModel.update(
      {
        spent_amount: spentAmount,
        remaining: remaining,
        alert_triggered: alertTriggered,
      },
      {
        where: { id },
      }
    );
  }
}

export const budgetRepository = new BudgetRepository();
