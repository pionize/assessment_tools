# STORY-006: Candidate & Submissions (Read/Review)

## Deskripsi
Sebagai Reviewer/Analyst, saya ingin melihat kandidat dan submission mereka untuk kebutuhan review dan analisis.

## API Contracts

### GET /admin/candidates
**Request:**
```typescript
{
  page?: number;              // Default: 1
  limit?: number;             // Default: 20, max: 100
  search?: string;            // Search by name or email
  assessment_id?: string;     // Filter by assessment
  status?: 'active' | 'completed' | 'expired' | 'all'; // Default: 'all'
  sortBy?: 'name' | 'email' | 'created_at' | 'last_activity'; // Default: 'created_at'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
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
      content: [{
        id: string;
        name: string;
        email: string;
        assessment_id: string;
        assessment_title: string;
        status: 'active' | 'completed' | 'expired';
        session_started_at: string | null;
        session_expires_at: string | null;
        submission_count: number;
        total_challenges: number;
        overall_score: number | null;
        time_spent: number | null; // minutes
        last_activity: string | null;
        created_at: string;
      }];
      pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
    }
  }
}
```

### GET /admin/submissions
**Request:**
```typescript
{
  page?: number;              // Default: 1
  limit?: number;             // Default: 20, max: 100
  assessment_id?: string;     // Filter by assessment
  candidate_id?: string;      // Filter by candidate
  status?: 'draft' | 'submitted' | 'reviewing' | 'reviewed' | 'all'; // Default: 'all'
  challenge_type?: 'code' | 'multiple-choice' | 'open-ended' | 'all'; // Default: 'all'
  sortBy?: 'submitted_at' | 'score' | 'ai_likelihood' | 'review_priority'; // Default: 'submitted_at'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
  score_range?: {             // Filter by score range
    min: number;
    max: number;
  };
  ai_likelihood_range?: {     // Filter by AI detection likelihood
    min: number;
    max: number;
  };
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
      content: [{
        id: string;
        candidate: {
          id: string;
          name: string;
          email: string;
        };
        assessment: {
          id: string;
          title: string;
        };
        challenge: {
          id: string;
          title: string;
          type: 'code' | 'multiple-choice' | 'open-ended';
          points: number;
        };
        status: 'draft' | 'submitted' | 'reviewing' | 'reviewed';
        score: number | null;
        auto_score: number | null;
        manual_score: number | null;
        ai_detection: {
          likelihood: number;     // 0-100
          confidence: number;     // 0-1
          flags: string[];        // Specific detection reasons
        };
        time_spent: number;       // seconds
        submitted_at: string | null;
        reviewed_at: string | null;
        reviewer: {
          id: string;
          name: string;
        } | null;
        review_priority: 'low' | 'medium' | 'high';
        created_at: string;
      }];
      pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
      aggregations: {
        total_submissions: number;
        pending_review: number;
        average_score: number;
        ai_flagged_count: number;
      };
    }
  }
}
```

