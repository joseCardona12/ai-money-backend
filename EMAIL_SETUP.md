# Email Configuration Setup

## Gmail Configuration (Recommended for Development)

### 1. Enable 2-Factor Authentication

- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password

- Go to Google Account > Security > 2-Step Verification
- Scroll down to "App passwords"
- Generate a new app password for "Mail"
- Copy the 16-character password

### 3. Environment Variables

Add these to your `.env` file:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
FRONTEND_URL=http://localhost:3000
```

**Note**: Using `service: "gmail"` in Nodemailer automatically configures the SMTP settings, so you only need the user and password.

## Alternative Email Providers

### SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=your_verified_sender@domain.com
```

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email@outlook.com
```

### AWS SES

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_aws_access_key_id
EMAIL_PASSWORD=your_aws_secret_access_key
EMAIL_FROM=your_verified_email@domain.com
```

## Testing Email Configuration

You can test the email configuration by calling:

```typescript
import { EmailService } from "./src/services/emailService";

// Test connection
const isConnected = await EmailService.testConnection();
console.log("Email connection:", isConnected);
```

## API Endpoints

### Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "jwt_reset_token_from_email",
  "newPassword": "newSecurePassword123"
}
```

## Security Notes

1. **App Passwords**: Never use your actual Gmail password. Always use app passwords.
2. **Token Expiration**: Reset tokens expire in 1 hour for security.
3. **HTTPS**: Always use HTTPS in production for secure token transmission.
4. **Rate Limiting**: Consider implementing rate limiting for forgot password requests.

## Troubleshooting

### Common Issues

1. **"Invalid login"**: Check if 2FA is enabled and you're using an app password
2. **"Connection timeout"**: Check firewall settings and port 587
3. **"Authentication failed"**: Verify email and password are correct
4. **"Less secure app access"**: This is deprecated, use app passwords instead

### Debug Mode

To see detailed SMTP logs, modify the transporter:

```typescript
const transporter = nodemailer.createTransporter({
  // ... other config
  debug: true,
  logger: true,
});
```
