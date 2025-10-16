# Settings API Documentation

## Authentication Required

All settings endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Models Overview

### Languages
- **id**: Primary key
- **name**: Language name (e.g., "English", "Spanish", "French")

### Plans
- **id**: Primary key  
- **name**: Plan name (e.g., "Basic", "Premium", "Enterprise")

### Security Levels
- **id**: Primary key
- **name**: Security level name (e.g., "Low", "Medium", "High")

### Settings
- **id**: Primary key
- **region**: User's region (VARCHAR 250)
- **timezone**: User's timezone (VARCHAR 250)
- **notification_enabled**: Boolean for notifications
- **created_at**: Creation timestamp
- **user_id**: Foreign key to users
- **plan_id**: Foreign key to plans
- **security_level_id**: Foreign key to security_levels
- **currency_id**: Foreign key to currencies
- **language_id**: Foreign key to languages

## Endpoints

### 1. Create or Update User Settings

**POST** `/api/settings`

Creates new settings or updates existing settings for the authenticated user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "region": "North America",
  "timezone": "America/New_York",
  "notification_enabled": true,
  "plan_id": 2,
  "security_level_id": 3,
  "currency_id": 1,
  "language_id": 1
}
```

**Response (200):**
```json
{
  "message": "Settings saved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "region": "North America",
    "timezone": "America/New_York",
    "notification_enabled": true,
    "created_at": "2024-10-16T10:30:00.000Z",
    "user_id": 123,
    "plan_id": 2,
    "security_level_id": 3,
    "currency_id": 1,
    "language_id": 1
  }
}
```

### 2. Get User's Settings

**GET** `/api/settings`

Retrieves settings for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Settings retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "region": "North America",
    "timezone": "America/New_York",
    "notification_enabled": true,
    "created_at": "2024-10-16T10:30:00.000Z",
    "user_id": 123,
    "plan_id": 2,
    "security_level_id": 3,
    "currency_id": 1,
    "language_id": 1,
    "plan": {
      "id": 2,
      "name": "Premium"
    },
    "securityLevel": {
      "id": 3,
      "name": "High"
    },
    "currency": {
      "id": 1,
      "name": "USD"
    },
    "language": {
      "id": 1,
      "name": "English"
    }
  }
}
```

### 3. Update User Settings

**PUT** `/api/settings`

Updates settings for the authenticated user (partial update).

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body (partial update):**
```json
{
  "timezone": "Europe/London",
  "notification_enabled": false,
  "language_id": 2
}
```

**Response (200):**
```json
{
  "message": "Settings updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "region": "North America",
    "timezone": "Europe/London",
    "notification_enabled": false,
    "created_at": "2024-10-16T10:30:00.000Z",
    "user_id": 123,
    "plan_id": 2,
    "security_level_id": 3,
    "currency_id": 1,
    "language_id": 2
  }
}
```

### 4. Toggle Notifications

**POST** `/api/settings/toggle-notifications`

Toggles the notification setting (enabled ↔ disabled).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Notification settings updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "region": "North America",
    "timezone": "Europe/London",
    "notification_enabled": true,
    "created_at": "2024-10-16T10:30:00.000Z",
    "user_id": 123,
    "plan_id": 2,
    "security_level_id": 3,
    "currency_id": 1,
    "language_id": 2
  }
}
```

### 5. Update Notification Preference

**PATCH** `/api/settings/notifications`

Updates only the notification preference.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "notification_enabled": false
}
```

**Response (200):**
```json
{
  "message": "Notification preference updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "notification_enabled": false,
    "user_id": 123
  }
}
```

### 6. Update Timezone

**PATCH** `/api/settings/timezone`

Updates only the timezone setting.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "timezone": "Asia/Tokyo"
}
```

**Response (200):**
```json
{
  "message": "Timezone updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "timezone": "Asia/Tokyo",
    "user_id": 123
  }
}
```

### 7. Update Language Preference

**PATCH** `/api/settings/language`

Updates only the language preference.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "language_id": 3
}
```

**Response (200):**
```json
{
  "message": "Language preference updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "language_id": 3,
    "user_id": 123,
    "language": {
      "id": 3,
      "name": "Spanish"
    }
  }
}
```

### 8. Get Setting by ID (Admin)

**GET** `/api/settings/:id`

Retrieves a specific setting by its ID (admin functionality).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Setting retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "region": "North America",
    "timezone": "Asia/Tokyo",
    "notification_enabled": false,
    "created_at": "2024-10-16T10:30:00.000Z",
    "user_id": 123,
    "plan_id": 2,
    "security_level_id": 3,
    "currency_id": 1,
    "language_id": 3
  }
}
```

## Error Responses

### 400 - Validation Error
```json
{
  "message": "Region is required and must be a string",
  "status": 400,
  "code": "VALIDATION_ERROR"
}
```

### 401 - Unauthorized
```json
{
  "message": "Access token is required",
  "status": 401,
  "code": "UNAUTHORIZED"
}
```

### 404 - Not Found
```json
{
  "message": "Settings not found for this user",
  "status": 404,
  "code": "NOT_FOUND"
}
```

### 409 - Conflict
```json
{
  "message": "User already has settings configured",
  "status": 409,
  "code": "CONFLICT"
}
```

## Field Descriptions

- **region**: User's geographical region (required, string, max 250 characters)
- **timezone**: User's timezone (required, string, max 250 characters)
- **notification_enabled**: Enable/disable notifications (optional, boolean, default true)
- **plan_id**: User's subscription plan (optional, foreign key to plans)
- **security_level_id**: Security level preference (optional, foreign key to security_levels)
- **currency_id**: Preferred currency (optional, foreign key to currencies)
- **language_id**: Preferred language (optional, foreign key to languages)
- **user_id**: User ID (automatically set from JWT token)

## Business Rules

1. **One setting per user** - Each user can only have one settings record
2. **Auto create/update** - POST endpoint creates new or updates existing settings
3. **Required fields** - Region and timezone are required for creation
4. **User isolation** - Users can only access their own settings
5. **Partial updates** - All update endpoints support partial data

## Usage Flow

1. User creates initial settings with `POST /api/settings`
2. User can view settings with `GET /api/settings`
3. User can update all settings with `PUT /api/settings`
4. User can update specific preferences:
   - `PATCH /api/settings/notifications` - Toggle notifications
   - `PATCH /api/settings/timezone` - Change timezone
   - `PATCH /api/settings/language` - Change language
5. User can quickly toggle notifications with `POST /api/settings/toggle-notifications`

## Common Timezone Examples

- `"UTC"` - Coordinated Universal Time
- `"America/New_York"` - Eastern Time (US)
- `"America/Los_Angeles"` - Pacific Time (US)
- `"Europe/London"` - Greenwich Mean Time
- `"Europe/Paris"` - Central European Time
- `"Asia/Tokyo"` - Japan Standard Time
- `"Asia/Shanghai"` - China Standard Time
