# Budgets API Documentation

## Authentication Required

All budget endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Models Overview

### Report Types
- **id**: Primary key
- **name**: Report type name (e.g., "Monthly Report", "Annual Report", "Custom Report")

### Budgets
- **id**: Primary key
- **month**: Budget month (DATE)
- **budgeted_amount**: Planned amount for the category (DECIMAL 12,2)
- **spent_amount**: Amount already spent (DECIMAL 12,2)
- **remaining**: Remaining amount (DECIMAL 12,2)
- **alert_triggered**: Whether budget alert was triggered (BOOLEAN)
- **created_at**: Creation timestamp
- **category_id**: Foreign key to categories
- **user_id**: Foreign key to users

### Reports
- **id**: Primary key
- **start_date**: Report start date
- **end_date**: Report end date
- **file_url**: URL to generated report file
- **created_at**: Creation timestamp
- **report_type_id**: Foreign key to report_types
- **user_id**: Foreign key to users

### Debts
- **id**: Primary key
- **name**: Debt name (e.g., "Credit Card", "Student Loan")
- **total_amount**: Original debt amount (DECIMAL 12,2)
- **remaining_amount**: Current remaining amount (DECIMAL 12,2)
- **monthly_payment**: Monthly payment amount (DECIMAL 12,2)
- **interest_rate**: Annual interest rate (DECIMAL 5,2)
- **start_date**: Debt start date
- **end_date**: Expected payoff date
- **created_at**: Creation timestamp
- **status_id**: Foreign key to states (Active, Paid, etc.)
- **user_id**: Foreign key to users

### Analytics
- **id**: Primary key
- **total_income**: Total income for period (DECIMAL 12,2)
- **total_expenses**: Total expenses for period (DECIMAL 12,2)
- **total_savings**: Total savings for period (DECIMAL 12,2)
- **savings_rate**: Savings rate percentage (DECIMAL 5,2)
- **net_cash_flow**: Net cash flow (DECIMAL 12,2)
- **period**: Analysis period (DATE)
- **created_at**: Creation timestamp
- **user_id**: Foreign key to users

## Budget Endpoints

### 1. Create Budget

**POST** `/api/budgets`

Creates a new budget for a specific category and month.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "month": "2024-10-01",
  "budgeted_amount": 500.00,
  "category_id": 3
}
```

**Response (201):**
```json
{
  "message": "Budget created successfully",
  "status": 201,
  "data": {
    "id": 1,
    "month": "2024-10-01T00:00:00.000Z",
    "budgeted_amount": 500.00,
    "spent_amount": 0.00,
    "remaining": 500.00,
    "alert_triggered": false,
    "created_at": "2024-10-16T10:30:00.000Z",
    "category_id": 3,
    "user_id": 123
  }
}
```

### 2. Get User's Budgets

**GET** `/api/budgets`

Retrieves budgets for the authenticated user with optional filters.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `month` (optional): Filter by specific month (YYYY-MM-DD)

**Response (200):**
```json
{
  "message": "Budgets retrieved successfully",
  "status": 200,
  "data": {
    "budgets": [
      {
        "id": 1,
        "month": "2024-10-01T00:00:00.000Z",
        "budgeted_amount": 500.00,
        "spent_amount": 250.00,
        "remaining": 250.00,
        "alert_triggered": false,
        "created_at": "2024-10-16T10:30:00.000Z",
        "category_id": 3,
        "user_id": 123,
        "category": {
          "id": 3,
          "name": "Food"
        },
        "percentage_used": 50.0,
        "is_over_budget": false,
        "days_remaining_in_month": 15
      }
    ],
    "total": 5,
    "page": 1,
    "totalPages": 1
  }
}
```

### 3. Get Budget Summary

**GET** `/api/budgets/summary`

Retrieves a summary of all budgets for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `month` (optional): Filter by specific month (YYYY-MM-DD)

**Response (200):**
```json
{
  "message": "Budget summary retrieved successfully",
  "status": 200,
  "data": {
    "total_budgeted": 2000.00,
    "total_spent": 1200.00,
    "total_remaining": 800.00,
    "percentage_used": 60.0,
    "categories_over_budget": 1,
    "categories_with_alerts": 2
  }
}
```

### 4. Get Monthly Budget Overview

**GET** `/api/budgets/monthly-overview`

Retrieves a complete overview of budgets for a specific month.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `month` (required): Specific month (YYYY-MM-DD)

**Response (200):**
```json
{
  "message": "Monthly budget overview retrieved successfully",
  "status": 200,
  "data": {
    "month": "2024-10-01T00:00:00.000Z",
    "total_budgeted": 2000.00,
    "total_spent": 1200.00,
    "total_remaining": 800.00,
    "percentage_used": 60.0,
    "budgets": [
      {
        "id": 1,
        "month": "2024-10-01T00:00:00.000Z",
        "budgeted_amount": 500.00,
        "spent_amount": 250.00,
        "remaining": 250.00,
        "category": {
          "id": 3,
          "name": "Food"
        }
      }
    ]
  }
}
```

### 5. Get Budgets with Alerts

**GET** `/api/budgets/alerts`

Retrieves budgets that have triggered alerts (low remaining amount).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Budgets with alerts retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 2,
      "month": "2024-10-01T00:00:00.000Z",
      "budgeted_amount": 300.00,
      "spent_amount": 280.00,
      "remaining": 20.00,
      "alert_triggered": true,
      "category": {
        "id": 4,
        "name": "Entertainment"
      }
    }
  ]
}
```

