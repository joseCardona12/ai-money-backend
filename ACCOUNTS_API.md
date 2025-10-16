# Accounts API Documentation

## Authentication Required

All account endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Models Overview

### Currencies
- **id**: Primary key
- **name**: Currency name (e.g., "USD", "EUR", "COP")

### Account Types
- **id**: Primary key  
- **name**: Account type name (e.g., "Savings", "Checking", "Credit Card")

### Accounts
- **id**: Primary key
- **name**: Account name
- **account_type_id**: Foreign key to account_types
- **balance**: Account balance (DECIMAL 12,2)
- **created_at**: Creation timestamp
- **currency_id**: Foreign key to currencies
- **user_id**: Foreign key to users

## Endpoints

### 1. Create Account

**POST** `/api/accounts`

Creates a new account for the authenticated user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "My Savings Account",
  "account_type_id": 1,
  "balance": 1000.00,
  "currency_id": 1
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "status": 201,
  "data": {
    "id": 1,
    "name": "My Savings Account",
    "account_type_id": 1,
    "balance": 1000.00,
    "created_at": "2024-10-16T10:30:00.000Z",
    "currency_id": 1,
    "user_id": 123
  }
}
```

### 2. Get User's Accounts

**GET** `/api/accounts`

Retrieves all accounts for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Accounts retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "My Savings Account",
      "account_type_id": 1,
      "balance": 1000.00,
      "created_at": "2024-10-16T10:30:00.000Z",
      "currency_id": 1,
      "user_id": 123,
      "accountType": {
        "id": 1,
        "name": "Savings"
      },
      "currency": {
        "id": 1,
        "name": "USD"
      }
    }
  ]
}
```

### 3. Get Account by ID

**GET** `/api/accounts/:id`

Retrieves a specific account by its ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Account retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "My Savings Account",
    "account_type_id": 1,
    "balance": 1000.00,
    "created_at": "2024-10-16T10:30:00.000Z",
    "currency_id": 1,
    "user_id": 123,
    "accountType": {
      "id": 1,
      "name": "Savings"
    },
    "currency": {
      "id": 1,
      "name": "USD"
    }
  }
}
```

### 4. Update Account

**PUT** `/api/accounts/:id`

Updates an account's information.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body (partial update):**
```json
{
  "name": "Updated Savings Account",
  "balance": 1500.00
}
```

**Response (200):**
```json
{
  "message": "Account updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "Updated Savings Account",
    "account_type_id": 1,
    "balance": 1500.00,
    "created_at": "2024-10-16T10:30:00.000Z",
    "currency_id": 1,
    "user_id": 123
  }
}
```

### 5. Delete Account

**DELETE** `/api/accounts/:id`

Deletes an account.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Account deleted successfully",
  "status": 200
}
```

### 6. Get Total Balance

**GET** `/api/accounts/total-balance`

Gets the sum of all account balances for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Total balance retrieved successfully",
  "status": 200,
  "data": {
    "total_balance": 2500.00,
    "user_id": 123
  }
}
```

### 7. Deposit to Account

**POST** `/api/accounts/:id/deposit`

Adds money to an account.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Response (200):**
```json
{
  "message": "Deposit completed successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "My Savings Account",
    "account_type_id": 1,
    "balance": 1500.00,
    "created_at": "2024-10-16T10:30:00.000Z",
    "currency_id": 1,
    "user_id": 123
  }
}
```

### 8. Withdraw from Account

**POST** `/api/accounts/:id/withdraw`

Removes money from an account.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "amount": 200.00
}
```

**Response (200):**
```json
{
  "message": "Withdrawal completed successfully",
  "status": 200,
  "data": {
    "id": 1,
    "name": "My Savings Account",
    "account_type_id": 1,
    "balance": 1300.00,
    "created_at": "2024-10-16T10:30:00.000Z",
    "currency_id": 1,
    "user_id": 123
  }
}
```

### 9. Transfer Between Accounts

**POST** `/api/accounts/transfer`

Transfers money between two accounts.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "from_account_id": 1,
  "to_account_id": 2,
  "amount": 300.00
}
```

**Response (200):**
```json
{
  "message": "Transfer completed successfully",
  "status": 200,
  "data": {
    "fromAccount": {
      "id": 1,
      "name": "My Savings Account",
      "balance": 1000.00,
      "user_id": 123
    },
    "toAccount": {
      "id": 2,
      "name": "My Checking Account",
      "balance": 800.00,
      "user_id": 123
    }
  }
}
```

### 10. Get Accounts with Low Balance

**GET** `/api/accounts/low-balance?threshold=100`

Gets accounts with balance below the specified threshold.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `threshold` (optional): Balance threshold (default: 100)

**Response (200):**
```json
{
  "message": "Accounts with low balance retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 2,
      "name": "Emergency Fund",
      "account_type_id": 1,
      "balance": 50.00,
      "created_at": "2024-10-16T10:30:00.000Z",
      "currency_id": 1,
      "user_id": 123,
      "accountType": {
        "id": 1,
        "name": "Savings"
      },
      "currency": {
        "id": 1,
        "name": "USD"
      }
    }
  ]
}
```

## Error Responses

### 400 - Validation Error
```json
{
  "message": "Account name is required and must be a string",
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
  "message": "Account not found",
  "status": 404,
  "code": "NOT_FOUND"
}
```

## Field Descriptions

- **name**: Account name (required, string, max 250 characters)
- **account_type_id**: Account type ID (optional, foreign key to account_types)
- **balance**: Account balance (optional, decimal, default 0, must be >= 0)
- **currency_id**: Currency ID (optional, foreign key to currencies)
- **user_id**: User ID (automatically set from JWT token)

## Business Rules

1. **Balance cannot be negative** - All operations validate this
2. **Withdrawal validation** - Cannot withdraw more than available balance
3. **Transfer validation** - Cannot transfer to same account, validates sufficient funds
4. **User isolation** - Users can only access their own accounts
5. **Deposit/Withdrawal amounts** - Must be positive numbers

## Usage Flow

1. User creates accounts with `POST /api/accounts`
2. User can view all accounts with `GET /api/accounts`
3. User can check total balance with `GET /api/accounts/total-balance`
4. User can deposit money with `POST /api/accounts/:id/deposit`
5. User can withdraw money with `POST /api/accounts/:id/withdraw`
6. User can transfer between accounts with `POST /api/accounts/transfer`
7. User can monitor low balance accounts with `GET /api/accounts/low-balance`
