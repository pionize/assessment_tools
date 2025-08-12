# TASK-004: Audit Logging Login/Logout/Refresh

## Deskripsi
Catat peristiwa autentikasi ke audit log untuk keperluan keamanan dan compliance.

## Acceptance Criteria
- Merekam event: login_success, login_failed, token_refreshed, logout, account_lockout (timestamp, user/email, IP, user-agent, hasil).
- Tersedia endpoint/listing internal untuk penelusuran (read-only via Super Admin).
- Data retensi min. 90 hari dan dapat diekspor CSV.

