import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../util/constants/loadEnv";
import { UnauthorizedError } from "../util/errors/customErrors";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    fullName: string;
    role_id: number;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Access token is required",
        status: 401,
        code: "UNAUTHORIZED",
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      res.status(401).json({
        message: "Access token is required",
        status: 401,
        code: "UNAUTHORIZED",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, jwt_secret) as any;
    
    if (!decoded || !decoded.id) {
      res.status(401).json({
        message: "Invalid access token",
        status: 401,
        code: "UNAUTHORIZED",
      });
      return;
    }

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      role_id: decoded.role_id,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      message: "Invalid access token",
      status: 401,
      code: "UNAUTHORIZED",
    });
  }
};
