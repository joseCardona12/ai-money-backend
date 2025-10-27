import { Router } from "express";
import { TransactionController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const transactionRouter: Router = Router();

// All transaction routes require authentication
transactionRouter.use(authMiddleware);

// ===== MOST SPECIFIC ROUTES FIRST (with multiple path segments) =====

// GET /api/transactions/user/:userId/monthly-stats - Get monthly statistics with comparison for specific user
transactionRouter.get(
  "/user/:userId/monthly-stats",
  TransactionController.getMonthlyStatsComparison
);

// GET /api/transactions/user/:userId/recent - Get recent transactions for specific user
transactionRouter.get(
  "/user/:userId/recent",
  TransactionController.getRecentTransactions
);

// GET /api/transactions/user/:userId/pending - Get pending transactions for specific user
transactionRouter.get(
  "/user/:userId/pending",
  TransactionController.getPendingTransactions
);

// GET /api/transactions/user/:userId/summary - Get transaction summary for specific user
transactionRouter.get(
  "/user/:userId/summary",
  TransactionController.getTransactionSummary
);

// GET /api/transactions/user/:userId/monthly-summary - Get monthly transaction summary for specific user
transactionRouter.get(
  "/user/:userId/monthly-summary",
  TransactionController.getMonthlyTransactionSummary
);

// GET /api/transactions/user/:userId/search - Search transactions by name/description for specific user
transactionRouter.get(
  "/user/:userId/search",
  TransactionController.searchTransactionsByName
);

// GET /api/transactions/user/:userId/account/:accountId - Get transactions by account for specific user
transactionRouter.get(
  "/user/:userId/account/:accountId",
  TransactionController.getTransactionsByAccount
);

// GET /api/transactions/user/:userId/category/:categoryId - Get transactions by category for specific user
transactionRouter.get(
  "/user/:userId/category/:categoryId",
  TransactionController.getTransactionsByCategory
);

// ===== TRANSACTION SPECIFIC ROUTES (/:id/user/:userId) =====

// GET /api/transactions/:id/user/:userId - Get transaction by ID for specific user
transactionRouter.get(
  "/:id/user/:userId",
  TransactionController.getTransactionById
);

// PUT /api/transactions/:id/user/:userId - Update transaction for specific user
transactionRouter.put(
  "/:id/user/:userId",
  TransactionController.updateTransaction
);

// DELETE /api/transactions/:id/user/:userId - Delete transaction for specific user
transactionRouter.delete(
  "/:id/user/:userId",
  TransactionController.deleteTransaction
);

// ===== GENERIC ROUTES (/:userId or /user/:userId) =====

// POST /api/transactions/user/:userId - Create transaction for specific user
transactionRouter.post(
  "/user/:userId",
  TransactionController.createTransactionForUser
);

// GET /api/transactions/user/:userId - Get all transactions for specific user
transactionRouter.get(
  "/user/:userId",
  TransactionController.getTransactionsByUserId
);
