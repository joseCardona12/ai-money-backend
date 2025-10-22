import { UserModel } from "./model";
import { CreateUserData, UpdateUserData } from "./types";

export class UserRepository {
  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({ where: { email } });
  }

  public async createUser(userData: CreateUserData): Promise<UserModel> {
    const userDataWithDate: Partial<UserModel> = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone_number,
      address: userData.address,
      bio: userData.bio,
      profile_picture: userData.profile_picture,
      role_id: userData.role_id,
      provider_id: userData.provider_id,
      plan_id: userData.plan_id,
      join_date: userData.join_date || new Date(),
    };
    return await UserModel.create(userDataWithDate);
  }

  public async getUserById(id: number): Promise<UserModel | null> {
    return await UserModel.findByPk(id);
  }

  public async updateUserPassword(id: number, password: string): Promise<void> {
    await UserModel.update({ password }, { where: { id } });
  }

  public async updateUser(
    id: number,
    userData: UpdateUserData
  ): Promise<[number]> {
    return await UserModel.update(userData, {
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
