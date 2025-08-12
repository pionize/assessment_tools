# STORY-003: Security Hardening Login

## Deskripsi
Sebagai pemilik sistem, saya ingin endpoint login dan data kredensial dilindungi dari penyalahgunaan sehingga risiko serangan berkurang.

## Acceptance Criteria
- Rate limiting diterapkan pada endpoint login.
- Lockout sementara setelah sejumlah percobaan gagal beruntun.
- Password policy minimal: panjang min 8, kombinasi karakter, larang password umum.
- Semua password disimpan dengan hashing kuat (bcrypt/argon2) + salt.
- Tercatat minimal 90 hari riwayat login/logout pada audit log.

