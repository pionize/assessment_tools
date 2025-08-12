# STORY-012: Assessment CRUD Interface

## Story Information

**Story ID:** STORY-012  
**Epic:** EPIC-003 (Data Management and CRUD Operations)  
**Story Points:** 13  
**Priority:** High  
**Assignee:** Full Stack Developer  
**Status:** To Do  

## User Story

**As an** Assessment Manager  
**I want** to create, view, edit, and manage assessments through a user-friendly interface  
**So that** I can efficiently build and maintain assessment content without requiring technical expertise

## Description

This story covers the creation of a comprehensive assessment management interface that allows Assessment Managers to perform all CRUD operations on assessments. The interface should be intuitive, provide clear feedback, and maintain data integrity throughout all operations.

## Acceptance Criteria

### AC1: Assessment List Management
- [ ] Display paginated list of all assessments with key information
- [ ] Show assessment metadata: title, description, status, creation date, challenge count
- [ ] Search assessments by title, description, or creator
- [ ] Filter assessments by status (draft, active, archived), creation date, challenge count
- [ ] Sort assessments by any column (title, created date, challenge count, status)
- [ ] Quick actions: duplicate, archive, activate/deactivate, delete
- [ ] Bulk operations for multiple assessments
- [ ] Assessment status indicators (draft, active, archived, has active sessions)

### AC2: Assessment Creation Interface
- [ ] Step-by-step assessment creation wizard
- [ ] Basic information form: title, description, instructions
- [ ] Advanced settings: time limit, passing score, attempt limits
- [ ] Challenge assignment interface with search and filtering
- [ ] Drag-and-drop challenge ordering
- [ ] Assessment preview before publishing
- [ ] Save as draft option at any step
- [ ] Form validation with clear error messages
- [ ] Auto-save draft functionality every 30 seconds

### AC3: Assessment Editing Capabilities
- [ ] Edit all assessment metadata and settings
- [ ] Modify challenge assignments and ordering
- [ ] Add/remove challenges with impact warnings
- [ ] Update assessment instructions with rich text editor
- [ ] Version control showing change history
- [ ] Warning when editing assessments with active sessions
- [ ] Rollback capability for recent changes
- [ ] Change impact analysis (affects X candidates)

### AC4: Assessment Configuration
- [ ] Time limit settings (overall and per challenge)
- [ ] Passing score configuration with percentage or points
- [ ] Assessment instructions with formatting support
- [ ] Challenge weight assignment for scoring
- [ ] Attempt limit settings (single attempt or multiple)
- [ ] Assessment tags for organization and searchability
- [ ] Assessment category assignment
- [ ] Difficulty level indication

### AC5: Challenge Assignment Management
- [ ] Browse available challenges by type, difficulty, tags
- [ ] Search challenges by title, content, or skills tested
- [ ] Preview challenge content before assignment
- [ ] Drag-and-drop interface for challenge ordering
- [ ] Set individual challenge weights for scoring
- [ ] Challenge dependency settings (if applicable)
- [ ] Remove challenges with dependency warnings
- [ ] Duplicate challenge detection and warnings

### AC6: Assessment Preview and Testing
- [ ] Full assessment preview from candidate perspective
- [ ] Test mode allowing complete assessment walkthrough
- [ ] Time calculation preview (total estimated time)
- [ ] Scoring preview showing point distribution
- [ ] Challenge flow testing with navigation
- [ ] Mobile preview for responsive design testing
- [ ] Preview different user scenarios (first-time, returning)

### AC7: Data Validation and Integrity
- [ ] Required field validation (title, description)
- [ ] Duplicate assessment title prevention
- [ ] Challenge assignment validation (at least one challenge)
- [ ] Time limit validation (positive numbers only)
- [ ] Passing score validation (0-100% range)
- [ ] Assessment dependency checking before deletion
- [ ] Data consistency checks across related entities

### AC8: Assessment Lifecycle Management
- [ ] Assessment status workflow (draft → active → archived)
- [ ] Publish assessment with validation checks
- [ ] Archive assessments with data preservation
- [ ] Duplicate assessments with customization options
- [ ] Delete assessments with cascade handling
- [ ] Restore archived assessments
- [ ] Assessment expiration date settings

## Technical Requirements

