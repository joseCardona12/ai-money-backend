import { Response } from "express";
import { transactionService as TransactionService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";
import { TransactionFilters } from "./types";

export class TransactionController {
  // Create new transaction
  public static async createTransaction(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        description,
        amount,
        date,
        transaction_type_id,
        state_id,
        account_id,
        category_id,
      } = req.body;
      const userId = req.user!.id; // User ID from JWT token

      // Validate required fields
      if (!description || typeof description !== "string") {
        res.status(400).json({
          message: "Description is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!amount || typeof amount !== "number") {
        res.status(400).json({
          message: "Amount is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!date) {
        res.status(400).json({
          message: "Date is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!transaction_type_id || typeof transaction_type_id !== "number") {
        res.status(400).json({
          message: "Transaction type ID is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!state_id || typeof state_id !== "number") {
        res.status(400).json({
          message: "State ID is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!account_id || typeof account_id !== "number") {
        res.status(400).json({
          message: "Account ID is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!category_id || typeof category_id !== "number") {
        res.status(400).json({
          message: "Category ID is required and must be a number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const transactionData = {
        description,
        amount,
        date: new Date(date),
        transaction_type_id,
        state_id,
        user_id: userId,
        account_id,
        category_id,
      };

      const transaction = await TransactionService.createTransaction(
        transactionData
      );

      res.status(201).json({
        message: "Transaction created successfully",
        status: 201,
        data: transaction,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createTransaction:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get user's transactions (current user)
  public static async getUserTransactions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const {
        page = 1,
        limit = 20,
        startDate,
        endDate,
        transaction_type_id,
        type,
        state_id,
        account_id,
        category_id,
        category,
        minAmount,
        maxAmount,
      } = req.query;

      // Build filters
      const filters: TransactionFilters = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      // Support both transaction_type_id and type parameter names
      if (transaction_type_id)
        filters.transaction_type_id = Number(transaction_type_id);
      else if (type) filters.transaction_type_id = Number(type);
      if (state_id) filters.state_id = Number(state_id);
      if (account_id) filters.account_id = Number(account_id);
      // Support both category_id and category parameter names
      if (category_id) filters.category_id = Number(category_id);
      else if (category) filters.category_id = Number(category);
      if (minAmount) filters.minAmount = Number(minAmount);
      if (maxAmount) filters.maxAmount = Number(maxAmount);

      const result = await TransactionService.getTransactionsByUserId(
        userId,
        filters,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        message: "Transactions retrieved successfully",
        status: 200,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserTransactions:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get transactions for specific user by ID (admin)
  public static async getTransactionsByUserId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const parsedUserId = parseInt(userId, 10);

      if (isNaN(parsedUserId)) {
        res.status(400).json({
          message: "Invalid user ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const {
        page = 1,
        limit = 20,
        search,
        startDate,
        endDate,
        transaction_type_id,
        type,
        state_id,
        account_id,
        category_id,
        category,
        minAmount,
        maxAmount,
      } = req.query;

      // If search parameter is provided, use search functionality
      if (search && typeof search === "string") {
        const result = await TransactionService.searchTransactionsByName(
          parsedUserId,
          search,
          Number(page),
          Number(limit)
        );

        res.status(200).json({
          message: "Transactions search completed successfully",
          status: 200,
          data: result,
        });
        return;
      }

      // Build filters
      const filters: TransactionFilters = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      // Support both transaction_type_id and type parameter names
      if (transaction_type_id)
        filters.transaction_type_id = Number(transaction_type_id);
      else if (type) filters.transaction_type_id = Number(type);
      if (state_id) filters.state_id = Number(state_id);
      if (account_id) filters.account_id = Number(account_id);
      // Support both category_id and category parameter names
      if (category_id) filters.category_id = Number(category_id);
      else if (category) filters.category_id = Number(category);
      if (minAmount) filters.minAmount = Number(minAmount);
      if (maxAmount) filters.maxAmount = Number(maxAmount);

      const result = await TransactionService.getTransactionsByUserId(
        parsedUserId,
        filters,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        message: "Transactions retrieved successfully",
        status: 200,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getTransactionsByUserId:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get transaction by ID
  public static async getTransactionById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const transactionId = parseInt(id);

      if (isNaN(transactionId)) {
        res.status(400).json({
          message: "Invalid transaction ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const transaction = await TransactionService.getTransactionById(
        transactionId
      );

      res.status(200).json({
        message: "Transaction retrieved successfully",
        status: 200,
        data: transaction,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getTransactionById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update transaction
  public static async updateTransaction(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const transactionId = parseInt(id);

      if (isNaN(transactionId)) {
        res.status(400).json({
          message: "Invalid transaction ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const {
        description,
        amount,
        date,
        transaction_type_id,
        state_id,
        account_id,
        category_id,
      } = req.body;

      // Build update data
      const updateData: any = {};
      if (description !== undefined) updateData.description = description;
      if (amount !== undefined) updateData.amount = amount;
      if (date !== undefined) updateData.date = new Date(date);
      if (transaction_type_id !== undefined)
        updateData.transaction_type_id = transaction_type_id;
      if (state_id !== undefined) updateData.state_id = state_id;
      if (account_id !== undefined) updateData.account_id = account_id;
      if (category_id !== undefined) updateData.category_id = category_id;

      const updatedTransaction = await TransactionService.updateTransaction(
        transactionId,
        updateData
      );

      res.status(200).json({
        message: "Transaction updated successfully",
        status: 200,
        data: updatedTransaction,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateTransaction:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete transaction
  public static async deleteTransaction(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const transactionId = parseInt(id);

      if (isNaN(transactionId)) {
        res.status(400).json({
          message: "Invalid transaction ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      await TransactionService.deleteTransaction(transactionId);

      res.status(200).json({
        message: "Transaction deleted successfully",
        status: 200,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in deleteTransaction:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get recent transactions
  public static async getRecentTransactions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { limit = 10 } = req.query;

      const transactions = await TransactionService.getRecentTransactions(
        userId,
        Number(limit)
      );

      res.status(200).json({
        message: "Recent transactions retrieved successfully",
        status: 200,
        data: transactions,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getRecentTransactions:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get pending transactions
  public static async getPendingTransactions(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const transactions = await TransactionService.getPendingTransactions(
        userId
      );

      res.status(200).json({
        message: "Pending transactions retrieved successfully",
        status: 200,
        data: transactions,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getPendingTransactions:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get transaction summary
  public static async getTransactionSummary(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { startDate, endDate } = req.query;

      const summary = await TransactionService.getTransactionSummary(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json({
        message: "Transaction summary retrieved successfully",
        status: 200,
        data: summary,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getTransactionSummary:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get monthly transaction summary
  public static async getMonthlyTransactionSummary(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { year } = req.query;

      if (!year) {
        res.status(400).json({
          message: "Year is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const summary = await TransactionService.getMonthlyTransactionSummary(
        userId,
        Number(year)
      );

      res.status(200).json({
        message: "Monthly transaction summary retrieved successfully",
        status: 200,
        data: summary,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error(
          "Unexpected error in getMonthlyTransactionSummary:",
          error
        );
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get transactions by account
  public static async getTransactionsByAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { accountId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const accountIdNum = parseInt(accountId);
      if (isNaN(accountIdNum)) {
        res.status(400).json({
          message: "Invalid account ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await TransactionService.getTransactionsByAccount(
        accountIdNum,
        userId,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        message: "Transactions by account retrieved successfully",
        status: 200,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getTransactionsByAccount:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get transactions by category
  public static async getTransactionsByCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { categoryId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const categoryIdNum = parseInt(categoryId);
      if (isNaN(categoryIdNum)) {
        res.status(400).json({
          message: "Invalid category ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await TransactionService.getTransactionsByCategory(
        categoryIdNum,
        userId,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        message: "Transactions by category retrieved successfully",
        status: 200,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getTransactionsByCategory:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Search transactions by name/description
  public static async searchTransactionsByName(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { search } = req.query;
      const { page = 1, limit = 20 } = req.query;

      if (!search || typeof search !== "string") {
        res.status(400).json({
          message: "Search term is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await TransactionService.searchTransactionsByName(
        userId,
        search,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        message: "Transactions search completed successfully",
        status: 200,
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in searchTransactionsByName:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
