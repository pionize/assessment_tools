# TASK-BE-004: Open-ended Challenge Service (Backend)

**Story**: Story-004 Challenge CRUD - Open-ended
**Estimasi**: 2 hari

## Dependencies
- Challenges base table created
- File storage service untuk attachments
- Rich text processing service

## Acceptance Criteria Backend

### Core CRUD Operations
- **POST /admin/challenges/open-ended** untuk create
- **GET /admin/challenges/open-ended/:id** dengan detail
- **PUT /admin/challenges/open-ended/:id** untuk updates
- **DELETE /admin/challenges/open-ended/:id** dengan soft delete
- **POST /admin/challenges/open-ended/:id/duplicate** untuk cloning

### Open-ended Features
- **Word count limits** validation
- **File attachment** support untuk submissions
- **Scoring rubric** management
- **Sample answers** storage untuk reference
- **Auto-save settings** configuration
- **Rich text processing** untuk instructions

### Response Format Compliance
- **Response wrapper**: `response_schema` + `response_output.detail`
- **Field naming**: snake_case (`min_words`, `max_words`)
- **Settings format**: JSON structure untuk rubric dan attachments

## Database Schema

```sql
CREATE TABLE open_ended_challenges (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  min_words INTEGER DEFAULT 0,
  max_words INTEGER,
  allow_attachments BOOLEAN DEFAULT false,
  max_attachments INTEGER DEFAULT 3,
  max_attachment_size INTEGER DEFAULT 10485760, -- 10MB
  scoring_rubric JSONB,
  sample_answers JSONB DEFAULT '[]'
);

-- Scoring rubric structure in JSONB:
-- {
--   "criteria": [
--     {
--       "id": "content",
--       "name": "Content Quality",
--       "description": "Evaluates the depth and accuracy of content",
--       "max_points": 40,
--       "levels": [
--         {"score": 4, "description": "Excellent"},
--         {"score": 3, "description": "Good"},
--         {"score": 2, "description": "Fair"},
--         {"score": 1, "description": "Poor"}
--       ]
--     }
--   ],
--   "total_points": 100
-- }
```

## API Implementation

```typescript
interface OpenEndedChallengeRequest {
  title: string;
  description: string;
  instructions: string;
  time_limit: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  min_words?: number;
  max_words?: number;
  allow_attachments?: boolean;
  max_attachments?: number;
  max_attachment_size?: number;
  scoring_rubric?: ScoringRubric;
  sample_answers?: SampleAnswer[];
}

interface ScoringRubric {
  criteria: {
    id: string;
    name: string;
    description: string;
    max_points: number;
    levels: {
      score: number;
      description: string;
    }[];
  }[];
  total_points: number;
}
```

## Validation Rules
- **Word limits**: min_words <= max_words if both specified
- **Attachment settings**: logical constraints untuk file limits
- **Rubric validation**: Total points consistency
- **Sample answers**: Format validation
- **Instructions**: Rich text format validation

## Business Logic
- **Word count validation** untuk submissions
- **File attachment validation** dengan size/type checks
- **Scoring calculation** based on rubric
- **Auto-save configuration** untuk candidate experience
- **Plagiarism detection** integration hooks

## Testing Requirements
- Unit tests untuk open-ended challenge CRUD
- Word count validation tests
- Attachment handling tests
- Rubric validation tests
- Sample answer management tests
