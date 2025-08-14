# STORY-002: Session, Refresh Token, dan Logout

## Deskripsi
Sebagai pengguna CMS, saya ingin sesi saya aman dan dapat diperpanjang tanpa sering login ulang, serta dapat logout kapan pun agar akses saya terputus.

## API Contracts

### POST /api/auth/refresh-token
**Request:**
```typescript
{
  refresh_token: string;    // Required, the refresh token from login
}
```

**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      access_token: string;        // New JWT token
      token_type: "Bearer";
      expires_in: number;          // Token expiry in seconds
      refresh_token?: string;      // Optional new refresh token (rotation)
      session_info: {
        session_id: string;
        refreshed_at: string;
        expires_at: string;
      };
    }
  }
}
```

### POST /api/auth/logout
**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```typescript
{
  refresh_token?: string;   // Optional, for revoking specific session
  logout_all?: boolean;     // Optional, logout from all devices
}
```

**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      message: "Logged out successfully";
      sessions_revoked: number;    // Number of sessions terminated
      logout_at: string;
    }
  }
}
```

### GET /api/auth/sessions
**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0000";
    response_message: "Success";
  };
  response_output: {
    list: {
      content: [{
        session_id: string;
        device_info: {
          user_agent: string;
          ip_address: string;
          device_type: 'desktop' | 'mobile' | 'tablet';
          browser: string;
          os: string;
        };
        login_at: string;
        last_activity: string;
        expires_at: string;
        is_current: boolean;
        location?: {
          country: string;
          city: string;
        };
      }];
      pagination: null;
    }
  }
}
```

### DELETE /api/auth/sessions/:sessionId
**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      message: "Session terminated successfully";
      session_id: string;
      terminated_at: string;
    }
  }
}
```

**Error Responses:**
```typescript
// 401 - Invalid/expired refresh token
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0005";
    response_message: "Invalid or expired refresh token";
  };
  response_output: null;
}

// 403 - Token revoked
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0006";
    response_message: "Token has been revoked";
  };
  response_output: null;
}

// 401 - Not authenticated
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0007";
    response_message: "Not authenticated";
  };
  response_output: null;
}

// 404 - Session not found
{
  response_schema: {
    response_code: "PLUGINUSERMANAGEMENT-0008";
    response_message: "Session not found";
  };
  response_output: null;
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

