# TASK-BE-002: RBAC Middleware & Permission System (Backend)

## Deskripsi
Implementasi comprehensive Role-Based Access Control system dengan middleware untuk permission checking dan database management.

## Estimasi
**4 hari**

## Dependencies
- Authentication system (TASK-BE-001) completed
- Database schema dengan roles dan permissions tables
- JWT token payload includes user role information

## Acceptance Criteria Backend

### Permission Middleware
- ✅ **Permission checking middleware** untuk protect API endpoints
- ✅ **Role-based route protection** dengan decorators/annotations
- ✅ **Resource-level permissions** (e.g., assessment ownership)
- ✅ **Multiple permission requirements** (AND/OR logic)
- ✅ **Permission caching** untuk performance optimization
- ✅ **Graceful permission denial** dengan proper error responses

### Database Operations
- ✅ **Role CRUD operations** dengan validation
- ✅ **Permission assignment/revocation** untuk roles
- ✅ **User role management** with history tracking
- ✅ **Permission inheritance** calculation
- ✅ **Bulk permission operations** untuk efficiency
- ✅ **Database constraints** untuk data integrity

### API Endpoints
- ✅ **GET /admin/roles** - List all roles with permissions
- ✅ **POST /admin/roles** - Create new custom role
- ✅ **PUT /admin/roles/:id** - Update role permissions
- ✅ **DELETE /admin/roles/:id** - Delete custom role (not system roles)
- ✅ **GET /admin/users/:id/permissions** - Get user effective permissions
- ✅ **PUT /admin/users/:id/role** - Assign role to user

## API Contracts

### GET /admin/roles
```typescript
Response: {
  success: true;
  data: {
    id: string;
    name: string;
    description: string;
    isSystemRole: boolean;
    permissions: string[];
    userCount: number;
    createdAt: string;
    updatedAt: string;
  }[]
}
```

### POST /admin/roles
```typescript
Request: {
  name: string;           // Required, unique
  description?: string;   
  permissions: string[];  // Array of permission IDs
}

Response: {
  success: true;
  data: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: string;
  }
}
```

### Permission Check Middleware
```typescript
// Usage examples
@RequirePermissions(['assessment:read'])
@RequirePermissions(['assessment:update'], { resource: 'assessment' })
@RequirePermissions(['user:read', 'user:update'], { operator: 'OR' })

// Middleware function
interface PermissionMiddleware {
  permissions: string[];
  options?: {
    operator?: 'AND' | 'OR';           // Default: 'AND'
    resource?: string;                 // Resource type for ownership check
    allowSelf?: boolean;               // Allow user to access own resource
    skipIfSuperAdmin?: boolean;        // Skip check for super_admin
  };
}
```

## Database Schema Extensions

```sql
-- Permission hierarchy for nested permissions
CREATE TABLE permission_hierarchy (
  parent_permission VARCHAR(50) REFERENCES permissions(id),
  child_permission VARCHAR(50) REFERENCES permissions(id),
  PRIMARY KEY (parent_permission, child_permission)
);

-- User role assignment history
CREATE TABLE user_role_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id),
  role_id VARCHAR(50) REFERENCES roles(id),
  assigned_by UUID REFERENCES admin_users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP NULL,
  reason TEXT
);

-- Resource ownership for fine-grained access control
CREATE TABLE resource_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL, -- 'assessment', 'challenge', etc.
  resource_id UUID NOT NULL,
  user_id UUID REFERENCES admin_users(id),
  permission_type VARCHAR(50) NOT NULL, -- 'owner', 'editor', 'viewer'
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Middleware Implementation Examples

```typescript
// Express.js middleware
export const requirePermissions = (
  permissions: string[], 
  options: PermissionMiddleware['options'] = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // From JWT middleware
    const userPermissions = await getUserPermissions(user.id);
    
    const hasPermission = options.operator === 'OR' 
      ? permissions.some(p => userPermissions.includes(p))
      : permissions.every(p => userPermissions.includes(p));
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required: permissions
      });
    }
    
    next();
  };
};

// Resource ownership check
export const requireResourceAccess = (
  resourceType: string,
  permission: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params.id;
    const userId = req.user.id;
    
    const hasAccess = await checkResourceAccess(
      userId, 
      resourceType, 
      resourceId, 
      permission
    );
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this resource'
      });
    }
    
    next();
  };
};
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| RBAC_001 | 403 | Insufficient permissions |
| RBAC_002 | 403 | Resource access denied |
| RBAC_003 | 400 | Invalid role assignment |
| RBAC_004 | 400 | Cannot modify system role |
| RBAC_005 | 400 | Permission not found |
| RBAC_006 | 409 | Role name already exists |

## Performance Considerations
- ✅ **Permission caching** dengan Redis atau in-memory cache
- ✅ **Efficient database queries** dengan proper indexing
- ✅ **Lazy loading** untuk permission resolution
- ✅ **Batch operations** untuk bulk permission checks
- ✅ **Cache invalidation** saat role/permission berubah

## Testing Requirements
- ✅ Unit tests untuk permission middleware
- ✅ Integration tests untuk all RBAC endpoints
- ✅ Security tests untuk permission bypass attempts  
- ✅ Performance tests untuk large permission sets
- ✅ Database constraint tests

## Security Validation
- ✅ **Principle of least privilege** enforced
- ✅ **System role protection** against modification
- ✅ **Permission escalation prevention**
- ✅ **Audit trail** untuk role assignments
- ✅ **Resource ownership validation**