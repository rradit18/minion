# 🧪 Testing Sheet — Minion Barbershop Backend

> Checklist untuk mencoba **seluruh fitur satu per satu** (REST API + Filament).
> Centang `[x]` setelah teruji. Urutan sudah disusun sesuai dependency.
> Disusun dari kode yang benar-benar ada di repo (bukan asumsi dari CLAUDE.md).

---

## 0. Persiapan

```bash
# 1. Pastikan PostgreSQL + Redis jalan
# 2. Migrate + seed data uji
php artisan migrate:fresh --seed

# 3. Jalankan server + queue + scheduler (3 terminal terpisah)
php artisan serve            # http://127.0.0.1:8000
php artisan queue:work       # untuk job
php artisan schedule:work    # untuk BookingExpiryJob (tiap menit)
```

**Base URL API:** `http://127.0.0.1:8000/api`
**Admin panel:** `http://127.0.0.1:8000/admin-panel`
**Kasir panel:** `http://127.0.0.1:8000/kasir-panel`

### Kredensial hasil seed

| Peran | Login (Filament = email, API = phone) | Password | Catatan |
|---|---|---|---|
| Admin | `admin@minionbarbershop.com` / `08117771001` | `password` | Panel admin |
| Kasir | `kasir.pusat@minionbarbershop.com` / `08117771002` | `password` | Cabang **pusat** |
| Customer | `customer@test.com` / `08117771003` | `password` | API customer |
| Barber | `rizky@minionbarbershop.com` / `08111000001` | `barber123` | + 7 barber lain (`...000002`–`...000008`) |

### Data uji yang tersedia
- **Cabang (slug):** `pusat`, `batu-8`, `batu-12`, `bintan-center`
- **Layanan:** Potong Rambut (35rb), Potong Rambut + Cuci (45rb), Cukur Jenggot (25rb), Creambath (75rb), Hair Coloring (150rb), Hair Treatment (100rb), Potong Anak (30rb)
- **Barber:** 8 barber, masing-masing di-assign ke cabang (lihat tabel di BarberSeeder)

> ⚠️ **PENTING — belum ada shift yang di-seed.**
> `availability` dan pembuatan `booking` akan **kosong/gagal** sampai kamu membuat
> shift barber dulu lewat **Kasir → ShiftCalendar** (Bagian 11) atau insert manual.
> Buat shift untuk hari ini sebelum menguji Bagian 3.

> ℹ️ **Belum diimplementasi (tidak ada route):** AI Hair Analysis (Phase 5) dan
> Forgot/Reset Password (Phase 6). Lewati bila menemukannya di CLAUDE.md.

---

## 1. Auth API

| ✓ | Test | Cara | Ekspektasi |
|---|---|---|---|
| [ ] | Register customer baru | `POST /api/auth/register` body `{name, phone, password, password_confirmation}` | 201, `data.{id, token}` |
| [ ] | Register phone duplikat | ulang dengan phone sama | 422, error validasi |
| [ ] | Login berhasil | `POST /api/auth/login` `{phone:"08117771003", password:"password"}` | 200, `data.token` |
| [ ] | Login password salah | password ngawur | 422/401 |
| [ ] | `GET /api/auth/me` (customer) | header `Authorization: Bearer {token}` | 200, user + `punch_card` |
| [ ] | `GET /api/auth/me` tanpa token | tanpa header | 401 |
| [ ] | Logout | `POST /api/auth/logout` + token | 200, token revoked |
| [ ] | Pakai token setelah logout | `GET /me` token lama | 401 |

```bash
# Contoh register
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"name":"Budi","phone":"081299990001","password":"rahasia12","password_confirmation":"rahasia12"}'
```

---

## 2. Public API (tanpa auth)

| ✓ | Test | Endpoint | Ekspektasi |
|---|---|---|---|
| [ ] | List cabang aktif | `GET /api/branches` | 4 cabang |
| [ ] | Detail cabang | `GET /api/branches/pusat` | detail + bank_accounts + services berharga |
| [ ] | Cabang tidak ada | `GET /api/branches/ngawur` | 404 |
| [ ] | Layanan per cabang | `GET /api/branches/{branchId}/services` | 7 layanan + harga cabang |
| [ ] | Barber per cabang | `GET /api/branches/{branchId}/barbers` | barber assigned + status shift hari ini |
| [ ] | List barber | `GET /api/barbers` | 8 barber + avg_rating |
| [ ] | Filter barber per cabang | `GET /api/barbers?branch_id={id}` | hanya barber cabang itu |
| [ ] | Detail barber | `GET /api/barbers/rizky-pratama` | detail + rating + review + cabang |
| [ ] | List layanan global | `GET /api/services` | 7 layanan (tanpa harga) |
| [ ] | Antrean hari ini | `GET /api/queue/pusat` | booking pending+confirmed+in_progress |

