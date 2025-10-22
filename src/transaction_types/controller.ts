import { Response } from "express";
import { transactionTypeService as TransactionTypeService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class TransactionTypeController {
  // Get all transaction types
  public static async getAllTransactionTypes(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const transactionTypes = await TransactionTypeService.getAllTransactionTypes();
      res.status(200).json({
        message: "Transaction types retrieved successfully",
        status: 200,
        data: transactionTypes,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAllTransactionTypes:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get transaction type by ID
  public static async getTransactionTypeById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const typeId = parseInt(id, 10);

      if (isNaN(typeId)) {
        res.status(400).json({
          message: "Invalid transaction type ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const transactionType = await TransactionTypeService.getTransactionTypeById(typeId);
      res.status(200).json({
        message: "Transaction type retrieved successfully",
        status: 200,
        data: transactionType,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getTransactionTypeById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Create new transaction type
  public static async createTransactionType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || typeof name !== "string") {
        res.status(400).json({
          message: "Transaction type name is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const transactionType = await TransactionTypeService.createTransactionType({ name });
      res.status(201).json({
        message: "Transaction type created successfully",
        status: 201,
        data: transactionType,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createTransactionType:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update transaction type
  public static async updateTransactionType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const typeId = parseInt(id, 10);

      if (isNaN(typeId)) {
        res.status(400).json({
          message: "Invalid transaction type ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { name } = req.body;

      // Build update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;

      const updatedType = await TransactionTypeService.updateTransactionType(
        typeId,
        updateData
      );

      res.status(200).json({
        message: "Transaction type updated successfully",
        status: 200,
        data: updatedType,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateTransactionType:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete transaction type
  public static async deleteTransactionType(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const typeId = parseInt(id, 10);

      if (isNaN(typeId)) {
        res.status(400).json({
          message: "Invalid transaction type ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await TransactionTypeService.deleteTransactionType(typeId);
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
        console.error("Unexpected error in deleteTransactionType:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}

