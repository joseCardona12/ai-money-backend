export interface CreateCurrencyData {
  name: string;
}

export interface UpdateCurrencyData {
  name?: string;
}

export interface CurrencyResponse {
  id: number;
  name: string;
}
