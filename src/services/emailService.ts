import nodemailer from "nodemailer";
import { email_user, email_password } from "../util/constants/loadEnv";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email_user,
      pass: email_password,
    },
  });

  // Send email
  public static async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: email_user, // Gmail automatically uses the authenticated user as sender
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Send password reset email
  public static async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName: string
  ): Promise<void> {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-email?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background-color: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              margin: 20px 0; 
            }
            .footer { font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>You requested a password reset for your account. Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hello ${userName},
      
      You requested a password reset for your account.
      
      Click this link to reset your password: ${resetUrl}
      
      If you didn't request this, please ignore this email. This link will expire in 1 hour.
      
      This is an automated email. Please do not reply.
    `;

    await this.sendEmail({
      to: email,
      subject: "Password Reset Request",
      html,
      text,
    });
  }

  // Test email connection
  public static async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email connection test failed:", error);
      return false;
    }
  }
}
