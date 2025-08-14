# TASK-BE-004: Challenge Management Service (Backend)

## Deskripsi
Implementasi comprehensive backend service untuk mengelola semua tipe challenge (Code, Multiple Choice, Open-ended) dengan unified API dan advanced features.

## Estimasi
**8 hari**

## Dependencies
- Assessment CRUD service completed
- File storage service untuk code files dan assets
- Code execution service untuk test case validation
- Rich text processing service

## Acceptance Criteria Backend

### Core Challenge CRUD
- ✅ **GET /admin/challenges** dengan filtering by type, difficulty, tags
- ✅ **POST /admin/challenges/code** untuk code challenges
- ✅ **POST /admin/challenges/multiple-choice** untuk MC challenges  
- ✅ **POST /admin/challenges/open-ended** untuk essay challenges
- ✅ **GET /admin/challenges/:id** dengan type-specific data
- ✅ **PUT /admin/challenges/:id** dengan partial updates
- ✅ **DELETE /admin/challenges/:id** dengan soft delete
- ✅ **POST /admin/challenges/:id/duplicate** untuk challenge cloning

### Code Challenge Features
- ✅ **File template management** dengan version control
- ✅ **Test case execution** dengan sandboxed environment
- ✅ **Language support** (JavaScript, TypeScript, Python, Java, Go, Rust, C++)
- ✅ **Code validation** dan syntax checking
- ✅ **Performance metrics** tracking (execution time, memory)
- ✅ **Security scanning** untuk malicious code detection

### Multiple Choice Features
- ✅ **Question-option management** dengan rich text support
- ✅ **Correct answer validation** dengan scoring logic
- ✅ **Question randomization** dan option shuffling
- ✅ **Media attachment** support (images, videos)
- ✅ **Bulk import/export** dari CSV/JSON format
- ✅ **Question categorization** dengan tagging system

### Open-ended Features
- ✅ **Rich text processing** dengan markdown support
- ✅ **Word count limitations** dan validation
- ✅ **File attachment** support untuk submissions
- ✅ **Auto-save functionality** untuk candidate responses
- ✅ **Plagiarism detection** integration hooks
- ✅ **Scoring rubric** management

## Database Schema

```sql
-- Unified challenges table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('code', 'multiple-choice', 'open-ended')),
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER NOT NULL CHECK (time_limit > 0),
  points INTEGER NOT NULL CHECK (points > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  template_id UUID REFERENCES challenges(id),
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  archived_at TIMESTAMP
);

-- Code challenge specific data
CREATE TABLE code_challenges (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  language VARCHAR(20) NOT NULL,
  files JSONB NOT NULL, -- File structure with content
  test_cases JSONB DEFAULT '[]',
  execution_config JSONB DEFAULT '{}', -- Timeout, memory limits, etc.
  starter_code_template JSONB,
  solution_code JSONB -- For reference/validation
);

-- Multiple choice challenge data
CREATE TABLE multiple_choice_challenges (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- Array of questions with options
  randomize_questions BOOLEAN DEFAULT false,
  randomize_options BOOLEAN DEFAULT false,
  allow_multiple_selections BOOLEAN DEFAULT false,
  show_explanations BOOLEAN DEFAULT true
);

-- Open-ended challenge data
CREATE TABLE open_ended_challenges (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  min_words INTEGER DEFAULT 0,
  max_words INTEGER,
  allow_attachments BOOLEAN DEFAULT false,
  max_attachments INTEGER DEFAULT 3,
  max_attachment_size INTEGER DEFAULT 10485760, -- 10MB
  scoring_rubric JSONB,
  sample_answers JSONB -- For reference
);

-- Challenge statistics
CREATE TABLE challenge_stats (
  challenge_id UUID PRIMARY KEY REFERENCES challenges(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  submission_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  average_completion_time INTEGER, -- in seconds
  difficulty_rating DECIMAL(3,2), -- Based on user performance
  last_used TIMESTAMP,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Test case execution results cache
CREATE TABLE test_execution_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  code_hash VARCHAR(64) NOT NULL, -- SHA-256 of submitted code
  test_results JSONB NOT NULL,
  execution_time INTEGER,
  memory_usage INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 hour'
);

-- Indexes for performance
CREATE INDEX idx_challenges_type ON challenges(type);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_tags ON challenges USING gin(tags);
CREATE INDEX idx_challenges_search ON challenges USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_test_cache_challenge ON test_execution_cache(challenge_id);
CREATE INDEX idx_test_cache_hash ON test_execution_cache(code_hash);
CREATE INDEX idx_test_cache_expires ON test_execution_cache(expires_at);
```

## API Implementation Details

