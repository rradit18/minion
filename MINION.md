# Minion Platform

> Dokumen ini mendeskripsikan **Minion** secara menyeluruh: positioning produk, seluruh fitur, peran pengguna, alur bisnis, model domain, dan status pengembangan. Disusun dari kode yang benar-benar ada di repo (branch `dev` untuk frontend, branch `be` untuk backend), bukan asumsi.

---

## 1. Pengantar

**Minion Platform adalah sebuah _all-in-one apps_** untuk operasional jaringan barbershop. Ia bukan satu aplikasi tunggal, melainkan satu ekosistem yang menyatukan beberapa produk dalam satu basis kode:

1. **Company Profile (Compro)** — situs publik perusahaan (landing page, profil cabang, galeri, barberman, dll). Ke depan, Compro ini akan dijadikan **CMS**: seluruh konten di Compro bersifat **dinamis** dan dapat diatur sepenuhnya lewat **dashboard Filament** (admin tinggal mengubah teks, gambar, promo, daftar cabang/barber, dsb. tanpa menyentuh kode).
2. **Sistem Booking & Reservasi Online** — pelanggan memesan jadwal cukur, memilih cabang/barber/layanan, membayar di muka, dan mengelola riwayatnya.
3. **POS & Operasional Kasir** — kasir menjalankan transaksi harian, walk-in, penjualan produk, hingga cetak struk.
4. **Portal Barberman** — tukang cukur melihat jadwal, antrean hari ini, dan performa rating mereka.
5. **Loyalty, Promo, & Feedback** — program retensi pelanggan dan kanal umpan balik.
6. **Back-office Admin** — pusat kendali data master, laporan keuangan, dan analitik bisnis.

Singkatnya: **satu platform untuk pelanggan, kasir, barber, dan pemilik bisnis sekaligus.**

> **Konteks bisnis:** jaringan barbershop di area **Bintan / Tanjungpinang** dengan 4 cabang ter-seed: `pusat`, `batu-8`, `batu-12`, `bintan-center`.

---

## 2. Arsitektur & Struktur Repo

Minion adalah aplikasi **full-stack terpisah (decoupled)**:

| Lapisan | Teknologi | Lokasi | Branch utama |
|---|---|---|---|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind CSS | `frontend/` | `dev` |
| **Backend** | Laravel 13 + Filament 5 + Sanctum (REST API) | `backend/` | `be` |
| **Integrasi** | Gabungan FE + BE | — | `integrate` |

> ⚠️ **Catatan penting:** branch `be` (Laravel) dan `dev` (Next.js) dikembangkan terpisah. Branch `integrate` adalah hasil merge keduanya. Pekerjaan backend tidak terlihat saat bekerja di branch `dev`.

### Database & Infrastruktur
- **PostgreSQL** — seluruh tabel memakai **UUID** sebagai primary key.
- **Redis** — cache & queue (bisa fallback ke database).
- **Cloudinary** — penyimpanan gambar (foto barber, bukti bayar, dll).
- **Queue + Scheduler** — untuk job background (mis. expiry booking tiap menit).

### Dua Panel Filament
- **Admin panel** — `/admin-panel` (tema gelap + gold) — role `admin`.
- **Kasir panel** — `/kasir-panel` — role `cashier`, **scoped per cabang** (kasir hanya melihat data cabangnya).

### Standar API
- Format respons konsisten: `{ status, message, data?, errors?, meta? }`.
- Semua `datetime` dikonversi ke zona **Asia/Jakarta**.
- Autentikasi token via **Laravel Sanctum** (Bearer token).

---

## 3. Peran Pengguna (Actors)

Sistem mengenal **4 peran** (`UserRole`):

| Peran | Akses | Antarmuka |
|---|---|---|
| **Customer** | Booking, riwayat, loyalty, promo, feedback | Frontend Next.js (`/akun`, `/booking`) |
| **Barber** | Jadwal, antrean hari ini, rating | Frontend Portal Barberman + API |
| **Cashier (Kasir)** | POS, walk-in, verifikasi booking, penjualan produk, shift | Panel Filament `/kasir-panel` |
| **Admin** | Data master, laporan, analitik, (calon CMS) | Panel Filament `/admin-panel` |