### Database Operations
```sql
-- Assessment table structure
CREATE TABLE assessments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions LONGTEXT,
    time_limit_minutes INT DEFAULT NULL,
    passing_score DECIMAL(5,2) DEFAULT NULL,
    status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    tags JSON DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    attempt_limit INT DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Assessment challenge mapping
CREATE TABLE assessment_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL,
    challenge_id VARCHAR(50) NOT NULL,
    display_order INT NOT NULL,
    weight DECIMAL(5,2) DEFAULT 1.0,
    is_required BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assessment_challenge (assessment_id, challenge_id)
);
```

### API Endpoints
- `GET /api/cms/assessments` - List assessments with filtering/search
- `POST /api/cms/assessments` - Create new assessment
- `GET /api/cms/assessments/:id` - Get assessment details
- `PUT /api/cms/assessments/:id` - Update assessment
- `DELETE /api/cms/assessments/:id` - Delete assessment
- `POST /api/cms/assessments/:id/duplicate` - Duplicate assessment
- `PUT /api/cms/assessments/:id/status` - Change assessment status
- `POST /api/cms/assessments/:id/challenges` - Assign challenge to assessment
- `PUT /api/cms/assessments/:id/challenges/order` - Reorder challenges

### Frontend Components
- Assessment list table with filtering and sorting
- Assessment creation wizard with multi-step form
- Rich text editor for instructions and descriptions
- Challenge assignment interface with drag-and-drop
- Assessment preview modal
- Confirmation dialogs for destructive actions
- Auto-save functionality for draft preservation

## User Interface Design

### Assessment List View
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Assessment Management                    [+ Create Assessment]                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Search: [_________________] Status: [All ▼] Category: [All ▼]          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Title                 | Challenges | Status | Created    | Actions        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Frontend Developer    | 3          | Active | 2024-01-15 | Edit Duplicate │
│ React Specialist      | 5          | Draft  | 2024-01-14 | Edit Publish   │
│ JavaScript Basics     | 2          | Active | 2024-01-13 | Edit Archive   │
│ Senior Full Stack     | 8          | Draft  | 2024-01-12 | Edit Delete    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [Bulk Actions ▼] [4 selected] [Export] [Page 1 of 3] [10 per page ▼]    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Assessment Creation Wizard
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Create New Assessment - Step 1 of 4                                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ● Basic Info  ○ Settings  ○ Challenges  ○ Review                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Assessment Title: *                                                         │
│ [_____________________________________________________]                     │
│                                                                              │
│ Description: *                                                               │
│ [_____________________________________________________]                     │
│ [                                                     ]                     │
│ [                                                     ]                     │
│                                                                              │
│ Category:                                                                    │
│ [Frontend ▼]                                                                │
│                                                                              │
│ Difficulty:                                                                  │
│ ◯ Easy  ● Medium  ◯ Hard                                                   │
│                                                                              │
│                   [Save Draft]        [Cancel]        [Next Step]         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## Dependencies

- Authentication system (EPIC-001)
- Role-based access control (EPIC-002)
- Challenge management system (STORY-013)
- Rich text editor component

## Definition of Done

- [ ] Assessment CRUD operations fully functional
- [ ] Assessment creation wizard working with all steps
- [ ] Challenge assignment interface operational
- [ ] Assessment preview and testing capabilities working
- [ ] Data validation preventing invalid assessments
- [ ] Auto-save functionality preserving draft work
- [ ] Bulk operations working for multiple assessments
- [ ] Responsive design tested on all device sizes
- [ ] Unit tests for all CRUD operations
- [ ] Integration tests for complete assessment lifecycle
- [ ] Performance testing with large numbers of assessments
- [ ] Security review for data access controls
- [ ] Code review completed

## Testing Scenarios

1. **Assessment Creation:** Complete wizard → Assessment created → Challenges assigned → Published successfully
2. **Assessment Editing:** Edit existing assessment → Modify challenges → Changes saved → Version tracked
3. **Assessment Deletion:** Delete assessment → Confirm action → Related data handled → Assessment removed
4. **Challenge Assignment:** Add challenges → Reorder via drag-drop → Set weights → Save successfully
5. **Assessment Preview:** Preview assessment → Test candidate experience → Identify issues → Make corrections
6. **Bulk Operations:** Select multiple assessments → Change status → Confirm action → All updated
7. **Auto-save:** Work on assessment → Leave page → Return later → Work preserved
8. **Validation:** Submit invalid data → Errors shown → Cannot proceed → Fix and retry

## Notes

- Consider implementing assessment templates for common patterns
- Future enhancement: Assessment versioning with rollback capabilities
- Consider collaborative editing features for team environments