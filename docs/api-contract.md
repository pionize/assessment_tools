# Developer Assessment System - API Contract

This document outlines the REST API contract for the Developer Assessment System, including support for multiple choice challenges.

## Base URL

```
https://api.assessment.example.com/v1
```

## Authentication

All API requests require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Content Type

All requests and responses use JSON:

```
Content-Type: application/json
```

---

## 1. Authentication Endpoints

### POST /auth/authenticate
Authenticate a candidate for an assessment.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com", 
  "assessmentId": "assessment-123"
}
```

**Response:**
```json
{
  "success": true,
  "candidateId": "candidate-456",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "assessmentId": "assessment-123",
  "token": "jwt-token-here",
  "sessionId": "session-789"
}
```

**Status Codes:**
- `200` - Authentication successful
- `400` - Invalid request data
- `404` - Assessment not found
- `409` - Candidate already has active session

---

## 2. Assessment Endpoints

### GET /assessments/{assessmentId}
Get assessment details.

**Response:**
```json
{
  "id": "assessment-123",
  "title": "Frontend Developer Assessment",
  "description": "Complete assessment for frontend developer position",
  "timeLimit": 120,
  "passingScore": 70.0,
  "totalChallenges": 3,
  "challengeTypes": {
    "code": 1,
    "openEnded": 1,
    "multipleChoice": 1
  },
  "instructions": "Please complete all challenges..."
}
```

**Status Codes:**
- `200` - Assessment found
- `404` - Assessment not found

### GET /assessments/{assessmentId}/challenges
Get list of challenges for an assessment.

**Response:**
```json
[
  {
    "id": "challenge-1",
    "title": "React Component Implementation",
    "type": "code",
    "description": "Create a reusable React component...",
    "difficulty": "medium",
    "timeLimit": 60,
    "weight": 1.0
  },
  {
    "id": "challenge-2",
    "title": "JavaScript Fundamentals Quiz",
    "type": "multiple-choice",
    "description": "Test your knowledge of JavaScript fundamentals...",
    "difficulty": "easy",
    "timeLimit": 25,
    "weight": 1.0,
    "totalQuestions": 5
  }
]
```

**Status Codes:**
- `200` - Challenges retrieved successfully
- `404` - Assessment not found

---

## 3. Challenge Endpoints

### GET /challenges/{challengeId}
Get detailed challenge information including questions and options.

**Response for Code Challenge:**
```json
{
  "id": "challenge-1",
  "title": "React Component Implementation",
  "type": "code",
  "description": "Create a reusable React component...",
  "difficulty": "medium",
  "timeLimit": 60,
  "instructions": "# React Component Challenge\n\nCreate a UserList component...",
  "language": "javascript",
  "files": {
    "UserList.jsx": {
      "content": "// Implement your UserList component here...",
      "language": "javascript"
    },
    "App.jsx": {
      "content": "import UserList from './UserList';...",
      "language": "javascript"
    }
  },
  "testCases": [
    {
      "input": "users = [{id: 1, name: 'John'}]",
      "expectedOutput": "Component renders correctly"
    }
  ]
}
```

**Response for Multiple Choice Challenge:**
```json
{
  "id": "challenge-3",
  "title": "JavaScript Fundamentals Quiz",
  "type": "multiple-choice",
  "description": "Test your knowledge of JavaScript fundamentals...",
  "difficulty": "easy",
  "timeLimit": 25,
  "instructions": "Answer the following multiple-choice questions...",
  "questions": [
    {
      "id": "Q1",
      "question": "What is the output of the following code?\n\n```javascript\nconsole.log(typeof null);\n```",
      "options": [
        {
          "id": "A",
          "text": "\"null\""
        },
        {
          "id": "B", 
          "text": "\"object\""
        },
        {
          "id": "C",
          "text": "\"undefined\""
        },
        {
          "id": "D",
          "text": "\"boolean\""
        }
      ],
      "correctAnswer": "B",
      "explanation": "In JavaScript, `typeof null` returns \"object\"...",
      "points": 1
    }
  ]
}
```

**Response for Open-ended Challenge:**
```json
{
  "id": "challenge-2",
  "title": "Algorithm Problem",
  "type": "open-ended",
  "description": "Solve this algorithmic problem...",
  "difficulty": "medium",
  "timeLimit": 30,
  "instructions": "# Two Sum Problem\n\nGiven an array of integers..."
}
```

**Status Codes:**
- `200` - Challenge found
- `404` - Challenge not found
- `403` - Not authorized to access this challenge

---

## 4. Submission Endpoints

### POST /submissions
Submit a challenge answer.

**Request Body for Code Challenge:**
```json
{
  "challengeId": "challenge-1",
  "type": "code", 
  "assessmentId": "assessment-123",
  "candidateName": "John Doe",
  "candidateEmail": "john.doe@example.com",
  "files": {
    "UserList.jsx": "const UserList = ({ users }) => {...}",
    "App.jsx": "import UserList from './UserList';..."
  },
  "language": "javascript",
  "timeSpent": 3600,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Request Body for Multiple Choice Challenge:**
```json
{
  "challengeId": "challenge-3",
  "type": "multiple-choice",
  "assessmentId": "assessment-123", 
  "candidateName": "John Doe",
  "candidateEmail": "john.doe@example.com",
  "answers": {
    "Q1": "B",
    "Q2": "D", 
    "Q3": "D",
    "Q4": "C",
    "Q5": "B"
  },
  "timeSpent": 1200,
  "timestamp": "2024-01-15T10:45:00Z",
  "autoSubmit": false
}
```

**Request Body for Open-ended Challenge:**
```json
{
  "challengeId": "challenge-2",
  "type": "open-ended",
  "assessmentId": "assessment-123",
  "candidateName": "John Doe", 
  "candidateEmail": "john.doe@example.com",
  "answer": "The solution uses a hash map approach...",
  "timeSpent": 1800,
  "timestamp": "2024-01-15T11:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "submission-999",
  "timestamp": "2024-01-15T11:00:00Z",
  "message": "Challenge submitted successfully",
  "score": 80.0,
  "maxScore": 100.0,
  "feedback": "Good work! You got 4 out of 5 questions correct."
}
```

**Status Codes:**
- `201` - Submission created successfully
- `400` - Invalid submission data
- `403` - Not authorized or challenge already submitted
- `404` - Challenge not found
- `409` - Challenge already submitted

### GET /submissions/{submissionId}
Get submission details.

**Response:**
```json
{
  "id": "submission-999",
  "challengeId": "challenge-3", 
  "candidateId": "candidate-456",
  "type": "multiple-choice",
  "status": "submitted",
  "submittedAt": "2024-01-15T11:00:00Z",
  "timeSpent": 1200,
  "score": 80.0,
  "maxScore": 100.0,
  "answers": {
    "Q1": "B",
    "Q2": "D",
    "Q3": "D", 
    "Q4": "C",
    "Q5": "B"
  },
  "results": [
    {
      "questionId": "Q1",
      "selectedAnswer": "B",
      "correctAnswer": "B",
      "isCorrect": true,
      "points": 1
    }
  ]
}
```

**Status Codes:**
- `200` - Submission found
- `404` - Submission not found
- `403` - Not authorized to view this submission

---

## 5. Session Endpoints

### GET /sessions/{sessionId}
Get assessment session progress.

**Response:**
```json
{
  "id": "session-789",
  "assessmentId": "assessment-123",
  "candidateId": "candidate-456", 
  "status": "in_progress",
  "startedAt": "2024-01-15T10:00:00Z",
  "expiresAt": "2024-01-15T12:00:00Z",
  "totalChallenges": 3,
  "completedChallenges": 2,
  "remainingChallenges": 1,
  "completionPercentage": 66.67,
  "currentScore": 85.0,
  "maxScore": 100.0,
  "submissions": [
    {
      "challengeId": "challenge-1",
      "status": "submitted",
      "score": 90.0,
      "submittedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Session found
- `404` - Session not found
- `403` - Not authorized to access this session

### POST /sessions/{sessionId}/submit
Submit final assessment (when all challenges completed).

**Request Body:**
```json
{
  "assessmentId": "assessment-123",
  "candidateName": "John Doe",
  "candidateEmail": "john.doe@example.com",
  "submissions": {
    "challenge-1": {
      "type": "code",
      "files": {...},
      "score": 90.0
    },
    "challenge-2": {
      "type": "open-ended", 
      "answer": "...",
      "score": 85.0
    },
    "challenge-3": {
      "type": "multiple-choice",
      "answers": {...},
      "score": 80.0
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "assessmentId": "assessment-123",
  "candidateId": "candidate-456",
  "sessionId": "session-789",
  "submissionId": "assessment-submission-111",
  "timestamp": "2024-01-15T12:00:00Z",
  "finalScore": 85.0,
  "maxScore": 100.0,
  "isPassed": true,
  "passingScore": 70.0,
  "message": "Assessment submitted successfully"
}
```

**Status Codes:**
- `200` - Assessment submitted successfully
- `400` - Invalid submission data
- `403` - Not authorized or assessment not complete
- `409` - Assessment already submitted

---

## 6. Admin Endpoints

### POST /admin/assessments
Create a new assessment.

**Request Body:**
```json
{
  "title": "Senior Developer Assessment",
  "description": "Advanced assessment for senior developer positions",
  "timeLimit": 180,
  "passingScore": 80.0,
  "instructions": "This assessment contains...",
  "challenges": [
    "challenge-1",
    "challenge-2", 
    "challenge-3"
  ]
}
```

**Response:**
```json
{
  "id": "assessment-456",
  "title": "Senior Developer Assessment",
  "description": "Advanced assessment for senior developer positions",
  "timeLimit": 180,
  "passingScore": 80.0,
  "createdAt": "2024-01-15T09:00:00Z",
  "createdBy": "admin@example.com"
}
```

### POST /admin/challenges
Create a new challenge.

**Request Body for Multiple Choice Challenge:**
```json
{
  "title": "React Hooks Quiz",
  "type": "multiple-choice",
  "description": "Test knowledge of React Hooks",
  "difficulty": "medium",
  "timeLimit": 30,
  "instructions": "Answer the following questions about React Hooks...",
  "questions": [
    {
      "question": "Which hook is used for state management in functional components?",
      "options": [
        {"id": "A", "text": "useEffect"},
        {"id": "B", "text": "useState"},
        {"id": "C", "text": "useContext"},
        {"id": "D", "text": "useReducer"}
      ],
      "correctAnswer": "B",
      "explanation": "useState is the primary hook for state management in functional components.",
      "points": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": "challenge-789",
  "title": "React Hooks Quiz", 
  "type": "multiple-choice",
  "description": "Test knowledge of React Hooks",
  "difficulty": "medium",
  "timeLimit": 30,
  "createdAt": "2024-01-15T09:00:00Z",
  "createdBy": "admin@example.com",
  "totalQuestions": 1
}
```

### GET /admin/submissions
Get all submissions for reporting.

**Query Parameters:**
- `assessmentId` (optional) - Filter by assessment
- `candidateId` (optional) - Filter by candidate
- `status` (optional) - Filter by submission status
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "submission-999",
      "assessmentId": "assessment-123",
      "candidateId": "candidate-456",
      "candidateName": "John Doe",
      "candidateEmail": "john.doe@example.com",
      "challengeId": "challenge-3",
      "challengeTitle": "JavaScript Fundamentals Quiz",
      "type": "multiple-choice",
      "status": "submitted",
      "score": 80.0,
      "maxScore": 100.0,
      "submittedAt": "2024-01-15T11:00:00Z",
      "timeSpent": 1200
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

---

## 7. Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Requested resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `CONFLICT` - Resource already exists or state conflict
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## 8. Rate Limiting

API requests are rate limited per IP address:

- Authentication: 10 requests per minute
- Submissions: 1 request per 10 seconds
- General API: 100 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 9. Webhooks

The system supports webhooks for real-time notifications.

### Webhook Events

- `assessment.submitted` - Assessment submission completed
- `challenge.submitted` - Challenge submission completed
- `session.expired` - Session expired due to timeout

### Webhook Payload Example

```json
{
  "event": "assessment.submitted",
  "timestamp": "2024-01-15T12:00:00Z",
  "data": {
    "assessmentId": "assessment-123",
    "candidateId": "candidate-456",
    "candidateName": "John Doe",
    "candidateEmail": "john.doe@example.com",
    "finalScore": 85.0,
    "isPassed": true
  }
}
```

---

## 10. SDK Examples

### JavaScript/Node.js Example

```javascript
const AssessmentAPI = require('@assessment/api-client');

const client = new AssessmentAPI({
  baseURL: 'https://api.assessment.example.com/v1',
  apiKey: 'your-api-key'
});

// Authenticate candidate
const auth = await client.authenticate({
  name: 'John Doe',
  email: 'john.doe@example.com',
  assessmentId: 'assessment-123'
});

// Submit multiple choice challenge
const submission = await client.submitChallenge({
  challengeId: 'challenge-3',
  type: 'multiple-choice',
  answers: {
    'Q1': 'B',
    'Q2': 'D'
  }
});
```

### cURL Examples

```bash
# Authenticate candidate
curl -X POST https://api.assessment.example.com/v1/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "assessmentId": "assessment-123"
  }'

# Submit multiple choice answers
curl -X POST https://api.assessment.example.com/v1/submissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "challenge-3",
    "type": "multiple-choice",
    "answers": {
      "Q1": "B",
      "Q2": "D",
      "Q3": "D"
    }
  }'
```

This API contract provides comprehensive coverage for all challenge types including the new multiple choice functionality, with proper authentication, validation, and error handling.
