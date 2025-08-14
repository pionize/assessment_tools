# TASK-FE-004: Open-ended Challenge Builder (Frontend)

**Story**: Story-004 Challenge CRUD - Open-ended  
**Estimasi**: 2 hari

## Dependencies
- Open-ended backend API completed
- Rich text editor library
- File upload component

## Acceptance Criteria Frontend

### Challenge Builder Interface
- ✅ **Rich text editor** untuk instructions dengan markdown
- ✅ **Word limit configuration** dengan validation
- ✅ **Attachment settings** management
- ✅ **Scoring rubric builder** dengan criteria definition
- ✅ **Sample answer management** untuk reference
- ✅ **Challenge preview** dalam candidate view

### Rubric Builder Features
- ✅ **Criteria management**: add, edit, delete criteria
- ✅ **Scoring levels** configuration per criteria
- ✅ **Point distribution** dengan total validation
- ✅ **Rubric templates** untuk common evaluation types
- ✅ **Rubric preview** dengan sample scoring

### Settings Configuration
- ✅ **Word count settings** dengan min/max inputs
- ✅ **File attachment toggles** dengan limits
- ✅ **Auto-save settings** configuration
- ✅ **Response format** settings

## Component Structure

```typescript
// src/components/admin/challenges/OpenEndedBuilder.tsx
interface OpenEndedBuilderProps {
  challenge?: OpenEndedChallenge;
  onSave: (challenge: OpenEndedChallengeData) => Promise<void>;
}

// src/components/admin/challenges/ScoringRubricBuilder.tsx
interface ScoringRubricBuilderProps {
  rubric?: ScoringRubric;
  onChange: (rubric: ScoringRubric) => void;
  maxPoints: number;
}

// src/components/admin/challenges/ResponseSettings.tsx
interface ResponseSettingsProps {
  settings: ResponseSettings;
  onChange: (settings: ResponseSettings) => void;
}
```

## Rubric Builder Features

```typescript
// Rubric template presets
const rubricTemplates = [
  {
    id: 'technical-writing',
    name: 'Technical Writing',
    criteria: [
      {
        id: 'accuracy',
        name: 'Technical Accuracy',
        max_points: 30,
        levels: [
          { score: 4, description: 'Completely accurate' },
          { score: 3, description: 'Mostly accurate' },
          { score: 2, description: 'Some inaccuracies' },
          { score: 1, description: 'Major inaccuracies' }
        ]
      },
      {
        id: 'clarity',
        name: 'Clarity & Communication',
        max_points: 25
      }
    ]
  }
];

interface CriteriaBuilder {
  criteria: RubricCriteria[];
  onAdd: () => void;
  onUpdate: (id: string, criteria: RubricCriteria) => void;
  onDelete: (id: string) => void;
  onReorder: (criteria: RubricCriteria[]) => void;
}
```

## Validation Rules
- ✅ **Word limits**: min_words <= max_words validation
- ✅ **Rubric points**: Total points == challenge points
- ✅ **Criteria validation**: Each criteria has valid scoring levels
- ✅ **File settings**: Logical attachment constraints
- ✅ **Instructions**: Rich text format validation

## UI/UX Requirements
- ✅ **Rich text editor** dengan formatting toolbar
- ✅ **Drag-and-drop** untuk criteria reordering
- ✅ **Inline editing** untuk criteria dan levels
- ✅ **Real-time validation** dengan error messages
- ✅ **Preview mode** untuk candidate experience
- ✅ **Form auto-save** dengan conflict resolution

## Sample Answer Management
```typescript
interface SampleAnswer {
  id: string;
  title: string;
  content: string;
  score?: number;
  notes?: string;
  is_exemplary: boolean;
}

interface SampleAnswerManager {
  answers: SampleAnswer[];
  onAdd: () => void;
  onUpdate: (id: string, answer: SampleAnswer) => void;
  onDelete: (id: string) => void;
  enableScoring: boolean;
}
```

## Testing Requirements
- ✅ Component unit tests dengan React Testing Library
- ✅ Rich text editor integration tests
- ✅ Rubric builder workflow tests
- ✅ Form validation tests
- ✅ Settings configuration tests
- ✅ Sample answer management tests