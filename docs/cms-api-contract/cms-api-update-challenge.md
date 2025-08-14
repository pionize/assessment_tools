# CMS API - Update Challenge

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/challenges/{id}`

## Request

- Method: `POST`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Challenge ID |

## Request Body Examples

### Code Challenge Update
```json
{
  "title": "Advanced React Component Implementation",
  "description": "Updated: Create a reusable React component with hooks and context integration.",
  "difficulty": "hard",
  "status": "active",
  "time_limit": 60,
  "points": 120,
  "tags": ["react", "hooks", "context", "advanced"],
  "instructions": "Updated instructions: Implement a UserProfile component with React hooks and context for state management.",
  "starter_code": {
    "App.tsx": "import React from 'react';\nimport { UserProvider } from './UserContext';\n\n// TODO: Implement UserProfile component with hooks\n\nfunction App() {\n  return (\n    <UserProvider>\n      <div className=\"App\">\n        <h1>Advanced User Profile Demo</h1>\n        {/* Use your UserProfile component here */}\n      </div>\n    </UserProvider>\n  );\n}\n\nexport default App;",
    "UserContext.tsx": "import React, { createContext, useContext, useState } from 'react';\nimport { User } from './types';\n\n// TODO: Implement UserContext\n",
    "types.ts": "export interface User {\n  id: string;\n  name: string;\n  email: string;\n  avatar?: string;\n  preferences?: UserPreferences;\n}\n\nexport interface UserPreferences {\n  theme: 'light' | 'dark';\n  notifications: boolean;\n}\n"
  },
  "solution_code": {
    "UserProfile.tsx": "// Updated solution with hooks and context",
    "UserContext.tsx": "// Context implementation"
  },
  "test_cases": [
    {
      "name": "uses context correctly",
      "input": {"user": {"id": "1", "name": "John Doe"}},
      "expected": "component reads from UserContext",
      "points": 30
    },
    {
      "name": "handles state updates",
      "input": {"preferences": {"theme": "dark"}},
      "expected": "context state updates properly",
      "points": 30
    }
  ],
  "evaluation_criteria": [
    {
      "criterion": "React Hooks Usage",
      "points": 30,
      "description": "Proper use of useState, useEffect, and useContext hooks"
    },
    {
      "criterion": "Context Implementation",
      "points": 30,
      "description": "Correct context provider and consumer implementation"
    },
    {
      "criterion": "TypeScript Integration",
      "points": 30,
      "description": "Strong typing for context and component props"
    },
    {
      "criterion": "Performance Optimization",
      "points": 30,
      "description": "Proper memoization and optimization techniques"
    }
  ]
}
```

### Multiple Choice Challenge Update
```json
{
  "title": "Advanced JavaScript Concepts",
  "description": "Updated: Test your knowledge of advanced JavaScript features and patterns.",
  "difficulty": "medium",
  "time_limit": 30,
  "points": 75,
  "tags": ["javascript", "advanced", "es2020", "patterns"],
  "instructions": "Updated instructions: Choose the best answer. Some questions may have multiple correct approaches.",
  "questions": [
    {
      "id": "q1",
      "question": "What is the output of `console.log(typeof null)` in JavaScript?",
      "options": [
        {"id": "a", "text": "null"},
        {"id": "b", "text": "object"},
        {"id": "c", "text": "undefined"},
        {"id": "d", "text": "boolean"}
      ],
      "correct_answer": "b",
      "explanation": "In JavaScript, `typeof null` returns 'object' due to a legacy bug in the language specification.",
      "points": 15
    },
    {
      "id": "q2",
      "question": "Which of the following is the best way to handle asynchronous operations in modern JavaScript?",
      "options": [
        {"id": "a", "text": "Callbacks only"},
        {"id": "b", "text": "Promises with .then()"},
        {"id": "c", "text": "async/await"},
        {"id": "d", "text": "setTimeout"}
      ],
      "correct_answer": "c",
      "explanation": "async/await provides the most readable and maintainable way to handle asynchronous operations.",
      "points": 15
    },
    {
      "id": "q3",
      "question": "What does the ?? operator do in JavaScript?",
      "options": [
        {"id": "a", "text": "Logical OR"},
        {"id": "b", "text": "Nullish coalescing"},
        {"id": "c", "text": "Strict equality"},
        {"id": "d", "text": "Type conversion"}
      ],
      "correct_answer": "b",
      "explanation": "The ?? operator is the nullish coalescing operator, returning the right side when the left side is null or undefined.",
      "points": 15
    }
  ]
}
```

### Open-Ended Challenge Update
```json
{
  "title": "Advanced System Architecture Design",
  "description": "Updated: Design a highly scalable and resilient architecture for a global social media platform.",
  "difficulty": "hard",
  "time_limit": 45,
  "points": 100,
  "tags": ["architecture", "microservices", "scalability", "resilience", "global"],
  "instructions": "Updated: Provide a comprehensive architecture design with focus on global scale and fault tolerance.",
  "prompt": "Updated prompt: You are the principal architect for a global social media platform that needs to handle 1 billion+ users across multiple continents. Design a system that supports:\n\n- Multi-region deployment with data locality\n- Real-time features (messaging, live streaming)\n- Content recommendation engine\n- Advanced analytics and ML pipelines\n- Disaster recovery and fault tolerance\n\nAddress:\n1. Global architecture and data distribution\n2. Microservices design and communication\n3. Data consistency and CAP theorem considerations\n4. Performance optimization at scale\n5. Security and compliance across regions\n6. Cost optimization strategies",
  "evaluation_criteria": [
    {
      "criterion": "Global Architecture Design",
      "points": 20,
      "description": "Multi-region deployment strategy with proper data locality"
    },
    {
      "criterion": "Microservices Architecture",
      "points": 20,
      "description": "Well-designed service boundaries and communication patterns"
    },
    {
      "criterion": "Data Consistency Strategy",
      "points": 20,
      "description": "Proper handling of distributed data and consistency models"
    },
    {
      "criterion": "Performance & Scalability",
      "points": 20,
      "description": "Comprehensive scaling strategies and performance optimization"
    },
    {
      "criterion": "Security & Compliance",
      "points": 20,
      "description": "Security measures and regulatory compliance considerations"
    }
  ],
  "sample_answer": "Updated comprehensive architectural solution focusing on global scale...",
  "word_limit": 1500
}
```

## Request Body Schema

All fields are optional for updates. Only include fields you want to change.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Challenge title (max 200 chars) |
| `description` | string | Challenge description (max 1000 chars) |
| `difficulty` | string | Difficulty: `easy`, `medium`, `hard` |
| `status` | string | Status: `active`, `inactive`, `draft`, `archived` |
| `time_limit` | integer | Time limit in minutes |
| `points` | integer | Points awarded |
| `language` | string | Programming language (for code challenges) |
| `tags` | array | Array of tags |
| `instructions` | string | Instructions for candidates |

## Response Example

### 200 OK
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Challenge updated successfully"
  },
  "response_output": {
    "detail": {
      "id": "challenge-001",
      "type": "code",
      "title": "Advanced React Component Implementation",
      "description": "Updated: Create a reusable React component with hooks and context integration.",
      "difficulty": "hard",
      "status": "active",
      "time_limit": 60,
      "points": 120,
      "language": "javascript",
      "tags": ["react", "hooks", "context", "advanced"],
      "usage_count": 15,
      "average_score": 7.8,
      "pass_rate": 73.3,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-22T16:45:00Z",
      "created_by": "admin@company.com",
      "updated_by": "admin@company.com",
      "change_summary": {
        "modified_fields": ["title", "description", "difficulty", "time_limit", "points", "tags", "starter_code", "test_cases"],
        "impact_analysis": {
          "active_assessments": 3,
          "pending_submissions": 2,
          "requires_notification": true
        }
      }
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
    "response_message": "Insufficient permissions to update challenges"
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
    "response_message": "Cannot update challenge - has active submissions"
  },
  "response_output": {
    "detail": {
      "challenge_id": "challenge-001",
      "active_submissions": 5,
      "pending_assessments": 2,
      "suggestion": "Consider creating a new version instead of updating"
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

- **Version Control**: Updates create a new version while preserving the original
- **Impact Analysis**: Shows which assessments and submissions will be affected
- **Validation**: Different validation rules apply based on challenge type
- **Change Tracking**: All modifications are logged with timestamps and user info
- **Notification System**: Admin users can be notified of significant changes