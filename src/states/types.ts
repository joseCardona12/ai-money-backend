export interface CreateStateData {
  name: string;
}

export interface UpdateStateData {
  name?: string;
}

export interface StateResponse {
  id: number;
  name: string;
}
