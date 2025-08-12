# STORY-006: User Role Management Interface

## Story Information

**Story ID:** STORY-006  
**Epic:** EPIC-002 (Role-Based Access Control)  
**Story Points:** 8  
**Priority:** High  
**Assignee:** Full Stack Developer  
**Status:** To Do  

## User Story

**As a** Super Admin  
**I want** to manage user roles and permissions through a user-friendly interface  
**So that** I can control who has access to what functions in the CMS without technical intervention

## Description

This story covers the creation of a comprehensive user management interface that allows Super Admins to view all users, modify their roles, and manage their account status. The interface should provide clear visibility into the current permission structure and make role changes simple and safe.

## Acceptance Criteria

### AC1: User Management Dashboard
- [ ] Display list of all admin users with current roles and status
- [ ] Show user information: name, email, role, last login, account status
- [ ] Provide search functionality to find specific users
- [ ] Filter users by role, status, or last login date
- [ ] Sort users by any column (name, email, role, last login)
- [ ] Pagination for large user lists
- [ ] User count summary by role type

### AC2: Role Assignment Interface
- [ ] Dropdown or radio buttons for role selection per user
- [ ] Clear indication of current role vs new role during changes
- [ ] Confirmation dialog before role changes
- [ ] Bulk role assignment for multiple users
- [ ] Role change history visible for each user
- [ ] Prevent Super Admins from removing their own Super Admin role
- [ ] Warning when changing roles that affect current permissions

### AC3: Account Status Management
- [ ] Ability to activate/deactivate user accounts
- [ ] Suspend accounts temporarily without deletion
- [ ] Unlock accounts that have been locked due to failed logins
- [ ] Force password reset for specific users
- [ ] Account status changes require confirmation
- [ ] Status change history tracked and displayed
- [ ] Cannot deactivate own account

### AC4: Permission Preview System
- [ ] Show what permissions each role includes
- [ ] Preview what a user will be able to access after role change
- [ ] Permission matrix display showing role capabilities
- [ ] Highlight permission differences between roles
- [ ] Help text explaining what each permission allows
- [ ] Warning for permission reductions that affect active sessions

### AC5: Audit and Logging
- [ ] All role changes logged with timestamp and admin who made change
- [ ] Account status changes logged with reason
- [ ] Display recent role change activity
- [ ] Export audit logs for compliance purposes
- [ ] Search audit logs by user, admin, or date range
- [ ] Notification system for sensitive role changes

### AC6: Security and Validation
- [ ] Only Super Admins can access user management interface
- [ ] Validate role assignments against available roles
- [ ] Prevent privilege escalation attacks
- [ ] Rate limiting on role change operations
- [ ] CSRF protection on all role management forms
- [ ] Input validation on all user management operations

## Technical Requirements

### Database Schema
```sql
-- Role change audit table
CREATE TABLE role_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    old_role ENUM('super_admin', 'assessment_manager', 'reviewer', 'analyst'),
    new_role ENUM('super_admin', 'assessment_manager', 'reviewer', 'analyst'),
    changed_by VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- Account status change audit
CREATE TABLE status_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    old_status ENUM('inactive', 'active', 'suspended'),
    new_status ENUM('inactive', 'active', 'suspended'),
    changed_by VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);
```

### API Endpoints
- `GET /api/cms/users` - List all admin users with filtering/search
- `PUT /api/cms/users/:id/role` - Change user role
- `PUT /api/cms/users/:id/status` - Change account status
- `POST /api/cms/users/bulk-role-change` - Bulk role assignments
- `GET /api/cms/users/:id/audit` - Get user change history
- `GET /api/cms/roles/permissions` - Get permission matrix

### Frontend Components
- User list table with sorting and filtering
- Role assignment dropdown/modal
- Bulk operations interface
- Permission preview modal
- Audit log viewer
- Confirmation dialogs for changes

## User Interface Design

### User Management Table
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ User Management                                                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Search: [______________] Filter by Role: [All ▼] Status: [All ▼]          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ☐ Name            | Email              | Role              | Status  | Actions │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ☐ John Smith      | john@company.com   | Super Admin       | Active  | Edit    │
│ ☐ Jane Doe        | jane@company.com   | Assessment Mgr    | Active  | Edit    │
│ ☐ Bob Wilson      | bob@company.com    | Reviewer          | Locked  | Unlock  │
│ ☐ Alice Johnson   | alice@company.com  | Analyst           | Active  | Edit    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [Bulk Actions: Change Role ▼] [Selected: 2 users] [Page 1 of 3]           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Role Change Modal
```
┌────────────────────────────────────────┐
│ Change User Role                       │
├────────────────────────────────────────┤
│ User: Jane Doe (jane@company.com)      │
│                                        │
│ Current Role: Assessment Manager       │
│                                        │
│ New Role:                              │
│ ◯ Super Admin                        │
│ ● Assessment Manager                 │
│ ◯ Reviewer                           │
│ ◯ Analyst                            │
│                                        │
│ Reason (optional):                     │
│ [________________________]            │
│                                        │
│ [Cancel]              [Change Role]   │
└────────────────────────────────────────┘
```

## Dependencies

- Authentication system (EPIC-001)
- Permission validation middleware (STORY-007)
- Admin user database schema

## Definition of Done

- [ ] User management interface accessible to Super Admins
- [ ] Role changes working with proper validation
- [ ] Account status management functional
- [ ] Audit logging capturing all changes
- [ ] Bulk operations working correctly
- [ ] Security validations preventing unauthorized changes
- [ ] Responsive design working on all devices
- [ ] Unit tests for role management logic
- [ ] Integration tests for complete user management flow
- [ ] Security testing for privilege escalation prevention
- [ ] Code review completed

## Testing Scenarios

1. **Role Change:** Super Admin changes user role → Role updated → Change logged → User permissions updated
2. **Self-Protection:** Super Admin tries to remove own Super Admin role → Action blocked → Error message shown
3. **Account Suspension:** Super Admin suspends user account → User cannot login → Change logged
4. **Bulk Role Change:** Select multiple users → Change role → All users updated → Changes logged
5. **Audit Trail:** View user change history → All changes displayed → Details accurate
6. **Search/Filter:** Search for specific user → Results filtered correctly → Actions available
7. **Permission Preview:** View role permissions → Accurate permission list shown → Differences highlighted

## Notes

- Consider implementing approval workflow for sensitive role changes
- Future enhancement: Temporary role assignments with expiration
- Consider email notifications for role changes affecting the user