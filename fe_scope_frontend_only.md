# Frontend Scope Document — Barber Shop Booking System
### Versi: Frontend-Only (Tanpa Integrasi Backend)

> Semua halaman dikerjakan murni di sisi frontend. Tidak ada pemanggilan API backend.
> Data menggunakan mock/hardcoded JSON, persistensi memakai `localStorage`/`sessionStorage`, dan auth disimulasikan tanpa NextAuth.

---

## Ringkasan Proyek

| Item | Detail |
|---|---|
| Total Halaman | 23 (Next.js) |
| Ketergantungan API | 0 |
| Halaman bisa dikerjakan sekarang | 23 |
| Persistensi data | `localStorage` / `sessionStorage` |
| Auth | Simulasi via `localStorage` (tanpa NextAuth) |
| Mock data | Hardcoded JSON / file lokal |

---

## Prinsip Umum (Berlaku untuk Semua Halaman)

1. **Mock data** — Semua data (cabang, barber, layanan, promo, rating, booking) disimpan sebagai hardcoded JSON atau file `.json` lokal di project.
2. **Persistensi lokal** — Booking, profil user, riwayat, loyalty point semuanya disimpan dan dibaca dari `localStorage`.
3. **Auth simulasi** — Login/register cukup menulis/membaca user ke `localStorage`. Proteksi halaman (auth required) cukup cek ada/tidaknya session di `localStorage`, lalu redirect ke `/login` jika tidak ada.
4. **Logika tetap di FE** — State machine booking, countdown modal, filter, sorting, kalender slot, punch card — semua ini memang murni frontend dan tidak perlu diubah.
5. **Swap-ready** — Semua mock data bisa diganti dengan API call nyata nanti hanya dengan mengganti satu fungsi `fetchData()` per halaman, tanpa mengubah struktur komponen.

---

## 1. Authentication — 3 Halaman

### `/login`

**Type**: Complex — Local State + Fake Auth

**Deskripsi**: Login form dengan validasi FE dan simulasi auth via `localStorage`.

**Perubahan dari versi API**:
- Validasi form dilakukan di FE (format HP/email, password tidak kosong)
- Login check menggunakan hardcoded credentials atau user list di `localStorage`
- Session disimpan ke `localStorage` / `sessionStorage` setelah login berhasil
- Redirect ke `/akun` dilakukan via router push (Next.js), tidak menunggu respons API
- Tidak ada POST ke `/api/auth/login`

---

### `/register`

**Type**: Complex — Local State + Fake Auth

**Deskripsi**: Form registrasi pengguna baru dengan persistensi lokal.

**Perubahan dari versi API**:
- Validasi form di FE (format, kecocokan password, dll.)
- Data user baru disimpan ke `localStorage` sebagai user list
- Auto-login simulasi: langsung set session di `localStorage`, redirect ke `/akun`
- Tidak ada POST ke `/api/auth/register`

---

### `/lupa-password`

**Type**: Complex — Local State

**Deskripsi**: Password reset flow dua langkah, dikelola sepenuhnya via React state.

**Perubahan dari versi API**:
- Step 1: Input email/HP → tampilkan pesan sukses (simulasi kirim link, tidak ada email terkirim)
- Step 2: Form set password baru → validasi di FE, update data user di `localStorage`
- Transisi step 1 → step 2 tetap via React state (tidak perlu token dari API)

---

## 2. Booking Flow — 2 Halaman

### `/booking`

**Type**: Complex — State Machine JS + Mock Data

**Deskripsi**: Multi-step booking process dengan state machine di FE. Seluruh data dan logika bersumber dari mock lokal.

**Steps (tidak berubah)**:
1. Pilih Cabang
2. Pilih Barber
3. Pilih Layanan (harga per cabang)
4. Pilih Slot Kalender
5. Input Data Diri
6. Warning modal dengan countdown 5 detik
7. Submit

**Perubahan dari versi API**:
- Data cabang, barber, layanan, harga → hardcoded JSON atau file mock lokal
- Kalender slot → di-generate dari logika JS lokal (tanpa slot locking API, tanpa cek ketersediaan real-time)
- Countdown modal 5 detik → tetap pakai JS `setInterval`/`setTimeout`, tidak ada konfirmasi ke API
- Submit → simpan object booking ke `localStorage`, redirect ke `/booking/sukses`
- Nomor booking → di-generate random di FE (`Date.now()` atau `crypto.randomUUID()`)
- State machine multi-step tetap diimplementasi penuh di FE (tidak ada perubahan arsitektur)