> Gunakan `id` cabang dari hasil `GET /api/branches` untuk endpoint yang butuh `{branchId}`.

---

## 3. Availability + Booking

> **Prasyarat:** sudah ada shift barber hari ini (lihat Bagian 11 ShiftCalendar).

| ✓ | Test | Cara | Ekspektasi |
|---|---|---|---|
| [ ] | Slot tersedia | `GET /api/availability?barber_id={id}&date={Y-m-d}&service_ids[]={id}` | array slot 30-menit |
| [ ] | Tanpa shift | barber tanpa shift di tanggal itu | array kosong `[]` |
| [ ] | Durasi panjang kurangi slot | pilih layanan durasi 90 mnt (Hair Coloring) | slot lebih sedikit |
| [ ] | Buat booking (guest) | `POST /api/bookings` (lihat body di bawah) | 201, `booking_number` `MB-YYYYMMDD-0001` |
| [ ] | Buat booking (registered) | sama + header Bearer customer | 201, terhubung ke user |
| [ ] | Booking slot terkunci | submit 2x slot sama cepat | yang kedua 409 (slot lock) |
| [ ] | Booking slot tidak tersedia | scheduled_at di luar shift | 422 |
| [ ] | Cek status booking | `GET /api/bookings/{bookingNumber}` | status `pending_confirmation` |
| [ ] | Booking number increment | buat booking ke-2 hari sama | `...-0002` |

```bash
curl -X POST http://127.0.0.1:8000/api/bookings \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{
    "branch_id":"<UUID_PUSAT>",
    "barber_id":"<UUID_RIZKY>",
    "service_ids":["<UUID_POTONG>"],
    "scheduled_at":"2026-06-13T10:00:00",
    "customer_name":"Andi",
    "customer_phone":"081255550001",
    "notes":"test"
  }'
```

---

## 4. Customer Area `[auth:sanctum + role=customer]`

> Login sebagai customer dulu, pakai tokennya di semua request berikut.

| ✓ | Test | Endpoint | Ekspektasi |
|---|---|---|---|
| [ ] | Buat booking via customer | `POST /api/customer/bookings` | 201 |
| [ ] | Update profil | `PATCH /api/customer/profile` `{name?,email?,phone?,password?}` | 200 |
| [ ] | List booking (semua) | `GET /api/customer/bookings` | paginated |
| [ ] | Filter status | `GET /api/customer/bookings?status=upcoming` | terfilter |
| [ ] | Reschedule valid | `PATCH /api/customer/bookings/{id}/reschedule` `{scheduled_at}` (>1 jam, count<1) | 200, reschedule_count=1 |
| [ ] | Reschedule ke-2x | ulang reschedule | 422 (max 1x) |
| [ ] | Reschedule <1 jam | scheduled_at terlalu dekat | 422 |
| [ ] | Cancel valid | `DELETE /api/customer/bookings/{id}` (pending, >1 jam) | 200 |
| [ ] | Cancel booking orang lain | id booking milik user lain | 403/404 |
| [ ] | Rate booking completed | `POST /api/customer/bookings/{id}/rate` `{stars,comment?,is_anonymous?}` | 200 (status harus completed) |
| [ ] | Rate booking belum completed | booking pending | 422 |
| [ ] | Rate 2x | ulang rate booking sama | 422 |
| [ ] | Loyalty info | `GET /api/customer/loyalty` | punch_count, next_reward_at, dll |
| [ ] | Promo applicable | `GET /api/customer/promos` | list promo + voucher reward |
| [ ] | Akses pakai token non-customer | token barber/kasir | 403 |

---

## 5. Kasir API `[auth:sanctum + role=cashier]`

> Login sebagai kasir (`kasir.pusat@...`). Booking harus milik cabang kasir.

