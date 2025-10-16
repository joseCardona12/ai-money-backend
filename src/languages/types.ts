export interface CreateLanguageData {
  name: string;
}

export interface UpdateLanguageData {
  name?: string;
}

export interface LanguageResponse {
  id: number;
  name: string;
}
