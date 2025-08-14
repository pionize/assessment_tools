# STORY-001: Admin Login (Email + Password)

## Deskripsi
Sebagai Super Admin/Staff CMS, saya ingin bisa login ke CMS menggunakan email dan password untuk mendapatkan akses ke fitur manajemen.

## API Contracts

### POST /api/auth/login
**Request:**
```typescript
{
  username: string;     // Required, email or username
  password: string;     // Required, min 8 chars
}
```

**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "CODE-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      access_token: string;        // JWT with permissions/authorities
      refresh_token: string;       // For token renewal
      token_type: "Bearer";
      need_change_password: boolean; // Force password change flag
      expires_in: number;          // Token expiry in seconds
      user_profile: {
        id: number;
        username: string;
        name: string;
        email?: string;
        is_active: boolean;
        roles: {
          id: string;
          name: string;
          description: string;
          permissions: {
            id: string;
            name: string;
            description: string;
            permission_actions: {
              id: string;              // e.g., "MASTER_USER.READ_LIST"
              description: string;
            }[];
          }[];
        }[];
        created_at: string;
        last_modified_at: string;
      };
      session_info: {
        session_id: string;
        ip_address?: string;
        user_agent?: string;
        login_at: string;
        expires_at: string;
      };
    }
  }
}
```

### GET /api/user/profile
**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```typescript
{
  response_schema: {
    response_code: "CODE-0000";
    response_message: "Success";
  };
  response_output: {
    detail: {
      name: string;
      permissions: string[];       // Array of permission action IDs
    }
  }
}
```

**Error Responses:**
```typescript
// 400 - Invalid input
{
  response_schema: {
    response_code: "CODE-0001";
    response_message: "Invalid username or password format";
  };
  response_output: null;
}

// 401 - Invalid credentials
{
  response_schema: {
    response_code: "CODE-0002";
    response_message: "Invalid credentials";
  };
  response_output: null;
}

// 423 - Account locked
{
  response_schema: {
    response_code: "CODE-0003";
    response_message: "Account temporarily locked";
  };
  response_output: {
    detail: {
      retry_after: number;        // seconds until unlock
      locked_until: string;       // ISO timestamp
      failed_attempts: number;
    }
  }
}

// 429 - Too many requests
{
  response_schema: {
    response_code: "CODE-0004";
    response_message: "Too many requests";
  };
  response_output: {
    detail: {
      retry_after: number;        // seconds
      limit: number;              // requests per window
      window: number;             // window size in seconds
    }
  }
}
```

## Acceptance Criteria
- Dapat memasukkan email dan password pada halaman login CMS
- Validasi input: email format valid, password minimal 8 karakter
- Jika kredensial benar, sistem mengembalikan JWT access + refresh token
- UI menyimpan token aman (httpOnly cookie untuk refresh, memory untuk access)
- Jika kredensial salah, tampilkan pesan error generik
- Akun yang di-lockout menampilkan pesan sesuai dan tidak memberikan token
- Sesi berakhir otomatis saat token kedaluwarsa; redirect ke login
- Rate limiting: 10 requests/minute per IP
- Account lockout: 5 failed attempts = 15 minute lockout
- Password hashing menggunakan bcrypt (cost factor 12)

## Validation Rules
- **Email**: Must be valid email format using regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Password**: Minimum 8 characters, no maximum limit
- **Rate Limit**: 10 requests per minute per IP address
- **Lockout Policy**: 5 consecutive failures locks account for 15 minutes

