# Submit Challenge API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/challenges/submissions`

## Request

- Method: `POST`
- Header:
  - `Authorization: Bearer <jwt, from authenticate API>`
  - `Content-Type: application/json`

### Body Example (Multiple Choice)
```json
{
  "challenge_id": "challenge-3",
  "times_spent_in_seconds": 12300,
  "multiple_choice_answers": [
    { "question_id": 1, "option_id": "B" },
    { "question_id": 2, "option_id": "A" }
  ]
}
