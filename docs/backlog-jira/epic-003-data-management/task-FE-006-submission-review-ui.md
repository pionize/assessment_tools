# TASK-FE-006: Submission Review Dashboard (Frontend)

**Story**: Story-006 Candidate & Submissions Read-only
**Estimasi**: 4 hari

## Dependencies
- Submission read-only backend API completed
- Code syntax highlighting library
- Export functionality components
- Review and scoring components

## Acceptance Criteria Frontend

### Submission Dashboard
- **Submission list** dengan advanced filtering
- **Multi-view layout**: table, card, detailed views
- **Real-time search** dengan highlighted results
- **Advanced filtering** by assessment, challenge, candidate, status
- **Bulk operations** untuk review dan export
- **Performance metrics** visualization

### Submission Detail View
- **Full submission viewer** dengan type-specific rendering
- **Code submission viewer** dengan syntax highlighting
- **Multiple choice results** dengan answer breakdown
- **Open-ended viewer** dengan rich text rendering
- **Candidate information** panel
- **Time tracking** dan performance metrics

### Review & Scoring Interface
- **Scoring form** dengan rubric integration
- **Feedback editor** dengan rich text support
- **Score breakdown** per criteria
- **Flag submission** untuk suspicious activity
- **Review history** tracking
- **Batch review** untuk similar submissions

## Component Structure

```typescript
// src/components/admin/submissions/SubmissionDashboard.tsx
interface SubmissionDashboardProps {
  initialFilters?: SubmissionFilters;
  view?: 'table' | 'cards' | 'detailed';
}

// src/components/admin/submissions/SubmissionViewer.tsx
interface SubmissionViewerProps {
  submissionId: string;
  enableReview?: boolean;
  onReviewSubmit?: (review: ReviewData) => void;
}

// src/components/admin/submissions/ReviewPanel.tsx
interface ReviewPanelProps {
  submission: Submission;
  challenge: Challenge;
  onReviewSubmit: (review: ReviewData) => Promise<void>;
  existingReview?: Review;
}
```

## Submission Type Viewers