### Code Challenge Test Execution
```typescript
interface CodeExecutionRequest {
  challengeId: string;
  files: Record<string, string>;
  testCaseId?: string; // Run specific test or all
}

interface CodeExecutionResult {
  testResults: {
    testCaseId: string;
    passed: boolean;
    output: string;
    expectedOutput: string;
    executionTime: number;
    memoryUsage: number;
    error?: string;
  }[];
  overallScore: number;
  securityIssues: SecurityIssue[];
  performanceMetrics: PerformanceMetrics;
}
```

### Challenge Validation Engine
```typescript
const validateCodeChallenge = async (challengeData: CodeChallengeData) => {
  // Validate file structure
  if (!challengeData.files || Object.keys(challengeData.files).length === 0) {
    throw new ValidationError('At least one file template is required');
  }

  // Validate language and file extensions
  const validExtensions = getValidExtensions(challengeData.language);
  for (const fileName of Object.keys(challengeData.files)) {
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      throw new ValidationError(`Invalid file extension for ${challengeData.language}: ${fileName}`);
    }
  }

  // Validate test cases
  if (challengeData.testCases && challengeData.testCases.length > 0) {
    await validateTestCases(challengeData.testCases, challengeData.files);
  }
};

const validateMultipleChoiceChallenge = (challengeData: MCChallengeData) => {
  for (const question of challengeData.questions) {
    if (question.options.length < 2) {
      throw new ValidationError('Each question must have at least 2 options');
    }
    
    const correctAnswers = question.options.filter(opt => opt.isCorrect);
    if (correctAnswers.length === 0) {
      throw new ValidationError('Each question must have at least one correct answer');
    }
  }
};
```

### Advanced Search & Filtering
```typescript
interface ChallengeSearchParams {
  search?: string;
  type?: ChallengeType | 'all';
  difficulty?: Difficulty | 'all';
  language?: string; // For code challenges
  tags?: string[];
  createdBy?: string;
  usageCount?: { min?: number; max?: number };
  averageScore?: { min?: number; max?: number };
  dateRange?: { from: string; to: string };
  hasTestCases?: boolean; // For code challenges
  questionCount?: { min?: number; max?: number }; // For MC challenges
  wordLimit?: { min?: number; max?: number }; // For open-ended
}
```

## Security & Performance

### Code Execution Security
```typescript
interface ExecutionEnvironment {
  language: string;
  timeoutSeconds: number;
  memoryLimitMB: number;
  allowedModules: string[];
  blockedFunctions: string[];
  networkAccess: boolean;
  fileSystemAccess: 'readonly' | 'none';
}

const securityConfigs: Record<string, ExecutionEnvironment> = {
  javascript: {
    language: 'javascript',
    timeoutSeconds: 30,
    memoryLimitMB: 128,
    allowedModules: ['lodash', 'moment'],
    blockedFunctions: ['eval', 'Function', 'require'],
    networkAccess: false,
    fileSystemAccess: 'none'
  },
  python: {
    language: 'python',
    timeoutSeconds: 30,
    memoryLimitMB: 256,
    allowedModules: ['numpy', 'pandas', 'math'],
    blockedFunctions: ['exec', 'eval', '__import__'],
    networkAccess: false,
    fileSystemAccess: 'readonly'
  }
};
```

### Performance Optimization
- ✅ **Result caching** untuk test execution dengan TTL
- ✅ **Background processing** untuk heavy operations
- ✅ **Database query optimization** dengan proper indexing
- ✅ **File compression** untuk large code templates
- ✅ **CDN integration** untuk media assets
- ✅ **Connection pooling** untuk database efficiency

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| CHALL_001 | 400 | Invalid challenge data |
| CHALL_002 | 400 | File validation failed |
| CHALL_003 | 400 | Test case validation failed |
| CHALL_004 | 409 | Challenge title already exists |
| CHALL_005 | 400 | Unsupported programming language |
| CHALL_006 | 413 | File size exceeds limit |
| CHALL_007 | 408 | Code execution timeout |
| CHALL_008 | 500 | Execution environment error |
| CHALL_009 | 404 | Challenge not found |
| CHALL_010 | 403 | Insufficient permissions |

## Testing Requirements
- ✅ Unit tests untuk all challenge types
- ✅ Integration tests untuk API endpoints
- ✅ Security tests untuk code execution
- ✅ Performance tests untuk large datasets
- ✅ Validation tests untuk all input scenarios
- ✅ Database constraint tests
- ✅ File handling tests untuk edge cases

## Monitoring & Analytics
- ✅ **Usage analytics** tracking per challenge
- ✅ **Performance monitoring** untuk code execution
- ✅ **Error rate tracking** dengan alerting
- ✅ **Resource utilization** monitoring
- ✅ **Success rate metrics** per challenge type