import { Router } from "express";
import { AccountController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const accountRouter: Router = Router();

// All account routes require authentication
accountRouter.use(authMiddleware);

// POST /api/accounts - Create account
accountRouter.post("/", AccountController.createAccount);

// GET /api/accounts - Get user's accounts
accountRouter.get("/", AccountController.getUserAccounts);

// GET /api/accounts/total-balance - Get total balance
accountRouter.get("/total-balance", AccountController.getTotalBalance);

// GET /api/accounts/low-balance - Get accounts with low balance
accountRouter.get("/low-balance", AccountController.getAccountsWithLowBalance);

// POST /api/accounts/transfer - Transfer between accounts
accountRouter.post("/transfer", AccountController.transferBetweenAccounts);

// GET /api/accounts/:id - Get account by ID
accountRouter.get("/:id", AccountController.getAccountById);

// PUT /api/accounts/:id - Update account
accountRouter.put("/:id", AccountController.updateAccount);

// DELETE /api/accounts/:id - Delete account
accountRouter.delete("/:id", AccountController.deleteAccount);

// POST /api/accounts/:id/deposit - Deposit to account
accountRouter.post("/:id/deposit", AccountController.depositToAccount);

// POST /api/accounts/:id/withdraw - Withdraw from account
accountRouter.post("/:id/withdraw", AccountController.withdrawFromAccount);
