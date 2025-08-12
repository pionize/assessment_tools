# STORY-001: Admin User Registration System

## Story Information

**Story ID:** STORY-001  
**Epic:** EPIC-001 (CMS Authentication System)  
**Story Points:** 5  
**Priority:** High  
**Assignee:** Backend Developer  
**Status:** To Do  

## User Story

**As a** Super Admin  
**I want** to register new admin users in the CMS  
**So that** authorized personnel can access the system with appropriate credentials and role assignments

## Description

This story covers the creation of an admin user registration system that allows Super Admins to add new users to the CMS. The system needs to handle user creation, initial role assignment, and secure credential management.

The registration process should be secure, with proper validation and the ability to set initial roles that will be used by the RBAC system.

## Acceptance Criteria

### AC1: Admin User Registration Interface
- [ ] Super Admins can access user registration form in CMS
- [ ] Registration form includes: email, full name, initial role selection
- [ ] Form validation prevents duplicate email addresses
- [ ] Form validation ensures email format is correct
- [ ] Form validation requires all mandatory fields
- [ ] Success message shown after successful registration
- [ ] Error messages displayed for validation failures

### AC2: Secure Password Generation
- [ ] System generates secure temporary password for new users
- [ ] Temporary password meets security requirements (8+ chars, mixed case, numbers, symbols)
- [ ] Temporary password is sent to user's email address
- [ ] Password reset link included in welcome email
- [ ] Temporary password expires after 24 hours
- [ ] Users must change password on first login

### AC3: User Account Creation
- [ ] New user record created in admin_users table
- [ ] Password is properly hashed before storage
- [ ] User account is created in inactive state until first login
- [ ] Initial role is assigned based on Super Admin selection
- [ ] User creation is logged for audit purposes
- [ ] Database constraints prevent duplicate registrations

### AC4: Welcome Email System
- [ ] Automated welcome email sent to new user
- [ ] Email includes CMS login URL and temporary credentials
- [ ] Email includes password reset link for immediate password change
- [ ] Email template is professional and includes contact information
- [ ] Email delivery failures are logged and reported
- [ ] Email contains clear instructions for first-time login

### AC5: Security and Validation
- [ ] Only Super Admins can register new users
- [ ] Email uniqueness enforced at database level
- [ ] Input sanitization prevents injection attacks
- [ ] Rate limiting prevents abuse of registration endpoint
- [ ] All registration activities logged for audit
- [ ] Failed registration attempts tracked

## Technical Requirements

### Database Schema
```sql
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
    password_changed_at TIMESTAMP NULL
);
```

### API Endpoints
- `POST /api/cms/admin-users` - Create new admin user
- `GET /api/cms/admin-users` - List admin users (for verification)
- `POST /api/cms/admin-users/resend-welcome` - Resend welcome email

### Email Template
- Professional welcome email template
- Login instructions and temporary credentials
- Password change requirements
- Support contact information

## Dependencies

- Email service configuration
- Database admin_users table creation
- Authentication middleware (from related stories)

## Definition of Done

- [ ] Registration form accessible to Super Admins
- [ ] New users can be created with all required fields
- [ ] Welcome emails sent automatically
- [ ] Temporary passwords expire correctly
- [ ] All security validations working
- [ ] Unit tests for registration logic
- [ ] Integration tests for complete flow
- [ ] Code review completed
- [ ] Security review passed

## Testing Scenarios

1. **Successful Registration:** Super Admin creates user → User receives welcome email → Can login with temp password
2. **Duplicate Email:** Attempt to register existing email → Error message shown → No duplicate created
3. **Invalid Email Format:** Invalid email entered → Validation error shown → Form submission blocked
4. **Email Delivery Failure:** Email service unavailable → Error logged → Admin notified of failure
5. **Temporary Password Expiry:** User attempts login after 24 hours → Access denied → Must use password reset

## Notes

- Consider implementing user import functionality for bulk user creation
- Future enhancement: Integration with corporate directory services
- Email template should be configurable for different organizations