# STORY-001: Admin Login (Email + Password)

## Deskripsi
Sebagai Super Admin/Staff CMS, saya ingin bisa login ke CMS menggunakan email dan password untuk mendapatkan akses ke fitur manajemen.

## Acceptance Criteria
- Dapat memasukkan email dan password pada halaman login CMS.
- Validasi input: email valid, password tidak kosong.
- Jika kredensial benar, sistem mengembalikan JWT akses + refresh token; UI menyimpan aman (httpOnly cookie untuk refresh, memory/local state untuk access sesuai praktik baik).
- Jika kredensial salah, tampilkan pesan error generik tanpa membocorkan detail.
- Akun yang di-lockout menampilkan pesan sesuai dan tidak memberikan token.
- Sesi berakhir otomatis saat token kedaluwarsa; pengguna diarahkan ulang ke login.
- Audit log mencatat login sukses/gagal (email, IP, timestamp, hasil).

## Catatan
- Rate limiting pada endpoint login (mis. 10 req/menit per IP).
- Lockout sementara setelah N kegagalan (mis. 5 kali, 15 menit).

