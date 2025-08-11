# Authenticate API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/assessments/authenticate`

## Request

- Method: `POST`
- Body: JSON (shape TBD by caller)

## Response Example

```
{
  "response_schema": {"response_code": "CODE-0000", "response_message": "Success"},
  "response_detail": {
    "detail": {
      "success": true,
      "candidate_id": "candidate-1754639355070",
      "name": "John Doe",
      "email": "john@example.com",
      "assessment_id": "assessment-123",
      "start_at": "2025-08-08T07:49:15.072113600Z",
      "time_limit_minutes": 120,
      "token": "<jwt>"
    }
  }
}
```

## Usage

```ts
import { apiService } from "src/services/api";

const auth = await apiService.authenticate(
  "John Doe",
  "john@example.com",
  "assessment-123",
);
// auth.token
```
