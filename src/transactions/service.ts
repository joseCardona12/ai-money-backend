import { TransactionModel } from "./model";
import { transactionRepository as TransactionRepository } from "./repository";
import { accountRepository as AccountRepository } from "../accounts/repository";
import {
  CreateTransactionData,
  UpdateTransactionData,
  TransactionResponse,
  TransactionFilters,
  TransactionSummary,
  MonthlyTransactionSummary,
  MonthlyStatsComparison,
} from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../util/errors/customErrors";
import { Op } from "sequelize";

export class TransactionService {
  // Create new transaction
  public async createTransaction(
    data: CreateTransactionData
  ): Promise<TransactionModel> {
    // Validate required fields
    if (!data.description || data.description.trim().length === 0) {
      throw new ValidationError("Description is required");
    }

    if (!data.amount || data.amount <= 0) {
      throw new ValidationError("Amount must be greater than 0");
    }

    if (!data.date) {
      throw new ValidationError("Date is required");
    }

    if (data.description.length > 250) {
      throw new ValidationError("Description cannot exceed 250 characters");
    }

    // Validate that the account belongs to the user
    if (data.user_id && data.account_id) {
      const account = await AccountRepository.getAccountById(data.account_id);
      if (!account) {
        throw new NotFoundError("Account not found");
      }

      if (account.user_id !== data.user_id) {
        throw new ValidationError("Account does not belong to the user");
      }
    }

    // Create transaction
    const newTransaction = await TransactionRepository.createTransaction(data);
    return newTransaction;
  }

  // Get transaction by ID
  public async getTransactionById(id: number): Promise<TransactionResponse> {
    const transaction = await TransactionRepository.getTransactionById(id);

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return this.transformToTransactionResponse(transaction);
  }

