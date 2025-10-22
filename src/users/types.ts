export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
  bio: string;
  profile_picture: string;
  role_id: number;
  provider_id: number;
  plan_id?: number;
  join_date?: Date;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  bio?: string;
  profile_picture?: string;
  plan_id?: number;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone_number: string;
  address: string;
  bio: string;
  profile_picture: string;
  join_date: Date;
  role_id: number;
  provider_id: number;
  plan_id?: number;
}
