# TASK-002: Auth UI - Login Form

## Deskripsi
Implementasi halaman login CMS (React + TS) dengan validasi, error state, dan integrasi endpoint backend.

## Acceptance Criteria
- Form dengan input email dan password, validasi on-blur/on-submit.
- Loading state, kesalahan ditampilkan secara generik; tidak mengungkap apakah email terdaftar.
- Menyimpan access token secara aman (in-memory) dan refresh via httpOnly cookie.
- Redirect ke halaman CMS utama ketika login sukses; state dipulihkan saat refresh token valid.
- Test komponen: render, validasi, successful submit, error path.