> Admin & Kasir **sepenuhnya ditangani oleh Filament** di backend. Dashboard admin/kasir versi frontend sudah dihapus agar tidak duplikat.

---

## 4. Modul & Fitur per Aktor

### 4.1 Company Profile (Publik) — _calon CMS_
Halaman publik di `frontend/app/(company)/`:
- **Landing page** — hero, USP, layanan, banner promo, preview galeri, preview barberman, lokasi.
- **About**, **Contact**, **Branches** (daftar cabang + peta), **Gallery** (dengan compare-slider before/after), **Products** (etalase produk), **Feedback** (form umpan balik publik).
- **Barberman** — daftar barber + halaman detail per barber (`/barberman/[slug]`).
- **Hair Analysis** (`/hair-analysis`) — fitur kamera: ambil foto, "scan", dan rekomendasi gaya rambut (lihat §6.7).

> **Rencana CMS:** seluruh konten di atas akan dibuat dinamis & dikelola dari Filament — teks hero, daftar layanan, foto galeri, banner promo, info cabang, profil barber, dll.

### 4.2 Area Customer
Frontend `frontend/app/akun/` + `frontend/app/booking/`:
- **Booking online** 6 langkah (lihat §6.1).
- **Akun / Dashboard member** — ringkasan, booking mendatang, jumlah loyalty punch.
- **Profil** — edit data diri & password.
- **Riwayat** — daftar booking (upcoming/selesai/dibatalkan), reschedule, cancel, beri rating.
- **Loyalty** — kartu punch (progress menuju reward).
- **Promo** — daftar promo & voucher yang berlaku.
- **Auth** — login, register/signup, lupa password.

**API Customer** (`auth:sanctum + role=customer`): buat booking, update profil, list booking, reschedule, cancel, rate, loyalty, promos.

### 4.3 Portal Barberman
Frontend `frontend/app/barberman-portal/` + API barber:
- **Hari ini** — daftar booking hari ini, terurut waktu.
- **Jadwal** — shift mingguan (2 minggu) beserta booking.
- **Rating** — rata-rata, distribusi bintang, dan review per bulan.

### 4.4 Panel Kasir (Filament `/kasir-panel`)
Semua data **scoped ke cabang kasir**:
- **ShiftCalendar** — atur shift barber mingguan (dengan deteksi konflik antar-cabang).
- **TodayTimeline** — timeline booking hari ini per barber (polling 10 dtk); aksi: Konfirmasi → Mulai Sesi → Selesai (buka POS).
- **WalkinForm** — buat booking walk-in 4 langkah (lihat §6.2).
- **PosModal** — proses pembayaran 5 langkah → cetak struk (lihat §6.3).
- **ProductPos / ProductSale** — penjualan produk eceran.
- **QuickStats** — 3 kartu (transaksi, revenue, barber on-shift), polling 30 dtk.
- **Resources:** Booking (verifikasi bukti bayar), Customer, Product, Receipt.
- **ChangePassword** — wajib ganti password saat pertama login (`password.changed`).

### 4.5 Panel Admin (Filament `/admin-panel`)
- **Resources (data master):** Branch (+ harga layanan & rekening bank per cabang), Barber (foto, signature color, assignment cabang), Service, User, Promo, Product, CustomerPunchCard (+ adjust manual), Feedback (read-only + export CSV).
- **Dashboard Widgets:** StatsOverview (revenue hari ini, booking minggu ini, completion rate, barber populer), RevenueChart (30 hari), BookingTrend, BarberPerformance, PaymentMethodChart.
- **FinancialReport** — laporan keuangan.

---

## 5. Model Domain & Siklus Status

### Entitas Inti (20+ Model)
`User`, `Branch`, `BranchServicePrice`, `BranchBankAccount`, `Barber`, `BarberBranchAssignment`, `BarberShift`, `Service`, `Booking`, `BookingService`, `Product`, `Promo`, `PromoBranch`, `PromoUsage`, `CustomerPunchCard`, `PunchCardHistory`, `Rating`, `Feedback`, `Receipt`, `ReceiptItem`, `BlogPost`.

