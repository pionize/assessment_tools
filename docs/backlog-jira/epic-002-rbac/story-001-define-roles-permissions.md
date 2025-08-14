# STORY-001: Definisikan Roles dan Permissions

## Deskripsi
Sebagai Super Admin, saya ingin sistem memiliki role dan permission yang jelas agar akses ke fitur CMS dapat dikontrol dengan tepat.

## Permission Matrix

### Core Permissions
```typescript
enum Permissions {
  // User Management
  'user:create' = 'user:create',
  'user:read' = 'user:read',
  'user:update' = 'user:update',
  'user:delete' = 'user:delete',
  'user:role_assign' = 'user:role_assign',

  // Assessment Management
  'assessment:create' = 'assessment:create',
  'assessment:read' = 'assessment:read',
  'assessment:update' = 'assessment:update',
  'assessment:delete' = 'assessment:delete',
  'assessment:publish' = 'assessment:publish',

  // Challenge Management
  'challenge:create' = 'challenge:create',
  'challenge:read' = 'challenge:read',
  'challenge:update' = 'challenge:update',
  'challenge:delete' = 'challenge:delete',

  // Submission Review
  'submission:read' = 'submission:read',
  'submission:review' = 'submission:review',
  'submission:score' = 'submission:score',
  'submission:export' = 'submission:export',

  // Reporting & Analytics
  'report:view' = 'report:view',
  'report:export' = 'report:export',
  'analytics:view' = 'analytics:view',

  // System Configuration
  'system:config' = 'system:config',
  'system:logs' = 'system:logs'
}
```

### Role Definitions
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permissions[];
  isSystemRole: boolean; // Cannot be deleted
}

const roles: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Full system access',
    permissions: [...ALL_PERMISSIONS],
    isSystemRole: true
  },
  {
    id: 'assessment_manager',
    name: 'Assessment Manager',
    description: 'Manage assessments and challenges',
    permissions: [
      'user:read',
      'assessment:create', 'assessment:read', 'assessment:update', 'assessment:delete', 'assessment:publish',
      'challenge:create', 'challenge:read', 'challenge:update', 'challenge:delete',
      'submission:read', 'submission:export',
      'report:view', 'analytics:view'
    ],
    isSystemRole: true
  },
  {
    id: 'reviewer',
    name: 'Submission Reviewer',
    description: 'Review and score candidate submissions',
    permissions: [
      'assessment:read',
      'challenge:read',
      'submission:read', 'submission:review', 'submission:score',
      'report:view'
    ],
    isSystemRole: true
  },
  {
    id: 'analyst',
    name: 'Data Analyst',
    description: 'View reports and analytics',
    permissions: [
      'assessment:read',
      'challenge:read',
      'submission:read',
      'report:view', 'report:export', 'analytics:view'
    ],
    isSystemRole: true
  }
];
```

### Permission Groups
```typescript
const permissionGroups = {
  'User Management': [
    'user:create', 'user:read', 'user:update', 'user:delete', 'user:role_assign'
  ],
  'Assessment Management': [
    'assessment:create', 'assessment:read', 'assessment:update', 'assessment:delete', 'assessment:publish'
  ],
  'Challenge Management': [
    'challenge:create', 'challenge:read', 'challenge:update', 'challenge:delete'
  ],
  'Submission Review': [
    'submission:read', 'submission:review', 'submission:score', 'submission:export'
  ],
  'Reporting & Analytics': [
    'report:view', 'report:export', 'analytics:view'
  ],
  'System Administration': [
    'system:config', 'system:logs'
  ]
};
```

## Database Schema

```sql
-- Roles table
CREATE TABLE roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  group_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
  role_id VARCHAR(50) REFERENCES roles(id) ON DELETE CASCADE,
  permission_id VARCHAR(50) REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User-Role assignment (extends admin_users)
ALTER TABLE admin_users ADD COLUMN role_id VARCHAR(50) REFERENCES roles(id);
CREATE INDEX idx_admin_users_role ON admin_users(role_id);
```

## Acceptance Criteria
- Role system: Super Admin, Assessment Manager, Reviewer, Analyst
- Granular permissions per feature dengan resource:action pattern
- Permission groups untuk UI organization
- Role-permission mapping dengan database constraints
- Default "least privilege" principle applied
- System roles cannot be deleted atau modified
- Permission inheritance dari role assignments
- Database seed/migration ready untuk initial setup

## Validation Rules
- **Role Assignment**: Only Super Admin dapat assign roles
- **Permission Check**: Every API endpoint validates required permissions
- **Role Modification**: System roles tidak dapat diubah atau dihapus
- **User Permissions**: Derived dari assigned role permissions
- **Resource Access**: Permissions checked at resource level (assessment ID, etc.)

