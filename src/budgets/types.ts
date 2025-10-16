export interface CreateBudgetData {
  month: Date;
  budgeted_amount: number;
  spent_amount?: number;
  remaining?: number;
  alert_triggered?: boolean;
  category_id: number;
  user_id?: number; // Optional, will be set from JWT token
}

export interface UpdateBudgetData {
  month?: Date;
  budgeted_amount?: number;
  spent_amount?: number;
  remaining?: number;
  alert_triggered?: boolean;
  category_id?: number;
}

export interface BudgetResponse {
  id: number;
  month: Date;
  budgeted_amount: number;
  spent_amount: number;
  remaining: number;
  alert_triggered: boolean;
  created_at: Date;
  category_id: number;
  user_id: number;
  category?: {
    id: number;
    name: string;
  };
  // Calculated fields
  percentage_used?: number;
  is_over_budget?: boolean;
  days_remaining_in_month?: number;
}

export interface BudgetSummary {
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  percentage_used: number;
  categories_over_budget: number;
  categories_with_alerts: number;
}

export interface MonthlyBudgetOverview {
  month: Date;
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  percentage_used: number;
  budgets: BudgetResponse[];
}
