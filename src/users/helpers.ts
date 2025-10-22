import { UserModel } from "./model";
import { UserResponse } from "./types";

export class UserHelpers {
  // Transform UserModel to UserResponse, excluding password
  public static toUserResponse(user: UserModel): UserResponse {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      bio: user.bio,
      profile_picture: user.profile_picture,
      join_date: user.join_date,
      role_id: user.role_id,
      provider_id: user.provider_id,
      plan_id: user.plan_id,
    };
  }

  // Transform multiple UserModel to UserResponse array
  public static toUserResponseArray(users: UserModel[]): UserResponse[] {
    return users.map((user) => this.toUserResponse(user));
  }
}
