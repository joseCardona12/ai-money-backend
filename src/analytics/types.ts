export interface CreateAnalyticsData {
  total_income?: number;
  total_expenses?: number;
  total_savings?: number;
  savings_rate?: number;
  net_cash_flow?: number;
  period: Date;
  user_id?: number; // Optional, will be set from JWT token
}

export interface UpdateAnalyticsData {
  total_income?: number;
  total_expenses?: number;
  total_savings?: number;
  savings_rate?: number;
  net_cash_flow?: number;
  period?: Date;
}

export interface AnalyticsResponse {
  id: number;
  total_income: number;
  total_expenses: number;
  total_savings: number;
  savings_rate: number;
  net_cash_flow: number;
  period: Date;
  created_at: Date;
  user_id: number;
  // Calculated fields
  expense_ratio?: number;
  income_growth?: number;
  expense_growth?: number;
  financial_health_score?: number;
}

export interface AnalyticsTrend {
  period: Date;
  total_income: number;
  total_expenses: number;
  total_savings: number;
  savings_rate: number;
  net_cash_flow: number;
  income_change_percentage?: number;
  expense_change_percentage?: number;
  savings_change_percentage?: number;
}

export interface FinancialHealthMetrics {
  current_savings_rate: number;
  average_savings_rate: number;
  debt_to_income_ratio: number;
  emergency_fund_months: number;
  financial_health_score: number;
  recommendations: string[];
}

export interface CategoryAnalytics {
  category_id: number;
  category_name: string;
  total_spent: number;
  percentage_of_expenses: number;
  average_transaction_amount: number;
  transaction_count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface MonthlyComparison {
  current_month: AnalyticsResponse;
  previous_month: AnalyticsResponse;
  income_change: number;
  expense_change: number;
  savings_change: number;
  net_cash_flow_change: number;
}
