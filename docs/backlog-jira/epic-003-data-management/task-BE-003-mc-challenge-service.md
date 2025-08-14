# TASK-BE-003: Multiple Choice Challenge Service (Backend)

**Story**: Story-003 Challenge CRUD - Multiple Choice  
**Estimasi**: 3 hari

## Dependencies
- Challenges base table created
- Media storage service untuk attachments
- Rich text processing service

## Acceptance Criteria Backend

### Core CRUD Operations
- ✅ **POST /admin/challenges/multiple-choice** untuk create MC challenge
- ✅ **GET /admin/challenges/multiple-choice/:id** dengan detail
- ✅ **PUT /admin/challenges/multiple-choice/:id** untuk updates
- ✅ **DELETE /admin/challenges/multiple-choice/:id** dengan soft delete
- ✅ **POST /admin/challenges/multiple-choice/:id/duplicate** untuk cloning

### Multiple Choice Features
- ✅ **Question-option management** dengan rich text
- ✅ **Correct answer validation** dengan scoring
- ✅ **Question randomization** settings
- ✅ **Media attachment** support untuk questions
- ✅ **Bulk import/export** dari CSV/JSON format
- ✅ **Answer validation** untuk submissions

### Response Format Compliance
- ✅ **Questions format** sesuai Postman collection
- ✅ **Options structure**: `{id, text}` format
- ✅ **Response wrapper**: `response_schema` + `response_output.detail`

## Database Schema

```sql
CREATE TABLE multiple_choice_challenges (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  randomize_questions BOOLEAN DEFAULT false,
  randomize_options BOOLEAN DEFAULT false,
  allow_multiple_selections BOOLEAN DEFAULT false,
  show_explanations BOOLEAN DEFAULT true
);

-- Question structure in JSONB:
-- {
--   "id": 1,
--   "question": "What is the output...",
--   "options": [
--     {"id": "A", "text": "Option A"},
--     {"id": "B", "text": "Option B"}
--   ],
--   "correct_answers": ["B"],
--   "explanation": "Because...",
--   "media_attachments": []
-- }
```

## API Implementation

```typescript
interface MCChallengeRequest {
  title: string;
  description: string;
  instructions: string;
  time_limit: number;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    id: number;
    question: string;
    options: {
      id: string;
      text: string;
    }[];
    correct_answers: string[];
    explanation?: string;
    points?: number;
  }[];
  randomize_questions?: boolean;
  randomize_options?: boolean;
  allow_multiple_selections?: boolean;
}
```

## Validation Rules
- ✅ **Question validation**: Minimal 1 question required
- ✅ **Option validation**: Minimal 2 options per question
- ✅ **Correct answer validation**: Minimal 1 correct answer
- ✅ **Points validation**: Total points <= challenge points
- ✅ **Text validation**: Rich text format validation

## Business Logic
- ✅ **Scoring calculation** based on correct answers
- ✅ **Question randomization** untuk candidate view
- ✅ **Answer submission validation** dengan format checking
- ✅ **Bulk operations** untuk question management

## Testing Requirements
- ✅ Unit tests untuk MC challenge CRUD
- ✅ Question validation tests
- ✅ Scoring logic tests
- ✅ Randomization tests
- ✅ Bulk import/export tests