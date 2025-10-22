import { TransactionModel } from "./model";
import {
  CreateTransactionData,
  UpdateTransactionData,
  TransactionFilters,
} from "./types";
import { UserModel } from "../users/model";
import { AccountModel } from "../accounts/model";
import { TransactionTypeModel } from "../transaction_types/model";
import { StateModel } from "../states/model";
import { CategoryModel } from "../categories/model";
import { Op } from "sequelize";

export class TransactionRepository {
  // Get transaction by ID
  public async getTransactionById(
    id: number
  ): Promise<TransactionModel | null> {
    return await TransactionModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
    });
  }

  // Get transactions by user ID
  public async getTransactionsByUserId(
    userId: number,
    filters?: TransactionFilters,
    limit?: number,
    offset?: number
  ): Promise<TransactionModel[]> {
    const whereClause: any = { user_id: userId };

    // Apply filters
    if (filters) {
      if (filters.startDate && filters.endDate) {
        whereClause.date = {
          [Op.between]: [filters.startDate, filters.endDate],
        };
      } else if (filters.startDate) {
        whereClause.date = {
          [Op.gte]: filters.startDate,
        };
      } else if (filters.endDate) {
        whereClause.date = {
          [Op.lte]: filters.endDate,
        };
      }

      if (filters.transaction_type_id) {
        whereClause.transaction_type_id = filters.transaction_type_id;
      }

      if (filters.state_id) {
        whereClause.state_id = filters.state_id;
      }

      if (filters.account_id) {
        whereClause.account_id = filters.account_id;
      }

      if (filters.category_id) {
        whereClause.category_id = filters.category_id;
      }

      if (filters.minAmount && filters.maxAmount) {
        whereClause.amount = {
          [Op.between]: [filters.minAmount, filters.maxAmount],
        };
      } else if (filters.minAmount) {
        whereClause.amount = {
          [Op.gte]: filters.minAmount,
        };
      } else if (filters.maxAmount) {
        whereClause.amount = {
          [Op.lte]: filters.maxAmount,
        };
      }
    }

    return await TransactionModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [
        ["date", "DESC"],
        ["created_at", "DESC"],
      ],
      limit,
      offset,
    });
  }

  // Create new transaction
  public async createTransaction(
    data: CreateTransactionData
  ): Promise<TransactionModel> {
    const transactionData = {
      description: data.description,
      amount: data.amount,
      date: data.date,
      transaction_type_id: data.transaction_type_id,
      state_id: data.state_id,
      user_id: data.user_id,
      account_id: data.account_id,
      category_id: data.category_id,
      created_at: new Date(),
    };

    return await TransactionModel.create(transactionData);
  }

  // Update transaction
  public async updateTransaction(
    id: number,
    data: UpdateTransactionData
  ): Promise<[number]> {
    return await TransactionModel.update(data, {
      where: { id },
    });
  }

  // Delete transaction
  public async deleteTransaction(id: number): Promise<number> {
    return await TransactionModel.destroy({
      where: { id },
    });
  }

  // Get transactions by account ID
  public async getTransactionsByAccountId(
    accountId: number,
    limit?: number,
    offset?: number
  ): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      where: { account_id: accountId },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [
        ["date", "DESC"],
        ["created_at", "DESC"],
      ],
      limit,
      offset,
    });
  }

  // Get transactions by category
  public async getTransactionsByCategory(
    categoryId: number,
    userId?: number,
    limit?: number,
    offset?: number
  ): Promise<TransactionModel[]> {
    const whereClause: any = { category_id: categoryId };
    if (userId) {
      whereClause.user_id = userId;
    }

    return await TransactionModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [
        ["date", "DESC"],
        ["created_at", "DESC"],
      ],
      limit,
      offset,
    });
  }

  // Get transactions by type
  public async getTransactionsByType(
    transactionTypeId: number,
    userId?: number,
    limit?: number,
    offset?: number
  ): Promise<TransactionModel[]> {
    const whereClause: any = { transaction_type_id: transactionTypeId };
    if (userId) {
      whereClause.user_id = userId;
    }

    return await TransactionModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [
        ["date", "DESC"],
        ["created_at", "DESC"],
      ],
      limit,
      offset,
    });
  }

  // Get recent transactions for user
  public async getRecentTransactionsForUser(
    userId: number,
    limit: number = 10
  ): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      where: { user_id: userId },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [["created_at", "DESC"]],
      limit,
    });
  }

  // Get pending transactions for user
  public async getPendingTransactionsForUser(
    userId: number,
    pendingStateId: number = 1
  ): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      where: {
        user_id: userId,
        state_id: pendingStateId,
      },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [
        ["date", "ASC"],
        ["created_at", "ASC"],
      ],
    });
  }

  // Count transactions by user
  public async countTransactionsByUser(
    userId: number,
    filters?: TransactionFilters
  ): Promise<number> {
    const whereClause: any = { user_id: userId };

    // Apply same filters as getTransactionsByUserId
    if (filters) {
      if (filters.startDate && filters.endDate) {
        whereClause.date = {
          [Op.between]: [filters.startDate, filters.endDate],
        };
      }
      if (filters.transaction_type_id) {
        whereClause.transaction_type_id = filters.transaction_type_id;
      }
      if (filters.state_id) {
        whereClause.state_id = filters.state_id;
      }
      if (filters.account_id) {
        whereClause.account_id = filters.account_id;
      }
      if (filters.category_id) {
        whereClause.category_id = filters.category_id;
      }
    }

    return await TransactionModel.count({
      where: whereClause,
    });
  }

  // Search transactions by name/description
  public async searchTransactionsByName(
    userId: number,
    searchTerm: string,
    limit?: number,
    offset?: number
  ): Promise<TransactionModel[]> {
    return await TransactionModel.findAll({
      where: {
        user_id: userId,
        description: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountModel, as: "account" },
        { model: TransactionTypeModel, as: "transactionType" },
        { model: StateModel, as: "state" },
        { model: CategoryModel, as: "category" },
      ],
      order: [
        ["date", "DESC"],
        ["created_at", "DESC"],
      ],
      limit,
      offset,
    });
  }

  // Count transactions by search term
  public async countTransactionsBySearchTerm(
    userId: number,
    searchTerm: string
  ): Promise<number> {
    return await TransactionModel.count({
      where: {
        user_id: userId,
        description: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
    });
  }
}

export const transactionRepository = new TransactionRepository();
