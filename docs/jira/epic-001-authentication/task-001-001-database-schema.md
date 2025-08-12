# TASK-001-001: Create Admin Users Database Schema

## Task Information

**Task ID:** TASK-001-001  
**Story:** STORY-001 (Admin User Registration System)  
**Epic:** EPIC-001 (CMS Authentication System)  
**Assignee:** Backend Developer  
**Estimate:** 2 hours  
**Priority:** High  
**Status:** To Do  

## Description

Create the database schema for admin users table and related authentication structures. This includes the main admin_users table, audit tables for tracking login attempts and user changes, and necessary indexes for performance.

## Acceptance Criteria

- [ ] Admin users table created with all required fields
- [ ] Password hashing column properly configured
- [ ] Role enumeration includes all defined roles
- [ ] Login attempts tracking table created
- [ ] User creation audit table created
- [ ] Appropriate indexes created for query performance
- [ ] Foreign key constraints properly defined
- [ ] Database migration script created
- [ ] Schema documentation updated

## Technical Requirements

### Database Schema SQL

```sql
-- Main admin users table
CREATE TABLE admin_users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'assessment_manager', 'reviewer', 'analyst') NOT NULL,
    status ENUM('inactive', 'active', 'suspended') DEFAULT 'inactive',
    temp_password BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) NOT NULL,
    last_login TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_last_login (last_login)
);

-- Login attempts tracking
CREATE TABLE login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100) DEFAULT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_ip_address (ip_address),
    INDEX idx_attempted_at (attempted_at),
    INDEX idx_success (success)
);

-- User creation audit
CREATE TABLE user_creation_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    initial_role ENUM('super_admin', 'assessment_manager', 'reviewer', 'analyst') NOT NULL,
    welcome_email_sent BOOLEAN DEFAULT FALSE,
    welcome_email_sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at)
);

-- Session management table
CREATE TABLE admin_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
);

-- Password history for preventing reuse
CREATE TABLE password_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### Migration Script

```sql
-- Migration: 001_create_admin_users_schema.sql
-- Description: Create initial admin users and authentication tables
-- Created: [Date]

START TRANSACTION;

-- Check if tables already exist
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables 
                    WHERE table_schema = DATABASE() AND table_name = 'admin_users');

SET @sql = IF(@table_exists = 0, 
    'CREATE TABLE admin_users (...)', 
    'SELECT "Table admin_users already exists" as message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert initial super admin user
INSERT INTO admin_users (id, email, full_name, password_hash, role, status, temp_password, created_by)
VALUES (
    'admin-001',
    'admin@company.com',
    'System Administrator',
    '$2b$12$dummy_hash_for_initial_admin', -- This should be replaced with actual hash
    'super_admin',
    'active',
    TRUE,
    'system'
) ON DUPLICATE KEY UPDATE id = id; -- Prevent duplicate if run multiple times

COMMIT;
```

### Schema Validation

```sql
-- Validation queries to ensure schema is correct
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('admin_users', 'login_attempts', 'user_creation_audit', 'admin_sessions', 'password_history')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Check indexes
SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('admin_users', 'login_attempts', 'user_creation_audit', 'admin_sessions', 'password_history')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
```

## Implementation Steps

1. **Review Database Connection Configuration**
   - Verify database connection settings
   - Ensure proper permissions for schema creation
   - Test connection to target database

2. **Create Migration File**
   - Create numbered migration file (001_create_admin_users_schema.sql)
   - Include rollback script for migration reversal
   - Add migration tracking to migrations table

3. **Execute Schema Creation**
   - Run migration script in development environment
   - Verify all tables and indexes created correctly
   - Test foreign key constraints

4. **Create Seed Data**
   - Insert initial super admin user
   - Create test users for development (if needed)
   - Verify data integrity

5. **Performance Testing**
   - Test query performance on main tables
   - Verify index effectiveness
   - Optimize if necessary

6. **Documentation**
   - Update database schema documentation
   - Document table relationships
   - Create data dictionary

## Testing Checklist

- [ ] All tables created without errors
- [ ] Foreign key constraints working correctly
- [ ] Indexes improve query performance (test with EXPLAIN)
- [ ] Enum values accept all required role/status values
- [ ] Email uniqueness constraint prevents duplicates
- [ ] Migration script can be run multiple times safely
- [ ] Rollback script successfully removes all created objects
- [ ] Initial admin user can be created
- [ ] Password hash field accepts bcrypt hashes
- [ ] Timestamp fields default to current time correctly

## Definition of Done

- [ ] Database schema created and tested
- [ ] Migration script created and documented
- [ ] Initial data seeded successfully
- [ ] Schema validation queries pass
- [ ] Performance testing completed
- [ ] Documentation updated
- [ ] Code review completed
- [ ] Changes deployed to development environment

## Dependencies

- Database server access and permissions
- Migration framework setup
- Development environment configuration

## Notes

- Password hashes should use bcrypt with cost factor 12
- Session IDs should be cryptographically secure random strings
- Consider data retention policies for audit tables
- Plan for future schema changes (versioning strategy)