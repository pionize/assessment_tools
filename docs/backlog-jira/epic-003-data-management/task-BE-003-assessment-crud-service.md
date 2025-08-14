# TASK-BE-003: Assessment CRUD Service (Backend)

## Deskripsi
Implementasi comprehensive backend service untuk mengelola assessment lifecycle dengan validation, status management, dan relationship handling.

## Estimasi
**6 hari**

## Dependencies
- Authentication & RBAC system completed
- Database schema untuk assessments dan related tables
- File storage service untuk attachment handling

## Acceptance Criteria Backend

### Core CRUD Operations
- ✅ **GET /admin/assessments** dengan pagination, filtering, sorting
- ✅ **POST /admin/assessments** dengan comprehensive validation
- ✅ **GET /admin/assessments/:id** dengan detailed information
- ✅ **PUT /admin/assessments/:id** dengan partial updates
- ✅ **PUT /admin/assessments/:id/status** untuk lifecycle management
- ✅ **DELETE /admin/assessments/:id** dengan soft delete
- ✅ Assessment duplication dengan modification capabilities

### Business Logic & Validation
- ✅ **Status lifecycle validation** (draft → active → archived)
- ✅ **Title uniqueness** enforcement per organization
- ✅ **Assessment activation rules** (must have challenges)
- ✅ **Archive constraints** (no active candidate sessions)
- ✅ **Permission-based access control** integration
- ✅ **Audit trail** untuk semua modifications

### Advanced Features
- ✅ **Assessment statistics** calculation dan caching
- ✅ **Challenge relationship** management
- ✅ **Bulk operations** untuk multiple assessments
- ✅ **Search functionality** dengan full-text search
- ✅ **Assessment templates** untuk quick creation
- ✅ **Version control** untuk published assessments

## Database Schema

```sql
-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  time_limit INTEGER NOT NULL CHECK (time_limit > 0 AND time_limit <= 480),
  pass_threshold INTEGER NOT NULL CHECK (pass_threshold >= 0 AND pass_threshold <= 100),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  version INTEGER DEFAULT 1,
  template_id UUID REFERENCES assessments(id),
  organization_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  archived_at TIMESTAMP,
  
  UNIQUE(title, organization_id, status) -- Title unique per org for active assessments
);

-- Assessment-Challenge linking table
CREATE TABLE assessment_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  order_position INTEGER NOT NULL,
  points_override INTEGER,
  time_limit_override INTEGER,
  required BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(assessment_id, challenge_id),
  UNIQUE(assessment_id, order_position)
);

-- Assessment statistics cache
CREATE TABLE assessment_stats (
  assessment_id UUID PRIMARY KEY REFERENCES assessments(id) ON DELETE CASCADE,
  challenge_count INTEGER DEFAULT 0,
  candidate_count INTEGER DEFAULT 0,
  submission_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  completion_rate DECIMAL(5,2),
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Assessment audit log
CREATE TABLE assessment_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID NOT NULL REFERENCES admin_users(id),
  performed_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_org ON assessments(organization_id);
CREATE INDEX idx_assessments_created_by ON assessments(created_by);
CREATE INDEX idx_assessments_title_search ON assessments USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_assessment_challenges_assessment ON assessment_challenges(assessment_id);
CREATE INDEX idx_assessment_challenges_order ON assessment_challenges(assessment_id, order_position);
```

## API Implementation Details

### Search & Filtering
```typescript
interface AssessmentSearchParams {
  search?: string;        // Full-text search in title, description
  status?: AssessmentStatus | 'all';
  createdBy?: string;     // Filter by creator
  dateFrom?: string;      // Created after date
  dateTo?: string;        // Created before date
  hasSubmissions?: boolean; // Filter assessments with/without submissions
  challengeCount?: {      // Filter by challenge count
    min?: number;
    max?: number;
  };
  tags?: string[];        // Filter by tags (future feature)
}
```

### Status Transition Validation
```typescript
const statusTransitions = {
  'draft': ['active', 'archived'],
  'active': ['archived'],
  'archived': [] // Terminal state
};

const validateStatusTransition = (currentStatus: string, newStatus: string) => {
  return statusTransitions[currentStatus]?.includes(newStatus) ?? false;
};
```

### Business Rule Enforcement
```typescript
// Assessment activation validation
const canActivateAssessment = async (assessmentId: string) => {
  const challengeCount = await getChallengeCount(assessmentId);
  if (challengeCount === 0) {
    throw new BusinessRuleError('Assessment must have at least one challenge to be activated');
  }
  return true;
};

// Archive constraint validation
const canArchiveAssessment = async (assessmentId: string) => {
  const activeSessions = await getActiveSessionCount(assessmentId);
  if (activeSessions > 0) {
    throw new BusinessRuleError('Cannot archive assessment with active candidate sessions');
  }
  return true;
};
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| ASSESS_001 | 400 | Invalid assessment data |
| ASSESS_002 | 409 | Title already exists |
| ASSESS_003 | 400 | Invalid status transition |
| ASSESS_004 | 409 | Cannot activate without challenges |
| ASSESS_005 | 409 | Cannot archive with active sessions |
| ASSESS_006 | 404 | Assessment not found |
| ASSESS_007 | 403 | Insufficient permissions |

## Performance Considerations
- ✅ **Database indexing** untuk search dan filtering
- ✅ **Statistics caching** dengan background refresh
- ✅ **Pagination optimization** dengan cursor-based paging
- ✅ **Query optimization** dengan selective field loading
- ✅ **Background jobs** untuk heavy operations
- ✅ **Connection pooling** untuk database efficiency

## Testing Requirements
- ✅ Unit tests untuk business logic dan validation
- ✅ Integration tests untuk all API endpoints
- ✅ Performance tests untuk large dataset operations
- ✅ Security tests untuk permission enforcement
- ✅ Database constraint tests
- ✅ Status transition workflow tests

## Audit & Monitoring
- ✅ **Comprehensive audit logging** untuk semua CRUD operations
- ✅ **Performance monitoring** dengan metrics collection
- ✅ **Error tracking** dengan structured logging
- ✅ **Business metrics** tracking (creation rate, activation rate)
- ✅ **Health checks** untuk service availability