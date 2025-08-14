# TASK-FE-004: Challenge Builder UI (Frontend)

## Deskripsi
Implementasi comprehensive challenge builder interface untuk semua tipe challenge dengan advanced editing capabilities dan real-time preview.

## Estimasi
**7 hari**

## Dependencies
- Challenge management backend API completed
- Monaco Editor integration untuk code editing
- Rich text editor library (TinyMCE/Quill)
- Drag-and-drop library untuk question reordering
- File upload component dengan validation

## Acceptance Criteria Frontend

### Challenge Builder Dashboard
- ✅ **Challenge type selection** dengan guided creation wizard
- ✅ **Challenge library** dengan advanced search dan filtering
- ✅ **Template gallery** untuk quick challenge creation
- ✅ **Bulk operations** untuk challenge management
- ✅ **Challenge statistics** overview dengan usage metrics
- ✅ **Import/export** functionality untuk challenge definitions
- ✅ **Challenge duplication** dengan customization options

### Code Challenge Builder
- ✅ **File structure editor** dengan Monaco Editor integration
- ✅ **Language selection** dengan syntax highlighting
- ✅ **Test case builder** dengan input/output validation
- ✅ **Code execution testing** dengan real-time results
- ✅ **File template management** dengan version control
- ✅ **Performance monitoring** untuk test execution
- ✅ **Security validation** feedback

### Multiple Choice Builder
- ✅ **Question editor** dengan rich text support
- ✅ **Option management** dengan drag-and-drop reordering
- ✅ **Media attachment** support (images, videos)
- ✅ **Bulk question import** dari CSV/JSON
- ✅ **Question randomization** settings
- ✅ **Answer validation** dengan scoring preview
- ✅ **Question categorization** dengan tagging

### Open-ended Builder
- ✅ **Rich text question editor** dengan markdown support
- ✅ **Word limit configuration** dengan validation
- ✅ **Attachment settings** management
- ✅ **Scoring rubric builder** dengan criteria definition
- ✅ **Sample answer management** untuk reference
- ✅ **Auto-save settings** configuration

## Component Structure

```typescript
// src/components/admin/challenges/ChallengeBuilder.tsx
interface ChallengeBuilderProps {
  challengeType: 'code' | 'multiple-choice' | 'open-ended';
  challenge?: Challenge;
  mode: 'create' | 'edit' | 'duplicate';
  onSave: (challenge: CreateChallengeRequest) => Promise<void>;
  onCancel: () => void;
}

// src/components/admin/challenges/CodeChallengeBuilder.tsx
interface CodeChallengeBuilderProps {
  challenge?: CodeChallenge;
  onSave: (challenge: CodeChallengeData) => Promise<void>;
  enableTesting?: boolean;
  availableLanguages: string[];
}

// src/components/admin/challenges/FileEditor.tsx
interface FileEditorProps {
  files: Record<string, FileTemplate>;
  language: string;
  onChange: (files: Record<string, FileTemplate>) => void;
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

// src/components/admin/challenges/TestCaseBuilder.tsx
interface TestCaseBuilderProps {
  testCases: TestCase[];
  language: string;
  onChange: (testCases: TestCase[]) => void;
  onExecute: (testCase: TestCase) => Promise<TestResult>;
  enableBulkImport?: boolean;
}
```

### Code Challenge Components

```typescript
// File structure management
<FileStructureEditor
  files={challenge.files}
  language={challenge.language}
  onFileAdd={handleFileAdd}
  onFileDelete={handleFileDelete}
  onFileRename={handleFileRename}
  onContentChange={handleContentChange}
  templates={fileTemplates}
  validation={fileValidation}
/>

// Test case management with execution
<TestCaseManager
  testCases={challenge.testCases}
  onAdd={handleTestCaseAdd}
  onUpdate={handleTestCaseUpdate}
  onDelete={handleTestCaseDelete}
  onExecute={handleTestExecution}
  onBulkImport={handleBulkImport}
  executionResults={testResults}
/>

// Language-specific configuration
<LanguageConfig
  language={challenge.language}
  config={challenge.executionConfig}
  onChange={handleConfigChange}
  presets={languagePresets}
  validation={configValidation}
/>
```

### Multiple Choice Components

```typescript
// Question builder with rich text
<QuestionBuilder
  questions={challenge.questions}
  onQuestionAdd={handleQuestionAdd}
  onQuestionUpdate={handleQuestionUpdate}
  onQuestionDelete={handleQuestionDelete}
  onReorder={handleQuestionReorder}
  enableRichText={true}
  mediaUpload={true}
/>

// Option management with validation
<OptionManager
  question={selectedQuestion}
  options={question.options}
  onOptionAdd={handleOptionAdd}
  onOptionUpdate={handleOptionUpdate}
  onOptionDelete={handleOptionDelete}
  onCorrectAnswerChange={handleCorrectAnswerChange}
  allowMultipleCorrect={challenge.allowMultiple}
/>

// Bulk import interface
<BulkQuestionImport
  onImport={handleBulkImport}
  supportedFormats={['csv', 'json', 'xlsx']}
  templateDownload={true}
  validation={importValidation}
  preview={true}
/>
```

### Open-ended Components

