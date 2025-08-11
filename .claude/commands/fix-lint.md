# Fix Lint Errors

## Context Requirements
Before making ANY changes, you MUST:
1. Analyze the ENTIRE file structure and understand all dependencies
2. Identify ALL imported modules, types, and interfaces used in the file
3. Map out the component/function relationships and data flow
4. Understand the existing code patterns and conventions used in the project
5. Check for any global configurations or ESLint rules specific to this project

## Pre-Fix Analysis
First, provide a brief analysis of:
- The file's purpose and role in the application
- Key dependencies and their usage
- Current code patterns being followed
- Potential side effects of fixes on other parts of the code

## Fixing Guidelines

### DO:
- **Preserve ALL existing functionality** - never remove or modify business logic
- **Maintain all imports** that are actually being used in the code
- **Keep the same code style** and formatting conventions as the existing code
- **Fix one category of errors at a time** in order of priority:
  1. Syntax errors
  2. Type errors
  3. Import/export issues
  4. Variable declarations
  5. Code style/formatting
- **Test each fix mentally** by tracing through the code flow
- **Preserve comments** and documentation
- **Maintain backward compatibility** with existing API contracts

### DON'T:
- Remove imports without verifying they're truly unused
- Change variable/function names unless absolutely necessary
- Modify the logic flow or algorithms
- Add new dependencies without explicit permission
- Auto-fix issues that might change behavior
- Ignore TypeScript type definitions
- Break existing interfaces or contracts

## Step-by-Step Process

1. **Initial Assessment**
   - List all lint errors found
   - Categorize them by severity and type
   - Identify any interconnected issues

2. **Context Gathering**
   - Review related files if needed (ask for them if not provided)
   - Understand the module's exports and how they're used elsewhere
   - Check for any custom ESLint configurations

3. **Fix Implementation**
   - Start with the most critical errors
   - For each fix, explain:
     - What the error is
     - Why it occurred
     - How you're fixing it
     - Any potential impacts

4. **Validation**
   - After each fix, mentally verify:
     - The code still compiles
     - Types are properly resolved
     - No new errors are introduced
     - Functionality remains unchanged

## Common Pitfalls to Avoid

1. **Import Removal**: Never remove an import just because ESLint says it's unused without checking:
   - JSX elements (React components)
   - Types used in annotations
   - Side-effect imports
   - Re-exported modules

2. **Type Assertions**: Don't add 'any' types or ignore TypeScript errors - fix them properly

3. **Async/Await**: Ensure proper handling of promises and async operations

4. **Dependencies**: Check that all dependencies exist in package.json

5. **React Specific**:
   - Don't remove React import if JSX is used
   - Preserve key props in lists
   - Maintain proper hook dependencies

## Validation Commands

After applying fixes, ALWAYS verify by running:
1. **`npm run typecheck`** - Ensure TypeScript compilation passes without errors
2. **`npm run build`** - Verify the build process completes successfully

If these commands would fail, DO NOT proceed with the fix. Instead:
- Identify what would cause the failure
- Adjust the fix to ensure both commands pass
- If a fix would break the build, leave the lint warning and explain why

## Build Error Prevention

Before finalizing any fix, mentally simulate:
- Would `tsc` compile this without errors?
- Are all type definitions properly resolved?
- Would the build process succeed?
- Are there any circular dependencies introduced?
- Do all imported modules exist and export what's being imported?

Common build-breaking issues to avoid:
- Missing type exports/imports
- Incorrect module resolution paths
- Incompatible type assignments
- Broken dependency chains
- Invalid JSX/TSX syntax
- Async/await without proper Promise handling

## Output Format

Provide the fixed code with:
1. A summary of what was fixed
2. Confirmation that the fixes would pass:
   - ✅ `npm run typecheck` - TypeScript compilation
   - ✅ `npm run build` - Build process
3. Any warnings about changes that might need review
4. Suggestions for further improvements (if any)
5. List of any lint errors that couldn't be safely fixed and why

## Example Context Request

If you need more context, ask specifically:
- "I need to see the TypeScript interfaces defined in [file]"
- "What is the ESLint configuration for this project?"
- "How is this component/function used in other files?"
- "What are the project's coding conventions?"

## Final Checklist

Before presenting the fixed code, verify:
- [ ] All imports are still valid and used
- [ ] No business logic was changed
- [ ] Type safety is maintained or improved
- [ ] Code follows existing patterns
- [ ] No new runtime errors introduced
- [ ] All lint errors that can be safely fixed are resolved
- [ ] Documentation/comments are preserved
- [ ] **`npm run typecheck` would pass** - No TypeScript compilation errors
- [ ] **`npm run build` would succeed** - No build process failures

Remember: It's better to leave a lint warning than to break working code. When in doubt, ask for clarification or additional context.

## Critical: Build Validation

**NEVER submit a fix without ensuring both `npm run typecheck` and `npm run build` would pass.**

If you're unsure whether your fixes would pass these checks, explicitly state:
- "Please run `npm run typecheck` after applying these changes"
- "Please verify with `npm run build` before committing"
- Which specific changes might need additional testing