export interface CreateAccountTypeData {
  name: string;
}

export interface UpdateAccountTypeData {
  name?: string;
}

export interface AccountTypeResponse {
  id: number;
  name: string;
}
