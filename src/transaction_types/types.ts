export interface CreateTransactionTypeData {
  name: string;
}

export interface UpdateTransactionTypeData {
  name?: string;
}

export interface TransactionTypeResponse {
  id: number;
  name: string;
}
