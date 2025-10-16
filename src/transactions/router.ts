import { Router } from "express";
import { TransactionController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const transactionRouter: Router = Router();

// All transaction routes require authentication
transactionRouter.use(authMiddleware);

// POST /api/transactions - Create new transaction
transactionRouter.post("/", TransactionController.createTransaction);

// GET /api/transactions - Get user's transactions with filters and pagination
transactionRouter.get("/", TransactionController.getUserTransactions);

// GET /api/transactions/recent - Get recent transactions
transactionRouter.get("/recent", TransactionController.getRecentTransactions);

// GET /api/transactions/pending - Get pending transactions
transactionRouter.get("/pending", TransactionController.getPendingTransactions);

// GET /api/transactions/summary - Get transaction summary
transactionRouter.get("/summary", TransactionController.getTransactionSummary);

// GET /api/transactions/monthly-summary - Get monthly transaction summary
transactionRouter.get("/monthly-summary", TransactionController.getMonthlyTransactionSummary);

// GET /api/transactions/account/:accountId - Get transactions by account
transactionRouter.get("/account/:accountId", TransactionController.getTransactionsByAccount);

// GET /api/transactions/category/:categoryId - Get transactions by category
transactionRouter.get("/category/:categoryId", TransactionController.getTransactionsByCategory);

// GET /api/transactions/:id - Get transaction by ID
transactionRouter.get("/:id", TransactionController.getTransactionById);

// PUT /api/transactions/:id - Update transaction
transactionRouter.put("/:id", TransactionController.updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
transactionRouter.delete("/:id", TransactionController.deleteTransaction);
