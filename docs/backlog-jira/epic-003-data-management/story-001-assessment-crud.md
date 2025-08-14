# STORY-001: Assessment CRUD + Lifecycle

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat, mengedit, mengarsipkan assessment lengkap dengan metadata (title, description, instructions, time_limit, pass_threshold) agar dapat dikelola dengan baik.

## API Contracts

### GET /admin/assessments
**Request:**
```typescript
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 20, max: 100
  search?: string;        // Search in title, description
  status?: 'draft' | 'active' | 'archived' | 'all';  // Default: 'all'
  sortBy?: 'title' | 'created_at' | 'updated_at';    // Default: 'created_at'
  sortOrder?: 'asc' | 'desc';  // Default: 'desc'
}
```

**Success Response (200):**
```typescript
{
  success: true;
  data: {
    assessments: {
      id: string;
      title: string;
      description: string;
      status: 'draft' | 'active' | 'archived';
      challengeCount: number;
      candidateCount: number;
      timeLimit: number; // minutes
      passThreshold: number; // percentage
      createdBy: {
        id: string;
        name: string;
      };
      createdAt: string;
      updatedAt: string;
    }[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  }
}
```

### POST /admin/assessments
**Request:**
```typescript
{
  title: string;              // Required, 3-100 chars, unique
  description: string;        // Required, max 500 chars
  instructions?: string;      // Optional, max 2000 chars
  timeLimit: number;          // Required, 1-480 minutes
  passThreshold: number;      // Required, 0-100 percentage
  status?: 'draft' | 'active'; // Default: 'draft'
}
```

**Success Response (201):**
```typescript
{
  success: true;
  data: {
    id: string;
    title: string;
    description: string;
    instructions: string;
    timeLimit: number;
    passThreshold: number;
    status: 'draft';
    challengeCount: 0;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  }
}
```

### GET /admin/assessments/:id
**Success Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    title: string;
    description: string;
    instructions: string;
    timeLimit: number;
    passThreshold: number;
    status: 'draft' | 'active' | 'archived';
    challengeCount: number;
    candidateCount: number;
    submissionCount: number;
    averageScore: number | null;
    challenges: {
      id: string;
      title: string;
      type: 'code' | 'multiple-choice' | 'open-ended';
      order: number;
    }[];
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  }
}
```

### PUT /admin/assessments/:id
**Request:**
```typescript
{
  title?: string;         // 3-100 chars, unique
  description?: string;   // max 500 chars
  instructions?: string;  // max 2000 chars
  timeLimit?: number;     // 1-480 minutes
  passThreshold?: number; // 0-100 percentage
}
```

### PUT /admin/assessments/:id/status
**Request:**
```typescript
{
  status: 'draft' | 'active' | 'archived';
  reason?: string; // Optional reason for status change
}
```

**Error Responses:**
```typescript
// 400 - Validation errors
{
  success: false;
  error: "Validation failed";
  details: {
    field: string;
    message: string;
  }[];
}

// 409 - Business rule violations
{
  success: false;
  error: "Cannot archive assessment with active submissions";
}

// 404 - Not found
{
  success: false;
  error: "Assessment not found";
}
```

## Acceptance Criteria
- ✅ Dapat membuat assessment baru dengan field validation lengkap
- ✅ Title unique per organisation/tenant dengan conflict detection
- ✅ Status lifecycle: draft → active → archived dengan business rules
- ✅ Assessment list dengan pagination, search, filtering, sorting
- ✅ Detail view dengan challenge overview dan statistics
- ✅ Update assessment fields dengan validation constraints
- ✅ Status change validation (archived assessments read-only)
- ✅ Soft delete untuk data integrity (archived, bukan delete)

## Validation Rules
- **Title**: 3-100 characters, unique, alphanumeric + spaces
- **Description**: Required, max 500 characters
- **Instructions**: Optional, max 2000 characters, rich text support
- **Time Limit**: 1-480 minutes (8 hours max)
- **Pass Threshold**: 0-100 percentage
- **Status Transitions**: draft ↔ active, active → archived (one-way)
- **Archive Constraint**: Cannot archive if active candidate sessions exist

## Business Rules
- **Draft assessments**: Can be fully edited, not visible to candidates
- **Active assessments**: Limited editing, visible to candidates, can have submissions
- **Archived assessments**: Read-only, submissions preserved, not visible to new candidates
- **Title uniqueness**: Enforced at organisation/tenant level
- **Challenge requirement**: Assessment must have at least 1 challenge to be activated

