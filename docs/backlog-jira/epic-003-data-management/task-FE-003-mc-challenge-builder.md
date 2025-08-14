# TASK-FE-003: Multiple Choice Challenge Builder (Frontend)

**Story**: Story-003 Challenge CRUD - Multiple Choice
**Estimasi**: 3 hari

## Dependencies
- Multiple choice backend API completed
- Rich text editor library
- Drag-and-drop library untuk reordering
- File upload component untuk media

## Acceptance Criteria Frontend

### Question Builder Interface
- **Question editor** dengan rich text support
- **Option management** dengan add/delete/reorder
- **Correct answer selection** dengan validation
- **Question reordering** dengan drag-and-drop
- **Media attachment** untuk questions (images, videos)
- **Question preview** dengan candidate view

### Advanced Features
- **Bulk question import** dari CSV/JSON
- **Question templates** untuk common patterns
- **Question categorization** dengan tags
- **Answer explanation** management
- **Point distribution** per question
- **Randomization settings** configuration

### Form Management
- **Multi-question form** dengan validation
- **Auto-save drafts** dengan conflict detection
- **Form submission** dengan error handling
- **Question validation** real-time feedback

## Component Structure

```typescript
// src/components/admin/challenges/MCChallengeBuilder.tsx
interface MCChallengeBuilderProps {
  challenge?: MCChallenge;
  onSave: (challenge: MCChallengeData) => Promise<void>;
  enablePreview?: boolean;
}

// src/components/admin/challenges/QuestionBuilder.tsx
interface QuestionBuilderProps {
  questions: Question[];
  onQuestionAdd: () => void;
  onQuestionUpdate: (id: number, question: Question) => void;
  onQuestionDelete: (id: number) => void;
  onReorder: (questions: Question[]) => void;
}

// src/components/admin/challenges/OptionManager.tsx
interface OptionManagerProps {
  question: Question;
  options: Option[];
  onOptionAdd: () => void;
  onOptionUpdate: (id: string, option: Option) => void;
  onOptionDelete: (id: string) => void;
  onCorrectAnswerChange: (optionIds: string[]) => void;
}
```

## Question Builder Features

```typescript
// Question template presets
const questionTemplates = [
  {
    id: 'true-false',
    name: 'True/False',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ]
  },
  {
    id: 'abcd',
    name: 'A/B/C/D',
    options: [
      { id: 'A', text: 'Option A' },
      { id: 'B', text: 'Option B' },
      { id: 'C', text: 'Option C' },
      { id: 'D', text: 'Option D' }
    ]
  }
];

// Bulk import format
interface ImportFormat {
  question: string;
  option_a: string;
  option_b: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string; // 'A' or 'B,C' for multiple
  explanation?: string;
  points?: number;
}
```

## Validation Rules
- **Question text**: Required, max 2000 characters
- **Options**: Minimum 2, maximum 10 options
- **Correct answers**: At least 1 correct answer required
- **Points**: Per question points <= total challenge points
- **Media files**: Size limits, format validation

## UI/UX Requirements
- **Drag-and-drop** untuk question dan option reordering
- **Rich text editor** dengan formatting tools
- **Media upload** dengan preview functionality
- **Responsive design** untuk mobile editing
- **Keyboard shortcuts** untuk power users
- **Auto-save indicators** dengan status display

## Testing Requirements
- Component unit tests dengan React Testing Library
- Question builder workflow tests
- Drag-and-drop functionality tests
- Rich text editor integration tests
- Bulk import validation tests
- Form validation dan error handling tests
