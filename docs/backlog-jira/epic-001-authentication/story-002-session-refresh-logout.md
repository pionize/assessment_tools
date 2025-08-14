# STORY-002: Session, Refresh Token, dan Logout

## Deskripsi
Sebagai pengguna CMS, saya ingin sesi saya aman dan dapat diperpanjang tanpa sering login ulang, serta dapat logout kapan pun agar akses saya terputus.

## API Contracts

### POST /admin/auth/refresh
**Request:**
```typescript
// Refresh token sent via httpOnly cookie
// No body required
```

**Success Response (200):**
```typescript
{
  success: true;
  data: {
    accessToken: string;   // New JWT, expires in 15 minutes
    expiresIn: number;     // 900 seconds (15 minutes)
  }
}
```

**Error Responses:**
```typescript
// 401 - Invalid/expired refresh token
{
  success: false;
  error: "Invalid or expired refresh token";
}

// 403 - Token revoked
{
  success: false;
  error: "Token has been revoked";
}
```

### POST /admin/auth/logout
**Request:**
```typescript
// Both tokens needed: Authorization header + httpOnly cookie
// No body required
```

**Success Response (200):**
```typescript
{
  success: true;
  message: "Logged out successfully";
}
```

**Error Responses:**
```typescript
// 401 - No valid tokens
{
  success: false;
  error: "Not authenticated";
}
```

## Acceptance Criteria
- Sistem mengeluarkan access token (15 menit) dan refresh token (7 hari)
- Endpoint refresh mengembalikan access token baru jika refresh token valid
- Logout mencabut refresh token aktif dan clear client tokens
- Refresh token tersimpan dalam httpOnly cookie (secure, sameSite=strict)
- Refresh token dapat direvoke per-device
- Access token otomatis di-refresh saat mendekati expiry
- Auto-logout jika refresh token expired/revoked

## Validation Rules
- **Access Token**: JWT dengan RS256, expires dalam 15 menit
- **Refresh Token**: UUID v4, expires dalam 7 hari, stored hashed di database
- **Cookie Security**: httpOnly, secure (HTTPS only), sameSite=strict
- **Token Rotation**: New refresh token issued setiap refresh (optional)
- **Revocation**: Soft delete refresh token di database untuk logout

