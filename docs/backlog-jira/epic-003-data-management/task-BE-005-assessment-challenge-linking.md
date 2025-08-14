# TASK-BE-005: Assessment-Challenge Linking Service (Backend)

**Story**: Story-005 Assessment-Challenge Linking + Ordering
**Estimasi**: 3 hari

## Dependencies
- Assessment CRUD service completed
- Challenge services (Code, MC, Open-ended) completed
- Database schema untuk linking table

## Acceptance Criteria Backend

### Core Linking Operations
- **GET /admin/assessments/:id/challenges** dengan challenge list
- **POST /admin/assessments/:id/challenges** untuk add challenge
- **PUT /admin/assessments/:id/challenges/reorder** untuk ordering
- **PUT /admin/assessments/:id/challenges/:challengeId** untuk settings
- **DELETE /admin/assessments/:id/challenges/:challengeId** untuk remove
- **GET /admin/challenges/available** dengan exclusion filter

### Advanced Features
- **Challenge ordering** dengan drag-and-drop support
- **Points override** per assessment
- **Time limit override** per assessment
- **Required/optional** challenge designation
- **Duplicate prevention** dalam same assessment
- **Bulk operations** untuk multiple challenges

### Response Format Compliance
- **Challenge list**: `response_output.content` array
- **Available challenges**: Filter format sesuai Postman
- **Success operations**: `response_output.detail.success` format

## Database Schema

```sql
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

CREATE INDEX idx_assessment_challenges_assessment ON assessment_challenges(assessment_id);
CREATE INDEX idx_assessment_challenges_order ON assessment_challenges(assessment_id, order_position);
```

## API Implementation

```typescript
interface AddChallengeRequest {
  challenge_id: string;
  order?: number;
  points_override?: number;
  time_limit_override?: number;
  required?: boolean;
}

interface ReorderRequest {
  challenges: {
    challenge_id: string;
    order: number;
  }[];
}

interface ChallengeInAssessment {
  challenge_id: string;
  title: string;
  type: 'code' | 'multiple-choice' | 'open-ended';
  order: number;
  points: number;
  time_limit: number;
  required: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

## Business Logic

### Ordering Management
```typescript
const updateChallengeOrder = async (assessmentId: string, challenges: ReorderItem[]) => {
  // Validate order sequence (1, 2, 3, ...)
  const orders = challenges.map(c => c.order).sort((a, b) => a - b);
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i + 1) {
      throw new ValidationError('Order sequence must be sequential starting from 1');
    }
  }

  // Update all orders in transaction
  await db.transaction(async (trx) => {
    for (const challenge of challenges) {
      await trx('assessment_challenges')
        .where({ assessment_id: assessmentId, challenge_id: challenge.challenge_id })
        .update({ order_position: challenge.order });
    }
  });
};
```

### Validation Rules
- **Uniqueness**: No duplicate challenges dalam same assessment
- **Order sequence**: Sequential ordering (1, 2, 3, ...)
- **Points override**: <= 200% of original challenge points
- **Time override**: Reasonable limits (1-300 minutes)
- **Assessment status**: Only draft assessments can be modified

### Available Challenges Filter
```typescript
const getAvailableChallenges = async (params: AvailableParams) => {
  let query = db('challenges')
    .where('status', 'published')
    .whereNotIn('id', function() {
      if (params.exclude_assessment_id) {
        this.select('challenge_id')
          .from('assessment_challenges')
          .where('assessment_id', params.exclude_assessment_id);
      }
    });

  if (params.type) query = query.where('type', params.type);
  if (params.difficulty) query = query.where('difficulty', params.difficulty);
  if (params.search) {
    query = query.whereRaw("title ILIKE ? OR description ILIKE ?",
      [`%${params.search}%`, `%${params.search}%`]);
  }

  return query.orderBy('title');
};
```

## Testing Requirements
- Unit tests untuk linking operations
- Order validation tests
- Duplicate prevention tests
- Override validation tests
- Available challenges filtering tests
- Bulk operations tests