| ✓ | Test | Endpoint | Ekspektasi |
|---|---|---|---|
| [ ] | Konfirmasi kedatangan | `PATCH /api/kasir/bookings/{id}/confirm` | status → `confirmed` |
| [ ] | Confirm booking non-pending | booking sudah confirmed | 422 (transisi invalid) |
| [ ] | Mulai sesi | `PATCH /api/kasir/bookings/{id}/start` | status → `in_progress` |
| [ ] | Booking cabang lain | id booking cabang batu-8 | 403/404 (scope branch) |
| [ ] | Laporan harian | `GET /api/kasir/report?date=YYYY-MM-DD` | ringkasan revenue cabang |
| [ ] | Export CSV | `GET /api/kasir/report/export?date=...` | file CSV |

---

## 6. Barber Portal `[auth:sanctum + role=barber]`

> Login `rizky@minionbarbershop.com` / `barber123`.

| ✓ | Test | Endpoint | Ekspektasi |
|---|---|---|---|
| [ ] | Jadwal | `GET /api/barber/schedule?week_start=YYYY-MM-DD` | shift 2 minggu + booking |
| [ ] | Booking hari ini | `GET /api/barber/bookings/today` | sorted by scheduled_at |
| [ ] | Rating | `GET /api/barber/ratings?month=YYYY-MM` | avg, distribusi, review |

---

## 7. Promo

| ✓ | Test | Cara | Ekspektasi |
|---|---|---|---|
| [ ] | Buat promo di Admin | Filament → Promos (Bagian 10) | tersimpan |
| [ ] | Validate promo valid | `POST /api/promos/validate` `{code,subtotal,branch_id}` | `valid:true`, discount_amount |
| [ ] | Kode tidak ada | code ngawur | 404 |
| [ ] | Promo nonaktif | is_active=false | 422 |
| [ ] | Di luar periode | tanggal lewat valid_until | 422 |
| [ ] | Cabang tidak sesuai | branch_id di luar promo_branches | 422 |
| [ ] | `registered_only` tanpa login | tanpa token | 422 "khusus member" |
| [ ] | Di bawah min_order | subtotal kecil | 422 |
| [ ] | Kuota habis | used_count = max_uses | 422 |
| [ ] | Kalkulasi percentage/fixed/free_service | masing-masing tipe | discount benar |

---

## 8. Feedback

| ✓ | Test | Endpoint | Ekspektasi |
|---|---|---|---|
| [ ] | Kirim feedback (guest) | `POST /api/feedback` `{branch_id?,stars,category,message,customer_name?,customer_phone?}` | 200 "Terima kasih..." |
| [ ] | Kirim feedback (login) | + Bearer token | nama+HP auto-fill |
| [ ] | Kategori invalid | category bukan enum | 422 |
| [ ] | Muncul di Admin | cek FeedbackResource | feedback tampil |

---

## 9. Receipt Page (Web)

| ✓ | Test | Cara | Ekspektasi |
|---|---|---|---|
| [ ] | Render struk | buka `http://127.0.0.1:8000/receipt/{receiptId}` di browser | halaman struk HTML |
| [ ] | Print-friendly | Ctrl+P / preview | layout thermal 80mm rapi |
| [ ] | Receipt tidak ada | id ngawur | 404 |

> `receiptId` didapat setelah menyelesaikan POS (Bagian 11 PosModal).

---

## 10. Filament Admin Panel `/admin-panel`

> Login `admin@minionbarbershop.com` / `password`. Tema gelap + warna gold.

### BranchResource
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | List cabang | 4 cabang + jumlah barber assigned |
| [ ] | Create cabang | slug auto-generate, tersimpan |
| [ ] | Edit + RelationManager harga | tambah/edit `branch_service_prices` |
| [ ] | RelationManager bank | tambah/edit rekening |
| [ ] | Toggle is_active | status berubah |

### BarberResource
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | List barber | avatar, signature_color badge, cabang, rating |
| [ ] | Create/Edit | slug auto, upload foto (Cloudinary), CheckboxList cabang |
| [ ] | signature_color picker | 4 pilihan warna |

### ServiceResource
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | List + sort_order | 7 layanan |
| [ ] | Create/Edit | durasi, default_price, is_active |

