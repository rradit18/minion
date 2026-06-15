# Integrasi API Backend ↔ Frontend

> Status per 2026-06-15. Analisis endpoint `backend/routes/api.php` vs pemakaian di `frontend/`.

## Ringkasan

**Hampir seluruh API backend belum terintegrasi.** Frontend saat ini **100% memakai mock data** (`src/lib/mockData.ts` membaca JSON di `src/mocks/`) dan **localStorage** (`src/lib/localStorage.ts`). Belum ada satupun panggilan `fetch`/`axios` nyata ke backend, tidak ada base URL API, dan tidak ada file `.env`. Satu-satunya jejak rencana integrasi adalah komentar `// TODO: POST /api/auth/register` di `app/(auth)/signup/page.tsx`.

Kabar baiknya: `mockData.ts` sengaja dibuat **swap-ready** (lihat komentar barisnya: *"ganti fungsi fetchX() dengan API call nyata tanpa ubah struktur komponen"*). Integrasi bisa dilakukan terpusat dengan mengubah `fetchX()` menjadi panggilan `fetch` ke backend, plus mengganti pemakaian `localStorage` untuk auth/booking/customer.

---

## 🔴 Auth — belum terintegrasi (pakai localStorage)

| Endpoint | Dipakai di | Status saat ini |
|---|---|---|
| `POST /auth/register` | `register/page.tsx`, `signup/page.tsx` | `saveUser()` localStorage (ada TODO) |
| `POST /auth/login` | `login/page.tsx` | `findUserByEmail()` localStorage |
| `POST /auth/logout` | `akun/layout.tsx`, `barberman-portal/layout.tsx` | `clearSession()` |
| `GET /auth/me` | layout terproteksi | belum dipakai |
| `POST /auth/change-password` | `lupa-password/page.tsx` | localStorage |

## 🔴 Public (katalog & booking) — belum terintegrasi (pakai JSON mock)

| Endpoint | Mock pengganti | Dipakai di |
|---|---|---|
| `GET /branches`, `GET /branches/{slug}` | `fetchBranches` / `branches.json` | `BranchesPage`, `BookingClient`, homepage |
| `GET /branches/{id}/services` | `fetchServices` / `services.json` | `BookingClient` |
| `GET /branches/{id}/barbers` | `fetchBarbersByBranch` | `BookingClient` |
| `GET /barbers`, `GET /barbers/{slug}` | `barbers.json` | `BarbermanGrid`, detail barber |
| `GET /services` | `services.json` | beberapa section |
| `GET /availability` | `fetchSlots` / `slots.json` | `BookingClient` (pilih jam) |
| `POST /bookings` | `saveBooking()` localStorage | `BookingClient` |
| `POST /feedback` | — | `feedback/page.tsx` (belum kirim) |
| `GET /bookings/{no}` | `getLastBooking()` localStorage | `booking/sukses` |
| `GET /bookings/{no}/payment` + `POST .../payment-proof` | — | **belum ada UI/integrasi** (padahal commit terakhir menambah payment step) |
| `GET /queue/{branchSlug}` | — | **belum ada halaman antrean** |

## 🔴 Customer area — belum terintegrasi

Semua digantikan localStorage (`getBookings`, `updateBooking`, `getLoyaltyPunches`, dst.) di `akun/riwayat`, `akun/profil`, `akun/loyalty`, `akun/promo`.

- `POST /customer/bookings`
- `PATCH /customer/profile`
- `GET /customer/bookings`
- `PATCH /customer/bookings/{id}/reschedule`
- `DELETE /customer/bookings/{id}`
- `POST /customer/bookings/{id}/rate`
- `GET /customer/loyalty`
- `GET /customer/promos`

## 🔴 Promo — belum terintegrasi

| Endpoint | Mock pengganti | Dipakai di |
|---|---|---|
| `POST /promos/validate` | `fetchPromoByCode()` / `promos.json` | `BookingClient` |

## 🔴 Barber portal — belum terintegrasi

| Endpoint | Mock pengganti | Dipakai di |
|---|---|---|
| `GET /barber/schedule` | `fetchSchedule()` / `barber-schedule.json` | `barberman-portal/jadwal`, `/page`, `/hari-ini` |
| `GET /barber/bookings/today` | `fetchSchedule()` | `barberman-portal/hari-ini` |
| `GET /barber/ratings` | `fetchRatings()` / `ratings.json` | `barberman-portal/rating` |

---

## Saran urutan integrasi

1. **Fondasi** — buat API client terpusat (base URL via `.env`, helper `fetch` + penyimpanan token Sanctum).
2. **Auth** (login, register, logout, me, change-password) — jalur autentikasi sebagai prasyarat area terproteksi.
3. **Booking publik** (branches, services, barbers, availability, `POST /bookings`, payment) — jalur kritis konversi.
4. **Customer area** (riwayat, profil, loyalty, promo, reschedule/cancel/rate).
5. **Barber portal** (schedule, today, ratings).
6. **Pelengkap** (feedback, queue, promo validate).

> Catatan: titik sentuh utama ada di `src/lib/mockData.ts` (ubah `fetchX()` → API) dan `src/lib/localStorage.ts` (auth/booking/customer pindah ke server).
