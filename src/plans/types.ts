export interface CreatePlanData {
  name: string;
}

export interface UpdatePlanData {
  name?: string;
}

export interface PlanResponse {
  id: number;
  name: string;
}