### Code Submission Viewer
```typescript
const CodeSubmissionViewer = ({ submission }: { submission: CodeSubmission }) => {
  const [selectedFile, setSelectedFile] = useState<string>();

  return (
    <div className="code-submission-viewer">
      <div className="file-tree">
        {Object.keys(submission.content.files).map(fileName => (
          <div
            key={fileName}
            className={`file-item ${selectedFile === fileName ? 'active' : ''}`}
            onClick={() => setSelectedFile(fileName)}
          >
            {fileName}
          </div>
        ))}
      </div>

      <div className="code-editor">
        <MonacoEditor
          language={submission.content.files[selectedFile]?.language || 'javascript'}
          value={submission.content.files[selectedFile]?.content || ''}
          options={{
            readOnly: true,
            theme: 'vs-dark',
            minimap: { enabled: true },
            lineNumbers: 'on'
          }}
        />
      </div>

      {submission.content.test_results && (
        <div className="test-results">
          <h4>Test Results</h4>
          <div className="results-summary">
            {submission.content.test_results.passed_tests} / {submission.content.test_results.total_tests} tests passed
          </div>
          {submission.content.test_results.test_details.map(result => (
            <div key={result.test_id} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
              <span className="test-name">{result.name}</span>
              <span className="test-status">{result.passed ? '✓' : '✗'}</span>
              {!result.passed && (
                <div className="test-error">{result.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Multiple Choice Viewer
```typescript
const MCSubmissionViewer = ({ submission }: { submission: MCSubmission }) => {
  return (
    <div className="mc-submission-viewer">
      <div className="score-summary">
        <div className="score-circle">
          <span className="score">{submission.content.score_breakdown.percentage}%</span>
          <span className="details">
            {submission.content.score_breakdown.correct_answers} / {submission.content.score_breakdown.total_questions} correct
          </span>
        </div>
      </div>

      <div className="answers-list">
        {submission.content.answers.map(answer => (
          <div key={answer.question_id} className="answer-item">
            <div className="question">Question {answer.question_id}</div>
            <div className={`answer ${answer.is_correct ? 'correct' : 'incorrect'}`}>
              Selected: {answer.selected_option}
              {answer.is_correct ? ' ✓' : ' ✗'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Open-ended Viewer
```typescript
const OpenEndedViewer = ({ submission }: { submission: OpenEndedSubmission }) => {
  return (
    <div className="open-ended-viewer">
      <div className="metadata">
        <span>Word count: {submission.content.word_count}</span>
        {submission.content.attachments && (
          <span>Attachments: {submission.content.attachments.length}</span>
        )}
      </div>

      <div className="answer-content">
        <ReactMarkdown>{submission.content.answer}</ReactMarkdown>
      </div>

      {submission.content.attachments && (
        <div className="attachments">
          <h4>Attachments</h4>
          {submission.content.attachments.map(attachment => (
            <div key={attachment.filename} className="attachment-item">
              <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                {attachment.filename} ({formatFileSize(attachment.file_size)})
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Review & Scoring Interface

```typescript
interface ReviewForm {
  score: number;
  maxScore: number;
  feedback: string;
  scoringBreakdown: {
    criteriaId: string;
    score: number;
    feedback?: string;
  }[];
  flags: {
    type: 'plagiarism' | 'incomplete' | 'suspicious';
    description: string;
  }[];
}

const ReviewPanel = ({ submission, challenge, onReviewSubmit }: ReviewPanelProps) => {
  const [review, setReview] = useState<ReviewForm>({
    score: 0,
    maxScore: challenge.points,
    feedback: '',
    scoringBreakdown: [],
    flags: []
  });

  const handleSubmit = async () => {
    try {
      await onReviewSubmit(review);
      showSuccess('Review submitted successfully');
    } catch (error) {
      showError('Failed to submit review');
    }
  };

  return (
    <div className="review-panel">
      <div className="score-section">
        <label>Score</label>
        <input
          type="number"
          min={0}
          max={review.maxScore}
          value={review.score}
          onChange={(e) => setReview(prev => ({ ...prev, score: parseInt(e.target.value) }))}
        />
        <span>/ {review.maxScore}</span>
      </div>

      <div className="feedback-section">
        <label>Feedback</label>
        <RichTextEditor
          value={review.feedback}
          onChange={(feedback) => setReview(prev => ({ ...prev, feedback }))}
          placeholder="Provide feedback for the candidate..."
        />
      </div>

      {challenge.scoring_rubric && (
        <div className="rubric-scoring">
          <h4>Scoring Rubric</h4>
          {challenge.scoring_rubric.criteria.map(criteria => (
            <div key={criteria.id} className="criteria-score">
              <label>{criteria.name}</label>
              <select
                value={review.scoringBreakdown.find(s => s.criteriaId === criteria.id)?.score || 0}
                onChange={(e) => updateCriteriaScore(criteria.id, parseInt(e.target.value))}
              >
                {criteria.levels.map(level => (
                  <option key={level.score} value={level.score}>
                    {level.score} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSubmit} className="submit-review-btn">
        Submit Review
      </button>
    </div>
  );
};
```

## Advanced Filtering & Search

```typescript
interface SubmissionFilters {
  search: string;
  assessmentId?: string;
  challengeId?: string;
  candidateId?: string;
  status?: SubmissionStatus;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  scoreRange: {
    min: number | null;
    max: number | null;
  };
  challengeType?: ChallengeType;
}

const AdvancedFilters = ({ filters, onChange }: FilterProps) => {
  return (
    <div className="advanced-filters">
      <SearchInput
        value={filters.search}
        onChange={(search) => onChange({ ...filters, search })}
        placeholder="Search candidates, submissions..."
        debounceMs={300}
      />

      <SelectFilter
        label="Assessment"
        options={assessmentOptions}
        value={filters.assessmentId}
        onChange={(assessmentId) => onChange({ ...filters, assessmentId })}
      />

      <SelectFilter
        label="Status"
        options={statusOptions}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />

      <DateRangeFilter
        label="Submission Date"
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
      />

      <RangeFilter
        label="Score Range"
        min={0}
        max={100}
        value={filters.scoreRange}
        onChange={(scoreRange) => onChange({ ...filters, scoreRange })}
      />
    </div>
  );
};
```

## Export & Bulk Operations

```typescript
const BulkOperations = ({ selectedSubmissions }: { selectedSubmissions: string[] }) => {
  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const blob = await exportSubmissions({
        format,
        submission_ids: selectedSubmissions,
        fields: ['candidate_name', 'challenge_title', 'score', 'submitted_at']
      });
      downloadFile(blob, `submissions.${format}`);
    } catch (error) {
      showError('Export failed');
    }
  };

  return (
    <div className="bulk-operations">
      <span>{selectedSubmissions.length} selected</span>
      <button onClick={() => handleExport('csv')}>Export CSV</button>
      <button onClick={() => handleExport('excel')}>Export Excel</button>
      <button onClick={handleBulkReview}>Bulk Review</button>
    </div>
  );
};
```

## Testing Requirements
- Component unit tests dengan React Testing Library
- Submission viewer integration tests
- Review and scoring workflow tests
- Filtering dan search functionality tests
- Export functionality tests
- Bulk operations tests
- Performance tests untuk large submission lists
