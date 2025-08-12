# CMS API - Assessment Detail

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/assessments/{assessmentId}`

## Request

- Method: `GET`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assessmentId` | string | Yes | Assessment ID |

## Response Example

```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "assessment": {
      "id": "assessment-123",
      "title": "Full Stack Developer Assessment",
      "description": "Comprehensive assessment for full stack developer position",
      "instructions": "Please complete all challenges within the time limit. You may use any resources available online.",
      "status": "active",
      "time_limit": 180,
      "pass_threshold": 70.0,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z",
      "created_by": "admin@company.com"
    },
    "challenges": [
      {
        "id": "challenge-1",
        "title": "React Component Implementation",
        "type": "code",
        "description": "Create a reusable React component that displays a list of users with search functionality.",
        "instructions": "Implement a UserList component with the following requirements...",
        "time_limit": 60,
        "points": 25,
        "difficulty": "medium",
        "language": "javascript",
        "order": 1
      },
      {
        "id": "challenge-2",
        "title": "Algorithm Problem",
        "type": "open-ended",
        "description": "Solve this algorithmic problem and explain your approach.",
        "instructions": "Given an array of integers, find the maximum sum of contiguous subarray...",
        "time_limit": 30,
        "points": 20,
        "difficulty": "hard",
        "order": 2
      },
      {
        "id": "challenge-3",
        "title": "JavaScript Fundamentals Quiz",
        "type": "multiple-choice",
        "description": "Test your knowledge of JavaScript fundamentals and modern ES6+ features.",
        "time_limit": 25,
        "points": 15,
        "difficulty": "easy",
        "order": 3,
        "total_questions": 10
      }
    ],
    "statistics": {
      "total_submissions": 25,
      "completed_submissions": 23,
      "average_score": 7.2,
      "pass_rate": 68.0,
      "average_completion_time": 142,
      "challenge_statistics": [
        {
          "challenge_id": "challenge-1",
          "completion_rate": 92.0,
          "average_score": 18.5,
          "average_time_spent": 52
        },
        {
          "challenge_id": "challenge-2",
          "completion_rate": 84.0,
          "average_score": 14.2,
          "average_time_spent": 28
        },
        {
          "challenge_id": "challenge-3",
          "completion_rate": 96.0,
          "average_score": 12.1,
          "average_time_spent": 18
        }
      ]
    }
  }
}
```

## Error Responses

### 404 Not Found
```json
{
  "response_schema": {
    "response_code": "CODE-4004",
    "response_message": "Assessment not found"
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