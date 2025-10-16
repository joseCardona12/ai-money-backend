import { AccountTypeModel } from "./model";
import { CreateAccountTypeData, UpdateAccountTypeData } from "./types";

export class AccountTypeRepository {
  // Get account type by ID
  public async getAccountTypeById(id: number): Promise<AccountTypeModel | null> {
    return await AccountTypeModel.findByPk(id);
  }

  // Get all account types
  public async getAllAccountTypes(): Promise<AccountTypeModel[]> {
    return await AccountTypeModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new account type
  public async createAccountType(data: CreateAccountTypeData): Promise<AccountTypeModel> {
    const accountTypeData = {
      name: data.name,
    };

    return await AccountTypeModel.create(accountTypeData);
  }

  // Update account type
  public async updateAccountType(
    id: number,
    data: UpdateAccountTypeData
  ): Promise<[number]> {
    return await AccountTypeModel.update(data, {
      where: { id },
    });
  }

  // Delete account type
  public async deleteAccountType(id: number): Promise<number> {
    return await AccountTypeModel.destroy({
      where: { id },
    });
  }

  // Get account type by name
  public async getAccountTypeByName(name: string): Promise<AccountTypeModel | null> {
    return await AccountTypeModel.findOne({
      where: { name },
    });
  }
}

export const accountTypeRepository = new AccountTypeRepository();
