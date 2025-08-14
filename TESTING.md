# Testing Documentation

This project includes comprehensive testing setup with both unit tests and end-to-end (e2e) tests.

## Test Structure

```
src/
├── test/
│   └── setup.ts                    # Test setup configuration
├── utils/
│   └── sessionStorage.test.ts      # Utility function tests
├── contexts/
│   └── AssessmentContext.test.tsx  # Context provider tests
├── services/
│   └── api.test.ts                 # API service integration tests
└── components/
    ├── ui/
    │   ├── Button.test.tsx         # UI component tests
    │   └── Card.test.tsx           # UI component tests
    ├── Login.test.tsx              # Login component tests
    └── MultipleChoiceChallenge.test.tsx # Challenge component tests

e2e/
├── login.spec.ts                   # Login flow e2e tests
├── challenge-list.spec.ts          # Challenge list e2e tests
├── multiple-choice-challenge.spec.ts # Multiple choice e2e tests
├── code-challenge.spec.ts          # Code challenge e2e tests
└── assessment-flow.spec.ts         # Complete assessment flow tests
```

## Testing Frameworks

### Unit Testing
- **Vitest**: Fast unit test runner with ESM support
- **React Testing Library**: Component testing utilities
- **jsdom**: Browser environment simulation

### E2E Testing
- **Playwright**: Cross-browser end-to-end testing
- **Multi-browser support**: Chromium, Firefox, WebKit
- **Mobile testing**: Pixel 5 emulation

## Test Scripts

```bash
# Unit Tests
npm run test              # Run unit tests
npm run test:watch        # Run unit tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:ui           # Open Vitest UI

# E2E Tests
npm run e2e               # Run e2e tests
npm run e2e:ui            # Run e2e tests with UI mode
npm run e2e:debug         # Run e2e tests in debug mode

# All Tests
npm run test:all          # Run both unit and e2e tests
```

## Configuration Files

### Vitest Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
})
```

### Playwright Configuration (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Test Categories

### 1. Utility Tests (`sessionStorage.test.ts`)
- Session storage operations
- Data persistence and retrieval
- Error handling for invalid JSON
- Session management functions

### 2. Context Tests (`AssessmentContext.test.tsx`)
- State management actions
- Provider functionality
- Hook usage validation
- State transitions

### 3. API Integration Tests (`api.test.ts`)
- Authentication flow
- Challenge retrieval
- Submission handling
- Session validation
- Error scenarios

### 4. Component Tests
- **UI Components**: Button, Card styling and behavior
- **Login Component**: Form validation, authentication flow
- **Challenge Components**: User interactions, submissions

### 5. E2E Test Scenarios

#### Login Flow (`login.spec.ts`)
- Form validation
- Successful authentication
- Error handling
- Session persistence

#### Challenge List (`challenge-list.spec.ts`)
- Challenge display
- Navigation between challenges
- Progress tracking
- Timer functionality

#### Multiple Choice Challenge (`multiple-choice-challenge.spec.ts`)
- Question rendering
- Answer selection
- Progress tracking
- Results display
- Navigation after submission

#### Code Challenge (`code-challenge.spec.ts`)
- Monaco editor integration
- File tree operations
- Code editing
- Submission flow

#### Complete Assessment Flow (`assessment-flow.spec.ts`)
- End-to-end user journey
- Multi-challenge completion
- Session persistence
- Error scenarios

## Test Features

### Mocking Strategy
- **localStorage**: Mocked for session storage tests
- **API calls**: Mocked with vi.mock()
- **Browser APIs**: Mocked window.confirm, window.alert
- **Router**: React Router mocked for navigation tests

### Test Data
- Mock candidates and assessments
- Sample challenge data (code, multiple choice, open-ended)
- Submission examples

### Assertions
- Component rendering
- User interactions
- State changes
- Navigation
- API calls
- Error handling

## Running Tests

### Development
```bash
# Run tests during development
npm run test:watch

# Debug specific test
npm run test -- src/utils/sessionStorage.test.ts
```

### CI/CD
```bash
# Run all tests (suitable for CI)
npm run test:all
```

### Browser Testing
```bash
# Test in specific browser
npm run e2e -- --project=firefox

# Test with UI for debugging
npm run e2e:ui
```

## Coverage

The unit tests provide comprehensive coverage for:
- Utility functions (sessionStorage)
- Context providers (AssessmentContext)
- API service methods
- UI components
- Core application components

The e2e tests cover:
- Complete user workflows
- Cross-browser compatibility
- Mobile responsiveness
- Error scenarios
- Session persistence

## Notes for Developers

1. **Test Data**: Use the mock data provided in test files for consistency
2. **Async Testing**: Properly handle promises and async operations
3. **User Events**: Use fireEvent and userEvent for realistic interactions
4. **Accessibility**: Tests include ARIA labels and semantic HTML testing
5. **Mobile Testing**: E2E tests include mobile viewport testing
6. **Error Handling**: Both happy path and error scenarios are tested

## Continuous Integration

These tests are designed to run in CI environments:
- Headless browser execution
- Parallel test execution
- Retry on failure
- Test result reporting
- Cross-platform compatibility

## Future Enhancements

Consider adding:
- Visual regression testing
- Performance testing
- Accessibility testing with axe-core
- API contract testing
- Load testing for high-traffic scenarios