```typescript
// Rich text editor with markdown
<RichTextEditor
  content={challenge.instructions}
  onChange={handleInstructionsChange}
  enableMarkdown={true}
  enablePreview={true}
  toolbarOptions={editorToolbar}
  validation={textValidation}
/>

// Scoring rubric builder
<ScoringRubricBuilder
  rubric={challenge.scoringRubric}
  onChange={handleRubricChange}
  criteria={rubricCriteria}
  weightings={scoringWeights}
  presets={rubricPresets}
/>

// Word limit and attachment settings
<ResponseSettings
  minWords={challenge.minWords}
  maxWords={challenge.maxWords}
  allowAttachments={challenge.allowAttachments}
  maxAttachments={challenge.maxAttachments}
  attachmentTypes={allowedTypes}
  onChange={handleSettingsChange}
/>
```

## Advanced Features

### Challenge Preview System
```typescript
interface ChallengePreview {
  mode: 'candidate' | 'admin';
  challenge: Challenge;
  showMetadata?: boolean;
  interactive?: boolean;
}

<ChallengePreview
  challenge={currentChallenge}
  mode="candidate"
  onInteract={handlePreviewInteraction}
  showTimer={true}
  enableSubmission={false}
/>
```

### Template Management
```typescript
interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  category: string;
  defaults: Partial<Challenge>;
  popularity: number;
}

<TemplateGallery
  templates={availableTemplates}
  onSelect={handleTemplateSelection}
  categories={templateCategories}
  enableCustomization={true}
  enablePreview={true}
/>
```

### Collaborative Editing
```typescript
interface CollaborativeFeatures {
  enableRealTimeSync: boolean;
  showCursorPositions: boolean;
  enableComments: boolean;
  enableVersionHistory: boolean;
}

<CollaborativeEditor
  challenge={challenge}
  collaborators={activeCollaborators}
  onSync={handleRealtimeSync}
  onComment={handleComment}
  onVersionRevert={handleVersionRevert}
  conflictResolution={conflictResolver}
/>
```

## UI/UX Requirements

### Form & Validation
- ✅ **Multi-step wizard** untuk complex challenge creation
- ✅ **Real-time validation** dengan visual feedback
- ✅ **Auto-save functionality** dengan conflict detection
- ✅ **Field dependencies** dan conditional logic
- ✅ **Progress indicators** untuk long forms
- ✅ **Keyboard shortcuts** untuk power users
- ✅ **Undo/redo functionality** untuk editing actions

### Editor Experience
- ✅ **Syntax highlighting** untuk all supported languages
- ✅ **Auto-completion** dan IntelliSense
- ✅ **Error highlighting** dengan inline diagnostics
- ✅ **Code formatting** dengan prettier integration
- ✅ **Minimap navigation** untuk large files
- ✅ **Split-screen editing** untuk multiple files
- ✅ **Vim/Emacs keybindings** support

### Testing & Validation
```typescript
// Real-time test execution
<TestExecutor
  challenge={codeChallenge}
  files={currentFiles}
  onExecute={handleTestExecution}
  onResult={handleTestResult}
  showPerformanceMetrics={true}
  enableDebugMode={true}
/>

// Validation feedback
<ValidationFeedback
  validation={currentValidation}
  errors={validationErrors}
  warnings={validationWarnings}
  suggestions={improvementSuggestions}
  autoFix={enableAutoFix}
/>
```

## Form Validation & Error Handling

```typescript
// Challenge form validation schemas
const codeChallengeSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    unique: true
  },
  language: {
    required: true,
    enum: supportedLanguages
  },
  files: {
    required: true,
    minItems: 1,
    validate: validateFileStructure
  },
  testCases: {
    validate: validateTestCases,
    minItems: 1
  }
};

const multipleChoiceSchema = {
  questions: {
    required: true,
    minItems: 1,
    validate: validateQuestions
  }
};

// Error handling dengan user-friendly messages
const errorMessages = {
  'CHALL_001': 'Please check your challenge data and try again',
  'CHALL_002': 'File validation failed. Please check file names and content',
  'CHALL_003': 'Test case validation failed. Check input/output format',
  'CHALL_004': 'A challenge with this title already exists',
  'CHALL_005': 'Unsupported programming language selected',
  'CHALL_006': 'File size exceeds the maximum limit',
  'CHALL_007': 'Code execution timed out. Consider simpler test cases',
  'CHALL_008': 'Execution environment error. Please try again',
  'NETWORK_ERROR': 'Connection failed. Your changes have been saved locally'
};
```

## Performance Optimization

### Editor Performance
- ✅ **Lazy loading** untuk large code files
- ✅ **Virtual scrolling** untuk long file lists
- ✅ **Debounced auto-save** untuk frequent changes
- ✅ **Worker threads** untuk syntax validation
- ✅ **Memory optimization** untuk multiple editors
- ✅ **Caching strategies** untuk template loading

### Rendering Optimization
- ✅ **Component memoization** untuk expensive renders
- ✅ **Virtual lists** untuk large question sets
- ✅ **Image lazy loading** untuk media content
- ✅ **Progressive enhancement** untuk rich features
- ✅ **Bundle splitting** untuk challenge types

## Responsive Design & Accessibility
- ✅ **Mobile-responsive** challenge builder
- ✅ **Touch-friendly** drag-and-drop untuk tablets
- ✅ **Keyboard navigation** untuk all features
- ✅ **Screen reader compatibility** dengan proper ARIA
- ✅ **High contrast mode** support
- ✅ **Focus management** dalam complex workflows
- ✅ **Reduced motion** support untuk animations

## Testing Requirements
- ✅ Component unit tests dengan React Testing Library
- ✅ Editor integration tests
- ✅ Form validation dan submission tests
- ✅ File upload dan management tests
- ✅ Test case execution workflow tests
- ✅ Accessibility tests dengan axe-core
- ✅ Performance tests untuk large challenges
- ✅ Cross-browser compatibility tests