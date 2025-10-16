export interface CreateOnboardingData {
  currency_id?: number;
  monthly_income: number;
  initial_balance: number;
  completed?: boolean;
  user_id?: number;
  goal_type_id?: number;
  budget_preference_id?: number;
}

export interface UpdateOnboardingData {
  currency_id?: number;
  monthly_income?: number;
  initial_balance?: number;
  completed?: boolean;
  goal_type_id?: number;
  budget_preference_id?: number;
}

export interface OnboardingResponse {
  id: number;
  currency_id?: number;
  monthly_income: number;
  initial_balance: number;
  completed: boolean;
  user_id?: number;
  goal_type_id?: number;
  budget_preference_id?: number;
}
