# STORY-003: Challenge CRUD - Multiple Choice

## Deskripsi
Sebagai Assessment Manager, saya ingin membuat dan mengelola challenge Multiple Choice dengan question builder lengkap (pilihan jawaban, kunci, penjelasan) agar mengukur pengetahuan kandidat.

## Acceptance Criteria
- Question builder: daftar pertanyaan, setiap pertanyaan memiliki options (id, text), correctAnswer, optional explanation, points.
- Validasi: minimal 1 pertanyaan, setiap pertanyaan memiliki ≥2 options dan tepat satu correctAnswer.
- Dapat create, update, delete pertanyaan dan opsi; urutan pertanyaan dapat diatur; totalQuestions terhitung otomatis.
- Dapat import/export pertanyaan via JSON untuk bulk edit.
- Audit log untuk perubahan.

