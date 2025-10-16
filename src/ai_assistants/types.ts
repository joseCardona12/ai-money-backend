export interface CreateAiAssistantData {
  recomendation_type_id?: number;
  message: string;
  user_id?: number;
}

export interface UpdateAiAssistantData {
  recomendation_type_id?: number;
  message?: string;
}

export interface AiAssistantResponse {
  id: number;
  recomendation_type_id?: number;
  message: string;
  created_at: Date;
  user_id?: number;
}