### GET /admin/submissions/:id
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
      candidate: {
        id: string;
        name: string;
        email: string;
        session_id: string;
      };
      assessment: {
        id: string;
        title: string;
        total_challenges: number;
      };
      challenge: {
        id: string;
        title: string;
        description: string;
        type: 'code' | 'multiple-choice' | 'open-ended';
        points: number;
        time_limit: number;
      };
      submission_data: {
        // For code challenges
        files?: Record<string, string>;
        language?: string;
        
        // For multiple choice
        answers?: Record<string, string>; // questionId -> optionId
        
        // For open-ended
        answer?: string;
        word_count?: number;
        attachments?: {
          id: string;
          filename: string;
          size: number;
          url: string;
        }[];
      };
      scoring: {
        auto_score: number | null;
        manual_score: number | null;
        final_score: number | null;
        breakdown: {
          test_cases?: {
            name: string;
            passed: boolean;
            points: number;
            execution_time?: number;
            memory_used?: number;
          }[];
          criteria_scores?: {
            criterion: string;
            score: number;
            max_score: number;
          }[];
        };
      };
      ai_detection: {
        likelihood: number;       // 0-100
        confidence: number;       // 0-1
        analysis: {
          code_similarity?: {
            sources: string[];
            similarity_score: number;
          };
          pattern_detection?: {
            suspicious_patterns: string[];
            confidence: number;
          };
          style_analysis?: {
            consistency_score: number;
            anomalies: string[];
          };
        };
        flags: string[];
      };
      timing: {
        started_at: string;
        submitted_at: string;
        time_spent: number;       // seconds
        idle_time: number;        // seconds
        activity_timeline: {
          timestamp: string;
          action: 'start' | 'edit' | 'run' | 'pause' | 'submit';
          details?: string;
        }[];
      };
      review: {
        status: 'pending' | 'in_progress' | 'completed';
        reviewer?: {
          id: string;
          name: string;
        };
        notes?: string;
        feedback?: string;
        reviewed_at?: string;
        review_time?: number;     // minutes
        priority: 'low' | 'medium' | 'high';
      };
      version: number;
      created_at: string;
      updated_at: string;
    }
  }
}
```

### PUT /admin/submissions/:id/review
**Request:**
```typescript
{
  manual_score?: number;      // 0 to challenge.points
  notes?: string;             // Internal reviewer notes
  feedback?: string;          // Feedback to candidate (optional)
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
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
    detail: {
      id: string;
      review: {
        status: string;
        manual_score: number | null;
        final_score: number | null;
        notes: string;
        feedback: string;
        reviewer: {
          id: string;
          name: string;
        };
        reviewed_at: string;
      }
    }
  }
}
```

### GET /admin/submissions/:id/activity
**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "CODE-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      submission_id: string;
      activity_log: {
        timestamp: string;
        action: 'session_start' | 'challenge_start' | 'code_edit' | 'test_run' | 'answer_change' | 'submit' | 'timeout';
        details: {
          challenge_id?: string;
          file_name?: string;
          line_changes?: number;
          test_results?: boolean;
          question_id?: string;
          answer?: string;
        };
        metadata: {
          ip_address?: string;
          user_agent?: string;
          browser_visibility?: boolean;
          focus_time?: number;
        };
      }[];
      summary: {
        total_time: number;
        active_time: number;
        idle_time: number;
        code_changes: number;
        test_runs: number;
        focus_switches: number;
      };
    }
  }
}
```

### POST /admin/submissions/bulk-review
**Request:**
```typescript
{
  submission_ids: string[];
  action: 'assign_reviewer' | 'set_priority' | 'export';
  parameters: {
    reviewer_id?: string;
    priority?: 'low' | 'medium' | 'high';
    format?: 'csv' | 'xlsx' | 'json';
  };
}
```

**Error Responses:**
```typescript
// 403 - Access denied
{
  response_schema: {
    response_code: "CODE-0003";
    response_message: "Insufficient permissions for review operations";
  };
  response_output: null;
}

// 404 - Not found
{
  response_schema: {
    response_code: "CODE-0004";
    response_message: "Submission not found";
  };
  response_output: null;
}
```

## Acceptance Criteria
- Daftar kandidat dengan search (by name/email) dan filter by assessment.
- Daftar submissions per assessment (pagination, filter status, sort by submitted_at, score, ai_likelihood) sesuai `cms-api-assessment-submissions.md`.
- Halaman detail submission menampilkan ringkasan skor, waktu, serta per-challenge results termasuk AI detection metrics dan konten jawaban (code, MC, open-ended).
- Reviewer dapat memberi catatan/feedback manual (komentar) tanpa mengubah skor otomatis.
- Akses dibatasi via RBAC (Reviewer read+score; Analyst read-only kecuali export/report).

## RBAC Permissions
- **Reviewer**: Read candidates, submissions; Update review scores/notes; View AI detection details
- **Analyst**: Read-only access; Export/report generation; View aggregated analytics
- **Assessment Manager**: Full access; Bulk operations; Delete submissions
- **Admin**: Full system access; User management; System configuration

## Review Workflow
- **Auto-assignment**: Distribute submissions to reviewers based on workload
- **Priority System**: Flag high-priority submissions for urgent review
- **Review Queue**: Organized queue with filters and sorting
- **Bulk Operations**: Mass assignment, priority setting, export operations
- **Activity Tracking**: Complete audit trail of review actions

## Analytics & Reporting
- **Performance Metrics**: Average scores, completion rates, time analysis
- **AI Detection Stats**: Flagging accuracy, manual override rates
- **Reviewer Efficiency**: Review time, consistency scores
- **Export Options**: CSV, Excel, JSON formats for external analysis

