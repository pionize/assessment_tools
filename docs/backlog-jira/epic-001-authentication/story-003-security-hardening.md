# STORY-003: Security Hardening Login

## Deskripsi
Sebagai pemilik sistem, saya ingin endpoint login dan data kredensial dilindungi dari penyalahgunaan sehingga risiko serangan berkurang.

## Security Requirements

### Rate Limiting Configuration
```typescript
// Per IP Address
{
  windowMs: 60000,        // 1 minute
  maxRequests: 10,        // 10 requests per window
  blockDuration: 900000,  // 15 minutes block after limit exceeded
  skipSuccessfulRequests: false
}

// Per User Account  
{
  windowMs: 300000,       // 5 minutes
  maxRequests: 5,         // 5 failed attempts per window
  lockoutDuration: 900000 // 15 minutes account lockout
}
```

### Password Policy
```typescript
interface PasswordPolicy {
  minLength: 8;
  maxLength: 128;
  requireUppercase: boolean;     // At least 1 uppercase letter
  requireLowercase: boolean;     // At least 1 lowercase letter  
  requireNumbers: boolean;       // At least 1 number
  requireSpecialChars: boolean;  // At least 1 special character
  blockedPasswords: string[];    // Common passwords blacklist
}
```

### Password Hashing
```typescript
// Using bcrypt with cost factor 12
const hashConfig = {
  algorithm: 'bcrypt',
  costFactor: 12,        // 2^12 iterations
  saltRounds: 12
}
```

## Acceptance Criteria
- ✅ Rate limiting: 10 req/min per IP, 5 failed attempts per user
- ✅ Account lockout: 15 minutes after 5 consecutive failures
- ✅ Password policy: min 8 chars, mixed case, numbers, special chars
- ✅ Blocked common passwords (top 10k list)
- ✅ Password hashing: bcrypt cost factor 12 with automatic salt
- ✅ Secure headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- ✅ Input sanitization: prevent injection attacks
- ✅ Request body size limits: max 1MB for auth endpoints

## Validation Rules
- **Rate Limiting**: Redis-based sliding window counter
- **Password Strength**: Real-time validation with error messages
- **Brute Force Protection**: Progressive delays for repeat offenders
- **Session Security**: Secure cookie flags, token rotation
- **Input Validation**: Schema validation with sanitization
- **Monitoring**: Failed login attempts, suspicious patterns detection