  // Get transactions by user ID with filters
  public async getTransactionsByUserId(
    userId: number,
    filters?: TransactionFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    transactions: TransactionResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const transactions = await TransactionRepository.getTransactionsByUserId(
      userId,
      filters,
      limit,
      offset
    );

    const total = await TransactionRepository.countTransactionsByUser(
      userId,
      filters
    );
    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((transaction) =>
        this.transformToTransactionResponse(transaction)
      ),
      total,
      page,
      totalPages,
    };
  }

  // Update transaction
  public async updateTransaction(
    id: number,
    data: UpdateTransactionData
  ): Promise<TransactionModel> {
    // Check if transaction exists
    const existingTransaction = await TransactionRepository.getTransactionById(
      id
    );
    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found");
    }

    // Validate updated data
    if (
      data.description !== undefined &&
      data.description.trim().length === 0
    ) {
      throw new ValidationError("Description cannot be empty");
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new ValidationError("Amount must be greater than 0");
    }

    if (data.description !== undefined && data.description.length > 250) {
      throw new ValidationError("Description cannot exceed 250 characters");
    }

    // Validate account ownership if account is being changed
    if (data.account_id !== undefined) {
      const account = await AccountRepository.getAccountById(data.account_id);
      if (!account) {
        throw new NotFoundError("Account not found");
      }

      if (account.user_id !== existingTransaction.user_id) {
        throw new ValidationError("Account does not belong to the user");
      }
    }

    // Update transaction
    await TransactionRepository.updateTransaction(id, data);

    // Return updated transaction
    const updatedTransaction = await TransactionRepository.getTransactionById(
      id
    );
    return updatedTransaction!;
  }

  // Delete transaction
  public async deleteTransaction(id: number): Promise<void> {
    const existingTransaction = await TransactionRepository.getTransactionById(
      id
    );
    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found");
    }

    await TransactionRepository.deleteTransaction(id);
  }

  // Get transactions by account
  public async getTransactionsByAccount(
    accountId: number,
    userId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    transactions: TransactionResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Verify account belongs to user
    const account = await AccountRepository.getAccountById(accountId);
    if (!account) {
      throw new NotFoundError("Account not found");
    }

    if (account.user_id !== userId) {
      throw new ValidationError("Account does not belong to the user");
    }

    const offset = (page - 1) * limit;
    const transactions = await TransactionRepository.getTransactionsByAccountId(
      accountId,
      limit,
      offset
    );

    // Count total transactions for this account
    const total = await TransactionRepository.countTransactionsByUser(userId, {
      account_id: accountId,
    });
    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((transaction) =>
        this.transformToTransactionResponse(transaction)
      ),
      total,
      page,
      totalPages,
    };
  }

  // Get recent transactions
  public async getRecentTransactions(
    userId: number,
    limit: number = 10
  ): Promise<TransactionResponse[]> {
    const transactions =
      await TransactionRepository.getRecentTransactionsForUser(userId, limit);
    return transactions.map((transaction) =>
      this.transformToTransactionResponse(transaction)
    );
  }

  // Get pending transactions
  public async getPendingTransactions(
    userId: number
  ): Promise<TransactionResponse[]> {
    const transactions =
      await TransactionRepository.getPendingTransactionsForUser(userId);
    return transactions.map((transaction) =>
      this.transformToTransactionResponse(transaction)
    );
  }

  // Get transaction summary for user
  public async getTransactionSummary(
    userId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<TransactionSummary> {
    const filters: TransactionFilters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const transactions = await TransactionRepository.getTransactionsByUserId(
      userId,
      filters
    );

    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = transactions.length;

    transactions.forEach((transaction) => {
      // Assuming transaction type 1 = Income, 2 = Expense
      if (transaction.transaction_type_id === 1) {
        totalIncome += Number(transaction.amount);
      } else if (transaction.transaction_type_id === 2) {
        totalExpenses += Number(transaction.amount);
      }
    });

    const netAmount = totalIncome - totalExpenses;
    const averageAmount =
      transactionCount > 0
        ? (totalIncome + totalExpenses) / transactionCount
        : 0;

    return {
      totalIncome,
      totalExpenses,
      netAmount,
      transactionCount,
      averageAmount,
    };
  }

  // Get monthly transaction summary
  public async getMonthlyTransactionSummary(
    userId: number,
    year: number
  ): Promise<MonthlyTransactionSummary[]> {
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st

    const transactions = await TransactionRepository.getTransactionsByUserId(
      userId,
      {
        startDate,
        endDate,
      }
    );

    // Group transactions by month
    const monthlyData: { [key: number]: MonthlyTransactionSummary } = {};

    // Initialize all months
    for (let month = 0; month < 12; month++) {
      monthlyData[month] = {
        month: new Date(year, month).toLocaleString("default", {
          month: "long",
        }),
        year,
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        transactionCount: 0,
      };
    }

    // Process transactions
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const month = transactionDate.getMonth();

      monthlyData[month].transactionCount++;

      if (transaction.transaction_type_id === 1) {
        // Income
        monthlyData[month].totalIncome += Number(transaction.amount);
      } else if (transaction.transaction_type_id === 2) {
        // Expense
        monthlyData[month].totalExpenses += Number(transaction.amount);
      }
    });

    // Calculate net amounts
    Object.values(monthlyData).forEach((monthData) => {
      monthData.netAmount = monthData.totalIncome - monthData.totalExpenses;
    });

    return Object.values(monthlyData);
  }

  // Get transactions by category
  public async getTransactionsByCategory(
    categoryId: number,
    userId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    transactions: TransactionResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const transactions = await TransactionRepository.getTransactionsByCategory(
      categoryId,
      userId,
      limit,
      offset
    );

    const total = await TransactionRepository.countTransactionsByUser(userId, {
      category_id: categoryId,
    });
    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((transaction) =>
        this.transformToTransactionResponse(transaction)
      ),
      total,
      page,
      totalPages,
    };
  }

  // Transform TransactionModel to TransactionResponse
  private transformToTransactionResponse(
    transaction: TransactionModel
  ): TransactionResponse {
    return {
      id: transaction.id,
      description: transaction.description,
      amount: Number(transaction.amount),
      date: transaction.date,
      created_at: transaction.created_at,
      transaction_type_id: transaction.transaction_type_id,
      state_id: transaction.state_id,
      user_id: transaction.user_id,
      account_id: transaction.account_id,
      category_id: transaction.category_id,
      transactionType: transaction.transactionType
        ? {
            id: transaction.transactionType.id,
            name: transaction.transactionType.name,
          }
        : undefined,
      state: transaction.state
        ? {
            id: transaction.state.id,
            name: transaction.state.name,
          }
        : undefined,
      account: transaction.account
        ? {
            id: transaction.account.id,
            name: transaction.account.name,
            balance: Number(transaction.account.balance),
          }
        : undefined,
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
          }
        : undefined,
    };
  }

  // Search transactions by name/description
  public async searchTransactionsByName(
    userId: number,
    searchTerm: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    transactions: TransactionResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new ValidationError("Search term is required");
    }

    if (searchTerm.length > 250) {
      throw new ValidationError("Search term cannot exceed 250 characters");
    }

    const offset = (page - 1) * limit;
    const transactions = await TransactionRepository.searchTransactionsByName(
      userId,
      searchTerm,
      limit,
      offset
    );

    const total = await TransactionRepository.countTransactionsBySearchTerm(
      userId,
      searchTerm
    );
    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((transaction) =>
        this.transformToTransactionResponse(transaction)
      ),
      total,
      page,
      totalPages,
    };
  }
  // Get monthly statistics with comparison to previous month
  public async getMonthlyStatsComparison(
    userId: number
  ): Promise<MonthlyStatsComparison> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Current month date range
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59
    );

    // Last month date range
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Get current month transactions
    const currentMonthTransactions =
      await TransactionRepository.getTransactionsByUserId(userId, {
        startDate: currentMonthStart,
        endDate: currentMonthEnd,
      });

    // Get last month transactions
    const lastMonthTransactions =
      await TransactionRepository.getTransactionsByUserId(userId, {
        startDate: lastMonthStart,
        endDate: lastMonthEnd,
      });

    // Calculate current month stats
    let currentTotalIncome = 0;
    let currentTotalExpenses = 0;

    currentMonthTransactions.forEach((transaction) => {
      if (transaction.transaction_type_id === 1) {
        currentTotalIncome += Number(transaction.amount);
      } else if (transaction.transaction_type_id === 2) {
        currentTotalExpenses += Number(transaction.amount);
      }
    });

    const currentTotalAmount = currentTotalIncome + currentTotalExpenses;
    const currentBalance = currentTotalIncome - currentTotalExpenses;

    // Calculate last month stats
    let lastTotalIncome = 0;
    let lastTotalExpenses = 0;
    let hasLastMonthData = lastMonthTransactions.length > 0;

    lastMonthTransactions.forEach((transaction) => {
      if (transaction.transaction_type_id === 1) {
        lastTotalIncome += Number(transaction.amount);
      } else if (transaction.transaction_type_id === 2) {
        lastTotalExpenses += Number(transaction.amount);
      }
    });

    const lastTotalAmount = lastTotalIncome + lastTotalExpenses;
    const lastBalance = lastTotalIncome - lastTotalExpenses;

    // Calculate percentage changes
    const calculatePercentageChange = (
      current: number,
      previous: number
    ): string => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? "+" : "";
      return sign;
    };

    const changes = {
      totalAmountChange: hasLastMonthData
        ? calculatePercentageChange(currentTotalAmount, lastTotalAmount)
        : null,
      totalIncomeChange: hasLastMonthData
        ? calculatePercentageChange(currentTotalIncome, lastTotalIncome)
        : null,
      totalExpensesChange: hasLastMonthData
        ? calculatePercentageChange(currentTotalExpenses, lastTotalExpenses)
        : null,
      totalAmountChangePositive: currentTotalAmount >= lastTotalAmount,
      totalIncomeChangePositive: currentTotalIncome >= lastTotalIncome,
      totalExpensesChangePositive: currentTotalExpenses <= lastTotalExpenses,
    };

    return {
      currentMonth: {
        totalAmount: currentTotalAmount,
        totalIncome: currentTotalIncome,
        totalExpenses: currentTotalExpenses,
        balance: currentBalance,
      },
      lastMonth: hasLastMonthData
        ? {
            totalAmount: lastTotalAmount,
            totalIncome: lastTotalIncome,
            totalExpenses: lastTotalExpenses,
            balance: lastBalance,
          }
        : null,
      changes,
    };
  }
}

export const transactionService = new TransactionService();
