import { UserModel } from "../users/model";
import { userRepository as UserRepository } from "../users/repository";
import { CreateUserData } from "../users/types";
import { PasswordHash } from "../util/crypto/passwordHash";
import { ResetToken } from "../util/crypto/resetToken";
import { EmailService } from "../services/emailService";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../util/errors/customErrors";

export class AuthService {
  public async login(
    email: string,
    password: string
  ): Promise<UserModel | null> {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Compare password with hash
    const isPasswordValid = await PasswordHash.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password");
    }

    return user;
  }

  public async register(userData: CreateUserData): Promise<UserModel> {
    // Check if user already exists
    const existingUser = await UserRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password before saving
    const hashedPassword = await PasswordHash.hash(userData.password);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    // Create user
    const newUser = await UserRepository.createUser(userDataWithHashedPassword);
    return newUser;
  }

  public async forgotPasswordByEmail(
    email: string
  ): Promise<{ message: string }> {
    // Find user by email
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Generate reset token
    const resetToken = ResetToken.generateResetToken(user.id, user.email);

    // Send password reset email
    await EmailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.fullName
    );

    return { message: "Password reset email sent successfully" };
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Verify reset token
    const decoded = ResetToken.verifyResetToken(token);

    // Find user by ID
    const user = await UserRepository.getUserById(decoded.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify email matches
    if (user.email !== decoded.email) {
      throw new UnauthorizedError("Invalid reset token");
    }

    // Hash new password
    const hashedPassword = await PasswordHash.hash(newPassword);

    // Update user password
    await UserRepository.updateUserPassword(user.id, hashedPassword);

    return { message: "Password reset successfully" };
  }
}

export const authService = new AuthService();
