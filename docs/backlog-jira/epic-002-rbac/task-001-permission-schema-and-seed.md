# TASK-001: Permission Schema & Seed

## Deskripsi
Buat tabel roles, permissions, role_permissions, user_roles, serta seed awal untuk 4 role utama sesuai matriks.

## Acceptance Criteria
- Migrasi DB membuat tabel relasional dengan constraint FK dan index yang sesuai.
- Seed default: daftar permissions granular + mapping ke Super Admin, Assessment Manager, Reviewer, Analyst.
- Dokumen matriks role-permission (md/JSON) diekspor sebagai referensi dan sinkron dengan seed.

