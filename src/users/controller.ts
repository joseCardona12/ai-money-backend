import { Response } from "express";
import { userService as UserService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class UserController {
  // Create a new user
  public static async createUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const {
        fullName,
        email,
        password,
        phone_number,
        address,
        bio,
        profile_picture,
        role_id,
        provider_id,
        plan_id,
      } = req.body;

      const newUser = await UserService.createUser({
        fullName,
        email,
        password,
        phone_number,
        address,
        bio,
        profile_picture,
        role_id,
        provider_id,
        plan_id,
      });

      res.status(201).json({
        message: "User created successfully",
        status: 201,
        data: newUser,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createUser:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get all users
  public static async getAllUsers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserService.getAllUsers(page, limit);

      res.status(200).json({
        message: "Users retrieved successfully",
        status: 200,
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getAllUsers:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get user by ID
  public static async getUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      const user = await UserService.getUserById(userId);
      res.status(200).json({
        message: "User retrieved successfully",
        status: 200,
        data: user,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getUserById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get current user profile
  public static async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      const user = await UserService.getUserById(userId);
      res.status(200).json({
        message: "Current user retrieved successfully",
        status: 200,
        data: user,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getCurrentUser:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update user
  public static async updateUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        fullName,
        email,
        phone_number,
        address,
        bio,
        profile_picture,
        plan_id,
      } = req.body;

      const updatedUser = await UserService.updateUser(userId, {
        fullName,
        email,
        phone_number,
        address,
        bio,
        profile_picture,
        plan_id,
      });

      res.status(200).json({
        message: "User updated successfully",
        status: 200,
        data: updatedUser,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateUser:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update user by ID (admin)
  public static async updateUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);
      const {
        fullName,
        email,
        phone_number,
        address,
        bio,
        profile_picture,
        plan_id,
      } = req.body;

      const updatedUser = await UserService.updateUser(userId, {
        fullName,
        email,
        phone_number,
        address,
        bio,
        profile_picture,
        plan_id,
      });

      res.status(200).json({
        message: "User updated successfully",
        status: 200,
        data: updatedUser,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateUserById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete user by ID (admin)
  public static async deleteUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      await UserService.deleteUser(userId);

      res.status(200).json({
        message: "User deleted successfully",
        status: 200,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in deleteUserById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}
