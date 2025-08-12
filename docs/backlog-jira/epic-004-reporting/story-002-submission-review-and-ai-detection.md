# STORY-002: Submission Review + AI Detection

## Deskripsi
Sebagai Reviewer/Analyst, saya ingin meninjau submission kandidat dengan metrik AI detection agar dapat mengidentifikasi risiko penggunaan AI berlebih.

## Acceptance Criteria
- List submissions mendukung filter skor min/max, status, sort by ai_likelihood desc/asc.
- Detail submission menampilkan overall AI likelihood, component analysis (code_style_patterns, response_timing, complexity_vs_time, language_patterns), risk_level, dan confidence.
- Dapat menandai submission sebagai "needs further review" dan menambahkan komentar internal.
- Export daftar submissions ke CSV menghormati filter/sort aktif.
- RBAC: Reviewer dapat memberi status/komentar; Analyst read-only + export.

