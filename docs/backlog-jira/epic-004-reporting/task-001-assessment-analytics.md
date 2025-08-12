# TASK-001: Assessment Analytics Views

## Deskripsi
Bangun tampilan laporan untuk list assessment dan detail analytics per assessment mengacu `cms-api-contract`.

## Acceptance Criteria
- List menampilkan statistik (submission_count, pass_rate, average_score) dengan filter/search/sort.
- Detail menampilkan challenge breakdown (completion_rate, average_score, average_time_spent) dan agregat lainnya.
- Query parameter sinkron dengan UI (page, limit, status, sort, order, date range jika ada).
- Unit test untuk adapter data dan tampilan.

