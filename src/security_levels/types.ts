export interface CreateSecurityLevelData {
  name: string;
}

export interface UpdateSecurityLevelData {
  name?: string;
}

export interface SecurityLevelResponse {
  id: number;
  name: string;
}
