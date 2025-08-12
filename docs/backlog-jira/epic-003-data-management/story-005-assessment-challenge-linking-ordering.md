# STORY-005: Linking Challenge ke Assessment + Ordering

## Deskripsi
Sebagai Assessment Manager, saya ingin mengaitkan challenge ke assessment, menentukan urutan, bobot/points per challenge agar alur assessment konsisten.

## Acceptance Criteria
- UI untuk menambah/menghapus challenge dari assessment, atur `order`, points override (opsional), dan difficulty.
- Validasi duplikasi: satu challenge tidak muncul dua kali dalam assessment yang sama.
- Dapat drag-and-drop reordering; perubahan persisten.
- Perubahan mempengaruhi detail assessment (lihat di CMS detail) dan tercermin pada aplikasi kandidat setelah publish.
- Audit log untuk perubahan linkage dan ordering.