### UserResource
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | List user | role badge, status |
| [ ] | Create user | password hanya saat create |
| [ ] | Edit role | role berubah |

### PromoResource
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | Create promo | tombol auto-generate code |
| [ ] | discount_type conditional | field `free_service_id` muncul saat `free_service` |
| [ ] | CheckboxList cabang | kosong = semua cabang |

### CustomerPunchCardResource
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | List punch card | punch_count / 10, lifetime |
| [ ] | Manual Adjust | input alasan + jumlah → log ke history |

### FeedbackResource (read-only)
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | List + filter | filter cabang/kategori/rating/is_read/tanggal |
| [ ] | Mark read/unread | status berubah |
| [ ] | Export CSV | file ter-download |

### Dashboard Widgets
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | StatsOverview | 4 kartu: revenue hari ini, booking minggu ini, completion rate, barber populer |
| [ ] | RevenueChart | bar chart 30 hari, filter periode |
| [ ] | BookingTrend | line chart booking harian |
| [ ] | BarberPerformance | horizontal bar top barber |

---

## 11. Filament Kasir Panel `/kasir-panel`

> Login `kasir.pusat@minionbarbershop.com` / `password`.
> Semua data **hanya cabang pusat** (scope branch).

### ShiftCalendar — **buat ini DULU agar booking bisa diuji**
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | Tampil weekly | 7 hari ke depan, per barber cabang |
| [ ] | Tambah shift | pilih hari+barber → set start/end (+break opsional) |
| [ ] | Conflict detection | barber dgn shift overlap di cabang lain → error |

### TodayTimeline
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | Polling 10 dtk | otomatis refresh |
| [ ] | Grouped per barber | satu lane per barber |
| [ ] | Aksi Konfirmasi | pending → confirmed |
| [ ] | Aksi Mulai Sesi | confirmed → in_progress |
| [ ] | Aksi Selesai | in_progress → buka PosModal |
| [ ] | Badge expired/cancelled | tanpa aksi |

### WalkinForm
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | Step 1 cari HP | user ketemu / opsi tamu |
| [ ] | Step 2 pilih layanan | harga dari cabang kasir |
| [ ] | Step 3 barber + slot | barber on-shift + slot tersedia |
| [ ] | Step 4 buat walk-in | type=walkin, status langsung confirmed |

### PosModal (5 langkah)
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | review | tampil booking_services, tambah add-on, subtotal real-time |
| [ ] | promo | input kode → validasi → diskon / boleh skip |
| [ ] | tip | preset 5/10/20rb / custom (tip terpisah dari revenue) |
| [ ] | payment cash | input nominal → tampil kembalian |
| [ ] | payment transfer | tampil rekening bank cabang |
| [ ] | payment qris | tampil instruksi QR |
| [ ] | confirm | create receipt (transaction), booking → completed |
| [ ] | receipt_number | format `RCP-YYYYMMDD-XXXX` |
| [ ] | tombol Cetak Struk | buka `/receipt/{id}` |
| [ ] | loyalty punch | customer registered → punch_count +1 |
| [ ] | reward kelipatan 10 | punch ke-10 → promo `LOYALTY-XXXX` dibuat, count reset |

### QuickStats
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | 3 kartu | transaksi hari ini, revenue, barber on-shift |
| [ ] | Polling 30 dtk | auto refresh |

### Scope security
| ✓ | Test | Ekspektasi |
|---|---|---|
| [ ] | Kasir tidak lihat cabang lain | semua data hanya `pusat` |

---

## 12. Background Job — BookingExpiryJob

| ✓ | Test | Cara | Ekspektasi |
|---|---|---|---|
| [ ] | Expiry otomatis | buat booking `pending_confirmation` dgn `scheduled_at <= now-15mnt` (atau ubah manual di DB), tunggu scheduler | status → `expired`, `expired_at` terisi, `cancelled_by=system` |
| [ ] | Jalankan manual | `php artisan schedule:run` atau dispatch job langsung | sama |

---

## Catatan akhir

- Response API standar: `{ status, message, data?, errors?, meta? }`.
- Semua `datetime` di response sudah dikonversi ke `Asia/Jakarta`.
- Untuk dapat UUID cabang/barber/service: panggil endpoint list publik dulu, salin `id`.
- Reset data uji kapan saja: `php artisan migrate:fresh --seed`.
