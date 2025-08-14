# TASK-BE-006: Submission Read-only Service (Backend)

**Story**: Story-006 Candidate & Submissions Read-only
**Estimasi**: 2 hari

## Dependencies
- Submission tables already exist (from candidate app)
- Assessment and challenge services completed
- Review and scoring framework

## Acceptance Criteria Backend

### Read-only Operations
- **GET /admin/submissions** dengan filtering dan pagination
- **GET /admin/submissions/:id** dengan full detail
- **GET /admin/assessments/:id/submissions** untuk assessment view
- **GET /admin/challenges/:id/submissions** untuk challenge view
- **GET /admin/candidates/:id/submissions** untuk candidate view
- **POST /admin/submissions/:id/review** untuk scoring dan feedback

### Advanced Filtering
- **Multi-criteria filtering**: by assessment, challenge, candidate, date
- **Submission status**: submitted, reviewed, scored, flagged
- **Performance metrics**: completion time, score ranges
- **Search functionality**: dalam candidate name, email, submission content
- **Export functionality**: CSV, Excel formats untuk bulk analysis

### Response Format Compliance
- **List format**: `response_output.list.content` dengan pagination
- **Detail format**: `response_output.detail` dengan full submission data
- **Review format**: Include reviewer info dan scoring breakdown

## Database Views & Queries

```sql
-- Submission summary view for efficient listing
CREATE VIEW submission_summary AS
SELECT
  s.id,
  s.challenge_id,
  s.candidate_id,
  s.assessment_id,
  s.submitted_at,
  s.time_spent_seconds,
  s.status,
  c.name as candidate_name,
  c.email as candidate_email,
  ch.title as challenge_title,
  ch.type as challenge_type,
  a.title as assessment_title,
  sr.score,
  sr.max_score,
  sr.reviewed_at,
  sr.reviewed_by
FROM submissions s
LEFT JOIN candidates c ON s.candidate_id = c.id
LEFT JOIN challenges ch ON s.challenge_id = ch.id
LEFT JOIN assessments a ON s.assessment_id = a.id
LEFT JOIN submission_reviews sr ON s.id = sr.submission_id;

-- Indexes for performance
CREATE INDEX idx_submissions_assessment_id ON submissions(assessment_id);
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX idx_submissions_candidate_id ON submissions(candidate_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_submission_reviews_submission_id ON submission_reviews(submission_id);
```

## API Implementation

```typescript
interface SubmissionListParams {
  assessment_id?: string;
  challenge_id?: string;
  candidate_id?: string;
  status?: 'submitted' | 'reviewed' | 'scored' | 'flagged';
  date_from?: string;
  date_to?: string;
  score_min?: number;
  score_max?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'submitted_at' | 'score' | 'time_spent' | 'candidate_name';
  sort_order?: 'asc' | 'desc';
}

interface SubmissionDetail {
  id: string;
  challenge_id: string;
  candidate_id: string;
  assessment_id: string;
  submitted_at: string;
  time_spent_seconds: number;
  status: string;

  // Challenge info
  challenge: {
    id: string;
    title: string;
    type: 'code' | 'multiple-choice' | 'open-ended';
    max_score: number;
  };

  // Candidate info
  candidate: {
    id: string;
    name: string;
    email: string;
  };

  // Submission content (type-specific)
  content: CodeSubmissionContent | MCSubmissionContent | OpenEndedSubmissionContent;

  // Review and scoring
  review?: {
    score: number;
    max_score: number;
    feedback: string;
    reviewed_at: string;
    reviewed_by: {
      id: string;
      name: string;
    };
    scoring_breakdown: ScoringBreakdown;
  };
}
```

### Submission Content Types
```typescript
interface CodeSubmissionContent {
  files: {
    [fileName: string]: {
      content: string;
      language: string;
    }
  };
  test_results?: {
    passed_tests: number;
    total_tests: number;
    test_details: TestResult[];
  };
}

interface MCSubmissionContent {
  answers: {
    question_id: number;
    selected_option: string;
    is_correct: boolean;
  }[];
  score_breakdown: {
    correct_answers: number;
    total_questions: number;
    percentage: number;
  };
}

interface OpenEndedSubmissionContent {
  answer: string;
  word_count: number;
  attachments?: {
    filename: string;
    file_url: string;
    file_size: number;
  }[];
}
```

## Review & Scoring System

```typescript
interface ReviewRequest {
  score: number;
  max_score: number;
  feedback?: string;
  scoring_breakdown?: {
    criteria_id: string;
    score: number;
    feedback?: string;
  }[];
  flags?: {
    type: 'plagiarism' | 'incomplete' | 'suspicious';
    description: string;
  }[];
}

const createSubmissionReview = async (submissionId: string, review: ReviewRequest) => {
  // Validate score range
  if (review.score < 0 || review.score > review.max_score) {
    throw new ValidationError('Score must be between 0 and max_score');
  }

  // Create review record
  const reviewRecord = await db('submission_reviews').insert({
    submission_id: submissionId,
    score: review.score,
    max_score: review.max_score,
    feedback: review.feedback,
    scoring_breakdown: JSON.stringify(review.scoring_breakdown),
    reviewed_by: getCurrentUserId(),
    reviewed_at: new Date()
  }).returning('*');

  // Update submission status
  await db('submissions')
    .where('id', submissionId)
    .update({ status: 'reviewed' });

  return reviewRecord[0];
};
```

## Export Functionality

```typescript
interface ExportRequest {
  format: 'csv' | 'excel';
  filters: SubmissionListParams;
  fields: string[];
}

const exportSubmissions = async (exportRequest: ExportRequest) => {
  const submissions = await getSubmissions(exportRequest.filters);

  if (exportRequest.format === 'csv') {
    return generateCSV(submissions, exportRequest.fields);
  } else {
    return generateExcel(submissions, exportRequest.fields);
  }
};
```

## Testing Requirements
- Unit tests untuk submission read operations
- Filtering dan search functionality tests
- Review and scoring tests
- Export functionality tests
- Performance tests untuk large datasets
- Access control tests untuk sensitive data
