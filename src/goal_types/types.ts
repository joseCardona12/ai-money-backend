export interface CreateGoalTypeData {
  name: string;
  description: string;
}

export interface UpdateGoalTypeData {
  name?: string;
  description?: string;
}

export interface GoalTypeResponse {
  id: number;
  name: string;
  description: string;
}