### Siklus Hidup Booking (`BookingStatus`)
```
pending_payment ──(upload bukti)──▶ pending_confirmation ──(kasir verifikasi)──▶ confirmed
                                                                                     │
                                                                              (mulai sesi)
                                                                                     ▼
                                            completed ◀──(selesai + POS)── in_progress

  Jalur gagal:  pending_payment / pending_confirmation ──▶ expired   (lewat batas waktu / ditolak kasir)
                kapan saja ──▶ cancelled                              (dibatalkan customer/kasir)
```

### Enum / Aturan Bisnis Penting
| Enum | Nilai |
|---|---|
| **BookingType** | `online`, `walkin` |
| **PaymentMethod** | `cash`, `bank_transfer`, `qris_external` |
| **DiscountType** | `percentage`, `fixed_amount`, `free_service` |
| **PromoRequiredRole** | `all`, `registered_only` (khusus member) |
| **ShiftStatus** | `scheduled`, `on_duty`, `completed`, `cancelled` |
| **FeedbackCategory** | `pelayanan`, `kebersihan`, `barber`, `harga`, `fasilitas`, `lainnya` |
| **ProductCategory** | `clay_pomade`, `skincare`, `tools_accessories`, `fragrance`, `vitamins`, `grooming_kits` |
| **BarberSignatureColor** | `teal`, `coral`, `violet`, `yellow` |

### Penomoran
- **Booking:** `MB-YYYYMMDD-0001` (increment harian).
- **Receipt:** `RCP-YYYYMMDD-XXXX`.
- **Voucher loyalty:** `LOYALTY-XXXX`.

---

## 6. Alur Bisnis (Business Flows)

### 6.1 Booking Online (Customer)
Wizard **6 langkah** di frontend: **Cabang → Barber → Layanan → Jadwal → Data Diri → Konfirmasi**.

1. Customer memilih cabang, barber, satu/lebih layanan, lalu tanggal & slot waktu.
2. Sistem menghitung **slot 30 menit** berdasarkan **shift barber** & durasi layanan (layanan panjang memakan lebih banyak slot).
3. Saat submit → booking dibuat dengan status **`pending_payment`**; **slot ditahan ±10 menit** (`BOOKING_PAYMENT_WINDOW`).
4. Customer melihat info pembayaran (total, QRIS, rekening bank cabang) lalu **upload bukti bayar** → status jadi **`pending_confirmation`**.
5. **Kasir memverifikasi** bukti → **`confirmed`** (atau **Tolak** → `expired`, slot dilepas).
6. Bila tidak bayar sampai batas waktu → slot **otomatis dilepas** dan booking jadi **`expired`** (oleh `BookingExpiryJob`).

> Booking bisa dibuat **guest** (tanpa akun) atau **registered** (token customer → terhubung ke akun).

### 6.2 Booking Walk-in (Kasir)
Form **4 langkah** di panel kasir: **Cari HP → Pilih Layanan → Barber + Slot → Buat**.
- Cari pelanggan via nomor HP (atau lanjut sebagai tamu).
- Harga layanan mengikuti **harga cabang kasir**.
- Booking `type=walkin` langsung berstatus **`confirmed`** (tanpa proses bayar di muka).

### 6.3 POS / Penyelesaian Transaksi (PosModal — 5 langkah)
Saat sesi **Selesai**, kasir membuka POS:
1. **Review** — daftar layanan booking, tambah **add-on**, subtotal real-time.
2. **Promo** — input kode → validasi → diskon (boleh skip).
3. **Tip** — preset 5/10/20rb atau custom (**tip terpisah dari revenue**).
4. **Payment** — `cash` (hitung kembalian), `bank_transfer` (tampil rekening), atau `qris_external` (instruksi QR).
5. **Confirm** — buat **Receipt** (`RCP-YYYYMMDD-XXXX`), booking → **`completed`**, dan tombol **Cetak Struk** (`/receipt/{id}`, layout thermal 80mm).

### 6.4 Loyalty (Punch Card)
- Setiap transaksi selesai untuk **customer terdaftar** → `punch_count + 1`.
- Pada **kelipatan 10** → otomatis dibuat voucher `LOYALTY-XXXX` dan punch_count **di-reset**.
- Admin bisa **adjust manual** punch (dengan alasan, tercatat di `PunchCardHistory`).

