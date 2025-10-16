export interface CreateSettingData {
  region: string;
  timezone: string;
  notification_enabled?: boolean;
  user_id?: number;
  plan_id?: number;
  security_level_id?: number;
  currency_id?: number;
  language_id?: number;
}

export interface UpdateSettingData {
  region?: string;
  timezone?: string;
  notification_enabled?: boolean;
  plan_id?: number;
  security_level_id?: number;
  currency_id?: number;
  language_id?: number;
}

export interface SettingResponse {
  id: number;
  region: string;
  timezone: string;
  notification_enabled: boolean;
  created_at: Date;
  user_id?: number;
  plan_id?: number;
  security_level_id?: number;
  currency_id?: number;
  language_id?: number;
  plan?: {
    id: number;
    name: string;
  };
  securityLevel?: {
    id: number;
    name: string;
  };
  currency?: {
    id: number;
    name: string;
  };
  language?: {
    id: number;
    name: string;
  };
}
