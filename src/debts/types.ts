export interface CreateDebtData {
  name: string;
  total_amount: number;
  remaining_amount?: number;
  monthly_payment: number;
  interest_rate: number;
  start_date: Date;
  end_date?: Date;
  status_id: number;
  user_id?: number; // Optional, will be set from JWT token
}

export interface UpdateDebtData {
  name?: string;
  total_amount?: number;
  remaining_amount?: number;
  monthly_payment?: number;
  interest_rate?: number;
  start_date?: Date;
  end_date?: Date;
  status_id?: number;
}

export interface DebtResponse {
  id: number;
  name: string;
  total_amount: number;
  remaining_amount: number;
  monthly_payment: number;
  interest_rate: number;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  status_id: number;
  user_id: number;
  status?: {
    id: number;
    name: string;
  };
  // Calculated fields
  percentage_paid?: number;
  months_remaining?: number;
  total_interest_paid?: number;
  next_payment_date?: Date;
  is_overdue?: boolean;
}

export interface DebtSummary {
  total_debt_amount: number;
  total_remaining_amount: number;
  total_monthly_payments: number;
  average_interest_rate: number;
  total_debts_count: number;
  active_debts_count: number;
  percentage_paid_overall: number;
}

export interface DebtPaymentProjection {
  debt_id: number;
  debt_name: string;
  current_balance: number;
  monthly_payment: number;
  interest_rate: number;
  months_to_payoff: number;
  total_interest_to_pay: number;
  payoff_date: Date;
}
