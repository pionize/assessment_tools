# CMS API - Create Challenge

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/challenges`

## Request

- Method: `POST`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Request Body Examples

### Code Challenge
```json
{
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
    },
    {
      "name": "handles missing avatar gracefully",
      "input": {"user": {"id": "1", "name": "Jane Doe", "email": "jane@example.com"}},
      "expected": "displays default avatar",
      "points": 25
    }
  ],
  "evaluation_criteria": [
    {
      "criterion": "Correct TypeScript types",
      "points": 25,
      "description": "Uses proper TypeScript interfaces and types"
    },
    {
      "criterion": "Error handling",
      "points": 25,
      "description": "Handles missing or invalid props gracefully"
    }
  ]
}
```

### Multiple Choice Challenge
```json
{
  "type": "multiple-choice",
  "title": "JavaScript Fundamentals",
  "description": "Test your knowledge of JavaScript core concepts and ES6+ features.",
  "difficulty": "easy",
  "status": "active",
  "time_limit": 20,
  "points": 50,
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
    },
    {
      "id": "q2",
      "question": "Which method is used to add one or more elements to the end of an array?",
      "options": [
        {"id": "a", "text": "push()"},
        {"id": "b", "text": "pop()"},
        {"id": "c", "text": "shift()"},
        {"id": "d", "text": "unshift()"}
      ],
      "correct_answer": "a",
      "explanation": "The push() method adds elements to the end of an array and returns the new length.",
      "points": 10
    }
  ]
}
```

### Open-Ended Challenge
```json
{
  "type": "open-ended",
  "title": "System Architecture Design",
  "description": "Design a scalable architecture for a social media application with millions of users.",
  "difficulty": "hard",
  "status": "active",
  "time_limit": 30,
  "points": 75,
  "tags": ["architecture", "system-design", "scalability"],
  "instructions": "Provide a detailed explanation of your system architecture. Include diagrams if helpful. Address scalability, reliability, and performance considerations.",
  "prompt": "You are tasked with designing the architecture for a new social media platform that expects to handle millions of users. The platform should support:\n\n- User profiles and authentication\n- Posts with text, images, and videos\n- Real-time messaging\n- News feed with personalized content\n- Notifications\n\nDescribe your architecture approach, including:\n1. Database design and data storage strategy\n2. API design and microservices architecture\n3. Caching strategy\n4. Content delivery and media handling\n5. Scalability and reliability measures",
  "evaluation_criteria": [
    {
      "criterion": "Database Design",
      "points": 15,
      "description": "Clear database schema design with proper normalization and relationships"
    },
    {
      "criterion": "Microservices Architecture",
      "points": 15,
      "description": "Well-defined service boundaries and communication patterns"
    },
    {
      "criterion": "Scalability Solutions",
      "points": 15,
      "description": "Proper use of load balancing, caching, and horizontal scaling"
    },
    {
      "criterion": "Performance Optimization",
      "points": 15,
      "description": "CDN usage, database optimization, and caching strategies"
    },
    {
      "criterion": "Reliability and Monitoring",
      "points": 15,
      "description": "Error handling, monitoring, and disaster recovery planning"
    }
  ],
  "sample_answer": "A comprehensive architectural solution would include:\n\n1. **Database**: Use a combination of PostgreSQL for user data and relationships, Redis for caching and sessions, and MongoDB for posts and media metadata...",
  "word_limit": 1000
}
```

## Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Challenge type: `code`, `multiple-choice`, `open-ended` |
| `title` | string | Yes | Challenge title (max 200 chars) |
| `description` | string | Yes | Challenge description (max 1000 chars) |
| `difficulty` | string | Yes | Difficulty level: `easy`, `medium`, `hard` |
| `status` | string | No | Status: `active`, `inactive`, `draft` (default: `draft`) |
| `time_limit` | integer | Yes | Time limit in minutes |
| `points` | integer | Yes | Points awarded for completion |
| `language` | string | No | Programming language (required for code challenges) |
| `tags` | array | No | Array of tags for categorization |
| `instructions` | string | Yes | Instructions for candidates |

### Additional Fields by Type

**Code Challenges:**
- `starter_code` (object): Initial code files
- `solution_code` (object): Reference solution
- `test_cases` (array): Test cases for validation
- `evaluation_criteria` (array): Grading criteria

**Multiple Choice:**
- `questions` (array): Array of questions with options
- Each question requires: `question`, `options`, `correct_answer`, `points`

**Open-Ended:**
- `prompt` (string): Detailed question prompt
- `evaluation_criteria` (array): Grading rubric
- `sample_answer` (string): Reference answer
- `word_limit` (integer): Maximum word count

## Response Example

### 201 Created
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Challenge created successfully"
  },
  "response_output": {
    "detail": {
      "id": "challenge-123",
      "type": "code",
      "title": "React Component Implementation",
      "description": "Create a reusable React component for displaying user profiles with proper state management and props validation.",
      "difficulty": "medium",
      "status": "active",
      "time_limit": 45,
      "points": 100,
      "language": "javascript",
      "tags": ["react", "frontend", "components"],
      "instructions": "Implement a UserProfile component...",
      "usage_count": 0,
      "average_score": 0.0,
      "pass_rate": 0.0,
      "created_at": "2024-01-22T10:30:00Z",
      "updated_at": "2024-01-22T10:30:00Z",
      "created_by": "admin@company.com"
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
        "field": "type",
        "message": "Challenge type is required"
      },
      {
        "field": "language",
        "message": "Language is required for code challenges"
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

### 500 Internal Server Error
```json
{
  "response_schema": {
    "response_code": "CODE-5000",
    "response_message": "Internal server error occurred"
  }
}
```