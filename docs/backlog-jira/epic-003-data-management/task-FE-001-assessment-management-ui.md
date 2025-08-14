# TASK-FE-001: Assessment Management UI (Frontend)

**Story**: Story-001 Assessment CRUD + Lifecycle  
**Estimasi**: 3 hari

## Dependencies
- Assessment CRUD backend API completed
- Admin authentication system
- Rich text editor integration

## Acceptance Criteria Frontend

### Assessment List & Dashboard
- ✅ **Assessment list** dengan grid/table view
- ✅ **Search & filtering** dengan real-time results
- ✅ **Status filtering** dengan visual indicators
- ✅ **Pagination** dengan page navigation
- ✅ **Sorting** untuk multiple columns
- ✅ **Bulk actions** untuk multiple assessments

### Assessment Form
- ✅ **Create assessment form** dengan validation
- ✅ **Edit assessment form** dengan auto-save
- ✅ **Rich text editor** untuk instructions
- ✅ **Status management** dengan confirmation
- ✅ **Form field validation** dengan real-time feedback
- ✅ **Assessment templates** selection

### UI/UX Requirements
- ✅ **Responsive design** untuk mobile/desktop
- ✅ **Loading states** untuk async operations
- ✅ **Error handling** dengan user-friendly messages
- ✅ **Success notifications** untuk operations
- ✅ **Confirmation dialogs** untuk destructive actions

## Component Structure

```typescript
// src/components/admin/assessments/AssessmentList.tsx
interface AssessmentListProps {
  onSelectAssessment?: (assessment: Assessment) => void;
  enableBulkActions?: boolean;
}

// src/components/admin/assessments/AssessmentForm.tsx
interface AssessmentFormProps {
  assessment?: Assessment;
  mode: 'create' | 'edit';
  onSave: (assessment: CreateAssessmentRequest) => Promise<void>;
  onCancel: () => void;
}

// src/components/admin/assessments/StatusManager.tsx
interface StatusManagerProps {
  currentStatus: AssessmentStatus;
  onStatusChange: (status: AssessmentStatus, reason?: string) => Promise<void>;
}
```

## Validation Rules
- **Title**: 3-100 characters, unique validation
- **Description**: Required, max 500 characters
- **Time Limit**: 1-480 minutes
- **Pass Threshold**: 0-100 percentage
- **Status Transitions**: Enforce business rules

## Testing Requirements
- ✅ Component unit tests dengan React Testing Library
- ✅ Form validation tests
- ✅ User interaction tests
- ✅ Error handling tests