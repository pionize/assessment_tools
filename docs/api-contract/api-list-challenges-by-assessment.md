# List Challenges By Assessment API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/assessments/[assessmentID]/challenges`

## Request

- Method: `GET`
- Header:
  - `Authorization: Bearer <jwt, from authenticate API>`

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
        "id": "challenge-1",
        "title": "React Component Implementation",
        "type": "code",
        "description": "Create a reusable React component that displays a list of users with search functionality.",
        "time_limit": 60
      },
      {
        "id": "challenge-2",
        "title": "Algorithm Problem",
        "type": "open-ended",
        "description": "Solve this algorithmic problem and explain your approach.",
        "time_limit": 30
      },
      {
        "id": "challenge-3",
        "title": "JavaScript Fundamentals Quiz",
        "type": "multiple-choice",
        "description": "Test your knowledge of JavaScript fundamentals and modern ES6+ features.",
        "time_limit": 25
      }
    ]
  }
}
