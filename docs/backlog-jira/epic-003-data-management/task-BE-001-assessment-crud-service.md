# TASK-BE-001: Assessment CRUD Service (Backend)

**Story**: Story-001 Assessment CRUD + Lifecycle
**Estimasi**: 4 hari

## Dependencies
- Authentication & RBAC system completed
- Database schema untuk assessments table
- Audit logging infrastructure

## Acceptance Criteria Backend

### Core CRUD Operations
- **GET /admin/assessments** dengan pagination, filtering, sorting
- **POST /admin/assessments** dengan validation
- **GET /admin/assessments/:id** dengan detail
- **PUT /admin/assessments/:id** dengan partial updates
- **PUT /admin/assessments/:id/status** untuk lifecycle management
- **DELETE /admin/assessments/:id** dengan soft delete

### Response Format Compliance
- **Postman format**: `response_schema` + `response_output`
- **Snake case fields**: `time_limit`, `pass_threshold`, etc.
- **List format**: `response_output.list.content` untuk pagination
- **Detail format**: `response_output.detail` untuk single item
- **Error format**: `response_schema` dengan `CODE-xxxx`

### Business Logic
- **Status lifecycle**: draft → active → archived
- **Title uniqueness** per organization
- **Archive constraints**: no active sessions
- **Activation rules**: must have challenges
- **Audit trail** untuk semua changes

## Database Schema

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  time_limit INTEGER NOT NULL CHECK (time_limit > 0 AND time_limit <= 480),
  pass_threshold INTEGER NOT NULL CHECK (pass_threshold >= 0 AND pass_threshold <= 100),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  organization_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  archived_at TIMESTAMP,

  UNIQUE(title, organization_id, status)
);

CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_org ON assessments(organization_id);
CREATE INDEX idx_assessments_search ON assessments USING gin(to_tsvector('english', title || ' ' || description));
```

## Testing Requirements
- Unit tests untuk business logic
- Integration tests untuk API endpoints
- Status transition validation tests
- Database constraint tests
