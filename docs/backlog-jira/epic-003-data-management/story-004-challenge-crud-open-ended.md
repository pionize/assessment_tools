# STORY-004: Challenge CRUD - Open-ended

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat challenge Open-ended (deskriptif/penjelasan) dengan instructions yang jelas agar kandidat menuliskan jawaban.

## API Contracts

### POST /admin/challenges/open-ended
**Request:**
```typescript
{
  title: string;              // Required, 3-100 chars
  description: string;        // Required, max 500 chars
  instructions: string;       // Required, max 10000 chars, supports markdown
  time_limit: number;         // Required, 1-180 minutes
  points: number;             // Required, 1-100 points
  difficulty: 'easy' | 'medium' | 'hard';
  evaluation_criteria?: {
    id: string;
    criterion: string;        // e.g., "Technical accuracy", "Clarity"
    weight: number;           // Percentage weight (0-100)
    description?: string;     // Detailed explanation
  }[];                        // Optional scoring criteria
  word_limit?: number;        // Optional word count limit
  allow_attachments?: boolean; // Default: false
  sample_answer?: string;     // Optional model answer for reviewers
  tags?: string[];           // Optional categorization tags
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
      type: 'open-ended';
      time_limit: number;
      points: number;
      difficulty: string;
      settings: {
        word_limit?: number;
        allow_attachments: boolean;
        evaluation_method: 'manual' | 'ai-assisted';
      };
      evaluation_criteria: {
        id: string;
        criterion: string;
        weight: number;
        description?: string;
      }[];
      sample_answer?: string;
      tags: string[];
      version: 1;
      status: 'draft';
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

### GET /admin/challenges/open-ended/:id
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
      type: 'open-ended';
      time_limit: number;
      points: number;
      difficulty: 'easy' | 'medium' | 'hard';
      settings: {
        word_limit?: number;
        allow_attachments: boolean;
        evaluation_method: 'manual' | 'ai-assisted';
      };
      evaluation_criteria: {
        id: string;
        criterion: string;
        weight: number;
        description?: string;
      }[];
      sample_answer?: string;
      tags: string[];
      version: number;
      status: 'draft' | 'published' | 'archived';
      submission_count: number;
      average_score: number | null;
      average_review_time: number | null; // Minutes
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

### PUT /admin/challenges/open-ended/:id
**Request:**
```typescript
{
  title?: string;
  description?: string;
  instructions?: string;
  time_limit?: number;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  settings?: {
    word_limit?: number;
    allow_attachments?: boolean;
    evaluation_method?: 'manual' | 'ai-assisted';
  };
  evaluation_criteria?: {
    id: string;
    criterion: string;
    weight: number;
    description?: string;
  }[];
  sample_answer?: string;
  tags?: string[];
}
```

### POST /admin/challenges/open-ended/:id/ai-review
**Request:**
```typescript
{
  submission_id: string;
  review_criteria: string[]; // Specific criteria to focus on
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
      ai_feedback: {
        overall_score: number;    // 0-100
        criteria_scores: {
          criterion_id: string;
          score: number;
          feedback: string;
        }[];
        strengths: string[];
        improvements: string[];
        confidence_level: number; // 0-1
      };
      review_time: number;        // Seconds taken
      reviewer_notes?: string;    // Optional human reviewer notes
    }
  }
}
```

**Error Responses:**
```typescript
// 400 - Validation errors
{
  response_schema: {
    response_code: "CODE-0001";
    response_message: "Instructions cannot be empty";
  };
  response_output: null;
}

// 409 - Business rule violations
{
  response_schema: {
    response_code: "CODE-0002";
    response_message: "Cannot modify published challenge with active submissions";
  };
  response_output: null;
}
```

## Acceptance Criteria
- Form: title, description, instructions (rich text/markdown), time_limit, points, difficulty.
- Validasi: instructions wajib; points ≥ 0; time_limit > 0.
- Dapat create, update, delete; perubahan tercatat di audit log.

## Validation Rules
- **Title**: 3-100 characters, unique per assessment
- **Description**: Required, max 500 characters
- **Instructions**: Required, max 10000 characters, markdown support
- **Time Limit**: 1-180 minutes (3 hours max for essay-type questions)
- **Points**: 1-100 points per challenge
- **Word Limit**: If specified, 50-5000 words
- **Evaluation Criteria**: Max 10 criteria, total weight must equal 100%

## Evaluation Features
- **Manual Review**: Human reviewer scores based on criteria
- **AI-Assisted Review**: AI provides preliminary scoring and feedback
- **Rubric Builder**: Define scoring criteria with weights and descriptions
- **Sample Answers**: Model answers for reviewer reference
- **Batch Review**: Bulk review multiple submissions
- **Review Templates**: Predefined criteria sets for common question types

## Submission Handling
- **Rich Text Support**: Formatted text with basic styling
- **Attachment Support**: File uploads (when enabled)
- **Word Count Tracking**: Real-time word count with limit enforcement
- **Auto-save**: Periodic saving of draft responses
- **Plagiarism Detection**: Basic similarity checking against sample answers

