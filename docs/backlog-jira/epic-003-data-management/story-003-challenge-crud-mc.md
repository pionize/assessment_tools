# STORY-003: Challenge CRUD - Multiple Choice

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat dan mengelola challenge Multiple Choice dengan question builder lengkap (pilihan jawaban, kunci, penjelasan) agar mengukur pengetahuan kandidat.

## API Contracts

### POST /admin/challenges/multiple-choice
**Request:**
```typescript
{
  title: string;              // Required, 3-100 chars
  description: string;        // Required, max 500 chars
  instructions: string;       // Required, max 5000 chars, supports markdown
  time_limit: number;         // Required, 1-180 minutes
  points: number;             // Required, 1-100 points
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    id: number;               // Question sequence number
    question: string;         // Required, max 1000 chars
    options: {
      id: string;            // Option identifier (A, B, C, D)
      text: string;          // Option text, max 500 chars
    }[];                     // Min 2, max 6 options
    correct_answers: string[];  // Array of correct option IDs
    explanation?: string;     // Optional explanation, max 1000 chars
    points?: number;         // Optional per-question points
  }[];                       // Min 1 question required
  randomize_questions?: boolean;  // Default: false
  randomize_options?: boolean;    // Default: false
  allow_multiple_selections?: boolean; // Default: false
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
      type: 'multiple-choice';
      time_limit: number;
      points: number;
      difficulty: string;
      questions: {
        id: number;
        question: string;
        options: {
          id: string;
          text: string;
        }[];
        correct_answers: string[];
        explanation?: string;
        points: number;
      }[];
      settings: {
        randomize_questions: boolean;
        randomize_options: boolean;
        allow_multiple_selections: boolean;
        total_questions: number;
      };
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

### GET /admin/challenges/multiple-choice/:id
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
      type: 'multiple-choice';
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
        points: number;
      }[];
      settings: {
        randomize_questions: boolean;
        randomize_options: boolean;
        allow_multiple_selections: boolean;
        total_questions: number;
      };
      tags: string[];
      version: number;
      status: 'draft' | 'published' | 'archived';
      submission_count: number;
      average_score: number | null;
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

### PUT /admin/challenges/multiple-choice/:id
**Request:**
```typescript
{
  title?: string;
  description?: string;
  instructions?: string;
  time_limit?: number;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions?: {
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
  settings?: {
    randomize_questions?: boolean;
    randomize_options?: boolean;
    allow_multiple_selections?: boolean;
  };
  tags?: string[];
}
```

### POST /admin/challenges/multiple-choice/:id/import
**Request:**
```typescript
{
  format: 'json' | 'csv';
  data: string;              // JSON string or CSV content
  merge_mode: 'replace' | 'append'; // Default: 'replace'
}
```

### GET /admin/challenges/multiple-choice/:id/export
**Query Parameters:**
```typescript
{
  format: 'json' | 'csv';    // Default: 'json'
  include_answers?: boolean;  // Default: true
}
```

**Error Responses:**
```typescript
// 400 - Validation errors
{
  response_schema: {
    response_code: "CODE-0001";
    response_message: "Question must have at least 2 options";
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
- Question builder: daftar pertanyaan, setiap pertanyaan memiliki options (id, text), correctAnswer, optional explanation, points.
- Validasi: minimal 1 pertanyaan, setiap pertanyaan memiliki ≥2 options dan tepat satu correctAnswer.
- Dapat create, update, delete pertanyaan dan opsi; urutan pertanyaan dapat diatur; totalQuestions terhitung otomatis.
- Dapat import/export pertanyaan via JSON untuk bulk edit.
- Audit log untuk perubahan.

## Validation Rules
- **Title**: 3-100 characters, unique per assessment
- **Description**: Required, max 500 characters
- **Instructions**: Required, max 5000 characters, markdown support
- **Time Limit**: 1-180 minutes
- **Points**: 1-100 points per challenge
- **Questions**: Min 1 question, max 50 questions per challenge
- **Options**: Min 2, max 6 options per question
- **Correct Answers**: Min 1 correct answer per question
- **Question Text**: Max 1000 characters
- **Option Text**: Max 500 characters
- **Explanation**: Max 1000 characters

## Question Management Features
- **Visual Question Builder**: Rich text editor for questions
- **Option Management**: Add, edit, delete, reorder options
- **Answer Key**: Multiple correct answers support (when enabled)
- **Bulk Operations**: Import/export questions in JSON/CSV format
- **Question Preview**: Real-time preview in candidate view
- **Randomization Settings**: Question and option order randomization

