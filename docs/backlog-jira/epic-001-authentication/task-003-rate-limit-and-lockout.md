# TASK-003: Rate Limit dan Lockout

## Deskripsi
Terapkan rate limiting pada endpoint login dan mekanisme lockout sementara untuk kredensial yang gagal berulang.

## Acceptance Criteria
- Rate limit login (contoh 10 req/menit per IP) terukur dan dapat dikonfigurasi.
- Lockout sementara setelah N kegagalan beruntun (contoh 5), durasi 15 menit; tercatat di audit log.
- Pesan error tetap generik saat lockout.
- Unit/integration test mencakup skenario normal dan batasan rate/lockout.

