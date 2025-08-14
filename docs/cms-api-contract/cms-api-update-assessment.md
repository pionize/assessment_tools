# CMS API - Update Assessment

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/assessments/{id}`

## Request

- Method: `POST`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Assessment ID |

## Request Body

```json
{
  "title": "Full Stack Developer Assessment - Updated",
  "description": "Updated comprehensive assessment for full stack developer position",
  "status": "active",
  "time_limit": 240,
  "challenge_ids": ["challenge-001", "challenge-002", "challenge-003", "challenge-004"],
  "challenge_order": [
    {"challenge_id": "challenge-001", "order": 1},
    {"challenge_id": "challenge-002", "order": 2},
    {"challenge_id": "challenge-003", "order": 3},
    {"challenge_id": "challenge-004", "order": 4}
  ],
  "passing_score": 75.0,
  "instructions": "Updated instructions for the Full Stack Developer Assessment.",
  "tags": ["fullstack", "react", "nodejs", "senior", "updated"]
}
```

## Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Assessment title (max 200 chars) |
| `description` | string | No | Assessment description (max 1000 chars) |
| `status` | string | No | Status: `active`, `inactive`, `draft`, `archived` |
| `time_limit` | integer | No | Time limit in minutes |
| `challenge_ids` | array | No | Array of challenge IDs to include |
| `challenge_order` | array | No | Order of challenges with IDs and positions |
| `passing_score` | number | No | Minimum passing score percentage |
| `instructions` | string | No | Assessment instructions for candidates |
| `tags` | array | No | Array of tags for categorization |

## Response Example

### 200 OK
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Assessment updated successfully"
  },
  "response_output": {
    "detail": {
      "id": "assessment-789",
      "title": "Full Stack Developer Assessment - Updated",
      "description": "Updated comprehensive assessment for full stack developer position",
      "status": "active",
      "time_limit": 240,
      "challenge_ids": ["challenge-001", "challenge-002", "challenge-003", "challenge-004"],
      "challenge_order": [
        {"challenge_id": "challenge-001", "order": 1},
        {"challenge_id": "challenge-002", "order": 2},
        {"challenge_id": "challenge-003", "order": 3},
        {"challenge_id": "challenge-004", "order": 4}
      ],
      "passing_score": 75.0,
      "instructions": "Updated instructions for the Full Stack Developer Assessment.",
      "tags": ["fullstack", "react", "nodejs", "senior", "updated"],
      "submission_count": 5,
      "pass_rate": 80.0,
      "average_score": 7.5,
      "created_at": "2024-01-20T10:30:00Z",
      "updated_at": "2024-01-22T14:45:00Z",
      "created_by": "admin@company.com",
      "updated_by": "admin@company.com"
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
        "field": "time_limit",
        "message": "Time limit must be a positive integer"
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
    "response_message": "Insufficient permissions to update assessments"
  }
}
```

### 404 Not Found
```json
{
  "response_schema": {
    "response_code": "CODE-4004",
    "response_message": "Assessment not found"
  }
}
```

### 409 Conflict
```json
{
  "response_schema": {
    "response_code": "CODE-4009",
    "response_message": "Cannot update assessment - has active submissions"
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