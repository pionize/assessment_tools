# CMS API - Create Assessment

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/assessments`

## Request

- Method: `POST`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Request Body

```json
{
  "title": "Full Stack Developer Assessment",
  "description": "Comprehensive assessment for full stack developer position covering React, Node.js, and database skills",
  "status": "active",
  "time_limit": 180,
  "challenge_ids": ["challenge-001", "challenge-002", "challenge-003"],
  "challenge_order": [
    {"challenge_id": "challenge-001", "order": 1},
    {"challenge_id": "challenge-002", "order": 2},
    {"challenge_id": "challenge-003", "order": 3}
  ],
  "passing_score": 70.0,
  "instructions": "Welcome to the Full Stack Developer Assessment. Please read each question carefully and provide your best answers. You have 3 hours to complete all challenges.",
  "tags": ["fullstack", "react", "nodejs", "senior"]
}
```

## Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Assessment title (max 200 chars) |
| `description` | string | Yes | Assessment description (max 1000 chars) |
| `status` | string | No | Status: `active`, `inactive`, `draft` (default: `draft`) |
| `time_limit` | integer | Yes | Time limit in minutes |
| `challenge_ids` | array | Yes | Array of challenge IDs to include |
| `challenge_order` | array | No | Order of challenges with IDs and positions |
| `passing_score` | number | No | Minimum passing score percentage (default: 60.0) |
| `instructions` | string | No | Assessment instructions for candidates |
| `tags` | array | No | Array of tags for categorization |

## Response Example

### 201 Created
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Assessment created successfully"
  },
  "response_output": {
    "detail": {
      "id": "assessment-789",
      "title": "Full Stack Developer Assessment",
      "description": "Comprehensive assessment for full stack developer position covering React, Node.js, and database skills",
      "status": "active",
      "time_limit": 180,
      "challenge_ids": ["challenge-001", "challenge-002", "challenge-003"],
      "challenge_order": [
        {"challenge_id": "challenge-001", "order": 1},
        {"challenge_id": "challenge-002", "order": 2},
        {"challenge_id": "challenge-003", "order": 3}
      ],
      "passing_score": 70.0,
      "instructions": "Welcome to the Full Stack Developer Assessment. Please read each question carefully and provide your best answers. You have 3 hours to complete all challenges.",
      "tags": ["fullstack", "react", "nodejs", "senior"],
      "submission_count": 0,
      "pass_rate": 0.0,
      "average_score": 0.0,
      "created_at": "2024-01-20T10:30:00Z",
      "updated_at": "2024-01-20T10:30:00Z",
      "created_by": "admin@company.com"
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "response_schema": {
    "response_code": "CODE-4000",
    "response_message": "Validation failed"
  },
  "response_output": {
    "errors": [
      {
        "field": "title",
        "message": "Title is required and cannot be empty"
      },
      {
        "field": "challenge_ids",
        "message": "At least one challenge must be included"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "response_schema": {
    "response_code": "CODE-4001",
    "response_message": "Unauthorized access - Invalid or missing admin token"
  }
}
```

### 403 Forbidden
```json
{
  "response_schema": {
    "response_code": "CODE-4003",
    "response_message": "Insufficient permissions to create assessments"
  }
}
```

### 409 Conflict
```json
{
  "response_schema": {
    "response_code": "CODE-4009",
    "response_message": "Assessment with this title already exists"
  }
}
```

### 500 Internal Server Error
```json
{
  "response_schema": {
    "response_code": "CODE-5000",
    "response_message": "Internal server error occurred"
  }
}
```