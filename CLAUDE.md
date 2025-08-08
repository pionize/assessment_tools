# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start dev server**: `npm run dev` (runs on localhost:5173)
- **Build for production**: `npm run build` (TypeScript compilation + Vite build)
- **Lint code**: `npm run lint` (ESLint with TypeScript support)
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React-based Developer Assessment Platform built with TypeScript, Vite, and Tailwind CSS. The application allows candidates to complete coding challenges, multiple-choice questions, and open-ended questions with real-time timers.

### Core Architecture

**State Management**: Context API with useReducer pattern
- `AssessmentContext` manages global state (candidate info, assessment data, submissions)
- Session persistence via `sessionStorage` utility
- State synchronization between context and session storage

**Routing Structure**:
- `/assessment/:assessmentId` - Login page
- `/assessment/:assessmentId/challenges` - Challenge list dashboard  
- `/assessment/:assessmentId/challenge/:challengeId` - Challenge detail page

**Component Architecture**:
- UI components in `src/components/ui/` (Button, Card, Badge, Table)
- Feature components in `src/components/` (Login, ChallengeList, ChallengeDetail, etc.)
- Context providers in `src/contexts/`
- API services in `src/services/api.ts`

### Key Features

**Challenge Types**:
1. **Code challenges**: Monaco Editor with file tree, multi-language support, auto-save
2. **Multiple choice**: Dynamic question rendering with option selection
3. **Open-ended**: Textarea for free-form answers

**Assessment Flow**:
1. Candidate authentication (name/email validation)
2. Challenge dashboard with progress tracking
3. Individual challenge completion with timers
4. Auto-submit on timeout + manual submit
5. Final assessment submission

**Session Management**:
- Persistent sessions via localStorage (mock backend simulation)
- Time tracking with remaining time calculations  
- Session expiration handling
- Resume capability across browser sessions

### Data Flow

**Mock API** (`src/services/api.ts`):
- Simulates backend with localStorage for session persistence
- Implements full API contract from `docs/api-contract.md`
- Handles authentication, challenge retrieval, and submissions
- Validates submission data according to API contract

**Submission Types**:
- Code: `{ files: Record<string, string>, language: string }`
- Multiple Choice: `{ answers: Record<string, string> }` (questionId -> optionId)
- Open-ended: `{ answer: string }`

### File Structure Notes

- `docs/` contains API contract and database schema documentation
- `src/utils/sessionStorage.ts` handles state persistence
- Components use TypeScript interfaces from API service
- Tailwind CSS for styling with responsive design
- Monaco Editor integration for code challenges with syntax highlighting

### Testing

The codebase uses ESLint for code quality but doesn't include a test framework. When adding tests, check existing patterns in the mock data and component structure.

### Development Notes

- Assessment ID `assessment-123` is used for demo/testing
- Mock data includes complete examples for all challenge types
- File tree functionality in CodeEditor supports folder creation and file management
- Auto-save drafts are stored in context and session storage
- Timer components handle countdown and auto-submission logic
- When applying fixes or changes, please ensure that the modifications do not introduce any errors and do not alter the original context or intent of the code.