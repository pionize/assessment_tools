# CMS API - List Assessments

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/assessments`

## Request

- Method: `GET`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 10) |
| `status` | string | No | Filter by status: `active`, `inactive`, `archived` |
| `search` | string | No | Search by assessment title or description |
| `sort` | string | No | Sort by: `created_at`, `title`, `submission_count` (default: `created_at`) |
| `order` | string | No | Sort order: `asc`, `desc` (default: `desc`) |

## Response Example

```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "content": [
      {
        "id": "assessment-123",
        "title": "Full Stack Developer Assessment",
        "description": "Comprehensive assessment for full stack developer position",
        "status": "active",
        "total_challenges": 5,
        "time_limit": 180,
        "submission_count": 25,
        "pass_rate": 68.0,
        "average_score": 7.2,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-20T14:45:00Z",
        "created_by": "admin@company.com"
      },
      {
        "id": "assessment-456",
        "title": "React Developer Assessment",
        "description": "Frontend assessment focusing on React and modern JavaScript",
        "status": "active",
        "total_challenges": 3,
        "time_limit": 120,
        "submission_count": 42,
        "pass_rate": 71.4,
        "average_score": 8.1,
        "created_at": "2024-01-10T09:15:00Z",
        "updated_at": "2024-01-18T16:20:00Z",
        "created_by": "hr@company.com"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 25,
      "items_per_page": 10,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

## Error Responses

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
    "response_message": "Insufficient permissions to access CMS data"
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