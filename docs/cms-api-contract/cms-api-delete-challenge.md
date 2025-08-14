# CMS API - Delete Challenge

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/challenges/{id}`

## Request

- Method: `DELETE`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Challenge ID |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `force` | boolean | No | Force delete even with dependencies (default: false) |
| `archive_submissions` | boolean | No | Archive submissions before deletion (default: true) |

## Response Example

### 200 OK
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Challenge deleted successfully"
  },
  "response_output": {
    "detail": {
      "id": "challenge-001",
      "title": "React Component Implementation",
      "deleted_at": "2024-01-22T15:30:00Z",
      "deleted_by": "admin@company.com",
      "impact_summary": {
        "assessments_affected": 3,
        "assessments_updated": [
          {
            "assessment_id": "assessment-123",
            "title": "Full Stack Assessment",
            "challenges_remaining": 4,
            "action_taken": "challenge_removed_from_assessment"
          }
        ],
        "submissions_archived": 25,
        "submissions_deleted": 0
      },
      "cleanup_actions": [
        "Removed challenge from 3 active assessments",
        "Archived 25 candidate submissions",
        "Updated assessment scoring rubrics",
        "Sent notifications to affected assessment administrators"
      ]
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
    "response_message": "Cannot delete challenge with active dependencies"
  },
  "response_output": {
    "detail": {
      "challenge_id": "challenge-001",
      "blocking_dependencies": [
        {
          "type": "active_assessments",
          "count": 5,
          "description": "Challenge is used in 5 active assessments",
          "assessment_ids": ["assessment-123", "assessment-456", "assessment-789"]
        },
        {
          "type": "pending_submissions",
          "count": 12,
          "description": "12 candidates are currently working on this challenge"
        },
        {
          "type": "scheduled_assessments",
          "count": 2,
          "description": "Challenge is part of 2 future scheduled assessments",
          "scheduled_dates": ["2024-01-25T10:00:00Z", "2024-01-30T14:00:00Z"]
        }
      ],
      "suggestions": [
        "Set challenge status to 'inactive' instead of deletion",
        "Use force=true to override dependencies (not recommended)",
        "Wait until active submissions are completed",
        "Remove challenge from active assessments first"
      ]
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
    "response_message": "Insufficient permissions to delete challenges"
  }
}
```

### 404 Not Found
```json
{
  "response_schema": {
    "response_code": "CODE-4004",
    "response_message": "Challenge not found"
  }
}
```

### 409 Conflict
```json
{
  "response_schema": {
    "response_code": "CODE-4009",
    "response_message": "Challenge deletion conflicts with system constraints"
  },
  "response_output": {
    "detail": {
      "challenge_id": "challenge-001",
      "conflicts": [
        {
          "type": "data_integrity",
          "message": "Challenge is referenced by historical reporting data",
          "severity": "high"
        },
        {
          "type": "audit_requirements",
          "message": "Challenge has been used in certified assessments that require data retention",
          "retention_period": "7 years",
          "earliest_deletion_date": "2031-01-22T00:00:00Z"
        }
      ],
      "alternative_actions": [
        "Archive challenge instead of deletion",
        "Mark as inactive and hide from new assessments",
        "Create a replacement challenge and migrate assessments"
      ]
    }
  }
}
```

### 422 Unprocessable Entity
```json
{
  "response_schema": {
    "response_code": "CODE-4022",
    "response_message": "Challenge deletion would compromise assessment integrity"
  },
  "response_output": {
    "detail": {
      "challenge_id": "challenge-001",
      "integrity_issues": [
        {
          "assessment_id": "assessment-123",
          "issue": "Deleting this challenge would leave assessment with insufficient challenges for valid scoring",
          "current_challenges": 3,
          "minimum_required": 3,
          "impact": "Assessment would become invalid"
        }
      ],
      "recommendations": [
        "Add replacement challenge to affected assessments before deletion",
        "Archive challenge instead of deletion to maintain historical integrity"
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
    "response_message": "Internal server error occurred during challenge deletion"
  }
}
```

## Deletion Process

### Standard Deletion (force=false)
1. **Dependency Check**: Verify no active assessments or pending submissions
2. **Impact Analysis**: Calculate effects on existing data
3. **Soft Delete**: Mark challenge as deleted but retain data
4. **Cleanup**: Remove from active assessment pools
5. **Archive**: Move submissions to archived state
6. **Notification**: Inform relevant administrators

### Force Deletion (force=true)
1. **Override Checks**: Bypass dependency validation
2. **Assessment Updates**: Remove challenge from all assessments
3. **Submission Handling**: Archive or delete submissions based on settings
4. **Data Cleanup**: Clean up all related data
5. **Audit Logging**: Log all actions for compliance
6. **Notification**: Send detailed impact report to administrators

## Notes

- **Soft Delete**: Default behavior marks challenges as deleted but preserves data
- **Hard Delete**: Only available with appropriate permissions and force flag
- **Cascade Effects**: Deletion affects assessments, submissions, and scoring
- **Compliance**: Some challenges may have retention requirements that prevent deletion
- **Recovery**: Soft-deleted challenges can be recovered within a retention period
- **Audit Trail**: All deletion actions are logged with detailed impact analysis
- **Notifications**: Relevant administrators are automatically notified of deletions and their impacts