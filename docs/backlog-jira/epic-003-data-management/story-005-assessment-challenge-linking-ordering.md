# STORY-005: Linking Challenge ke Assessment + Ordering

## Deskripsi
Sebagai Assessment Manager, saya ingin mengaitkan challenge ke assessment, menentukan urutan, bobot/points per challenge agar alur assessment konsisten.

## API Contracts

### GET /admin/assessments/:id/challenges
**Success Response (200):**
```typescript
{
  success: true;
  data: {
    challengeId: string;
    title: string;
    type: 'code' | 'multiple-choice' | 'open-ended';
    order: number;
    points: number;           // May override challenge default points
    timeLimit: number;        // May override challenge default time
    required: boolean;        // If false, candidate can skip
    difficulty: 'easy' | 'medium' | 'hard';
  }[]
}
```

### POST /admin/assessments/:id/challenges
**Request:**
```typescript
{
  challengeId: string;
  order?: number;            // Auto-assigned if not provided
  pointsOverride?: number;   // Override challenge default points
  timeLimitOverride?: number; // Override challenge default time limit
  required?: boolean;        // Default: true
}
```

### PUT /admin/assessments/:id/challenges/reorder
**Request:**
```typescript
{
  challenges: {
    challengeId: string;
    order: number;
  }[]
}
```

### PUT /admin/assessments/:id/challenges/:challengeId
**Request:**
```typescript
{
  order?: number;
  pointsOverride?: number;
  timeLimitOverride?: number;
  required?: boolean;
}
```

### DELETE /admin/assessments/:id/challenges/:challengeId
**Success Response (200):**
```typescript
{
  success: true;
  message: "Challenge removed from assessment";
}
```

### GET /admin/challenges/available
**Query Parameters:**
```typescript
{
  type?: 'code' | 'multiple-choice' | 'open-ended';
  difficulty?: 'easy' | 'medium' | 'hard';
  excludeAssessmentId?: string;  // Exclude challenges already in this assessment
  search?: string;
  page?: number;
  limit?: number;
}
```

## Acceptance Criteria
- ✅ Challenge library dengan search/filter untuk assessment assignment
- ✅ Drag-and-drop interface untuk challenge reordering
- ✅ Points dan time limit override per assessment
- ✅ Duplicate challenge validation (tidak boleh sama dalam 1 assessment)
- ✅ Required/optional challenge designation
- ✅ Bulk challenge assignment dengan order preservation
- ✅ Assessment preview dengan challenge flow
- ✅ Real-time order persistence dengan optimistic updates

## Validation Rules
- **Challenge Uniqueness**: Each challenge dapat muncul max 1x per assessment
- **Order Sequence**: Order harus sequential (1, 2, 3...) tanpa gaps
- **Points Override**: Harus positive integer, max 200% dari challenge default
- **Time Limit Override**: 1-300 minutes, reasonable untuk challenge complexity
- **Minimum Challenges**: Assessment harus memiliki minimal 1 challenge untuk activation
- **Total Points**: Assessment total points calculated dari sum challenge points

## Business Rules
- **Draft Assessment**: Bebas modify challenge assignments
- **Active Assessment**: Limited modifications (cannot remove challenges with submissions)
- **Archived Assessment**: Read-only, no modifications allowed
- **Challenge Dependencies**: Future feature untuk prerequisite challenges
- **Scoring Weights**: Assessment dapat memiliki weighted scoring per challenge type

