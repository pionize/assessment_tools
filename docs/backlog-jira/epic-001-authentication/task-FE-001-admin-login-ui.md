# TASK-FE-001: Admin Login UI (Frontend)

## Deskripsi
Implementasi complete login interface untuk admin CMS dengan authentication context, form validation, dan secure token management.

## Estimasi
**3 hari**

## Dependencies
- Backend authentication endpoints available
- Admin UI routing structure
- Form validation library setup

## Acceptance Criteria Frontend

### Login Form Component
- Email input field dengan validation visual feedback
- Password input field dengan show/hide toggle
- Submit button dengan loading state indicator
- Error message display untuk semua error types
- Remember me checkbox (optional)
- Responsive design untuk mobile dan desktop
- Accessibility compliance (ARIA labels, keyboard navigation)

### Form Validation
- Client-side email format validation
- Password field required validation
- Real-time validation dengan error messages
- Form disable saat loading
- Rate limit error handling dengan countdown timer
- Account lockout notification dengan retry time

### Authentication Context
- AdminAuthContext dengan TypeScript interfaces
- Token storage management (memory + httpOnly cookie)
- Auto-refresh token mechanism
- Logout functionality dengan token cleanup
- Authentication state persistence
- Route protection untuk authenticated pages

### User Experience
- Success notification dengan redirect ke dashboard
- Loading states untuk semua async operations
- Graceful error handling dengan user-friendly messages
- Auto-logout notification pada token expiry
- Session timeout warning modal
- Password strength indicator (pada change password)

## Component Structure

```typescript
// src/components/admin/LoginForm.tsx
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// src/contexts/AdminAuthContext.tsx
interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
}

interface AdminAuthActions {
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// src/components/admin/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'staff';
  fallback?: React.ReactNode;
}
```

## Validation Rules (Client-side)

```typescript
const loginSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  password: {
    required: true,
    minLength: 8,
    message: "Password must be at least 8 characters"
  }
}
```

## Error Handling

```typescript
interface AuthError {
  code: string;
  message: string;
  retryAfter?: number; // For rate limiting
}

const errorMessages = {
  'AUTH_001': 'Please enter a valid email address',
  'AUTH_002': 'Password must be at least 8 characters',
  'AUTH_003': 'Invalid email or password',
  'AUTH_004': 'Account temporarily locked. Try again in {time} minutes',
  'AUTH_005': 'Too many requests. Try again in {time} seconds',
  'AUTH_006': 'Session expired. Please login again',
  'AUTH_007': 'Your session has been revoked. Please login again',
  'NETWORK_ERROR': 'Connection failed. Please check your internet connection'
}
```

## Token Management

```typescript
// Token storage strategy
interface TokenManager {
  // Access token: in memory only (security)
  setAccessToken: (token: string) => void;
  getAccessToken: () => string | null;

  // Refresh token: httpOnly cookie (handled by browser)
  // Auto-refresh: 2 minutes before access token expiry
  setupAutoRefresh: () => void;

  // Cleanup on logout
  clearTokens: () => void;
}
```

## Routing Integration

```typescript
// Protected route wrapper
<AdminAuthProvider>
  <Router>
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
</AdminAuthProvider>
```

## UI/UX Requirements
- Loading spinner saat authentication
- Success/error toast notifications
- Form auto-focus pada email field
- Enter key submit form
- Tab navigation accessibility
- Screen reader compatibility
- Mobile-responsive design
- Dark mode compatibility (if applicable)

## Testing Requirements
- Component unit tests dengan React Testing Library
- Form validation tests
- Authentication context tests
- Protected route tests
- Error handling tests
- Token management tests
