import crypto from "crypto";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../constants/loadEnv";

export interface ResetTokenPayload {
  userId: number;
  email: string;
  type: "password_reset";
}

export class ResetToken {
  // Generate secure reset token
  public static generateResetToken(userId: number, email: string): string {
    const payload: ResetTokenPayload = {
      userId,
      email,
      type: "password_reset",
    };

    // Token expires in 1 hour
    return jwt.sign(payload, jwt_secret, { expiresIn: "1h" });
  }

  // Verify and decode reset token
  public static verifyResetToken(token: string): ResetTokenPayload {
    try {
      const decoded = jwt.verify(token, jwt_secret) as ResetTokenPayload;
      
      if (decoded.type !== "password_reset") {
        throw new Error("Invalid token type");
      }
      
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired reset token");
    }
  }

  // Generate random token (alternative method)
  public static generateRandomToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
