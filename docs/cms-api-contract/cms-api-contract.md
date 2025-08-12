# Developer Assessment CMS - API Contract

This document outlines the REST API contract for the Developer Assessment Content Management System (CMS). These endpoints are designed for administrators to view and analyze assessment results, submissions, and candidate performance.

## Base URL

```
https://cms-api.assessment.example.com/v1
```

## Authentication

All CMS API requests require admin-level authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <admin_jwt_token>
```

**Note:** Admin tokens have elevated permissions compared to candidate tokens and provide access to sensitive assessment data, candidate submissions, and analytics.

## Content Type

All requests and responses use JSON:

```
Content-Type: application/json
```

---

## Overview

The CMS API provides three main functionalities:

1. **Assessment Management** - View and manage assessment configurations
2. **Assessment Analytics** - Get detailed statistics and performance metrics  
3. **Submission Review** - Review candidate submissions with AI detection analysis

---

## 1. List Assessments

**Endpoint:** `GET /cms/assessments`

View paginated list of all assessments with basic statistics.

**Features:**
- Pagination support
- Status filtering (active, inactive, archived)
- Search functionality
- Sorting options
- Basic statistics (submission count, pass rate, average score)

[📋 View detailed documentation](./cms-api-list-assessments.md)

---

## 2. Assessment Detail

**Endpoint:** `GET /cms/assessments/{assessmentId}`

Get comprehensive details about a specific assessment including challenges and statistics.

**Features:**
- Complete assessment configuration
- Challenge breakdown with difficulty and points
- Statistical analysis per challenge
- Performance metrics (completion rates, average scores, time spent)

[📊 View detailed documentation](./cms-api-assessment-detail.md)

---

## 3. Assessment Submissions

**Endpoint:** `GET /cms/assessments/{assessmentId}/submissions`

Review all candidate submissions for a specific assessment with detailed analysis.

**Features:**
- Candidate submission history
- Individual challenge results
- Score breakdown and feedback
- AI detection analysis with likelihood percentages
- Code submissions and open-ended answers
- Multiple choice results with accuracy metrics

[📝 View detailed documentation](./cms-api-assessment-submissions.md)

---

## Key Features

### AI Detection Analysis
All submissions include AI likelihood analysis with:
- **Overall Risk Score** (0-100%): Combined probability of AI assistance
- **Component Analysis**: 
  - Code style patterns
  - Response timing analysis
  - Complexity vs time correlation
  - Language pattern analysis
- **Risk Levels**: Low, Medium, High
- **Confidence Score**: Analysis reliability (0-1)

### Comprehensive Feedback
Each challenge submission includes:
- **Scoring**: Points earned vs maximum possible
- **Performance Metrics**: Time spent, completion status
- **Feedback**: Strengths, areas for improvement, overall comments
- **Code Review**: For code challenges, detailed analysis of implementation

### Advanced Filtering & Sorting
- Filter by performance metrics (score ranges, completion time)
- Sort by AI likelihood for suspicious submission detection
- Status-based filtering for workflow management
- Search and pagination for large datasets

---

## Response Schema

All endpoints follow the standard response format:

```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    // Endpoint-specific data
  }
}
```

## Error Handling

Standard HTTP status codes are used with consistent error response format:

- **401 Unauthorized**: Invalid or missing admin token
- **403 Forbidden**: Insufficient permissions for CMS access
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

---

## Security Considerations

- All endpoints require admin-level authentication
- Sensitive candidate data is included - ensure secure handling
- Rate limiting may apply to prevent abuse
- Audit logging recommended for compliance

---

## Usage Examples

### Get Assessment List
```bash
curl -H "Authorization: Bearer <admin_token>" \
     "https://cms-api.assessment.example.com/v1/cms/assessments?page=1&limit=10"
```

### Review High-Risk Submissions
```bash
curl -H "Authorization: Bearer <admin_token>" \
     "https://cms-api.assessment.example.com/v1/cms/assessments/assessment-123/submissions?ai_threshold=70&sort=ai_likelihood&order=desc"
```

### Get Assessment Performance Stats
```bash
curl -H "Authorization: Bearer <admin_token>" \
     "https://cms-api.assessment.example.com/v1/cms/assessments/assessment-123"
```