# TASK-BE-002: Code Challenge CRUD Service (Backend)

**Story**: Story-002 Challenge CRUD - Code Type
**Estimasi**: 5 hari

## Dependencies
- File storage service untuk code files
- Code execution service untuk test validation
- Database schema untuk challenges table

## Acceptance Criteria Backend

### Core CRUD Operations
- **POST /admin/challenges/code** untuk create code challenge
- **GET /admin/challenges/code/:id** dengan detail
- **PUT /admin/challenges/code/:id** untuk updates
- **DELETE /admin/challenges/code/:id** dengan soft delete
- **POST /admin/challenges/code/:id/duplicate** untuk cloning

### Code-Specific Features
- **File template management** dengan version control
- **POST /admin/challenges/code/:id/test** untuk test execution
- **POST /admin/challenges/code/:id/preview** untuk candidate view
- **Language support**: JavaScript, TypeScript, Python, Java, Go, Rust, C++
- **Security validation** untuk code content
- **Performance monitoring** untuk test execution

### Response Format Compliance
- **Files format** sesuai Postman: `{fileName: {content, language}}`
- **Test cases format**: `test_cases` dengan snake_case
- **Response wrapper**: `response_schema` + `response_output.detail`

## Database Schema

```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type = 'code'),
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER NOT NULL CHECK (time_limit > 0),
  points INTEGER NOT NULL CHECK (points > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE code_challenges (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  language VARCHAR(20) NOT NULL,
  files JSONB NOT NULL,
  test_cases JSONB DEFAULT '[]',
  execution_config JSONB DEFAULT '{}'
);
```

## Security Configuration

```typescript
interface ExecutionEnvironment {
  language: string;
  timeoutSeconds: number;
  memoryLimitMB: number;
  allowedModules: string[];
  blockedFunctions: string[];
}

const securityConfigs = {
  javascript: {
    timeoutSeconds: 30,
    memoryLimitMB: 128,
    blockedFunctions: ['eval', 'Function', 'require']
  },
  python: {
    timeoutSeconds: 30,
    memoryLimitMB: 256,
    blockedFunctions: ['exec', 'eval', '__import__']
  }
};
```

## Testing Requirements
- Unit tests untuk challenge CRUD
- File validation tests
- Test case execution tests
- Security validation tests
- Performance tests untuk large files
