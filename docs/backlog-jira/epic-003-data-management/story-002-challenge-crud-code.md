# STORY-002: Challenge CRUD - Code Type

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat dan mengelola challenge bertipe Code (file templates, language, instructions, test cases) agar kandidat dapat mengerjakan coding challenge.

## API Contracts

### POST /admin/challenges/code
**Request:**
```typescript
{
  title: string;              // Required, 3-100 chars
  description: string;        // Required, max 500 chars
  instructions: string;       // Required, max 5000 chars, supports markdown
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'go' | 'rust' | 'cpp';
  timeLimit: number;          // Required, 1-180 minutes
  points: number;             // Required, 1-100 points
  difficulty: 'easy' | 'medium' | 'hard';
  files: {
    [fileName: string]: {
      content: string;        // Initial file content
      readonly: boolean;      // If true, candidate cannot edit
      hidden: boolean;        // If true, not visible to candidate initially
    }
  };        // Optional categorization tags
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
      type: 'code';
      language: string;
      time_limit: number;
      points: number;
      difficulty: string;
      files: {
        [fileName: string]: {
          content: string;
          language: string;
        }
      };
      test_cases?: {
        id: string;
        name: string;
        input: string;
        expected_output: string;
        is_public: boolean;
        points: number;
      }[];
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

### GET /admin/challenges/code/:id
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
      type: 'code';
      language: string;
      time_limit: number;
      points: number;
      difficulty: 'easy' | 'medium' | 'hard';
      files: {
        [fileName: string]: {
          content: string;
          language: string;
          readonly?: boolean;
          hidden?: boolean;
        }
      };
      test_cases?: {
        id: string;
        name: string;
        input: string;
        expected_output: string;
        is_public: boolean;
        points: number;
      }[];
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

### PUT /admin/challenges/code/:id
**Request:**
```typescript
{
  title?: string;
  description?: string;
  instructions?: string;
  language?: string;
  timeLimit?: number;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  files?: Record<string, FileTemplate>;
  testCases?: TestCase[];
  tags?: string[];
}
```

### POST /admin/challenges/code/:id/preview
**Request:**
```typescript
{
  candidateView: boolean;    // If true, return candidate-visible structure only
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
      file_structure: {
        [fileName: string]: {
          content: string;
          language: string;
          readonly?: boolean;
        }
      };
      public_test_cases: {
        id: string;
        name: string;
        input: string;
        expected_output: string;
      }[];
      instructions: string;
      time_limit: number;
    }
  }
}
```

### POST /admin/challenges/code/:id/test
**Request:**
```typescript
{
  files: {
    [fileName: string]: {
      content: string;
      language: string;
    }
  };
  test_case_id?: string;         // Specific test case, or all if omitted
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
      results: {
        test_case_id: string;
        passed: boolean;
        output: string;
        expected_output: string;
        execution_time: number;
        memory_usage: number;
        error?: string;
      }[];
      overall_score: number;      // 0-100 percentage
      total_tests: number;
      passed_tests: number;
    }
  }
}
```

## File Template Structure
```typescript
interface FileTemplate {
  content: string;
  readonly: boolean;
  hidden: boolean;
  language?: string;           // Override challenge language for specific files
}

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  points: number;
  timeout?: number;            // Execution timeout in seconds
}
```

## Acceptance Criteria
- ✅ Form builder untuk code challenge dengan rich text editor
- ✅ File management: create, edit, delete, reorder files
- ✅ Language selection dengan syntax highlighting preview
- ✅ Test case builder dengan input/output validation
- ✅ Challenge preview dalam candidate view
- ✅ Version control untuk published challenges
- ✅ File template validation (at least 1 editable file required)
- ✅ Test execution untuk validation during creation
- ✅ Challenge duplication dengan modification
- ✅ Import/export challenge definitions

## Validation Rules
- **Title**: 3-100 characters, unique per assessment
- **Description**: Required, max 500 characters
- **Instructions**: Required, max 5000 characters, markdown support
- **Language**: Must be from supported languages list
- **Time Limit**: 1-180 minutes (3 hours max for complex challenges)
- **Points**: 1-100 points per challenge
- **Files**: At least 1 file required, at least 1 must be editable
- **File Names**: Valid file extensions for selected language
- **Test Cases**: If provided, at least 1 test case required
- **Test Case Points**: Sum cannot exceed challenge total points

## File Management Features
- **File Explorer**: Tree view with drag-and-drop reordering
- **Syntax Highlighting**: Language-specific highlighting in editor
- **File Validation**: Extension validation per language
- **Template Presets**: Common file structures for each language
- **Import Files**: Upload existing project structure
- **File Dependencies**: Specify file relationships (imports, etc.)

## Test Case Management
- **Visual Test Builder**: Input/output forms with validation
- **Batch Import**: CSV/JSON import for multiple test cases
- **Test Execution**: Real-time testing during challenge creation
- **Public/Private**: Mix of visible and hidden test cases
- **Performance Metrics**: Track execution time and memory usage
- **Test Categories**: Group tests by functionality/edge cases

