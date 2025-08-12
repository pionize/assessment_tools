# STORY-001: Assessment CRUD + Lifecycle

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat, mengedit, mengarsipkan assessment lengkap dengan metadata (title, description, instructions, time_limit, pass_threshold) agar dapat dikelola dengan baik.

## Acceptance Criteria
- Dapat membuat assessment baru dengan field wajib tervalidasi; title unik per organisasi/namespace.
- Dapat update field dan status: draft, active, archived; transisi tervalidasi (mis. archived → read-only).
- Dapat melihat daftar assessment dengan pagination, search, filter status, dan sort.
- Dapat melihat detail assessment beserta ringkasan statistik dasar (jika tersedia via API).
- Audit log untuk create/update/status change/archival termasuk siapa dan kapan.

