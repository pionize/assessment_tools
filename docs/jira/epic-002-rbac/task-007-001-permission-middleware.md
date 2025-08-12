# TASK-007-001: Implement Permission Validation Middleware

## Task Information

**Task ID:** TASK-007-001  
**Story:** STORY-007 (Permission Validation Middleware)  
**Epic:** EPIC-002 (Role-Based Access Control)  
**Assignee:** Backend Developer  
**Estimate:** 4 hours  
**Priority:** High  
**Status:** To Do  

## Description

Implement middleware for validating user permissions on API endpoints. This middleware should check if the authenticated user has the required permissions to access specific resources or perform certain actions, and provide consistent authorization across all CMS endpoints.

## Acceptance Criteria

- [ ] Permission validation middleware created and configurable
- [ ] Role-based permission checks implemented
- [ ] Resource-level permission validation supported
- [ ] Middleware returns appropriate HTTP status codes for authorization failures
- [ ] Permission checks are logged for audit purposes
- [ ] Performance impact minimized through efficient permission lookup
- [ ] Middleware is easily configurable for different endpoints
- [ ] Error responses don't expose sensitive information

## Technical Requirements

### Permission Middleware Implementation

```javascript
// middleware/permissions.js
const { getUserPermissions, logAuditEvent } = require('../services/authService');

/**
 * Permission validation middleware
 * @param {string|Array} requiredPermissions - Permission(s) required to access the endpoint
 * @param {Object} options - Additional configuration options
 * @returns {Function} Express middleware function
 */
function requirePermissions(requiredPermissions, options = {}) {
    return async (req, res, next) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required'
                    }
                });
            }

            // Get user permissions from database or cache
            const userPermissions = await getUserPermissions(req.user.id);
            
            // Convert to array if single permission provided
            const permissions = Array.isArray(requiredPermissions) 
                ? requiredPermissions 
                : [requiredPermissions];
            
            // Check if user has all required permissions
            const hasPermission = permissions.every(permission => 
                userPermissions.includes(permission)
            );
            
            if (!hasPermission) {
                // Log unauthorized access attempt
                await logAuditEvent({
                    user_id: req.user.id,
                    action: 'unauthorized_access_attempt',
                    resource: req.path,
                    required_permissions: permissions,
                    user_permissions: userPermissions,
                    ip_address: req.ip,
                    user_agent: req.get('User-Agent'),
                    timestamp: new Date()
                });
                
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'Insufficient permissions to access this resource'
                    }
                });
            }
            
            // Add permissions to request object for use in controllers
            req.permissions = userPermissions;
            
            // Log successful permission check if auditing enabled
            if (options.auditSuccess) {
                await logAuditEvent({
                    user_id: req.user.id,
                    action: 'authorized_access',
                    resource: req.path,
                    permissions_used: permissions,
                    ip_address: req.ip,
                    timestamp: new Date()
                });
            }
            
            next();
            
        } catch (error) {
            console.error('Permission validation error:', error);
            
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Permission validation failed'
                }
            });
        }
    };
}

/**
 * Resource-specific permission middleware
 * Checks permissions based on resource ownership or specific resource rules
 */
function requireResourcePermission(resourceType, action) {
    return async (req, res, next) => {
        try {
            const { user } = req;
            const resourceId = req.params.id;
            
            // Check if user has permission for this specific resource
            const hasPermission = await checkResourcePermission(
                user.id, 
                resourceType, 
                resourceId, 
                action
            );
            
            if (!hasPermission) {
                await logAuditEvent({
                    user_id: user.id,
                    action: 'unauthorized_resource_access',
                    resource_type: resourceType,
                    resource_id: resourceId,
                    attempted_action: action,
                    ip_address: req.ip,
                    timestamp: new Date()
                });
                
                return res.status(403).json({
                    error: {
                        code: 'FORBIDDEN',
                        message: 'Insufficient permissions for this resource'
                    }
                });
            }
            
            next();
            
        } catch (error) {
            console.error('Resource permission validation error:', error);
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Resource permission validation failed'
                }
            });
        }
    };
}

module.exports = {
    requirePermissions,
    requireResourcePermission
};
```

### Permission Service Implementation

