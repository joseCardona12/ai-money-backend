export interface CreateAccountData {
  name: string;
  account_type_id?: number;
  balance?: number;
  currency_id?: number;
  user_id?: number;
}

export interface UpdateAccountData {
  name?: string;
  account_type_id?: number;
  balance?: number;
  currency_id?: number;
}

export interface AccountResponse {
  id: number;
  name: string;
  account_type_id?: number;
  balance: number;
  created_at: Date;
  currency_id?: number;
  user_id?: number;
  accountType?: {
    id: number;
    name: string;
  };
  currency?: {
    id: number;
    name: string;
  };
}
