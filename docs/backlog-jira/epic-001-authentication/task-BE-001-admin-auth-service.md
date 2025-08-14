# TASK-BE-001: Admin Authentication Service (Backend)

## Deskripsi
Implementasi complete authentication service untuk admin CMS dengan JWT tokens, security hardening, dan database integration.

## Estimasi
**5 hari**

## Dependencies
- Database schema deployment
- JWT signing keys configuration
- Redis for rate limiting (optional, can use in-memory)

## Acceptance Criteria Backend

### Core Authentication
- **POST /admin/auth/login** endpoint implemented
- **POST /admin/auth/refresh** endpoint implemented
- **POST /admin/auth/logout** endpoint implemented
- Input validation: email format, password min 8 chars
- Password hashing with bcrypt (cost factor 12)
- JWT generation with RS256 algorithm
- Refresh token management (UUID v4, 7 days expiry)

### Security Features
- Rate limiting: 10 req/min per IP on login endpoint
- Account lockout: 5 failed attempts = 15 min lockout
- Password policy enforcement (8+ chars, mixed case, numbers, special)
- Common password blacklist (top 1000 passwords)
- Secure cookie configuration (httpOnly, secure, sameSite)
- CORS configuration for admin frontend

### Database Operations
- Admin user lookup and validation
- Refresh token storage and management
- Failed login attempt tracking
- Account lockout status management
- Token revocation on logout

## Database Schema Required

```sql
-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP NULL,
  password_changed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE admin_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  device_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_refresh_tokens_admin ON admin_refresh_tokens(admin_id);
CREATE INDEX idx_refresh_tokens_expires ON admin_refresh_tokens(expires_at);
```

## Environment Variables

```bash
# JWT Configuration
JWT_PRIVATE_KEY=<RSA private key>
JWT_PUBLIC_KEY=<RSA public key>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
ACCOUNT_LOCKOUT_THRESHOLD=5
ACCOUNT_LOCKOUT_DURATION_MS=900000

# Cookie Configuration
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
COOKIE_DOMAIN=.yourdomain.com
```

## API Error Codes

| Code | Status | Description |
|------|--------|-------------|
| AUTH_001 | 400 | Invalid email format |
| AUTH_002 | 400 | Invalid password format |
| AUTH_003 | 401 | Invalid credentials |
| AUTH_004 | 423 | Account temporarily locked |
| AUTH_005 | 429 | Rate limit exceeded |
| AUTH_006 | 401 | Invalid refresh token |
| AUTH_007 | 403 | Token revoked |

## Testing Requirements
- Unit tests for password hashing and validation
- Integration tests for all auth endpoints
- Security tests for rate limiting and lockout
- Token validation and expiry tests
- Database integration tests

## Security Validation
- Password strength validation
- JWT signature verification
- Refresh token rotation (optional)
- Secure header configuration
- Input sanitization
- SQL injection prevention
