# TASK-FE-002: Code Challenge Builder UI (Frontend)

**Story**: Story-002 Challenge CRUD - Code Type  
**Estimasi**: 4 hari

## Dependencies
- Code challenge backend API completed
- Monaco Editor integration
- File upload component

## Acceptance Criteria Frontend

### Code Challenge Builder
- ✅ **File structure editor** dengan Monaco Editor
- ✅ **Language selection** dengan syntax highlighting
- ✅ **Test case builder** dengan input/output forms
- ✅ **Code execution testing** dengan real-time results
- ✅ **File management**: add, delete, rename files
- ✅ **Challenge preview** dalam candidate view

### File Management Features
- ✅ **File explorer** dengan tree view
- ✅ **Drag-and-drop** file reordering
- ✅ **Syntax highlighting** per language
- ✅ **Auto-completion** dan error detection
- ✅ **File validation** (extensions, content)
- ✅ **Template presets** untuk common structures

### Test Case Management
- ✅ **Visual test builder** dengan forms
- ✅ **Test execution** dengan result display
- ✅ **Public/private test cases** management
- ✅ **Batch import** dari CSV/JSON
- ✅ **Performance metrics** display

## Component Structure

```typescript
// src/components/admin/challenges/CodeChallengeBuilder.tsx
interface CodeChallengeBuilderProps {
  challenge?: CodeChallenge;
  onSave: (challenge: CodeChallengeData) => Promise<void>;
  enableTesting?: boolean;
}

// src/components/admin/challenges/FileEditor.tsx
interface FileEditorProps {
  files: Record<string, FileTemplate>;
  language: string;
  onChange: (files: Record<string, FileTemplate>) => void;
}

// src/components/admin/challenges/TestCaseBuilder.tsx
interface TestCaseBuilderProps {
  testCases: TestCase[];
  onChange: (testCases: TestCase[]) => void;
  onExecute: (testCase: TestCase) => Promise<TestResult>;
}
```

## Editor Configuration

```typescript
const monacoConfig = {
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  lineNumbers: 'on',
  folding: true,
  renderWhitespace: 'selection'
};

const languageSupport = {
  javascript: { extensions: ['.js', '.jsx'], defaultFile: 'solution.js' },
  typescript: { extensions: ['.ts', '.tsx'], defaultFile: 'solution.ts' },
  python: { extensions: ['.py'], defaultFile: 'solution.py' },
  java: { extensions: ['.java'], defaultFile: 'Solution.java' }
};
```

## Validation & Error Handling
- ✅ **File structure validation** sebelum save
- ✅ **Language-specific validation** untuk file extensions
- ✅ **Test case validation** untuk input/output format
- ✅ **Real-time error display** dalam editor
- ✅ **Save confirmation** dengan conflict resolution

## Testing Requirements
- ✅ Component unit tests dengan React Testing Library
- ✅ Monaco Editor integration tests
- ✅ File management workflow tests
- ✅ Test execution flow tests
- ✅ Form validation tests