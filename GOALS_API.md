# Goals API Documentation

## Authentication Required

All goal endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create Goal

**POST** `/api/goals`

Creates a new financial goal for the authenticated user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "target_amount": 10000.00,
  "current_amount": 2500.00,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "state_id": 1,
  "goal_type_id": 2
}
```

**Response (201):**
```json
{
  "message": "Goal created successfully",
  "status": 201,
  "data": {
    "id": 1,
    "name": "Emergency Fund",
    "target_amount": 10000.00,
    "current_amount": 2500.00,
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "state_id": 1,
    "goal_type_id": 2,
    "user_id": 123
  }
}
```

### 2. Get User's Goals

**GET** `/api/goals`

Retrieves all goals for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Goals retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Emergency Fund",
      "target_amount": 10000.00,
      "current_amount": 2500.00,
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-12-31T00:00:00.000Z",
      "created_at": "2024-10-16T10:30:00.000Z",
      "state_id": 1,
      "goal_type_id": 2,
      "user_id": 123,
      "progress_percentage": 25,
      "days_remaining": 76
    }
  ]
}
```

### 3. Get Goal by ID

**GET** `/api/goals/:id`

Retrieves a specific goal by its ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Goal retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "Emergency Fund",
    "target_amount": 10000.00,
    "current_amount": 2500.00,
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "state_id": 1,
    "goal_type_id": 2,
    "user_id": 123,
    "progress_percentage": 25,
    "days_remaining": 76
  }
}
```

### 4. Update Goal

**PUT** `/api/goals/:id`

Updates a goal's information.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body (partial update):**
```json
{
  "name": "Updated Emergency Fund",
  "target_amount": 12000.00,
  "current_amount": 3000.00
}
```

**Response (200):**
```json
{
  "message": "Goal updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "Updated Emergency Fund",
    "target_amount": 12000.00,
    "current_amount": 3000.00,
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "state_id": 1,
    "goal_type_id": 2,
    "user_id": 123
  }
}
```

### 5. Delete Goal

**DELETE** `/api/goals/:id`

Deletes a goal.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Goal deleted successfully",
  "status": 200
}
```

### 6. Get Active Goals

**GET** `/api/goals/active`

Retrieves all active goals (goals that haven't ended yet) for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Active goals retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "Emergency Fund",
      "target_amount": 10000.00,
      "current_amount": 2500.00,
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-12-31T00:00:00.000Z",
      "created_at": "2024-10-16T10:30:00.000Z",
      "state_id": 1,
      "goal_type_id": 2,
      "user_id": 123,
      "progress_percentage": 25,
      "days_remaining": 76
    }
  ]
}
```

### 7. Update Goal Progress

**PATCH** `/api/goals/:id/progress`

Updates only the current amount (progress) of a goal.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "current_amount": 3500.00
}
```

**Response (200):**
```json
{
  "message": "Goal progress updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "Emergency Fund",
    "target_amount": 10000.00,
    "current_amount": 3500.00,
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-12-31T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "state_id": 1,
    "goal_type_id": 2,
    "user_id": 123
  }
}
```

### 8. Get Goals Near Completion

**GET** `/api/goals/near-completion`

Retrieves goals that are 90% or more complete for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Goals near completion retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 2,
      "name": "Vacation Fund",
      "target_amount": 5000.00,
      "current_amount": 4750.00,
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-06-30T00:00:00.000Z",
      "created_at": "2024-01-15T10:30:00.000Z",
      "state_id": 1,
      "goal_type_id": 3,
      "user_id": 123,
      "progress_percentage": 95,
      "days_remaining": 30
    }
  ]
}
```

## Error Responses

### 400 - Validation Error
```json
{
  "message": "Goal name is required and must be a string",
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
  "message": "Goal not found",
  "status": 404,
  "code": "NOT_FOUND"
}
```

## Field Descriptions

- **name**: Goal name (required, string, max 250 characters)
- **target_amount**: Target amount to reach (required, decimal, must be > 0)
- **current_amount**: Current saved amount (optional, decimal, default 0, must be >= 0)
- **start_date**: Goal start date (required, date)
- **end_date**: Goal end date (required, date, must be after start_date and in the future)
- **state_id**: Goal state ID (optional, integer)
- **goal_type_id**: Goal type ID (optional, integer, foreign key to goal_types)
- **user_id**: User ID (automatically set from JWT token)
- **progress_percentage**: Calculated field showing completion percentage
- **days_remaining**: Calculated field showing days until end_date

## Calculated Fields

The API automatically calculates and includes these fields in responses:

- **progress_percentage**: `(current_amount / target_amount) * 100`
- **days_remaining**: Days between current date and end_date (0 if past due)

## Usage Flow

1. User creates goals with `POST /api/goals`
2. User can view all goals with `GET /api/goals`
3. User can view only active goals with `GET /api/goals/active`
4. User updates progress with `PATCH /api/goals/:id/progress`
5. User can check goals near completion with `GET /api/goals/near-completion`
6. User can update full goal details with `PUT /api/goals/:id`
7. User can delete goals with `DELETE /api/goals/:id`
