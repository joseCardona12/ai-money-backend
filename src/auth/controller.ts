import { Request, Response } from "express";
import { authService as AuthService } from "./service";
import { CustomError } from "../util/errors/customErrors";
import { AuthValidators } from "../util/validators/authValidators";
import { UserHelpers } from "../users/helpers";
import jwt from "jsonwebtoken";
import { IGenerateTokenPayload } from "./types";
import { jwt_secret } from "../util/constants/loadEnv";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      AuthValidators.validateLoginParams(email, password);

      const response = await AuthService.login(email, password);
      if (!response) {
        res.status(401).json({ message: "Invalid credentials", status: 401 });
        return;
      }
      const token = AuthController.generateToken({
        id: response.id,
        email: response.email,
        role: `${response.role_id}`,
      });
      res.status(200).json({
        message: "Login successful",
        status: 200,
        data: {
          token,
          user: UserHelpers.toUserResponse(response),
        },
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          data: {
            error: error.message,
          },
        });
      } else {
        console.error("Unexpected error in login:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          data: {
            error: "Internal server error",
          },
        });
      }
    }
  }

  public static async register(req: Request, res: Response): Promise<void> {
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
      AuthValidators.validateRegisterParams(
        fullName,
        email,
        password,
        phone_number,
        address,
        bio,
        profile_picture,
        role_id,
        provider_id
      );

      // Create user
      const newUser = await AuthService.register({
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

      // Generar token para el nuevo usuario
      const token = AuthController.generateToken({
        id: newUser.id,
        email: newUser.email,
        role: `${newUser.role_id}`,
      });

      res.status(201).json({
        message: "User registered successfully",
        status: 201,
        data: {
          token,
          user: UserHelpers.toUserResponse(newUser),
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
        console.error("Unexpected error in register:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  public static async forgotPasswordByEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      // Validate email
      if (!email || typeof email !== "string") {
        res.status(400).json({
          message: "Email is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await AuthService.forgotPasswordByEmail(email);
      res.status(200).json({
        message: result.message,
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
        console.error("Unexpected error in forgotPasswordByEmail:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  public static async resetPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      // Validate inputs
      if (!token || typeof token !== "string") {
        res.status(400).json({
          message: "Reset token is required",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      if (
        !newPassword ||
        typeof newPassword !== "string" ||
        newPassword.length < 6
      ) {
        res.status(400).json({
          message: "New password must be at least 6 characters long",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const result = await AuthService.resetPassword(token, newPassword);
      res.status(200).json({
        message: result.message,
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
        console.error("Unexpected error in resetPassword:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  public static generateToken(user: IGenerateTokenPayload): string {
    return jwt.sign(user, jwt_secret, { expiresIn: "1h" });
  }
}
