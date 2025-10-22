import { TransactionTypeModel } from "./model";
import { transactionTypeRepository as TransactionTypeRepository } from "./repository";
import {
  CreateTransactionTypeData,
  UpdateTransactionTypeData,
  TransactionTypeResponse,
} from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class TransactionTypeService {
  // Get all transaction types
  public async getAllTransactionTypes(): Promise<TransactionTypeResponse[]> {
    const transactionTypes = await TransactionTypeRepository.getAllTransactionTypes();
    return transactionTypes.map((type) =>
      this.transformToTransactionTypeResponse(type)
    );
  }

  // Get transaction type by ID
  public async getTransactionTypeById(id: number): Promise<TransactionTypeResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid transaction type ID");
    }

    const transactionType = await TransactionTypeRepository.getTransactionTypeById(id);
    if (!transactionType) {
      throw new NotFoundError("Transaction type not found");
    }

    return this.transformToTransactionTypeResponse(transactionType);
  }

  // Create new transaction type
  public async createTransactionType(
    data: CreateTransactionTypeData
  ): Promise<TransactionTypeModel> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("Transaction type name is required");
    }

    if (data.name.length > 200) {
      throw new ValidationError("Transaction type name cannot exceed 200 characters");
    }

    // Check if transaction type already exists
    const existingType = await TransactionTypeRepository.getTransactionTypeByName(
      data.name.trim()
    );
    if (existingType) {
      throw new ConflictError("Transaction type with this name already exists");
    }

    return await TransactionTypeRepository.createTransactionType({
      name: data.name.trim(),
    });
  }

  // Update transaction type
  public async updateTransactionType(
    id: number,
    data: UpdateTransactionTypeData
  ): Promise<TransactionTypeModel> {
    // Check if transaction type exists
    const existingType = await TransactionTypeRepository.getTransactionTypeById(id);
    if (!existingType) {
      throw new NotFoundError("Transaction type not found");
    }

    // Validate updated data
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new ValidationError("Transaction type name cannot be empty");
      }

      if (data.name.length > 200) {
        throw new ValidationError("Transaction type name cannot exceed 200 characters");
      }

      // Check if new name already exists (and it's not the same type)
      const typeWithName = await TransactionTypeRepository.getTransactionTypeByName(
        data.name.trim()
      );
      if (typeWithName && typeWithName.id !== id) {
        throw new ConflictError("Transaction type with this name already exists");
      }
    }

    await TransactionTypeRepository.updateTransactionType(id, {
      name: data.name?.trim(),
    });

    const updatedType = await TransactionTypeRepository.getTransactionTypeById(id);
    if (!updatedType) {
      throw new NotFoundError("Transaction type not found after update");
    }

    return updatedType;
  }

  // Delete transaction type
  public async deleteTransactionType(id: number): Promise<{ message: string }> {
    // Check if transaction type exists
    const existingType = await TransactionTypeRepository.getTransactionTypeById(id);
    if (!existingType) {
      throw new NotFoundError("Transaction type not found");
    }

    await TransactionTypeRepository.deleteTransactionType(id);
    return { message: "Transaction type deleted successfully" };
  }

  // Transform to response format
  private transformToTransactionTypeResponse(
    type: TransactionTypeModel
  ): TransactionTypeResponse {
    return {
      id: type.id,
      name: type.name,
    };
  }
}

export const transactionTypeService = new TransactionTypeService();

