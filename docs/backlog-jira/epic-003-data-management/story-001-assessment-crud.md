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
  response_schema: {
    response_code: "CODE-0000";
    response_message: "Success";
  };
  response_output: {
    list: {
      content: {
        id: string;
        title: string;
        description: string;
        status: 'draft' | 'active' | 'archived';
        challenge_count: number;
        candidate_count: number;
        time_limit: number; // minutes
        pass_threshold: number; // percentage
        created_by: {
          id: string;
          name: string;
        };
        created_at: string;
        updated_at: string;
      }[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      }
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
  response_schema: {
    response_code: "CODE-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      id: string;
      title: string;
      description: string;
      instructions: string;
      time_limit: number;
      pass_threshold: number;
      status: 'draft';
      challenge_count: 0;
      created_by: {
        id: string;
        name: string;
      };
      created_at: string;
      updated_at: string;
    }
  }
}
```

### GET /admin/assessments/:id
**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "CODE-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      id: string;
      title: string;
      description: string;
      instructions: string;
      time_limit: number;
      pass_threshold: number;
      status: 'draft' | 'active' | 'archived';
      challenge_count: number;
      candidate_count: number;
      submission_count: number;
      average_score: number | null;
      challenges: {
        id: string;
        title: string;
        type: 'code' | 'multiple-choice' | 'open-ended';
        order: number;
      }[];
      created_by: {
        id: string;
        name: string;
      };
      created_at: string;
      updated_at: string;
    }
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
  response_schema: {
    response_code: "CODE-0001";
    response_message: "Validation failed";
  };
  response_output: null;
}

// 409 - Business rule violations  
{
  response_schema: {
    response_code: "CODE-0002";
    response_message: "Cannot archive assessment with active submissions";
  };
  response_output: null;
}

// 404 - Not found
{
  response_schema: {
    response_code: "CODE-0003";
    response_message: "Assessment not found";
  };
  response_output: null;
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

