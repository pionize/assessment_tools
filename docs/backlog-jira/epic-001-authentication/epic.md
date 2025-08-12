# EPIC-001: CMS Authentication

## Deskripsi
Menyediakan mekanisme autentikasi yang aman untuk pengguna CMS (admin dan staf terkait) yang berbeda dari autentikasi kandidat. Menghasilkan token JWT admin untuk mengakses endpoint CMS (Bearer token) sesuai kontrak di `docs/cms-api-contract`. Mencakup login, logout, sesi, dan hardening dasar (rate limit, lockout, audit).

## Tujuan Bisnis
- Hanya user terotorisasi yang dapat mengakses CMS dan data kandidat/submission.
- Menyediakan sesi yang aman, dapat diakhiri, dan terpantau.
- Menjadi fondasi bagi RBAC dan audit logging.

## Ruang Lingkup
- Form login admin (email + password) dan endpoint auth admin.
- JWT issuance + refresh, logout (token revoke/blacklist).
- Kebijakan keamanan: password policy minimum, rate limiting, lockout sementara.
- Audit login sukses/gagal.

## Di Luar Lingkup
- SSO/IdP enterprise (bisa sebagai enhancement terpisah).
- Self-service registration (user dibuat oleh Super Admin/HR ops).

## Acceptance Criteria Umum
- Menghasilkan `Authorization: Bearer <admin_jwt>` yang berlaku untuk CMS endpoints.
- Token memiliki expiry; refresh token dikelola aman dan dapat dicabut.
- Upaya login gagal dibatasi (rate limit + lockout sementara setelah X percobaan).
- Semua aktivitas login/logout tercatat di audit log.

## Dependensi
- Database tabel admin_users, refresh_tokens, audit_logs.
- Integrasi middleware RBAC (EPIC-002) untuk memvalidasi token + role.

## Risiko
- Brute-force terhadap endpoint login.
- Kebocoran refresh token jika tidak dienkripsi/diamankan.

