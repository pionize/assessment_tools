# STORY-001: Admin Login (Email + Password)

## Deskripsi
Sebagai Super Admin/Staff CMS, saya ingin bisa login ke CMS menggunakan email dan password untuk mendapatkan akses ke fitur manajemen.

## API Contract

### POST /admin/auth/login
**Request:**
```typescript
{
  email: string;     // Required, valid email format
  password: string;  // Required, min 8 chars
}
```

**Success Response (200):**
```typescript
{
  success: true;
  data: {
    accessToken: string;   // JWT, expires in 15 minutes  
    refreshToken: string;  // UUID, expires in 7 days
    admin: {
      id: string;
      email: string;
      role: 'super_admin' | 'admin' | 'staff';
      firstName: string;
      lastName: string;
    }
  }
}
```

**Error Responses:**
```typescript
// 400 - Invalid input
{
  success: false;
  error: "Invalid email or password format";
}

// 401 - Invalid credentials
{
  success: false;
  error: "Invalid credentials";
}

// 423 - Account locked
{
  success: false;
  error: "Account temporarily locked";
  retryAfter: number; // seconds
}

// 429 - Too many requests
{
  success: false;
  error: "Too many requests";
  retryAfter: number; // seconds
}
```

## Acceptance Criteria
- ✅ Dapat memasukkan email dan password pada halaman login CMS
- ✅ Validasi input: email format valid, password minimal 8 karakter
- ✅ Jika kredensial benar, sistem mengembalikan JWT access + refresh token
- ✅ UI menyimpan token aman (httpOnly cookie untuk refresh, memory untuk access)
- ✅ Jika kredensial salah, tampilkan pesan error generik
- ✅ Akun yang di-lockout menampilkan pesan sesuai dan tidak memberikan token
- ✅ Sesi berakhir otomatis saat token kedaluwarsa; redirect ke login
- ✅ Rate limiting: 10 requests/minute per IP
- ✅ Account lockout: 5 failed attempts = 15 minute lockout
- ✅ Password hashing menggunakan bcrypt (cost factor 12)

## Validation Rules
- **Email**: Must be valid email format using regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Password**: Minimum 8 characters, no maximum limit
- **Rate Limit**: 10 requests per minute per IP address
- **Lockout Policy**: 5 consecutive failures locks account for 15 minutes

