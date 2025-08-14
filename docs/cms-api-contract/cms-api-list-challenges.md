# CMS API - List Challenges

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/challenges`

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
| `type` | string | No | Filter by type: `code`, `multiple-choice`, `open-ended` |
| `difficulty` | string | No | Filter by difficulty: `easy`, `medium`, `hard` |
| `status` | string | No | Filter by status: `active`, `inactive`, `draft` |
| `search` | string | No | Search by challenge title or description |
| `tags` | string | No | Filter by tags (comma-separated) |
| `language` | string | No | Filter by programming language (for code challenges) |
| `sort` | string | No | Sort by: `created_at`, `title`, `difficulty`, `usage_count` (default: `created_at`) |
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
        "id": "challenge-001",
        "title": "React Component Implementation",
        "description": "Create a reusable React component with proper state management",
        "type": "code",
        "difficulty": "medium",
        "status": "active",
        "time_limit": 45,
        "points": 100,
        "language": "javascript",
        "tags": ["react", "frontend", "components"],
        "usage_count": 15,
        "average_score": 7.8,
        "pass_rate": 73.3,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-20T14:45:00Z",
        "created_by": "admin@company.com"
      },
      {
        "id": "challenge-002",
        "title": "Database Design Principles",
        "description": "Multiple choice questions about database normalization and design patterns",
        "type": "multiple-choice",
        "difficulty": "easy",
        "status": "active",
        "time_limit": 20,
        "points": 50,
        "language": null,
        "tags": ["database", "sql", "theory"],
        "usage_count": 28,
        "average_score": 8.2,
        "pass_rate": 85.7,
        "created_at": "2024-01-10T09:15:00Z",
        "updated_at": "2024-01-18T16:20:00Z",
        "created_by": "hr@company.com"
      },
      {
        "id": "challenge-003",
        "title": "System Architecture Explanation",
        "description": "Describe how you would architect a scalable web application",
        "type": "open-ended",
        "difficulty": "hard",
        "status": "active",
        "time_limit": 30,
        "points": 75,
        "language": null,
        "tags": ["architecture", "system-design", "scalability"],
        "usage_count": 8,
        "average_score": 6.5,
        "pass_rate": 62.5,
        "created_at": "2024-01-12T11:20:00Z",
        "updated_at": "2024-01-19T13:30:00Z",
        "created_by": "tech-lead@company.com"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 47,
      "items_per_page": 10,
      "has_next": true,
      "has_previous": false
    },
    "summary": {
      "total_challenges": 47,
      "by_type": {
        "code": 18,
        "multiple-choice": 20,
        "open-ended": 9
      },
      "by_difficulty": {
        "easy": 15,
        "medium": 22,
        "hard": 10
      },
      "by_status": {
        "active": 35,
        "inactive": 8,
        "draft": 4
      }
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

### 400 Bad Request
```json
{
  "response_schema": {
    "response_code": "CODE-4000",
    "response_message": "Invalid query parameters"
  },
  "response_output": {
    "errors": [
      {
        "field": "type",
        "message": "Invalid challenge type. Must be one of: code, multiple-choice, open-ended"
      }
    ]
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