### 6. Get Over-Budget Budgets

**GET** `/api/budgets/over-budget`

Retrieves budgets that have exceeded their allocated amount.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Over-budget budgets retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": 3,
      "month": "2024-10-01T00:00:00.000Z",
      "budgeted_amount": 200.00,
      "spent_amount": 250.00,
      "remaining": -50.00,
      "alert_triggered": true,
      "is_over_budget": true,
      "category": {
        "id": 5,
        "name": "Shopping"
      }
    }
  ]
}
```

### 7. Update Budget

**PUT** `/api/budgets/:id`

Updates a budget (partial update supported).

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "budgeted_amount": 600.00,
  "spent_amount": 300.00
}
```

**Response (200):**
```json
{
  "message": "Budget updated successfully",
  "status": 200,
  "data": {
    "id": 1,
    "month": "2024-10-01T00:00:00.000Z",
    "budgeted_amount": 600.00,
    "spent_amount": 300.00,
    "remaining": 300.00,
    "alert_triggered": false
  }
}
```

### 8. Delete Budget

**DELETE** `/api/budgets/:id`

Deletes a budget.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Budget deleted successfully",
  "status": 200
}
```

## Business Rules

1. **One budget per category per month** - Each category can only have one budget per month
2. **Automatic calculations** - Remaining amount and alerts are calculated automatically
3. **Alert triggers** - Alerts trigger when remaining amount is negative or less than 10% of budgeted amount
4. **User isolation** - Users can only access their own budgets
5. **Positive amounts** - Budgeted amounts must be greater than 0

## Common Use Cases

1. **Monthly budget planning** - Set budgets for different spending categories
2. **Expense tracking** - Monitor spending against budgeted amounts
3. **Budget alerts** - Get notified when approaching budget limits
4. **Financial analysis** - Analyze spending patterns and budget performance
5. **Budget adjustments** - Update budgets based on actual spending patterns

## Integration with Transactions

- When transactions are created, the `spent_amount` in corresponding budgets is automatically updated
- Budget alerts are triggered based on spending patterns
- Budget vs. actual spending analysis is available through summary endpoints

## Error Responses

### 400 - Validation Error
```json
{
  "message": "Budgeted amount is required and must be a number",
  "status": 400,
  "code": "VALIDATION_ERROR"
}
```

### 409 - Conflict
```json
{
  "message": "Budget already exists for this category and month",
  "status": 409,
  "code": "CONFLICT"
}
```

### 404 - Not Found
```json
{
  "message": "Budget not found",
  "status": 404,
  "code": "NOT_FOUND"
}
```
