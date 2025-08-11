# Get Challenge Detail API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/challenges/[challengeID]`

## Request

- Method: `GET`
- Header:
  - `Authorization: Bearer <jwt, from authenticate API>`

## Response Example (Multiple Choice)
```json
{
  "response_schema": {
    "response_code": "CODE-0000",
    "response_message": "Success"
  },
  "response_output": {
    "detail": {
      "id": "challenge-3",
      "title": "JavaScript Fundamentals Quiz",
      "type": "multiple-choice",
      "description": "Test your knowledge of JavaScript fundamentals and modern ES6+ features.",
      "instructions": "Answer the following multiple-choice questions about JavaScript. Each question has only one correct answer.",
      "time_limit": 25,
      "questions": [
        {
          "id": 1,
          "question": "What is the output of the following code?\n\n```javascript\nconsole.log(typeof null);\n```",
          "options": [
            { "id": "A", "text": "\"null\"" },
            { "id": "B", "text": "\"object\"" },
            { "id": "C", "text": "\"undefined\"" },
            { "id": "D", "text": "\"boolean\"" }
          ],
          "explanation": "In JavaScript, `typeof null` returns \"object\"..."
        }
      ]
    }
  }
}
