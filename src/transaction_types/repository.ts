import { TransactionTypeModel } from "./model";
import { CreateTransactionTypeData, UpdateTransactionTypeData } from "./types";

export class TransactionTypeRepository {
  // Get transaction type by ID
  public async getTransactionTypeById(id: number): Promise<TransactionTypeModel | null> {
    return await TransactionTypeModel.findByPk(id);
  }

  // Get all transaction types
  public async getAllTransactionTypes(): Promise<TransactionTypeModel[]> {
    return await TransactionTypeModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new transaction type
  public async createTransactionType(data: CreateTransactionTypeData): Promise<TransactionTypeModel> {
    const transactionTypeData = {
      name: data.name,
    };

    return await TransactionTypeModel.create(transactionTypeData);
  }

  // Update transaction type
  public async updateTransactionType(
    id: number,
    data: UpdateTransactionTypeData
  ): Promise<[number]> {
    return await TransactionTypeModel.update(data, {
      where: { id },
    });
  }

  // Delete transaction type
  public async deleteTransactionType(id: number): Promise<number> {
    return await TransactionTypeModel.destroy({
      where: { id },
    });
  }

  // Get transaction type by name
  public async getTransactionTypeByName(name: string): Promise<TransactionTypeModel | null> {
    return await TransactionTypeModel.findOne({
      where: { name },
    });
  }
}

export const transactionTypeRepository = new TransactionTypeRepository();
