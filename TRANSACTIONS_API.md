# Transactions API Documentation

## Authentication Required

All transaction endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Models Overview

### Transaction Types
- **id**: Primary key
- **name**: Transaction type name (e.g., "Income", "Expense", "Transfer")

### States
- **id**: Primary key
- **name**: State name (e.g., "Pending", "Completed", "Cancelled")

### Categories
- **id**: Primary key
- **name**: Category name (e.g., "Food", "Transportation", "Entertainment", "Salary")

### Transactions
- **id**: Primary key
- **description**: Transaction description (VARCHAR 250)
- **amount**: Transaction amount (DECIMAL 12,2)
- **date**: Transaction date
- **created_at**: Creation timestamp
- **transaction_type_id**: Foreign key to transaction_types
- **state_id**: Foreign key to states
- **user_id**: Foreign key to users
- **account_id**: Foreign key to accounts
- **category_id**: Foreign key to categories

## Endpoints

### 1. Create Transaction

**POST** `/api/transactions`

Creates a new transaction for the authenticated user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "description": "Grocery shopping at Walmart",
  "amount": 85.50,
  "date": "2024-10-16",
  "transaction_type_id": 2,
  "state_id": 2,
  "account_id": 1,
  "category_id": 3
}
```

**Response (201):**
```json
{
  "message": "Transaction created successfully",
  "status": 201,
  "data": {
    "id": 1,
    "description": "Grocery shopping at Walmart",
    "amount": 85.50,
    "date": "2024-10-16T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "transaction_type_id": 2,
    "state_id": 2,
    "user_id": 123,
    "account_id": 1,
    "category_id": 3
  }
}
```

### 2. Get User's Transactions

**GET** `/api/transactions`

Retrieves transactions for the authenticated user with optional filters and pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)
- `transaction_type_id` (optional): Filter by transaction type
- `state_id` (optional): Filter by state
- `account_id` (optional): Filter by account
- `category_id` (optional): Filter by category
- `minAmount` (optional): Minimum amount filter
- `maxAmount` (optional): Maximum amount filter

**Example:**
```
GET /api/transactions?page=1&limit=10&startDate=2024-10-01&endDate=2024-10-31&transaction_type_id=2
```

**Response (200):**
```json
{
  "message": "Transactions retrieved successfully",
  "status": 200,
  "data": {
    "transactions": [
      {
        "id": 1,
        "description": "Grocery shopping at Walmart",
        "amount": 85.50,
        "date": "2024-10-16T00:00:00.000Z",
        "created_at": "2024-10-16T10:30:00.000Z",
        "transaction_type_id": 2,
        "state_id": 2,
        "user_id": 123,
        "account_id": 1,
        "category_id": 3,
        "transactionType": {
          "id": 2,
          "name": "Expense"
        },
        "state": {
          "id": 2,
          "name": "Completed"
        },
        "account": {
          "id": 1,
          "name": "Main Checking",
          "balance": 1500.00
        },
        "category": {
          "id": 3,
          "name": "Food"
        }
      }
    ],
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

### 3. Get Transaction by ID

**GET** `/api/transactions/:id`

Retrieves a specific transaction by its ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Transaction retrieved successfully",
  "status": 200,
  "data": {
    "id": 1,
    "description": "Grocery shopping at Walmart",
    "amount": 85.50,
    "date": "2024-10-16T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "transaction_type_id": 2,
    "state_id": 2,
    "user_id": 123,
    "account_id": 1,
    "category_id": 3,
    "transactionType": {
      "id": 2,
      "name": "Expense"
    },
    "state": {
      "id": 2,
      "name": "Completed"
    },
    "account": {
      "id": 1,
      "name": "Main Checking",
      "balance": 1500.00
    },
    "category": {
      "id": 3,
      "name": "Food"
    }
  }
}
```

### 4. Update Transaction

**PUT** `/api/transactions/:id`

Updates a transaction (partial update supported).

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body (partial update):**
```json
{
  "description": "Updated grocery shopping description",
  "amount": 90.00,
  "state_id": 2
}
```

**Response (200):**
```json
{
  "message": "Transaction updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "description": "Updated grocery shopping description",
    "amount": 90.00,
    "date": "2024-10-16T00:00:00.000Z",
    "created_at": "2024-10-16T10:30:00.000Z",
    "transaction_type_id": 2,
    "state_id": 2,
    "user_id": 123,
    "account_id": 1,
    "category_id": 3
  }
}
```

### 5. Delete Transaction

**DELETE** `/api/transactions/:id`

Deletes a transaction.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Transaction deleted successfully",
  "status": 200
}
```

### 6. Get Recent Transactions

**GET** `/api/transactions/recent`

Retrieves the most recent transactions for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (optional): Number of transactions to retrieve (default: 10)

