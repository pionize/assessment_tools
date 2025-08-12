# STORY-002: Permission Middleware & Enforcement

## Deskripsi
Sebagai sistem, saya ingin setiap request ke endpoint CMS diverifikasi role dan permission-nya agar tidak ada akses di luar kewenangan.

## Acceptance Criteria
- Middleware memvalidasi JWT admin, status user aktif, dan role/permission pada setiap endpoint CMS.
- Response 401 untuk token tidak valid/kadaluarsa; 403 untuk izin tidak cukup.
- Log pelanggaran akses (user, endpoint, method, IP, timestamp).
- Unit test untuk setiap kombinasi role terhadap endpoint kritikal.

