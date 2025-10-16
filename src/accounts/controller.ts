import { Response } from "express";
import { accountService as AccountService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class AccountController {
  // Create account
  public static async createAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name, account_type_id, balance, currency_id } = req.body;
      const userId = req.user!.id; // User ID from JWT token

      // Validate required fields
      if (!name || typeof name !== "string") {
        res.status(400).json({
          message: "Account name is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      // Create account data
      const accountData = {
        name,
        account_type_id,
        balance: balance || 0,
        currency_id,
        user_id: userId, // Use authenticated user ID
      };

      const newAccount = await AccountService.createAccount(accountData);

      res.status(201).json({
        message: "Account created successfully",
        status: 201,
        data: newAccount,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createAccount:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get user's accounts
  public static async getUserAccounts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const accounts = await AccountService.getAccountsByUserId(userId);

      res.status(200).json({
        message: "Accounts retrieved successfully",
        status: 200,
        data: accounts,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserAccounts:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get account by ID
  public static async getAccountById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const accountId = parseInt(id);

      if (isNaN(accountId)) {
        res.status(400).json({
          message: "Invalid account ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const account = await AccountService.getAccountById(accountId);

      res.status(200).json({
        message: "Account retrieved successfully",
        status: 200,
        data: account,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAccountById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update account
  public static async updateAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const accountId = parseInt(id);

      if (isNaN(accountId)) {
        res.status(400).json({
          message: "Invalid account ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { name, account_type_id, balance, currency_id } = req.body;

      // Update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (account_type_id !== undefined) updateData.account_type_id = account_type_id;
      if (balance !== undefined) updateData.balance = balance;
      if (currency_id !== undefined) updateData.currency_id = currency_id;

      const updatedAccount = await AccountService.updateAccount(accountId, updateData);

      res.status(200).json({
        message: "Account updated successfully",
        status: 200,
        data: updatedAccount,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateAccount:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete account
  public static async deleteAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const accountId = parseInt(id);

      if (isNaN(accountId)) {
        res.status(400).json({
          message: "Invalid account ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      await AccountService.deleteAccount(accountId);

      res.status(200).json({
        message: "Account deleted successfully",
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
        console.error("Unexpected error in deleteAccount:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get total balance
  public static async getTotalBalance(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token

      const totalBalance = await AccountService.getTotalBalanceForUser(userId);

      res.status(200).json({
        message: "Total balance retrieved successfully",
        status: 200,
        data: {
          total_balance: totalBalance,
          user_id: userId,
        },
      });
    } catch (error: unknown) {
      console.error("Unexpected error in getTotalBalance:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  // Deposit to account
  public static async depositToAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const accountId = parseInt(id);

      if (isNaN(accountId)) {
        res.status(400).json({
          message: "Invalid account ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!amount || typeof amount !== "number" || amount <= 0) {
        res.status(400).json({
          message: "Amount is required and must be a positive number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updatedAccount = await AccountService.depositToAccount(accountId, amount);

      res.status(200).json({
        message: "Deposit completed successfully",
        status: 200,
        data: updatedAccount,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in depositToAccount:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Withdraw from account
  public static async withdrawFromAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const accountId = parseInt(id);

      if (isNaN(accountId)) {
        res.status(400).json({
          message: "Invalid account ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (!amount || typeof amount !== "number" || amount <= 0) {
        res.status(400).json({
          message: "Amount is required and must be a positive number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const updatedAccount = await AccountService.withdrawFromAccount(accountId, amount);

      res.status(200).json({
        message: "Withdrawal completed successfully",
        status: 200,
        data: updatedAccount,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in withdrawFromAccount:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Transfer between accounts
  public static async transferBetweenAccounts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { from_account_id, to_account_id, amount } = req.body;

      if (!from_account_id || !to_account_id || !amount) {
        res.status(400).json({
          message: "From account ID, to account ID, and amount are required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (typeof amount !== "number" || amount <= 0) {
        res.status(400).json({
          message: "Amount must be a positive number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await AccountService.transferBetweenAccounts(
        from_account_id,
        to_account_id,
        amount
      );

      res.status(200).json({
        message: "Transfer completed successfully",
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
        console.error("Unexpected error in transferBetweenAccounts:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get accounts with low balance
  public static async getAccountsWithLowBalance(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id; // User ID from JWT token
      const { threshold } = req.query;
      const thresholdAmount = threshold ? parseFloat(threshold as string) : 100;

      if (isNaN(thresholdAmount)) {
        res.status(400).json({
          message: "Threshold must be a valid number",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const accounts = await AccountService.getAccountsWithLowBalance(userId, thresholdAmount);

      res.status(200).json({
        message: "Accounts with low balance retrieved successfully",
        status: 200,
        data: accounts,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAccountsWithLowBalance:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
