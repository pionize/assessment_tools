# STORY-006: Candidate & Submissions (Read/Review)

## Deskripsi
Sebagai Reviewer/Analyst, saya ingin melihat kandidat dan submission mereka untuk kebutuhan review dan analisis.

## Acceptance Criteria
- Daftar kandidat dengan search (by name/email) dan filter by assessment.
- Daftar submissions per assessment (pagination, filter status, sort by submitted_at, score, ai_likelihood) sesuai `cms-api-assessment-submissions.md`.
- Halaman detail submission menampilkan ringkasan skor, waktu, serta per-challenge results termasuk AI detection metrics dan konten jawaban (code, MC, open-ended).
- Reviewer dapat memberi catatan/feedback manual (komentar) tanpa mengubah skor otomatis.
- Akses dibatasi via RBAC (Reviewer read+score; Analyst read-only kecuali export/report).

