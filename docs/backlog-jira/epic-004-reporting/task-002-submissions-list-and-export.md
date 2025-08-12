# TASK-002: Submissions List, Filters, dan Export

## Deskripsi
Bangun daftar submissions dengan filter skor, status, AI threshold, sorting; serta kemampuan export CSV/Excel.

## Acceptance Criteria
- Filter: status, min_score, max_score, ai_threshold; sort: submitted_at, score, completion_time, ai_likelihood.
- Export menghasilkan file sesuai tampilan/filter aktif; kolom: candidate, assessment, summary metrics, AI metrics.
- RBAC membatasi export pada role yang diizinkan.
- Test e2e untuk verifikasi filter dan export.