```javascript
// services/permissionService.js
const redis = require('redis');
const client = redis.createClient();

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
    super_admin: [
        'user:create', 'user:read', 'user:update', 'user:delete',
        'assessment:create', 'assessment:read', 'assessment:update', 'assessment:delete',
        'challenge:create', 'challenge:read', 'challenge:update', 'challenge:delete',
        'submission:read', 'submission:update', 'submission:score',
        'report:read', 'report:export', 'report:advanced',
        'system:configure', 'audit:read'
    ],
    assessment_manager: [
        'assessment:create', 'assessment:read', 'assessment:update',
        'challenge:create', 'challenge:read', 'challenge:update',
        'submission:read', 'submission:score',
        'report:read', 'report:export'
    ],
    reviewer: [
        'assessment:read',
        'challenge:read',
        'submission:read', 'submission:score',
        'report:read'
    ],
    analyst: [
        'assessment:read',
        'challenge:read',
        'submission:read',
        'report:read', 'report:export', 'report:advanced'
    ]
};

/**
 * Get user permissions from cache or database
 * @param {string} userId - User ID
 * @returns {Array} Array of permission strings
 */
async function getUserPermissions(userId) {
    try {
        // Try to get from cache first
        const cacheKey = `user_permissions:${userId}`;
        const cachedPermissions = await client.get(cacheKey);
        
        if (cachedPermissions) {
            return JSON.parse(cachedPermissions);
        }
        
        // Get from database if not in cache
        const user = await db.query(
            'SELECT role FROM admin_users WHERE id = ? AND status = "active"',
            [userId]
        );
        
        if (!user || user.length === 0) {
            return [];
        }
        
        const permissions = ROLE_PERMISSIONS[user[0].role] || [];
        
        // Cache permissions for 5 minutes
        await client.setex(cacheKey, 300, JSON.stringify(permissions));
        
        return permissions;
        
    } catch (error) {
        console.error('Error getting user permissions:', error);
        return [];
    }
}

/**
 * Check if user has permission for specific resource
 * @param {string} userId - User ID
 * @param {string} resourceType - Type of resource (assessment, challenge, etc.)
 * @param {string} resourceId - Specific resource ID
 * @param {string} action - Action being attempted
 * @returns {boolean} Whether user has permission
 */
async function checkResourcePermission(userId, resourceType, resourceId, action) {
    try {
        const permissions = await getUserPermissions(userId);
        const requiredPermission = `${resourceType}:${action}`;
        
        // Check if user has general permission for this action
        if (!permissions.includes(requiredPermission)) {
            return false;
        }
        
        // Additional resource-specific checks
        switch (resourceType) {
            case 'assessment':
                return await checkAssessmentPermission(userId, resourceId, action);
            case 'challenge':
                return await checkChallengePermission(userId, resourceId, action);
            case 'submission':
                return await checkSubmissionPermission(userId, resourceId, action);
            default:
                return true; // Default to allowing if no specific rules
        }
        
    } catch (error) {
        console.error('Error checking resource permission:', error);
        return false;
    }
}

/**
 * Clear user permissions cache when role changes
 * @param {string} userId - User ID
 */
async function clearUserPermissionsCache(userId) {
    try {
        const cacheKey = `user_permissions:${userId}`;
        await client.del(cacheKey);
    } catch (error) {
        console.error('Error clearing permissions cache:', error);
    }
}

module.exports = {
    getUserPermissions,
    checkResourcePermission,
    clearUserPermissionsCache,
    ROLE_PERMISSIONS
};
```

### Usage Examples

```javascript
// routes/assessments.js
const { requirePermissions, requireResourcePermission } = require('../middleware/permissions');

// Require general assessment permissions
router.get('/assessments', 
    requirePermissions('assessment:read'),
    assessmentController.list
);

// Require specific assessment update permission
router.put('/assessments/:id',
    requirePermissions('assessment:update'),
    requireResourcePermission('assessment', 'update'),
    assessmentController.update
);

// Multiple permissions required
router.post('/assessments',
    requirePermissions(['assessment:create', 'challenge:read']),
    assessmentController.create
);

// Super admin only endpoint
router.delete('/assessments/:id',
    requirePermissions('assessment:delete'), // Only super_admin has this
    requireResourcePermission('assessment', 'delete'),
    assessmentController.delete
);
```

## Implementation Steps

1. **Create Permission Constants**
   - Define all permission strings
   - Map roles to permissions
   - Document permission hierarchy

2. **Implement Caching Layer**
   - Set up Redis connection
   - Implement cache get/set functions
   - Add cache invalidation logic

3. **Build Core Middleware**
   - Create permission validation function
   - Add error handling and logging
   - Implement audit trail logging

4. **Add Resource-Level Checks**
   - Implement resource ownership validation
   - Add business rule checks
   - Create resource-specific permission logic

5. **Integration Testing**
   - Test with all role types
   - Verify error responses
   - Test performance with caching

6. **Documentation**
   - Document all permissions
   - Create usage examples
   - Document performance characteristics

## Testing Checklist

- [ ] Middleware correctly identifies authenticated users
- [ ] Permission checks work for all defined roles
- [ ] Unauthorized access returns 403 status
- [ ] Unauthenticated access returns 401 status
- [ ] Multiple permission requirements work correctly
- [ ] Resource-level permissions validate ownership
- [ ] Permission changes clear cache appropriately
- [ ] Audit logging captures all access attempts
- [ ] Performance impact is minimal (< 10ms per request)
- [ ] Error responses don't leak sensitive information

## Performance Considerations

- Use Redis caching for permission lookups
- Cache permissions for 5 minutes to balance consistency and performance
- Implement efficient database queries with proper indexing
- Consider permission pre-loading for frequent operations
- Monitor and optimize middleware execution time

## Security Considerations

- Never expose detailed permission information in error responses
- Log all authorization failures for security monitoring
- Implement rate limiting for permission validation
- Validate all input parameters to prevent injection
- Use secure session management for user identification

## Definition of Done

- [ ] Permission middleware implemented and tested
- [ ] Caching layer working correctly
- [ ] Resource-level permissions validated
- [ ] Audit logging capturing all events
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Code review approved

## Dependencies

- Authentication middleware (from EPIC-001)
- Redis cache server
- Database connection for user role lookup
- Audit logging system

## Notes

- Consider implementing hierarchical permissions in future versions
- Plan for dynamic permission assignment beyond roles
- Monitor cache hit rates and adjust TTL as needed
- Consider permission delegation features for future enhancement