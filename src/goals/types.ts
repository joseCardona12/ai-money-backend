export interface CreateGoalData {
  name: string;
  target_amount: number;
  current_amount?: number;
  start_date: Date;
  end_date: Date;
  state_id?: number;
  goal_type_id?: number;
  user_id?: number;
}

export interface UpdateGoalData {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  start_date?: Date;
  end_date?: Date;
  state_id?: number;
  goal_type_id?: number;
}

export interface GoalResponse {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  state_id?: number;
  goal_type_id?: number;
  user_id?: number;
  progress_percentage?: number;
  days_remaining?: number;
}
