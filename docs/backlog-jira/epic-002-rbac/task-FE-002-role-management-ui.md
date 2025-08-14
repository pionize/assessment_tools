# TASK-FE-002: Role Management UI (Frontend)

## Deskripsi
Implementasi comprehensive user interface untuk mengelola roles, permissions, dan user assignments dalam admin CMS.

## Estimasi
**4 hari**

## Dependencies
- RBAC backend API endpoints available
- Admin authentication system completed
- Permission-aware UI components

## Acceptance Criteria Frontend

### Role Management Dashboard
- ✅ **Role list view** dengan search dan filtering
- ✅ **Role detail view** dengan permission matrix
- ✅ **Create/Edit role form** dengan permission selection
- ✅ **Delete role confirmation** (only custom roles)
- ✅ **Role assignment to users** dengan bulk operations
- ✅ **System role protection** (read-only display)

### Permission-Based UI
- ✅ **Conditional rendering** based on user permissions
- ✅ **Navigation menu filtering** per role
- ✅ **Action buttons visibility** per permission
- ✅ **Page access control** dengan route guards
- ✅ **Feature toggles** berdasarkan permissions
- ✅ **Graceful permission denied** messages

### User Role Management
- ✅ **User list dengan current roles** displayed
- ✅ **Role assignment modal** dengan validation
- ✅ **Role history tracking** dan display
- ✅ **Bulk role assignment** untuk multiple users
- ✅ **Permission preview** sebelum assignment
- ✅ **Role inheritance display** (if applicable)

## Component Structure

```typescript
// src/components/admin/roles/RoleManagement.tsx
interface RoleManagementProps {
  initialView?: 'list' | 'create' | 'edit';
}

// src/components/admin/roles/RoleList.tsx
interface RoleListProps {
  onSelectRole?: (role: Role) => void;
  showActions?: boolean;
  filterByType?: 'system' | 'custom' | 'all';
}

// src/components/admin/roles/RoleForm.tsx
interface RoleFormProps {
  role?: Role; // For editing
  onSave: (role: CreateRoleRequest) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

// src/components/admin/roles/PermissionMatrix.tsx
interface PermissionMatrixProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  groupBy?: 'category' | 'resource';
  readOnly?: boolean;
}
```

### Permission Context & Hooks

```typescript
// src/contexts/PermissionContext.tsx
interface PermissionContext {
  userPermissions: string[];
  hasPermission: (permission: string | string[]) => boolean;
  hasRole: (role: string | string[]) => boolean;
  checkResourceAccess: (resource: string, action: string) => boolean;
  isLoading: boolean;
}

// src/hooks/usePermissions.ts
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  return {
    can: (permission: string) => context.hasPermission(permission),
    canAny: (permissions: string[]) => permissions.some(p => context.hasPermission(p)),
    canAll: (permissions: string[]) => permissions.every(p => context.hasPermission(p)),
    hasRole: (role: string) => context.hasRole(role),
    checkAccess: context.checkResourceAccess
  };
};

// src/components/common/ProtectedComponent.tsx
interface ProtectedComponentProps {
  permissions?: string | string[];
  roles?: string | string[];
  operator?: 'AND' | 'OR';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
```

### Role Management UI Components

```typescript
// Role List with Actions
<RoleList
  roles={roles}
  onEdit={(role) => setEditingRole(role)}
  onDelete={(role) => setDeletingRole(role)}
  renderActions={(role) => (
    <ProtectedComponent permissions="user:role_assign">
      <Button onClick={() => assignRole(role)}>
        Assign to Users
      </Button>
    </ProtectedComponent>
  )}
/>

// Permission Matrix Component  
<PermissionMatrix
  permissions={availablePermissions}
  selectedPermissions={form.permissions}
  onChange={(perms) => setForm({...form, permissions: perms})}
  groupBy="category"
  readOnly={role?.isSystemRole}
/>

// User Role Assignment Modal
<UserRoleAssignment
  isOpen={showAssignment}
  users={selectedUsers}
  currentRole={user.role}
  availableRoles={roles.filter(r => !r.isSystemRole || user.canAssignSystemRoles)}
  onAssign={handleRoleAssignment}
  onCancel={() => setShowAssignment(false)}
/>
```

## UI/UX Requirements

### Role Management Interface
- ✅ **Intuitive role hierarchy** display
- ✅ **Permission grouping** untuk better organization
- ✅ **Visual permission inheritance** indicators  
- ✅ **Drag-and-drop permission** assignment (optional)
- ✅ **Search/filter permissions** by category
- ✅ **Role comparison view** side-by-side
- ✅ **Permission conflict warnings**

### User Assignment Interface
- ✅ **Quick role assignment** dari user list
- ✅ **Bulk selection** dengan checkbox
- ✅ **Role change confirmation** dengan impact preview
- ✅ **Assignment history** dalam timeline format
- ✅ **Permission diff view** sebelum assignment
- ✅ **Auto-save draft assignments**

### Navigation & Access Control
```typescript
// Permission-aware navigation
const navigationItems = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    permissions: ['dashboard:view'],
    icon: DashboardIcon
  },
  {
    path: '/admin/users', 
    label: 'User Management',
    permissions: ['user:read'],
    icon: UsersIcon,
    children: [
      {
        path: '/admin/users/roles',
        label: 'Role Management', 
        permissions: ['user:role_assign']
      }
    ]
  },
  {
    path: '/admin/assessments',
    label: 'Assessments',
    permissions: ['assessment:read'],
    icon: AssessmentIcon
  }
];
```

## Form Validation & Error Handling

```typescript
// Role form validation
const roleFormSchema = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_\s]+$/,
    message: "Role name must be 3-50 characters, alphanumeric"
  },
  description: {
    maxLength: 200,
    message: "Description cannot exceed 200 characters"
  },
  permissions: {
    required: true,
    minItems: 1,
    message: "At least one permission must be selected"
  }
};

// Error handling untuk permission operations
const errorMessages = {
  'RBAC_001': 'You do not have permission to perform this action',
  'RBAC_002': 'Access denied to this resource',
  'RBAC_003': 'Invalid role assignment',
  'RBAC_004': 'System roles cannot be modified',
  'RBAC_005': 'Permission not found',
  'RBAC_006': 'Role name already exists'
};
```

## Responsive Design & Accessibility
- ✅ **Mobile-responsive** role management interface
- ✅ **Keyboard navigation** untuk all interactive elements
- ✅ **Screen reader compatibility** dengan proper ARIA labels
- ✅ **High contrast mode** support
- ✅ **Focus management** dalam modals dan forms
- ✅ **Loading states** dengan progress indicators

## Testing Requirements
- ✅ Component unit tests dengan React Testing Library
- ✅ Permission context tests
- ✅ Role management workflow tests
- ✅ Permission-based rendering tests
- ✅ Accessibility tests dengan axe-core
- ✅ Integration tests dengan backend API