# EPIC-004: Reporting & Analytics

## Deskripsi
Menyediakan kemampuan pelaporan dan analitik untuk menilai performa assessment, challenge, dan kandidat. Mendukung filter/segmentasi, metrik AI detection, serta ekspor.

## Tujuan Bisnis
- Mempercepat pengambilan keputusan hiring dengan data yang akurat.
- Deteksi dini indikasi kecurangan/AI assistance berlebih.

## Ruang Lingkup
- Laporan performa assessment (pass rate, average score, completion time).
- Drill-down submissions dan per-challenge statistics.
- Filter & sorting lanjutan, export CSV/Excel (PDF opsional).

## Acceptance Criteria Umum
- Endpoint/halaman laporan sesuai `docs/cms-api-contract` (list assessments, detail, submissions) beserta filter/sort.
- Export menghasilkan file dengan kolom sesuai tampilan/filter aktif.
- RBAC membatasi akses (semua role kecuali batasan tertentu sesuai matriks).

