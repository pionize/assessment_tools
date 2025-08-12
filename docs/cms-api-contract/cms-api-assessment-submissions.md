# CMS API - Assessment Submissions

- Base URL from env: `CMS_API_BASE_URL`
- Path: `/cms/assessments/{assessmentId}/submissions`

## Request

- Method: `GET`
- Header:
  - `Authorization: Bearer <admin_jwt_token>`
  - `Content-Type: application/json`

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assessmentId` | string | Yes | Assessment ID |

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20) |
| `status` | string | No | Filter by status: `completed`, `partial`, `timeout` |
| `sort` | string | No | Sort by: `submitted_at`, `score`, `completion_time`, `ai_likelihood` (default: `submitted_at`) |
| `order` | string | No | Sort order: `asc`, `desc` (default: `desc`) |
| `min_score` | number | No | Filter by minimum score |
| `max_score` | number | No | Filter by maximum score |
| `ai_threshold` | number | No | Filter by AI likelihood threshold (0-100) |

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
        "submission_id": "sub-789",
        "candidate": {
          "id": "candidate-456",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "submitted_at": "2024-01-16T14:30:00Z"
        },
        "assessment": {
          "id": "assessment-123",
          "title": "Full Stack Developer Assessment"
        },
        "summary": {
          "status": "completed",
          "total_score": 85.5,
          "max_possible_score": 100,
          "percentage_score": 85.5,
          "completion_time": 156,
          "time_limit": 180,
          "passed": true,
          "ai_likelihood": 15.2,
          "submitted_at": "2024-01-16T14:30:00Z"
        },
        "challenge_submissions": [
          {
            "challenge_id": "challenge-1",
            "challenge_title": "React Component Implementation",
            "type": "code",
            "status": "completed",
            "score": 22.5,
            "max_score": 25,
            "time_spent": 55,
            "time_limit": 60,
            "ai_likelihood": 8.5,
            "submission_data": {
              "type": "code",
              "language": "javascript",
              "files": {
                "src/components/UserList.jsx": "import React, { useState, useEffect } from 'react';\n\nconst UserList = ({ users }) => {\n  const [searchTerm, setSearchTerm] = useState('');\n  const [filteredUsers, setFilteredUsers] = useState(users);\n\n  useEffect(() => {\n    if (searchTerm.trim()) {\n      const filtered = users.filter(user => \n        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||\n        user.email.toLowerCase().includes(searchTerm.toLowerCase())\n      );\n      setFilteredUsers(filtered);\n    } else {\n      setFilteredUsers(users);\n    }\n  }, [searchTerm, users]);\n\n  return (\n    <div className=\"user-list\">\n      <h2>User List</h2>\n      <input\n        type=\"text\"\n        placeholder=\"Search users...\"\n        value={searchTerm}\n        onChange={(e) => setSearchTerm(e.target.value)}\n      />\n      <div className=\"users-grid\">\n        {filteredUsers.map(user => (\n          <div key={user.id} className=\"user-card\">\n            <h3>{user.name}</h3>\n            <p>{user.email}</p>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n};\n\nexport default UserList;",
                "src/tests/UserList.test.jsx": "import React from 'react';\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport UserList from '../components/UserList';\n\ndescribe('UserList Component', () => {\n  const mockUsers = [\n    { id: 1, name: 'John Doe', email: 'john@example.com' },\n    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }\n  ];\n\n  test('renders user list', () => {\n    render(<UserList users={mockUsers} />);\n    expect(screen.getByText('User List')).toBeInTheDocument();\n  });\n\n  test('filters users by search term', () => {\n    render(<UserList users={mockUsers} />);\n    const searchInput = screen.getByPlaceholderText('Search users...');\n    fireEvent.change(searchInput, { target: { value: 'John' } });\n    expect(screen.getByText('John Doe')).toBeInTheDocument();\n  });\n});",
                "README.md": "# User List Component\n\nReusable React component for displaying and searching users.\n\n## Features\n- Display list of users\n- Search functionality\n- Responsive design\n\n## Usage\n```jsx\n<UserList users={userArray} />\n```"
              }
            },
            "feedback": "Well-structured React component with good practices. Shows clean component structure and good use of React hooks with proper error handling. Minor improvements needed: could optimize search performance and missing propTypes validation for production readiness."
          },
          {
            "challenge_id": "challenge-2",
            "challenge_title": "Algorithm Problem",
            "type": "open-ended",
            "status": "completed",
            "score": 18.0,
            "max_score": 20,
            "time_spent": 28,
            "time_limit": 30,
            "ai_likelihood": 25.8,
            "submission_data": {
              "type": "open-ended",
              "answer": "To solve the maximum subarray problem, I'll use Kadane's algorithm:\n\n```python\ndef maxSubArray(nums):\n    max_sum = nums[0]\n    current_sum = nums[0]\n    \n    for i in range(1, len(nums)):\n        current_sum = max(nums[i], current_sum + nums[i])\n        max_sum = max(max_sum, current_sum)\n    \n    return max_sum\n```\n\n**Explanation:**\nKadane's algorithm is an efficient dynamic programming approach that solves the maximum subarray problem in linear time. The key insight is to maintain two variables:\n- `current_sum`: maximum sum ending at the current position\n- `max_sum`: maximum sum found so far\n\n**Time Complexity:** O(n) - single pass through the array\n**Space Complexity:** O(1) - only using constant extra space\n\n**Example walkthrough:**\nFor array [-2, 1, -3, 4, -1, 2, 1, -5, 4]:\n- At index 0: current_sum = -2, max_sum = -2\n- At index 1: current_sum = max(1, -2+1) = 1, max_sum = 1\n- At index 3: current_sum = max(4, -3+4) = 4, max_sum = 4\n- Continue until we find max_sum = 6 (subarray [4,-1,2,1])\n\nThis algorithm handles negative numbers correctly and finds the optimal contiguous subarray efficiently."
            },
            "feedback": "Excellent understanding of dynamic programming concepts and algorithm optimization. Shows correct algorithm selection, clear explanation, and proper complexity analysis. Could be improved with edge case handling and example walkthrough."
          },
          {
            "challenge_id": "challenge-3",
            "challenge_title": "JavaScript Fundamentals Quiz",
            "type": "multiple-choice",
            "status": "completed",
            "score": 13.0,
            "max_score": 15,
            "time_spent": 18,
            "time_limit": 25,
            "ai_likelihood": 12.1,
            "submission_data": {
              "type": "multiple-choice",
              "answers": {
                "q1": "B",
                "q2": "A", 
                "q3": "D",
                "q4": "C",
                "q5": "B",
                "q6": "A",
                "q7": "B",
                "q8": "D",
                "q9": "C",
                "q10": "A"
              }
            },
            "results": {
              "correct_answers": 9,
              "total_questions": 10,
              "accuracy": 90.0,
              "incorrect_questions": ["q7"]
            }
          }
        ],
        "ai_detection": {
          "overall_likelihood": 15.2,
          "analysis": {
            "code_style_patterns": 8.5,
            "response_timing": 12.3,
            "complexity_vs_time": 18.7,
            "language_patterns": 6.2
          },
          "risk_level": "low",
          "confidence": 0.82
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 25,
      "items_per_page": 20,
      "has_next": true,
      "has_previous": false
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