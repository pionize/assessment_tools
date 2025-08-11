# Authenticate API

- Base URL from env: `VITE_API_BASE_URL`
- Path: `/assessments/[assessmentID]`

## Request

- Method: `GET`
- Header: Authentication: Bearer <jwt, from authenticate API>  

## Response Example

```
{
    "response_schema": {
        "response_code": "CODE-0000",
        "response_message": "Success"
    },
    "response_output": {
        "detail": {
            "id": "assessment-123",
            "title": "Frontend Developer Assessment",
            "description": "Complete assessment for frontend developer position"
        }
    }
}
```