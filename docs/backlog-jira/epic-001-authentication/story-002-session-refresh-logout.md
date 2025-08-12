# STORY-002: Session, Refresh Token, dan Logout

## Deskripsi
Sebagai pengguna CMS, saya ingin sesi saya aman dan dapat diperpanjang tanpa sering login ulang, serta dapat logout kapan pun agar akses saya terputus.

## Acceptance Criteria
- Sistem mengeluarkan access token (masa berlaku singkat) dan refresh token (masa berlaku lebih panjang).
- Endpoint refresh mengembalikan access token baru saat access token hampir/kadaluarsa, hanya jika refresh token valid dan belum dicabut.
- Logout mencabut refresh token aktif (blacklist) dan menghapus token sisi klien.
- Refresh token tersimpan aman (httpOnly cookie, secure, sameSite) dan dapat direvoke per-perangkat.
- Audit log mencatat refresh dan logout (user, device hint, IP, timestamp).

