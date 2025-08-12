# STORY-001: Definisikan Roles dan Permissions

## Deskripsi
Sebagai Super Admin, saya ingin sistem memiliki role dan permission yang jelas agar akses ke fitur CMS dapat dikontrol dengan tepat.

## Acceptance Criteria
- Role minimal tersedia: Super Admin, Assessment Manager, Reviewer, Analyst.
- Permissions ditentukan per fitur inti: User Management, Assessment CRUD, Challenge CRUD, Submission Review/Score, Reporting/Export, System Config.
- Tabel mapping role→permissions tersedia dan dapat diekspor sebagai seed/migrasi.
- Default permission ketat (principle of least privilege).

