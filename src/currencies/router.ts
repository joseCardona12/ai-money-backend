import { Router } from "express";
import { CurrencyController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const currencyRouter: Router = Router();

// All routes require authentication
currencyRouter.use(authMiddleware);

// Get all currencies
currencyRouter.get("/", CurrencyController.getAllCurrencies);

// Get currency by ID
currencyRouter.get("/:id", CurrencyController.getCurrencyById);

// Create new currency
currencyRouter.post("/", CurrencyController.createCurrency);

// Update currency
currencyRouter.put("/:id", CurrencyController.updateCurrency);

// Delete currency
currencyRouter.delete("/:id", CurrencyController.deleteCurrency);

