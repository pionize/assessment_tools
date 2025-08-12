# TASK-002: Middleware & Policies Enforcement

## Deskripsi
Implementasi middleware untuk validasi JWT admin, pemetaan role→permission, dan policy guard pada setiap route CMS.

## Acceptance Criteria
- Middleware memeriksa token, status user aktif, dan permission spesifik per endpoint.
- Response standar: 401 untuk tidak autentik, 403 untuk tidak berizin.
- Unit test mencakup endpoint sensitif (user mgmt, assessment/challenge write, reporting export).

