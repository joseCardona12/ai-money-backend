export interface CreateTransactionData {
  description: string;
  amount: number;
  date: Date;
  transaction_type_id: number;
  state_id: number;
  user_id?: number; // Optional, will be set from JWT token
  account_id: number;
  category_id: number;
}export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  date?: Date;
  transaction_type_id?: number;
  state_id?: number;
  account_id?: number;
  category_id?: number;
}export interface TransactionResponse {
  id: number;
  description: string;
  amount: number;
  date: Date;
  created_at: Date;
  transaction_type_id: number;
  state_id: number;
  user_id: number;
  account_id: number;
  category_id: number;
  transactionType?: {
    id: number;
    name: string;
  };
  state?: {
    id: number;
    name: string;
  };
  account?: {
    id: number;
    name: string;
    balance: number;
  };
  category?: {
    id: number;
    name: string;
  };
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  transaction_type_id?: number;
  state_id?: number;
  account_id?: number;
  category_id?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface MonthlyTransactionSummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
}

export interface MonthlyStatsComparison {
  currentMonth: {
    totalAmount: number;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  lastMonth: {
    totalAmount: number;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  } | null;
  changes: {
    totalAmountChange: string | null;
    totalIncomeChange: string | null;
    totalExpensesChange: string | null;
    totalAmountChangePositive: boolean;
    totalIncomeChangePositive: boolean;
    totalExpensesChangePositive: boolean;
  };
}
