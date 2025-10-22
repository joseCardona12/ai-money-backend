import { UserModel } from "./model";
import { userRepository as UserRepository } from "./repository";
import { UpdateUserData, UserResponse } from "./types";
import { NotFoundError, ValidationError, ConflictError } from "../util/errors/customErrors";

export class UserService {
  // Get user by ID
  public async getUserById(id: number): Promise<UserResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.transformToUserResponse(user);
  }

  // Update user
  public async updateUser(
    id: number,
    data: UpdateUserData
  ): Promise<UserResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    // Check if user exists
    const existingUser = await UserRepository.getUserById(id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // Validate email if provided
    if (data.email !== undefined) {
      if (!data.email || data.email.trim().length === 0) {
        throw new ValidationError("Email cannot be empty");
      }

      // Check if email is already in use by another user
      const userWithEmail = await UserRepository.getUserByEmail(data.email.trim());
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictError("Email is already in use");
      }
    }

    // Validate fullName if provided
    if (data.fullName !== undefined) {
      if (!data.fullName || data.fullName.trim().length === 0) {
        throw new ValidationError("Full name cannot be empty");
      }

      if (data.fullName.length > 200) {
        throw new ValidationError("Full name cannot exceed 200 characters");
      }
    }

    // Validate phone_number if provided
    if (data.phone_number !== undefined) {
      if (!data.phone_number || data.phone_number.trim().length === 0) {
        throw new ValidationError("Phone number cannot be empty");
      }

      if (data.phone_number.length > 200) {
        throw new ValidationError("Phone number cannot exceed 200 characters");
      }
    }

    // Validate address if provided
    if (data.address !== undefined) {
      if (!data.address || data.address.trim().length === 0) {
        throw new ValidationError("Address cannot be empty");
      }

      if (data.address.length > 200) {
        throw new ValidationError("Address cannot exceed 200 characters");
      }
    }

    // Validate bio if provided
    if (data.bio !== undefined) {
      if (data.bio.length > 65535) {
        throw new ValidationError("Bio is too long");
      }
    }

    // Validate profile_picture if provided
    if (data.profile_picture !== undefined) {
      if (data.profile_picture.length > 65535) {
        throw new ValidationError("Profile picture URL is too long");
      }
    }

    // Prepare update data with trimmed values
    const updateData: UpdateUserData = {};
    if (data.email !== undefined) updateData.email = data.email.trim();
    if (data.fullName !== undefined) updateData.fullName = data.fullName.trim();
    if (data.phone_number !== undefined) updateData.phone_number = data.phone_number.trim();
    if (data.address !== undefined) updateData.address = data.address.trim();
    if (data.bio !== undefined) updateData.bio = data.bio.trim();
    if (data.profile_picture !== undefined) updateData.profile_picture = data.profile_picture.trim();
    if (data.plan_id !== undefined) updateData.plan_id = data.plan_id;

    // Update user
    await UserRepository.updateUser(id, updateData);

    // Return updated user
    const updatedUser = await UserRepository.getUserById(id);
    return this.transformToUserResponse(updatedUser!);
  }

  // Transform UserModel to UserResponse
  private transformToUserResponse(user: UserModel): UserResponse {
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
}

export const userService = new UserService();

