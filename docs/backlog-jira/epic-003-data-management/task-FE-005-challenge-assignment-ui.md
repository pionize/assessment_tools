# TASK-FE-005: Challenge Assignment & Ordering UI (Frontend)

**Story**: Story-005 Assessment-Challenge Linking + Ordering  
**Estimasi**: 3 hari

## Dependencies
- Assessment-challenge linking backend API completed
- Drag-and-drop library (react-beautiful-dnd)
- Challenge search/filtering components

## Acceptance Criteria Frontend

### Challenge Assignment Interface
- ✅ **Challenge library** dengan search dan filtering
- ✅ **Available challenges** list dengan pagination
- ✅ **Challenge selection** dengan add/remove buttons
- ✅ **Assessment challenge list** dengan current assignments
- ✅ **Duplicate prevention** dengan visual feedback
- ✅ **Challenge details preview** dalam modal/sidebar

### Drag-and-Drop Ordering
- ✅ **Sortable challenge list** dengan drag handles
- ✅ **Visual drop indicators** during drag operations
- ✅ **Order persistence** dengan optimistic updates
- ✅ **Order validation** dengan error handling
- ✅ **Undo/redo functionality** untuk ordering changes
- ✅ **Keyboard accessibility** untuk reordering

### Challenge Configuration
- ✅ **Points override** per challenge dengan validation
- ✅ **Time limit override** dengan reasonable constraints
- ✅ **Required/optional** toggle per challenge
- ✅ **Bulk configuration** untuk multiple challenges
- ✅ **Settings preview** dengan impact calculation

## Component Structure

```typescript
// src/components/admin/assessments/ChallengeAssignment.tsx
interface ChallengeAssignmentProps {
  assessmentId: string;
  onAssignmentChange?: (challenges: AssignedChallenge[]) => void;
}

// src/components/admin/assessments/ChallengeLibrary.tsx
interface ChallengeLibraryProps {
  excludeAssessmentId?: string;
  onChallengeSelect: (challenge: Challenge) => void;
  selectedChallenges: string[];
}

// src/components/admin/assessments/AssignedChallengeList.tsx
interface AssignedChallengeListProps {
  challenges: AssignedChallenge[];
  onReorder: (challenges: AssignedChallenge[]) => void;
  onRemove: (challengeId: string) => void;
  onConfigChange: (challengeId: string, config: ChallengeConfig) => void;
}
```

## Drag-and-Drop Implementation

```typescript
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const handleDragEnd = (result: DropResult) => {
  if (!result.destination) return;
  
  const items = Array.from(challenges);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);
  
  // Update order positions
  const updatedItems = items.map((item, index) => ({
    ...item,
    order: index + 1
  }));
  
  // Optimistic update
  setChallenges(updatedItems);
  
  // Send to backend
  updateChallengeOrder(assessmentId, updatedItems)
    .catch(error => {
      // Revert on error
      setChallenges(challenges);
      showError('Failed to update order');
    });
};
```

## Challenge Library Features

```typescript
interface ChallengeFilter {
  search: string;
  type: ChallengeType | 'all';
  difficulty: Difficulty | 'all';
  sortBy: 'title' | 'created_at' | 'difficulty';
  sortOrder: 'asc' | 'desc';
}

interface ChallengeCard {
  challenge: Challenge;
  isSelected: boolean;
  isAlreadyAssigned: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

const ChallengeLibrary = ({ excludeAssessmentId, onChallengeSelect }: Props) => {
  const [filters, setFilters] = useState<ChallengeFilter>({
    search: '',
    type: 'all',
    difficulty: 'all',
    sortBy: 'title',
    sortOrder: 'asc'
  });
  
  const { data: challenges, loading } = useAvailableChallenges({
    ...filters,
    exclude_assessment_id: excludeAssessmentId
  });
  
  return (
    <div className="challenge-library">
      <ChallengeFilters filters={filters} onChange={setFilters} />
      <ChallengeGrid 
        challenges={challenges}
        onSelect={onChallengeSelect}
        loading={loading}
      />
    </div>
  );
};
```

## Challenge Configuration Panel

```typescript
interface ChallengeConfig {
  points_override?: number;
  time_limit_override?: number;
  required: boolean;
}

const ChallengeConfigPanel = ({ challenge, config, onChange }: Props) => {
  const [localConfig, setLocalConfig] = useState(config);
  
  const handleChange = (field: keyof ChallengeConfig, value: any) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    onChange(challenge.id, newConfig);
  };
  
  return (
    <div className="config-panel">
      <div className="config-field">
        <label>Points Override</label>
        <input
          type="number"
          min={1}
          max={challenge.points * 2}
          value={localConfig.points_override || challenge.points}
          onChange={(e) => handleChange('points_override', parseInt(e.target.value))}
        />
        <small>Original: {challenge.points} points</small>
      </div>
      
      <div className="config-field">
        <label>Time Limit Override</label>
        <input
          type="number"
          min={1}
          max={300}
          value={localConfig.time_limit_override || challenge.time_limit}
          onChange={(e) => handleChange('time_limit_override', parseInt(e.target.value))}
        />
        <small>Original: {challenge.time_limit} minutes</small>
      </div>
      
      <div className="config-field">
        <label>
          <input
            type="checkbox"
            checked={localConfig.required}
            onChange={(e) => handleChange('required', e.target.checked)}
          />
          Required Challenge
        </label>
      </div>
    </div>
  );
};
```

## Validation & Error Handling
- ✅ **Order validation**: Sequential order checking
- ✅ **Duplicate prevention**: Real-time checking
- ✅ **Override limits**: Points dan time validation
- ✅ **Network errors**: Graceful error handling dengan retry
- ✅ **Optimistic updates**: Immediate UI feedback

## UI/UX Requirements
- ✅ **Responsive design** untuk mobile/tablet usage
- ✅ **Loading states** untuk async operations
- ✅ **Success/error feedback** dengan toast notifications
- ✅ **Keyboard shortcuts** untuk power users
- ✅ **Bulk selection** dengan checkbox interface
- ✅ **Search highlighting** dalam challenge titles

## Testing Requirements
- ✅ Component unit tests dengan React Testing Library
- ✅ Drag-and-drop functionality tests
- ✅ Challenge assignment workflow tests
- ✅ Configuration panel tests
- ✅ Search and filtering tests
- ✅ Error handling dan validation tests