---

### `/booking/sukses`

**Type**: UI Saja — Baca dari `localStorage`

**Deskripsi**: Konfirmasi booking berhasil.

**Perubahan dari versi API**:
- Baca data booking dari `localStorage` yang disimpan saat submit di `/booking`
- Tampilkan nomor booking, waktu, barber, dan cabang dari data lokal
- Tombol "Tambah ke Kalender" → buat URL Google Calendar atau file `.ics` dari data lokal (tidak perlu API kalender)

---

## 3. Customer Area (`/akun`) — 5 Halaman

### `/akun` (Dashboard)

**Type**: Mock Data + Fake Auth

**Deskripsi**: Ringkasan akun dan shortcut ke tab lain.

**Perubahan dari versi API**:
- Auth check dari `localStorage` session; redirect ke `/login` jika tidak ada
- Upcoming booking → baca dari `localStorage` booking list, filter by status dan tanggal
- Saldo poin loyalty → nilai mock di state atau dihitung dari jumlah booking di `localStorage`

---

### `/akun/riwayat`

**Type**: Mock Data + Local State

**Deskripsi**: List semua booking dengan status dan aksi.

**Perubahan dari versi API**:
- Booking list → gabungan data dari `localStorage` + mock data riwayat lama (hardcoded)
- Filter tabs (Semua / Upcoming / Selesai / Dibatalkan) → `Array.filter()` di FE
- **Reschedule** → update status booking di `localStorage`, arahkan ke `/booking` dengan pre-fill data
- **Batalkan** → update field `status` di `localStorage`
- **Booking ulang** → baca data booking lama dari `localStorage`, pre-fill ke `/booking`
- **Beri rating** → simpan rating ke `localStorage` pada field booking yang bersangkutan

---

### `/akun/loyalty`

**Type**: Mock Data

**Deskripsi**: Program loyalitas punch card.

**Perubahan dari versi API**:
- Progress punch card (X/10) → hitung dari jumlah booking berstatus "Selesai" di `localStorage`
- Riwayat tanggal potong → ambil dari array booking di `localStorage`, sort by tanggal
- Kode reward → di-generate dari logika JS (misal: aktif setiap kelipatan 10 booking selesai)
- Tombol salin kode → `navigator.clipboard.writeText()` (Clipboard API browser, tidak perlu backend)

---

### `/akun/promo`

**Type**: Mock Data

**Deskripsi**: List promo aktif untuk customer.

**Perubahan dari versi API**:
- List promo → hardcoded JSON (nama promo, deskripsi, tanggal berlaku, nilai diskon)
- Voucher dari reward → generate dari data loyalty di `localStorage`
- Tombol "Gunakan" → simpan kode promo ke `sessionStorage`, redirect ke `/booking` (promo terbaca di step booking)

---

### `/akun/profil`

**Type**: Local State + Fake Auth

**Deskripsi**: Edit profil dan keamanan akun.

**Perubahan dari versi API**:
- Baca data profil dari `localStorage` user session
- Edit nama, HP, email → update object user di `localStorage` langsung
- Ganti password → validasi password lama di FE, update field password di `localStorage`
- Tidak ada PATCH ke `/api/customer/profile`

---

## 4. Barberman Portal (`/barberman-portal`) — 4 Halaman

### `/barberman-portal` (Landing)

**Type**: Mock Data + Fake Auth

**Deskripsi**: Landing page setelah barber login.

**Perubahan dari versi API**:
- Auth check role `"barber"` dari `localStorage` session; redirect ke `/login` jika tidak ada atau role salah
- Summary hari ini (jumlah booking, jam shift) → hardcoded mock object

---

### `/barberman-portal/jadwal`

**Type**: Mock Data

**Deskripsi**: Weekly view schedule 2 minggu ke depan.

**Perubahan dari versi API**:
- Generate 14 hari ke depan dari `new Date()` di JS
- Jam shift dan list booking per hari → dari hardcoded JSON mock
- Tampilan read-only, tidak ada interaksi yang butuh backend

---

### `/barberman-portal/hari-ini`

**Type**: Mock Data

**Deskripsi**: List booking hari ini sorted by waktu.

