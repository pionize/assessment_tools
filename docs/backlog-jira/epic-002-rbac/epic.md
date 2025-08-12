# EPIC-002: Role-Based Access Control (RBAC)

## Deskripsi
Menyediakan kontrol akses berbasis peran untuk CMS, memastikan hanya pengguna dengan izin tepat yang dapat mengakses/mengeksekusi fungsi tertentu (mengacu matriks peran pada `docs/jira/README.md`).

## Tujuan Bisnis
- Kurangi risiko akses tidak sah ke data sensitif.
- Memungkinkan delegasi aman antar tim (Super Admin, Assessment Manager, Reviewer, Analyst).

## Ruang Lingkup
- Definisi role dan permission granular per fitur/endpoint.
- Middleware verifikasi token + role + permission.
- UI manajemen role/assign role ke user.
- Audit perubahan role/permission.

## Acceptance Criteria Umum
- Setiap endpoint CMS memeriksa izin dan mengembalikan 403 jika tidak cukup.
- Hanya Super Admin yang dapat membuat/mengubah role dan memberikan role ke user lain.
- Perubahan role/permission tercatat (siapa, apa, kapan, sebelum/sesudah).

## Dependensi
- EPIC-001 untuk identitas dan token admin.
- Skema DB: roles, permissions, role_permissions, user_roles, audit_logs.

## Risiko
- Over-permissioning jika default tidak ketat.
- Inkonsistensi antara policy backend dan visibilitas UI.

