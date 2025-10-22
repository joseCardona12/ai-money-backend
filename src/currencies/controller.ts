import { Response } from "express";
import { currencyService as CurrencyService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class CurrencyController {
  // Get all currencies
  public static async getAllCurrencies(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const currencies = await CurrencyService.getAllCurrencies();
      res.status(200).json({
        message: "Currencies retrieved successfully",
        status: 200,
        data: currencies,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAllCurrencies:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get currency by ID
  public static async getCurrencyById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const currencyId = parseInt(id, 10);

      const currency = await CurrencyService.getCurrencyById(currencyId);
      res.status(200).json({
        message: "Currency retrieved successfully",
        status: 200,
        data: currency,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getCurrencyById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Create new currency
  public static async createCurrency(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name } = req.body;

      const newCurrency = await CurrencyService.createCurrency({ name });
      res.status(201).json({
        message: "Currency created successfully",
        status: 201,
        data: newCurrency,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createCurrency:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update currency
  public static async updateCurrency(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const currencyId = parseInt(id, 10);

      const updatedCurrency = await CurrencyService.updateCurrency(currencyId, { name });
      res.status(200).json({
        message: "Currency updated successfully",
        status: 200,
        data: updatedCurrency,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateCurrency:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete currency
  public static async deleteCurrency(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const currencyId = parseInt(id, 10);

      const result = await CurrencyService.deleteCurrency(currencyId);
      res.status(200).json({
        message: result.message,
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
        console.error("Unexpected error in deleteCurrency:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}