**Perubahan dari versi API**:
- Filter mock data berdasarkan tanggal hari ini (`new Date().toDateString()`)
- Sort by waktu menggunakan `Array.sort()` di FE
- Status badge → dari field `status` di mock data
- Tampilan read-only

---

### `/barberman-portal/rating`

**Type**: Mock Data

**Deskripsi**: Rating analytics untuk barber.

**Perubahan dari versi API**:
- Array mock rating (nilai 1–5 + teks review anonymous) → hardcoded JSON
- Rata-rata bintang → `array.reduce()` di FE
- Distribusi rating (1–5) → `Array.filter().length` per nilai di FE
- 5 review terbaru → slice dari mock array
- Filter by bulan → `Array.filter()` berdasarkan field `bulan` di mock data

---

## 5. AI Hair Analysis Kiosk — 1 Halaman

### `/hair-analysis`

**Type**: Complex — Camera API + Mock Hasil + Local State

**Deskripsi**: AI-powered hair analysis kiosk. Kamera tetap menggunakan browser API native; hasil analisis diganti dengan mock data.

**Flow (tidak berubah secara UX)**:
1. Idle screen
2. Aktifkan kamera
3. Capture foto
4. Scan animation (CSS keyframes)
5. Muncul 6 hasil secara progresif
6. Grid hasil tampil
7. CTA "Book Gaya Ini"

**Perubahan dari versi API**:
- Kamera → tetap pakai `navigator.mediaDevices.getUserMedia()` (browser API native, tidak perlu backend)
- Capture foto → `canvas.toDataURL()` di browser
- Scan animation → CSS `@keyframes`, tidak berubah
- 6 parallel LightX API calls → diganti dengan 6 hasil random dari hardcoded array gaya rambut (nama gaya + URL gambar contoh)
- Progressive UI update → disimulasikan dengan `setTimeout` bertahap (misal: 150ms per item) untuk mempertahankan feel UX yang sama
- CTA "Book Gaya Ini" → simpan pilihan gaya ke `sessionStorage`, redirect ke `/booking`
- Tidak ada data yang disimpan permanen (sesuai spesifikasi awal)

> **Catatan**: Blok mock hasil (poin ke-5) bisa di-swap ke LightX API call nyata tanpa mengubah UI sama sekali, cukup ganti fungsi `getHairAnalysisResults(imageData)`.

---

## Dependency Map — Antar Halaman

```
/register  ──────────────────────────────→  /akun
/login  ─────────────────────────────────→  /akun  (atau /barberman-portal jika role barber)

/booking  ───────────────────────────────→  /booking/sukses
/akun/promo  ────────────────────────────→  /booking  (pre-fill promo)
/akun/riwayat (reschedule/booking ulang) →  /booking  (pre-fill data)
/hair-analysis  ─────────────────────────→  /booking  (pre-fill gaya)

/akun  ──────────────────────────────────→  /akun/riwayat, /akun/loyalty, /akun/promo, /akun/profil
```

Semua komunikasi antar halaman menggunakan `sessionStorage` (data sementara antar navigasi) atau `localStorage` (data persisten).

---

## Struktur Mock Data yang Direkomendasikan

```
/src
  /mocks
    branches.json        ← data cabang
    barbers.json         ← data barber per cabang
    services.json        ← data layanan + harga per cabang
    slots.json           ← template slot waktu per hari
    promos.json          ← list promo aktif
    barber-schedule.json ← jadwal & booking mock untuk portal barber
    ratings.json         ← mock review & rating barber
    hair-styles.json     ← 6+ opsi gaya rambut untuk hair analysis mock
```

---

## Technology Stack (Direvisi)

| Item | Sebelumnya | Sekarang |
|---|---|---|
| Auth | NextAuth.js credentials | Simulasi `localStorage` |
| Data fetching | Custom backend APIs | Hardcoded JSON / mock files |
| Slot locking | API endpoint | Tidak ada (lokal saja) |
| Hair analysis | LightX API (6 calls) | Mock array + setTimeout |
| Kalender | — | Google Calendar URL / ICS (browser) |
| Copy kode | — | Clipboard API (browser) |
| Kamera | — | MediaDevices API (browser) |

**Stack yang tidak berubah**: Next.js, React, state machine FE untuk booking flow, CSS animations, TypeScript.
