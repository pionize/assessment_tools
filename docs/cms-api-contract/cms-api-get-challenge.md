# CMS API - Get Challenge Detail

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/challenges/{id}`

## Request

- Method: `GET`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Challenge ID |

## Response Examples

### Code Challenge
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-001",
      "type": "code",
      "title": "React Component Implementation",
      "description": "Create a reusable React component for displaying user profiles with proper state management and props validation.",
      "difficulty": "medium",
      "status": "active",
      "time_limit": 45,
      "points": 100,
      "language": "javascript",
      "tags": ["react", "frontend", "components"],
      "instructions": "Implement a UserProfile component that accepts user data as props and displays it in a formatted layout. Include proper TypeScript types and error handling.",
      "starter_code": {
        "App.tsx": "import React from 'react';\n\n// TODO: Implement UserProfile component\n\nfunction App() {\n  return (\n    <div className=\"App\">\n      <h1>User Profile Demo</h1>\n      {/* Use your UserProfile component here */}\n    </div>\n  );\n}\n\nexport default App;",
        "types.ts": "export interface User {\n  id: string;\n  name: string;\n  email: string;\n  avatar?: string;\n}\n"
      },
      "solution_code": {
        "UserProfile.tsx": "import React from 'react';\nimport { User } from './types';\n\ninterface UserProfileProps {\n  user: User;\n  showEmail?: boolean;\n}\n\nconst UserProfile: React.FC<UserProfileProps> = ({ user, showEmail = true }) => {\n  return (\n    <div className=\"user-profile\">\n      <img src={user.avatar || '/default-avatar.png'} alt={user.name} />\n      <h2>{user.name}</h2>\n      {showEmail && <p>{user.email}</p>}\n    </div>\n  );\n};\n\nexport default UserProfile;"
      },
      "test_cases": [
        {
          "name": "renders user name correctly",
          "input": {"user": {"id": "1", "name": "John Doe", "email": "john@example.com"}},
          "expected": "component displays 'John Doe'",
          "points": 25
        }
      ],
      "evaluation_criteria": [
        {
          "criterion": "Correct TypeScript types",
          "points": 25,
          "description": "Uses proper TypeScript interfaces and types"
        }
      ],
      "usage_count": 15,
      "average_score": 7.8,
      "pass_rate": 73.3,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z",
      "created_by": "admin@company.com",
      "statistics": {
        "total_submissions": 45,
        "passed_submissions": 33,
        "failed_submissions": 12,
        "average_completion_time": 38.5,
        "common_mistakes": [
          "Missing TypeScript types",
          "No error handling for missing props"
        ]
      }
    }
  }
}
```

### Multiple Choice Challenge
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-002",
      "type": "multiple-choice",
      "title": "JavaScript Fundamentals",
      "description": "Test your knowledge of JavaScript core concepts and ES6+ features.",
      "difficulty": "easy",
      "status": "active",
      "time_limit": 20,
      "points": 50,
      "language": null,
      "tags": ["javascript", "fundamentals", "es6"],
      "instructions": "Choose the best answer for each question. Only one answer per question is correct.",
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
          "points": 10
        }
      ],
      "usage_count": 28,
      "average_score": 8.2,
      "pass_rate": 85.7,
      "created_at": "2024-01-10T09:15:00Z",
      "updated_at": "2024-01-18T16:20:00Z",
      "created_by": "hr@company.com",
      "statistics": {
        "total_submissions": 65,
        "question_statistics": [
          {
            "question_id": "q1",
            "correct_answers": 55,
            "incorrect_answers": 10,
            "success_rate": 84.6,
            "most_common_wrong_answer": "a"
          }
        ]
      }
    }
  }
}
```

### Open-Ended Challenge
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-003",
      "type": "open-ended",
      "title": "System Architecture Design",
      "description": "Design a scalable architecture for a social media application with millions of users.",
      "difficulty": "hard",
      "status": "active",
      "time_limit": 30,
      "points": 75,
      "language": null,
      "tags": ["architecture", "system-design", "scalability"],
      "instructions": "Provide a detailed explanation of your system architecture. Include diagrams if helpful.",
      "prompt": "You are tasked with designing the architecture for a new social media platform...",
      "evaluation_criteria": [
        {
          "criterion": "Database Design",
          "points": 15,
          "description": "Clear database schema design with proper normalization"
        }
      ],
      "sample_answer": "A comprehensive architectural solution would include...",
      "word_limit": 1000,
      "usage_count": 8,
      "average_score": 6.5,
      "pass_rate": 62.5,
      "created_at": "2024-01-12T11:20:00Z",
      "updated_at": "2024-01-19T13:30:00Z",
      "created_by": "tech-lead@company.com",
      "statistics": {
        "total_submissions": 16,
        "average_word_count": 847,
        "criteria_performance": [
          {
            "criterion": "Database Design",
            "average_score": 12.3,
            "max_points": 15
          }
        ]
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
    "response_message": "Insufficient permissions to access challenge details"
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

- **Statistics**: Included performance metrics and common patterns from submissions
- **Solution Visibility**: Full solution code is only visible to admin users
- **Question Analysis**: For multiple-choice, includes answer distribution and success rates
- **Performance Tracking**: Average completion times and common mistakes are tracked