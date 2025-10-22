import { Router } from "express";
import { TransactionTypeController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const transactionTypeRouter: Router = Router();

// All transaction type routes require authentication
transactionTypeRouter.use(authMiddleware);

// POST /api/transaction-types - Create new transaction type
transactionTypeRouter.post("/", TransactionTypeController.createTransactionType);

// GET /api/transaction-types - Get all transaction types
transactionTypeRouter.get("/", TransactionTypeController.getAllTransactionTypes);

// GET /api/transaction-types/:id - Get transaction type by ID
transactionTypeRouter.get("/:id", TransactionTypeController.getTransactionTypeById);

// PUT /api/transaction-types/:id - Update transaction type
transactionTypeRouter.put("/:id", TransactionTypeController.updateTransactionType);

// DELETE /api/transaction-types/:id - Delete transaction type
transactionTypeRouter.delete("/:id", TransactionTypeController.deleteTransactionType);

