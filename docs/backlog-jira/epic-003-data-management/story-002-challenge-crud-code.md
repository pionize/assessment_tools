# STORY-002: Challenge CRUD - Code Type

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat dan mengelola challenge bertipe Code (file templates, language, instructions, test cases) agar kandidat dapat mengerjakan coding challenge.

## Acceptance Criteria
- Form builder untuk Code Challenge: title, description, instructions (rich text/markdown), language, files (nama file + konten awal), testCases (opsional), time_limit, points, difficulty.
- Validasi minimal: setidaknya satu file template, language valid, points ≥ 0, time_limit > 0.
- Dapat create, update, delete; perubahan tidak merusak submissions historis (versioning atau copy-on-edit minimal pada published challenge).
- Dapat preview struktur file yang akan dilihat kandidat.
- Audit log untuk semua perubahan.

