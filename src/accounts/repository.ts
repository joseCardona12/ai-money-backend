import { AccountModel } from "./model";
import { CreateAccountData, UpdateAccountData } from "./types";
import { UserModel } from "../users/model";
import { AccountTypeModel } from "../account_types/model";
import { CurrencyModel } from "../currencies/model";

export class AccountRepository {
  // Get account by ID
  public async getAccountById(id: number): Promise<AccountModel | null> {
    return await AccountModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: AccountTypeModel, as: "accountType" },
        { model: CurrencyModel, as: "currency" },
      ],
    });
  }

  // Get accounts by user ID
  public async getAccountsByUserId(userId: number): Promise<AccountModel[]> {
    return await AccountModel.findAll({
      where: { user_id: userId },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountTypeModel, as: "accountType" },
        { model: CurrencyModel, as: "currency" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Create new account
  public async createAccount(data: CreateAccountData): Promise<AccountModel> {
    const accountData = {
      name: data.name,
      account_type_id: data.account_type_id,
      balance: data.balance || 0.00,
      currency_id: data.currency_id,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await AccountModel.create(accountData);
  }

  // Update account
  public async updateAccount(
    id: number,
    data: UpdateAccountData
  ): Promise<[number]> {
    return await AccountModel.update(data, {
      where: { id },
    });
  }

  // Delete account
  public async deleteAccount(id: number): Promise<number> {
    return await AccountModel.destroy({
      where: { id },
    });
  }

  // Get all accounts (for admin purposes)
  public async getAllAccounts(): Promise<AccountModel[]> {
    return await AccountModel.findAll({
      include: [
        { model: UserModel, as: "user" },
        { model: AccountTypeModel, as: "accountType" },
        { model: CurrencyModel, as: "currency" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get accounts by account type
  public async getAccountsByType(accountTypeId: number): Promise<AccountModel[]> {
    return await AccountModel.findAll({
      where: { account_type_id: accountTypeId },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountTypeModel, as: "accountType" },
        { model: CurrencyModel, as: "currency" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Get accounts by currency
  public async getAccountsByCurrency(currencyId: number): Promise<AccountModel[]> {
    return await AccountModel.findAll({
      where: { currency_id: currencyId },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountTypeModel, as: "accountType" },
        { model: CurrencyModel, as: "currency" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Update account balance
  public async updateAccountBalance(
    id: number,
    balance: number
  ): Promise<[number]> {
    return await AccountModel.update(
      { balance },
      { where: { id } }
    );
  }

  // Get total balance for user (sum of all accounts)
  public async getTotalBalanceForUser(userId: number): Promise<number> {
    const accounts = await AccountModel.findAll({
      where: { user_id: userId },
      attributes: ['balance'],
    });

    return accounts.reduce((total, account) => total + Number(account.balance), 0);
  }

  // Get accounts with low balance (less than specified amount)
  public async getAccountsWithLowBalance(
    userId: number,
    threshold: number
  ): Promise<AccountModel[]> {
    return await AccountModel.findAll({
      where: { 
        user_id: userId,
        balance: {
          [require('sequelize').Op.lt]: threshold
        }
      },
      include: [
        { model: UserModel, as: "user" },
        { model: AccountTypeModel, as: "accountType" },
        { model: CurrencyModel, as: "currency" },
      ],
      order: [["balance", "ASC"]],
    });
  }
}

export const accountRepository = new AccountRepository();
