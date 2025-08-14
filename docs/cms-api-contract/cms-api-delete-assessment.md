# CMS API - Delete Assessment

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/assessments/{id}`

## Request

- Method: `DELETE`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Assessment ID |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `force` | boolean | No | Force delete even with submissions (default: false) |

## Response Example

### 200 OK
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Assessment deleted successfully"
  },
  "response_output": {
    "detail": {
      "id": "assessment-789",
      "title": "Full Stack Developer Assessment",
      "deleted_at": "2024-01-22T15:30:00Z",
      "deleted_by": "admin@company.com",
      "submissions_archived": 5,
      "challenges_unlinked": 3
    }
  }
}
```

### 204 No Content (Alternative response for successful deletion)
```
No response body
```

## Error Responses

### 400 Bad Request
```json
{
  "response_schema": {
    "response_code": "CODE-4000",
    "response_message": "Cannot delete assessment with active submissions. Use force=true to override or archive the assessment instead."
  },
  "response_output": {
    "detail": {
      "assessment_id": "assessment-789",
      "active_submissions": 5,
      "suggestion": "Consider setting status to 'archived' instead of deletion"
    }
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
    "response_message": "Insufficient permissions to delete assessments"
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
    "response_message": "Assessment cannot be deleted - has dependencies"
  },
  "response_output": {
    "detail": {
      "assessment_id": "assessment-789",
      "blocking_dependencies": [
        {
          "type": "submissions",
          "count": 25,
          "description": "Active candidate submissions"
        },
        {
          "type": "scheduled_assessments",
          "count": 3,
          "description": "Future scheduled assessments"
        }
      ]
    }
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

## Notes

- **Soft Delete**: By default, assessments are soft-deleted (marked as deleted but data retained)
- **Force Delete**: Using `force=true` will permanently delete the assessment and cascade to related data
- **Submissions Handling**: When force deleting, all submissions will be archived before deletion
- **Challenge Unlinking**: Associated challenges will be unlinked but not deleted
- **Audit Trail**: All deletion actions are logged for audit purposes