# Onboarding API Documentation

## Authentication Required

All onboarding endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from the login endpoint (`POST /api/auth/login`).

## Endpoints

### 1. Create Onboarding

**POST** `/api/onboardings`

Creates a new onboarding process for the authenticated user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currency_id": 1,
  "monthly_income": 5000.00,
  "initial_balance": 1000.00,
  "goal_type_id": 2,
  "budget_preference_id": 1
}
```

**Response (201):**
```json
{
  "message": "Onboarding created successfully",
  "status": 201,
  "data": {
    "id": 1,
    "currency_id": 1,
    "monthly_income": 5000.00,
    "initial_balance": 1000.00,
    "completed": false,
    "user_id": 123,
    "goal_type_id": 2,
    "budget_preference_id": 1
  }
}
```

### 2. Get User's Onboarding

**GET** `/api/onboardings`

Retrieves the onboarding data for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Onboarding retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "currency_id": 1,
    "monthly_income": 5000.00,
    "initial_balance": 1000.00,
    "completed": false,
    "user_id": 123,
    "goal_type_id": 2,
    "budget_preference_id": 1
  }
}
```

### 3. Update Onboarding

**PUT** `/api/onboardings`

Updates the onboarding data for the authenticated user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body (partial update):**
```json
{
  "monthly_income": 5500.00,
  "goal_type_id": 3
}
```

**Response (200):**
```json
{
  "message": "Onboarding updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "currency_id": 1,
    "monthly_income": 5500.00,
    "initial_balance": 1000.00,
    "completed": false,
    "user_id": 123,
    "goal_type_id": 3,
    "budget_preference_id": 1
  }
}
```

### 4. Complete Onboarding

**POST** `/api/onboardings/complete`

Marks the onboarding as completed for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Onboarding completed successfully",
  "status": 200,
  "data": {
    "id": 1,
    "currency_id": 1,
    "monthly_income": 5500.00,
    "initial_balance": 1000.00,
    "completed": true,
    "user_id": 123,
    "goal_type_id": 3,
    "budget_preference_id": 1
  }
}
```

### 5. Check Onboarding Status

**GET** `/api/onboardings/status`

Checks if the authenticated user has completed the onboarding process.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Onboarding status retrieved successfully",
  "status": 200,
  "data": {
    "completed": true,
    "user_id": 123
  }
}
```

## Error Responses

### 400 - Validation Error
```json
{
  "message": "Monthly income is required and must be a number",
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
  "message": "Onboarding not found for this user",
  "status": 404,
  "code": "NOT_FOUND"
}
```

### 409 - Conflict
```json
{
  "message": "User already has an onboarding process",
  "status": 409,
  "code": "CONFLICT"
}
```

## Field Descriptions

- **currency_id**: ID of the currency (optional)
- **monthly_income**: User's monthly income (required, must be > 0)
- **initial_balance**: User's initial account balance (required, must be >= 0)
- **goal_type_id**: ID of the user's financial goal type (optional)
- **budget_preference_id**: ID of the user's budget preference (optional)
- **completed**: Boolean indicating if onboarding is completed
- **user_id**: ID of the user (automatically set from JWT token)

## Usage Flow

1. User registers/logs in to get JWT token
2. User creates onboarding with `POST /api/onboardings`
3. User can update onboarding data with `PUT /api/onboardings`
4. User completes onboarding with `POST /api/onboardings/complete`
5. App can check onboarding status with `GET /api/onboardings/status`