**Response (200):**
```json
{
  "message": "Recent transactions retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 1,
      "description": "Grocery shopping at Walmart",
      "amount": 85.50,
      "date": "2024-10-16T00:00:00.000Z",
      "created_at": "2024-10-16T10:30:00.000Z",
      "transactionType": {
        "id": 2,
        "name": "Expense"
      },
      "category": {
        "id": 3,
        "name": "Food"
      }
    }
  ]
}
```

### 7. Get Pending Transactions

**GET** `/api/transactions/pending`

Retrieves all pending transactions for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Pending transactions retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 2,
      "description": "Pending salary deposit",
      "amount": 3000.00,
      "date": "2024-10-20T00:00:00.000Z",
      "state": {
        "id": 1,
        "name": "Pending"
      }
    }
  ]
}
```

### 8. Get Transaction Summary

**GET** `/api/transactions/summary`

Retrieves a summary of transactions for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `startDate` (optional): Start date for summary (YYYY-MM-DD)
- `endDate` (optional): End date for summary (YYYY-MM-DD)

**Response (200):**
```json
{
  "message": "Transaction summary retrieved successfully",
  "status": 200,
  "data": {
    "totalIncome": 5000.00,
    "totalExpenses": 2500.00,
    "netAmount": 2500.00,
    "transactionCount": 25,
    "averageAmount": 300.00
  }
}
```

### 9. Get Monthly Transaction Summary

**GET** `/api/transactions/monthly-summary`

Retrieves monthly transaction summary for a specific year.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `year` (required): Year for the summary (e.g., 2024)

**Response (200):**
```json
{
  "message": "Monthly transaction summary retrieved successfully",
  "status": 200,
  "data": [
    {
      "month": "January",
      "year": 2024,
      "totalIncome": 3000.00,
      "totalExpenses": 1500.00,
      "netAmount": 1500.00,
      "transactionCount": 15
    },
    {
      "month": "February",
      "year": 2024,
      "totalIncome": 3200.00,
      "totalExpenses": 1800.00,
      "netAmount": 1400.00,
      "transactionCount": 18
    }
  ]
}
```

### 10. Get Transactions by Account

**GET** `/api/transactions/account/:accountId`

Retrieves transactions for a specific account.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "message": "Transactions by account retrieved successfully",
  "status": 200,
  "data": {
    "transactions": [...],
    "total": 15,
    "page": 1,
    "totalPages": 1
  }
}
```

### 11. Get Transactions by Category

**GET** `/api/transactions/category/:categoryId`

Retrieves transactions for a specific category.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "message": "Transactions by category retrieved successfully",
  "status": 200,
  "data": {
    "transactions": [...],
    "total": 8,
    "page": 1,
    "totalPages": 1
  }
}
```

## Error Responses

### 400 - Validation Error
```json
{
  "message": "Amount is required and must be a number",
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
  "message": "Transaction not found",
  "status": 404,
  "code": "NOT_FOUND"
}
```

## Field Descriptions

- **description**: Transaction description (required, string, max 250 characters)
- **amount**: Transaction amount (required, number, must be > 0)
- **date**: Transaction date (required, date format)
- **transaction_type_id**: Type of transaction (required, foreign key)
- **state_id**: Transaction state (required, foreign key)
- **account_id**: Account for the transaction (required, foreign key)
- **category_id**: Transaction category (required, foreign key)
- **user_id**: User ID (automatically set from JWT token)

## Business Rules

1. **Amount validation** - Must be greater than 0
2. **Account ownership** - Users can only create transactions for their own accounts
3. **User isolation** - Users can only access their own transactions
4. **Required fields** - All foreign keys and core fields are required
5. **Date handling** - Dates are stored and returned in ISO format

## Common Transaction Types

1. **Income** (ID: 1) - Salary, freelance, investments
2. **Expense** (ID: 2) - Purchases, bills, subscriptions
3. **Transfer** (ID: 3) - Between accounts

## Common States

1. **Pending** (ID: 1) - Transaction not yet processed
2. **Completed** (ID: 2) - Transaction successfully processed
3. **Cancelled** (ID: 3) - Transaction was cancelled

## Common Categories

- **Food** - Groceries, restaurants, delivery
- **Transportation** - Gas, public transport, rideshare
- **Entertainment** - Movies, games, subscriptions
- **Bills** - Utilities, rent, insurance
- **Shopping** - Clothing, electronics, household items
- **Health** - Medical, pharmacy, fitness
- **Education** - Courses, books, training
- **Salary** - Regular income
- **Investment** - Stocks, bonds, crypto

## Usage Flow

1. Create transaction with `POST /api/transactions`
2. View all transactions with `GET /api/transactions` (with filters)
3. Get specific transaction details with `GET /api/transactions/:id`
4. Update transaction with `PUT /api/transactions/:id`
5. Delete transaction with `DELETE /api/transactions/:id`
6. Monitor recent activity with `GET /api/transactions/recent`
7. Check pending transactions with `GET /api/transactions/pending`
8. Analyze spending with `GET /api/transactions/summary`
9. View monthly trends with `GET /api/transactions/monthly-summary`
