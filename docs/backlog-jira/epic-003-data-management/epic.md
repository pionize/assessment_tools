# EPIC-003: CMS Data Management (CRUD)

## Deskripsi
Menyediakan kemampuan CRUD terstruktur untuk seluruh entitas inti: Assessments, Challenges (code, multiple choice, open-ended), Challenge–Assessment linkage & ordering, Candidates, dan Submissions (read/review).

## Tujuan Bisnis
- Admin dapat membuat/mengelola konten assessment secara efisien dan konsisten.
- Menjaga kualitas data melalui validasi dan workflow status (draft/active/archived).

## Ruang Lingkup
- Assessment CRUD + lifecycle (draft → active → archived) + metadata (time_limit, pass_threshold, instructions).
- Challenge CRUD per tipe termasuk builder/form khusus tiap tipe.
- Pengaitan challenge ke assessment, ordering, points, difficulty.
- Candidate management (read/search), Submissions read/review-only dari CMS.

## Acceptance Criteria Umum
- Setiap operasi CRUD tervalidasi
- Pagination, search, sort, filter sesuai kontrak API CMS.
- Status management mempengaruhi visibilitas pada aplikasi kandidat.
