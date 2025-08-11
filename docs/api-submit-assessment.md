# Submit Assessment API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/assessments/submissions`

## Request

- Method: `POST`
- Header:
  - `Authorization: Bearer <jwt, from authenticate API>`
  - `Content-Type: application/json`

### Body Example
```json
{
  "assessment_id": "assessment-123"
}