### 6.5 Promo
Validasi via `POST /api/promos/validate` `{code, subtotal, branch_id}`. Aturan:
- Promo harus **aktif**, dalam **periode** (`valid_from`–`valid_until`), dan cabang sesuai (`promo_branches`; kosong = semua cabang).
- `registered_only` → wajib login; di bawah `min_order` → ditolak; kuota `used_count = max_uses` habis → ditolak.
- Diskon dihitung sesuai `discount_type`: persentase, nominal tetap, atau layanan gratis.

### 6.6 Feedback & Rating
- **Feedback** — publik (guest/login), berkategori; muncul di panel admin (filter, mark read, export CSV).
- **Rating** — hanya untuk booking ber-status `completed`; 1 rating per booking; mengakumulasi rata-rata rating barber.

### 6.7 Hair Analysis (Frontend, simulasi)
Fitur kamera: ambil foto wajah → animasi "scanning" → rekomendasi gaya rambut (dari data mock), lalu bisa **prefill booking**. Saat ini murni **simulasi di frontend** (belum ada AI/endpoint backend).

---

## 7. Daftar Endpoint API (Backend)

**Auth:** `register`, `login`, `logout`, `me`, `change-password`.
**Publik:** `branches`, `branches/{slug}`, `branches/{id}/services`, `branches/{id}/barbers`, `barbers`, `barbers/{slug}`, `services`, `availability`, `bookings` (create), `bookings/{no}` (+ payment, payment-proof), `queue/{branchSlug}`, `feedback`, `promos/validate`.
**Customer** (`role=customer`): `customer/bookings` (CRUD), `reschedule`, `cancel`, `rate`, `loyalty`, `promos`, `profile`.
**Barber** (`role=barber`): `barber/schedule`, `barber/bookings/today`, `barber/ratings`.
**Web:** `/receipt/{receiptId}` (struk HTML print-friendly).

---

## 8. Status Pengembangan

| Bagian | Status |
|---|---|
| Backend — Auth, Branch, Barber, Service, Availability, Booking, Payment | ✅ Selesai |
| Backend — Customer area, Barber portal, Promo, Feedback, Loyalty | ✅ Selesai |
| Backend — POS (PosModal, Receipt), Product, Shift | ✅ Selesai |
| Backend — Panel Admin (Resources + Widgets + Financial Report) | ✅ Selesai |
| Backend — Panel Kasir (scoped per cabang) | ✅ Selesai |
| Backend — `BookingExpiryJob` (scheduler tiap menit) | ✅ Selesai |
| Frontend — Company Profile, Customer, Booking, Barberman Portal (UI) | ✅ Hampir selesai |
| **Integrasi Frontend ↔ Backend API** | ❌ **Belum** — frontend masih pakai **mock JSON + localStorage** |
| **CMS untuk Company Profile** (konten dinamis via Filament) | 🔜 Rencana |
| AI Hair Analysis (backend) | 🔜 Belum diimplementasi (Phase 5) |
| Forgot/Reset Password (backend) | 🔜 Belum diimplementasi (Phase 6) |

### Gap terbesar saat ini
Frontend **belum terhubung ke API backend**. Semua data berasal dari `frontend/src/mocks/*.json` melalui `frontend/src/lib/mockData.ts`, dan sesi/booking disimpan di `localStorage` (`frontend/src/lib/localStorage.ts`). Struktur sengaja dibuat _swap-ready_ — fungsi `fetchX()` tinggal diganti panggilan API nyata tanpa mengubah komponen.

---

## 9. Kredensial Demo (data seed backend)

| Peran | Login (Filament=email / API=phone) | Password |
|---|---|---|
| Admin | `admin@minionbarbershop.com` / `08117771001` | `password` |
| Kasir (cabang pusat) | `kasir.pusat@minionbarbershop.com` / `08117771002` | `password` |
| Customer | `customer@test.com` / `08117771003` | `password` |
| Barber | `rizky@minionbarbershop.com` / `08111000001` | `barber123` |

> Reset data uji: `php artisan migrate:fresh --seed`.

---

_Dokumen ini bersifat hidup — perbarui saat fitur/alur berubah._
