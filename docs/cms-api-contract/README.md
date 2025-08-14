# CMS API Contract Documentation

This directory contains comprehensive API documentation for the Content Management System (CMS) that manages assessments and challenges for the Developer Assessment Platform.

## Overview

The CMS API provides full CRUD (Create, Read, Update, Delete) functionality for:
- **Assessments**: Complete assessment management including metadata, challenge linking, and configuration
- **Challenges**: Individual challenge management supporting three types: code, multiple-choice, and open-ended

## API Design Principles

- **RESTful Design**: Following REST conventions with clear resource paths
- **Consistent Response Format**: All endpoints use the standardized response envelope
- **Authentication**: Bearer token authentication for all endpoints
- **Authorization**: Role-based access control with admin-level permissions
- **Update Method**: Using POST for updates (not PATCH) as specified in requirements
- **Error Handling**: Comprehensive error responses with detailed validation messages

## Authentication

All CMS API endpoints require admin-level authentication:

```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

## Base URL

- Production: `${CMS_API_BASE_URL}` (from environment variables)
- Development: `http://localhost:3001` (typical)

## API Endpoints

### Assessment Management

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/cms/assessments` | List all assessments with filtering and pagination | [cms-api-list-assessments.md](./cms-api-list-assessments.md) |
| GET | `/cms/assessments/{id}` | Get assessment details | [cms-api-assessment-detail.md](./cms-api-assessment-detail.md) |
| POST | `/cms/assessments` | Create new assessment | [cms-api-create-assessment.md](./cms-api-create-assessment.md) |
| POST | `/cms/assessments/{id}` | Update existing assessment | [cms-api-update-assessment.md](./cms-api-update-assessment.md) |
| DELETE | `/cms/assessments/{id}` | Delete assessment | [cms-api-delete-assessment.md](./cms-api-delete-assessment.md) |
| GET | `/cms/assessments/{id}/submissions` | List assessment submissions | [cms-api-assessment-submissions.md](./cms-api-assessment-submissions.md) |

### Challenge Management

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/cms/challenges` | List all challenges with filtering and pagination | [cms-api-list-challenges.md](./cms-api-list-challenges.md) |
| GET | `/cms/challenges/{id}` | Get challenge details | [cms-api-get-challenge.md](./cms-api-get-challenge.md) |
| POST | `/cms/challenges` | Create new challenge | [cms-api-create-challenge.md](./cms-api-create-challenge.md) |
| POST | `/cms/challenges/{id}` | Update existing challenge | [cms-api-update-challenge.md](./cms-api-update-challenge.md) |
| DELETE | `/cms/challenges/{id}` | Delete challenge | [cms-api-delete-challenge.md](./cms-api-delete-challenge.md) |

## Challenge Types

The system supports three types of challenges:

### 1. Code Challenges
- **Purpose**: Programming tasks requiring code implementation
- **Features**: Starter code, solution code, automated testing, multiple file support
- **Languages**: JavaScript/TypeScript, Python, Java, Go, PHP, etc.
- **Evaluation**: Automated testing with custom test cases

### 2. Multiple Choice
- **Purpose**: Knowledge-based questions with predefined answers
- **Features**: Multiple questions per challenge, explanations, weighted scoring
- **Format**: Single correct answer per question
- **Evaluation**: Automatic scoring based on correct selections

### 3. Open-Ended
- **Purpose**: Subjective questions requiring written responses
- **Features**: Rich text responses, word limits, evaluation criteria
- **Format**: Free-form text answers
- **Evaluation**: Manual review with structured rubrics

## Response Format

All API responses follow this standard format:

```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success message"
  },
  "response_output": {
    "detail": { /* Single resource */ },
    "content": [ /* Array of resources */ ],
    "pagination": { /* Pagination info */ }
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| CODE-0000 | 200/201 | Success |
| CODE-4000 | 400 | Bad Request - Validation errors |
| CODE-4001 | 401 | Unauthorized - Invalid or missing token |
| CODE-4003 | 403 | Forbidden - Insufficient permissions |
| CODE-4004 | 404 | Not Found - Resource doesn't exist |
| CODE-4009 | 409 | Conflict - Resource conflicts or dependencies |
| CODE-4022 | 422 | Unprocessable Entity - Business logic errors |
| CODE-5000 | 500 | Internal Server Error |

## Data Models

### Assessment Model
```typescript
interface Assessment {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  time_limit: number; // minutes
  challenge_ids: string[];
  challenge_order: Array<{challenge_id: string, order: number}>;
  passing_score: number; // percentage
  instructions?: string;
  tags: string[];
  submission_count: number;
  pass_rate: number;
  average_score: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}
```

### Challenge Model
```typescript
interface Challenge {
  id: string;
  type: 'code' | 'multiple-choice' | 'open-ended';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'inactive' | 'draft' | 'archived';
  time_limit: number; // minutes
  points: number;
  language?: string; // for code challenges
  tags: string[];
  instructions: string;
  usage_count: number;
  average_score: number;
  pass_rate: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
  
  // Type-specific fields
  starter_code?: Record<string, string>; // code challenges
  solution_code?: Record<string, string>; // code challenges
  test_cases?: TestCase[]; // code challenges
  questions?: Question[]; // multiple choice
  prompt?: string; // open-ended
  evaluation_criteria?: EvaluationCriterion[];
  sample_answer?: string; // open-ended
  word_limit?: number; // open-ended
}
```

## Security Considerations

- **Authentication**: All endpoints require valid admin JWT tokens
- **Authorization**: Role-based access with admin-level permissions
- **Input Validation**: Comprehensive validation on all request data
- **Rate Limiting**: API calls are rate-limited to prevent abuse
- **Audit Logging**: All CMS operations are logged for audit trails
- **Data Encryption**: Sensitive data is encrypted in transit and at rest

## Usage Examples

### Creating a Code Challenge
```bash
curl -X POST ${CMS_API_BASE_URL}/cms/challenges \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "code",
    "title": "React Component Task",
    "description": "Build a reusable component",
    "difficulty": "medium",
    "time_limit": 45,
    "points": 100,
    "language": "javascript"
  }'
```

### Updating an Assessment
```bash
curl -X POST ${CMS_API_BASE_URL}/cms/assessments/assessment-123 \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Assessment Title",
    "time_limit": 180,
    "challenge_ids": ["challenge-001", "challenge-002"]
  }'
```

## Development Notes

- **Database**: Supports both relational (PostgreSQL) and document (MongoDB) databases
- **Caching**: Redis integration for performance optimization
- **File Storage**: Support for code files and media storage (S3/MinIO)
- **Background Jobs**: Async processing for heavy operations
- **Monitoring**: Integration with monitoring and alerting systems

## Contributing

When adding new endpoints or modifying existing ones:

1. Update the relevant API contract documentation
2. Include request/response examples
3. Document all error cases
4. Add integration tests
5. Update this README if necessary

## Version History

- **v1.0.0**: Initial CMS API implementation
- **v1.1.0**: Added challenge statistics and analytics
- **v1.2.0**: Enhanced error handling and validation
- **v1.3.0**: Added multi-language support for challenges