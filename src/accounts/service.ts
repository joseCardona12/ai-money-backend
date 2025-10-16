import { AccountModel } from "./model";
import { accountRepository as AccountRepository } from "./repository";
import { CreateAccountData, UpdateAccountData, AccountResponse } from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class AccountService {
  // Create new account
  public async createAccount(data: CreateAccountData): Promise<AccountModel> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("Account name is required");
    }

    if (data.name.length > 250) {
      throw new ValidationError("Account name cannot exceed 250 characters");
    }

    // Validate balance
    if (data.balance !== undefined && data.balance < 0) {
      throw new ValidationError("Account balance cannot be negative");
    }

    // Create account
    const newAccount = await AccountRepository.createAccount(data);
    return newAccount;
  }

  // Get account by ID
  public async getAccountById(id: number): Promise<AccountResponse> {
    const account = await AccountRepository.getAccountById(id);
    
    if (!account) {
      throw new NotFoundError("Account not found");
    }

    return this.transformToAccountResponse(account);
  }

  // Get accounts by user ID
  public async getAccountsByUserId(userId: number): Promise<AccountResponse[]> {
    const accounts = await AccountRepository.getAccountsByUserId(userId);
    return accounts.map(account => this.transformToAccountResponse(account));
  }

  // Update account
  public async updateAccount(id: number, data: UpdateAccountData): Promise<AccountModel> {
    // Check if account exists
    const existingAccount = await AccountRepository.getAccountById(id);
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }

    // Validate updated data
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError("Account name cannot be empty");
    }

    if (data.name !== undefined && data.name.length > 250) {
      throw new ValidationError("Account name cannot exceed 250 characters");
    }

    if (data.balance !== undefined && data.balance < 0) {
      throw new ValidationError("Account balance cannot be negative");
    }

    // Update account
    await AccountRepository.updateAccount(id, data);
    
    // Return updated account
    const updatedAccount = await AccountRepository.getAccountById(id);
    return updatedAccount!;
  }

  // Delete account
  public async deleteAccount(id: number): Promise<void> {
    const existingAccount = await AccountRepository.getAccountById(id);
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }

    await AccountRepository.deleteAccount(id);
  }

  // Update account balance
  public async updateAccountBalance(id: number, balance: number): Promise<AccountModel> {
    const existingAccount = await AccountRepository.getAccountById(id);
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }

    if (balance < 0) {
      throw new ValidationError("Account balance cannot be negative");
    }

    await AccountRepository.updateAccountBalance(id, balance);
    
    const updatedAccount = await AccountRepository.getAccountById(id);
    return updatedAccount!;
  }

  // Get total balance for user
  public async getTotalBalanceForUser(userId: number): Promise<number> {
    return await AccountRepository.getTotalBalanceForUser(userId);
  }

  // Get accounts with low balance
  public async getAccountsWithLowBalance(
    userId: number,
    threshold: number = 100
  ): Promise<AccountResponse[]> {
    if (threshold < 0) {
      throw new ValidationError("Threshold cannot be negative");
    }

    const accounts = await AccountRepository.getAccountsWithLowBalance(userId, threshold);
    return accounts.map(account => this.transformToAccountResponse(account));
  }

  // Get accounts by type
  public async getAccountsByType(accountTypeId: number): Promise<AccountResponse[]> {
    const accounts = await AccountRepository.getAccountsByType(accountTypeId);
    return accounts.map(account => this.transformToAccountResponse(account));
  }

  // Get accounts by currency
  public async getAccountsByCurrency(currencyId: number): Promise<AccountResponse[]> {
    const accounts = await AccountRepository.getAccountsByCurrency(currencyId);
    return accounts.map(account => this.transformToAccountResponse(account));
  }

  // Add money to account (deposit)
  public async depositToAccount(id: number, amount: number): Promise<AccountModel> {
    if (amount <= 0) {
      throw new ValidationError("Deposit amount must be greater than 0");
    }

    const existingAccount = await AccountRepository.getAccountById(id);
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }

    const newBalance = Number(existingAccount.balance) + amount;
    await AccountRepository.updateAccountBalance(id, newBalance);
    
    const updatedAccount = await AccountRepository.getAccountById(id);
    return updatedAccount!;
  }

  // Remove money from account (withdrawal)
  public async withdrawFromAccount(id: number, amount: number): Promise<AccountModel> {
    if (amount <= 0) {
      throw new ValidationError("Withdrawal amount must be greater than 0");
    }

    const existingAccount = await AccountRepository.getAccountById(id);
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }

    const newBalance = Number(existingAccount.balance) - amount;
    if (newBalance < 0) {
      throw new ValidationError("Insufficient funds for withdrawal");
    }

    await AccountRepository.updateAccountBalance(id, newBalance);
    
    const updatedAccount = await AccountRepository.getAccountById(id);
    return updatedAccount!;
  }

  // Transfer money between accounts
  public async transferBetweenAccounts(
    fromAccountId: number,
    toAccountId: number,
    amount: number
  ): Promise<{ fromAccount: AccountModel; toAccount: AccountModel }> {
    if (amount <= 0) {
      throw new ValidationError("Transfer amount must be greater than 0");
    }

    if (fromAccountId === toAccountId) {
      throw new ValidationError("Cannot transfer to the same account");
    }

    const fromAccount = await AccountRepository.getAccountById(fromAccountId);
    const toAccount = await AccountRepository.getAccountById(toAccountId);

    if (!fromAccount) {
      throw new NotFoundError("Source account not found");
    }

    if (!toAccount) {
      throw new NotFoundError("Destination account not found");
    }

    const fromBalance = Number(fromAccount.balance) - amount;
    if (fromBalance < 0) {
      throw new ValidationError("Insufficient funds for transfer");
    }

    const toBalance = Number(toAccount.balance) + amount;

    // Update both accounts
    await AccountRepository.updateAccountBalance(fromAccountId, fromBalance);
    await AccountRepository.updateAccountBalance(toAccountId, toBalance);

    // Return updated accounts
    const updatedFromAccount = await AccountRepository.getAccountById(fromAccountId);
    const updatedToAccount = await AccountRepository.getAccountById(toAccountId);

    return {
      fromAccount: updatedFromAccount!,
      toAccount: updatedToAccount!,
    };
  }

  // Transform AccountModel to AccountResponse
  private transformToAccountResponse(account: AccountModel): AccountResponse {
    return {
      id: account.id,
      name: account.name,
      account_type_id: account.account_type_id,
      balance: account.balance,
      created_at: account.created_at,
      currency_id: account.currency_id,
      user_id: account.user_id,
      accountType: account.accountType ? {
        id: account.accountType.id,
        name: account.accountType.name,
      } : undefined,
      currency: account.currency ? {
        id: account.currency.id,
        name: account.currency.name,
      } : undefined,
    };
  }
}

export const accountService = new AccountService();
