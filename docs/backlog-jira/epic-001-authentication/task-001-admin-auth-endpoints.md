# TASK-001: Admin Auth Endpoints (Backend)

## Deskripsi
Buat endpoint autentikasi admin terpisah dari kandidat: `POST /cms/auth/login`, `POST /cms/auth/refresh`, `POST /cms/auth/logout` dengan JWT + refresh token sesuai praktik aman.

## Acceptance Criteria
- `POST /cms/auth/login` menerima email, password; mengembalikan access token (TTL pendek) dan refresh token (TTL panjang) yang disimpan aman.
- `POST /cms/auth/refresh` mengeluarkan access token baru jika refresh token valid dan belum dicabut.
- `POST /cms/auth/logout` mencabut refresh token terkait (blacklist) dan invalidasi sesi.
- Password diverifikasi menggunakan hashing kuat; respons error aman dan seragam.
- Unit test menutupi jalur sukses/gagal, rate limit, dan lockout.

