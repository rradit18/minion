# Manual QA Testing Guide — Minion Barbershop

> **Base URL:** `http://localhost:8000/api`
> **Admin Panel:** `http://localhost:8000/admin`
> **Kasir Panel:** `http://localhost:8000/kasir`

---

## Test Credentials

| Role          | Phone         | Password   |
| ---------------| ---------------| ------------|
| Admin         | `08117771001` | `password` |
| Kasir Pusat   | `08117771002` | `password` |
| Customer Test | `08117771003` | `password` |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Pass |
| ❌ | Fail |
| ⏭️ | Skip (not yet implemented) |

---

---

# Phase 1 — Foundation

> Models, Migrations, Enums, Authentication API

---

## 1.1 Database Migrations

| # | Test | Expected | Status |
|---|------|----------|--------|
| 1.1.1 | Run `php artisan migrate:fresh --seed` | No errors, 19 tables created | |
| 1.1.2 | Check `users` table has `role`, `is_active`, `branch_id` columns | Columns exist | |
| 1.1.3 | Check `bookings` table has `type`, `status`, `reschedule_count` columns | Columns exist | |
| 1.1.4 | Check `personal_access_tokens.tokenable_id` is UUID type (not int) | UUID column | |
| 1.1.5 | Check all 20 models use UUID primary keys | `id` is `uuid` in all tables | |

---

## 1.2 Register

**POST** `/api/auth/register`

### 1.2.1 — Happy Path: Register Customer

**Body:**
```json
{
  "name": "Budi Santoso",
  "phone": "081234567890",
  "password": "password123",
  "password_confirmation": "password123"
}
```

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 1.2.1a | HTTP status | `201 Created` | |
| 1.2.1b | Response has `token` | Non-empty string | |
| 1.2.1c | Response has `user.role` | `"customer"` | |
| 1.2.1d | Punch card auto-created | `punch_count: 0` in DB | |
| 1.2.1e | Token works on `/api/auth/me` | Returns user data | |

### 1.2.2 — Validation Errors

| # | Body | Expected HTTP | Expected Error Field | Status |
|---|------|---------------|----------------------|--------|
| 1.2.2a | Missing `phone` | `422` | `phone` | |
| 1.2.2b | `phone` already exists | `422` | `phone` (unique) | |
| 1.2.2c | `password` < 8 chars | `422` | `password` | |
| 1.2.2d | `password_confirmation` mismatch | `422` | `password` | |
| 1.2.2e | Missing `name` | `422` | `name` | |

---

## 1.3 Login

**POST** `/api/auth/login`

### 1.3.1 — Happy Path

**Body:**
```json
{
  "phone": "08117771003",
  "password": "password"
}
```

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 1.3.1a | HTTP status | `200 OK` | |
| 1.3.1b | Response has `token` | Non-empty string | |
| 1.3.1c | Response has `user.role` | `"customer"` | |
| 1.3.1d | Old tokens revoked on next login | Only 1 active token per user | |

### 1.3.2 — Invalid Credentials

| # | Body | Expected | Status |
|---|------|----------|--------|
| 1.3.2a | Wrong password | `401` or `422` | |
| 1.3.2b | Non-existent phone | `401` or `422` | |
| 1.3.2c | Inactive user (`is_active=false`) | `403` or `401` | |

---

## 1.4 Logout

**POST** `/api/auth/logout` *(requires Bearer token)*

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 1.4.1 | Logout with valid token | `200`, token revoked | |
| 1.4.2 | Use same token after logout | `401 Unauthenticated` | |
| 1.4.3 | Logout without token | `401` | |

---

## 1.5 Me

**GET** `/api/auth/me` *(requires Bearer token)*

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 1.5.1 | Customer token | Returns user + `punch_card` object | |
| 1.5.2 | Admin token | Returns user (no punch_card) | |
| 1.5.3 | Kasir token | Returns user (no punch_card) | |
| 1.5.4 | No token | `401` | |

---

---

# Phase 2 — Public API + Admin Filament

> Branches, Barbers, Services, Availability, Online Booking, Admin Panel

---

## 2.1 Branches

### 2.1.1 — List Branches

**GET** `/api/branches`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.1.1a | HTTP status | `200 OK` | |
| 2.1.1b | Returns array of branches | Each has `name`, `slug`, `city`, `address` | |
| 2.1.1c | Only `is_active=true` branches returned | No inactive branches in response | |

### 2.1.2 — Branch Detail

**GET** `/api/branches/{slug}` (e.g. `/api/branches/pusat`)

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.1.2a | HTTP status | `200 OK` | |
| 2.1.2b | Contains `bank_accounts` array | Has `bank_name`, `account_number`, `account_holder` | |
| 2.1.2c | Contains `services` with prices | Each service has `price` (branch-specific) | |
| 2.1.2d | Non-existent slug | `404` | |

---

## 2.2 Barbers

### 2.2.1 — List Barbers

**GET** `/api/barbers`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.2.1a | Returns active barbers | `is_active=true` only | |
| 2.2.1b | Filter by branch: `/api/barbers?branch_id={uuid}` | Only barbers assigned to that branch | |

### 2.2.2 — Barber Detail

**GET** `/api/barbers/{slug}`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.2.2a | Returns barber detail | Has `bio`, `tagline`, `signature_color` | |
| 2.2.2b | Returns `ratings_distribution` | Object with keys 1–5 | |
| 2.2.2c | Returns `reviews` | Max 10 recent reviews | |
| 2.2.2d | Non-existent slug | `404` | |

---

## 2.3 Services

### 2.3.1 — List All Services

**GET** `/api/services`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.3.1a | Returns all active services | `is_active=true` only, no branch prices | |

### 2.3.2 — Services by Branch

**GET** `/api/branches/{branchId}/services`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.3.2a | Returns services with `price` field | Branch-specific price (or default) | |
| 2.3.2b | Non-existent branch | `404` | |

### 2.3.3 — Barbers by Branch

**GET** `/api/branches/{branchId}/barbers`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.3.3a | Returns barbers for that branch | Only assigned barbers | |
| 2.3.3b | Each barber has today's shift status | `is_on_shift_today` boolean | |

---

## 2.4 Availability

**GET** `/api/availability?barber_id={uuid}&date=2026-06-13&service_ids[]={uuid}`

### Prerequisites
- Barber has a shift on the given date
- Branch has that service with a price

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 2.4.1 | Valid inputs with available barber | Returns array of time slots (30-min intervals) | |
| 2.4.2 | Date in the past | `422` or empty slots | |
| 2.4.3 | Barber has no shift on that date | Empty array `[]` | |
| 2.4.4 | Service duration fills entire shift | Only 1 slot or none | |
| 2.4.5 | Slot already booked | That slot not in response | |
| 2.4.6 | Missing `barber_id` | `422` validation error | |
| 2.4.7 | Missing `date` | `422` validation error | |

---

## 2.5 Online Booking (Guest)

**POST** `/api/bookings` *(no auth required)*

**Body:**
```json
{
  "branch_id": "{uuid}",
  "barber_id": "{uuid}",
  "service_ids": ["{uuid}"],
  "scheduled_at": "2026-06-15 10:00:00",
  "customer_name": "Tamu Budi",
  "customer_phone": "081234500000",
  "notes": "Tolong tipis ya"
}
```

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.5.1 | HTTP status | `201 Created` | |
| 2.5.2 | Response has `booking_number` | Format `MB-YYYYMMDD-XXXX` | |
| 2.5.3 | `status` in response | `"pending_confirmation"` | |
| 2.5.4 | `type` in response | `"online"` | |
| 2.5.5 | `total_price` is correct | Matches service prices from branch | |
| 2.5.6 | Slot is locked in Redis (for 5 min) | Second identical request returns conflict | |
| 2.5.7 | Booking number increments per day | Same date: 0001, 0002, 0003... | |

### 2.5.8 — Booking as Logged-in Customer

Add `Authorization: Bearer {token}` to same request.

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.5.8a | `customer_user_id` linked | Booking tied to authenticated user | |
| 2.5.8b | Customer can see it in `/api/customer/bookings` | Appears in list | |

### 2.5.9 — Validation

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 2.5.9a | Missing `branch_id` | `422` | |
| 2.5.9b | Missing `customer_name` (guest) | `422` | |
| 2.5.9c | Slot no longer available | `409` or `422` conflict error | |
| 2.5.9d | `scheduled_at` in the past | `422` | |
| 2.5.9e | Service not offered at that branch | `422` | |

---

## 2.6 Booking Lookup (Public)

**GET** `/api/bookings/{bookingNumber}`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.6.1 | Valid booking number | Returns booking detail with status | |
| 2.6.2 | Non-existent booking number | `404` | |
| 2.6.3 | No auth required | Works without Bearer token | |

---

## 2.7 Queue (Public)

**GET** `/api/queue/{branchSlug}`

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.7.1 | Valid branch slug | Returns today's bookings (pending/confirmed/in_progress) | |
| 2.7.2 | Does NOT show completed/expired/cancelled | Only active statuses | |
| 2.7.3 | Non-existent branch | `404` | |

---

## 2.8 Public Feedback

**POST** `/api/feedback`

**Body:**
```json
{
  "stars": 5,
  "category": "barber",
  "message": "Barbernya ramah banget!",
  "customer_name": "Anonim",
  "customer_phone": "081200000000"
}
```

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 2.8.1 | Submit as guest | `201 Created` | |
| 2.8.2 | Submit with auth token | `user_id` auto-filled | |
| 2.8.3 | `stars` out of range (0 or 6) | `422` | |
| 2.8.4 | Invalid `category` | `422` | |
| 2.8.5 | Optional `branch_id` links to branch | Feedback has branch | |

---

## 2.9 Admin Filament Panel

**URL:** `http://localhost:8000/admin`

Login with Admin credentials.

### 2.9.1 — Branch Management

| # | Action | Expected | Status |
|---|--------|----------|--------|
| 2.9.1a | View branch list | Shows name, city, barber count, status | |
| 2.9.1b | Create new branch | Fill Info tab, saves correctly | |
| 2.9.1c | Add service price to branch | RelationManager works, price saves | |
| 2.9.1d | Add bank account to branch | Shows in public API `/api/branches/{slug}` | |
| 2.9.1e | Toggle branch `is_active` | Inactive branch hidden from `/api/branches` | |
| 2.9.1f | Edit branch slug | Updates correctly | |

### 2.9.2 — Barber Management

| # | Action | Expected | Status |
|---|--------|----------|--------|
| 2.9.2a | View barber list | Shows photo, name, avg_rating, branches | |
| 2.9.2b | Create barber | Upload photo (Cloudinary), set signature_color | |
| 2.9.2c | Assign barber to branch | CheckboxList saves BarberBranchAssignment | |
| 2.9.2d | Barber appears in `/api/barbers` | Active barber visible publicly | |

### 2.9.3 — Service Management

| # | Action | Expected | Status |
|---|--------|----------|--------|
| 2.9.3a | View service list | Shows name, duration, default_price | |
| 2.9.3b | Create service | Saves with `sort_order`, `is_active=true` | |
| 2.9.3c | Toggle `is_active` | Inactive service hidden from `/api/services` | |

### 2.9.4 — User Management

| # | Action | Expected | Status |
|---|--------|----------|--------|
| 2.9.4a | View user list | Shows role badge, status | |
| 2.9.4b | Create kasir user | Set role=cashier, assign branch_id | |
| 2.9.4c | Create barber user | Role=barber, no branch_id required | |
| 2.9.4d | Deactivate user | User cannot login after `is_active=false` | |

---

---

# Phase 3 — Kasir Dashboard + Customer Endpoints

> Kasir Portal, Customer Self-Service, Booking Flow

---

## 3.1 Kasir Authentication

Login as Kasir Pusat before running these tests.

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.1.1 | Login as kasir | Token returned | |
| 3.1.2 | Access `/api/customer/bookings` with kasir token | `403 Forbidden` | |
| 3.1.3 | Access `/kasir` Filament panel | Dashboard loads | |

---

## 3.2 Kasir — Confirm Booking

**PATCH** `/api/kasir/bookings/{id}/confirm` *(kasir token)*

### Prerequisites
- Have a `pending_confirmation` booking at kasir's branch

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.2.1 | Confirm valid pending booking | `200`, status → `"confirmed"`, `confirmed_at` set | |
| 3.2.2 | Confirm booking from another branch | `403` or `404` | |
| 3.2.3 | Confirm already-confirmed booking | `422` invalid transition | |
| 3.2.4 | Confirm expired booking | `422` invalid transition | |
| 3.2.5 | No auth | `401` | |
| 3.2.6 | Customer token (not kasir) | `403` | |

---

## 3.3 Kasir — Start Booking

**PATCH** `/api/kasir/bookings/{id}/start` *(kasir token)*

### Prerequisites
- Have a `confirmed` booking

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.3.1 | Start valid confirmed booking | `200`, status → `"in_progress"`, `started_at` set | |
| 3.3.2 | Start pending_confirmation booking | `422` invalid transition | |
| 3.3.3 | Start booking from another branch | `403` or `404` | |

---

## 3.4 Kasir Filament Dashboard

**URL:** `http://localhost:8000/kasir`

### 3.4.1 — TodayTimeline

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.4.1a | Dashboard loads | No 500 errors | |
| 3.4.1b | Timeline shows bookings for today | Grouped by barber | |
| 3.4.1c | Pending booking shows "Konfirmasi Kedatangan" button | Button visible | |
| 3.4.1d | Click "Konfirmasi Kedatangan" | Status changes to confirmed, button changes | |
| 3.4.1e | Confirmed booking shows "Mulai Sesi" button | Button visible | |
| 3.4.1f | Click "Mulai Sesi" | Status changes to in_progress | |
| 3.4.1g | Timeline auto-refreshes every 10 seconds | New bookings appear without page reload | |
| 3.4.1h | Bookings from other branches NOT shown | Scoped to kasir's branch only | |

### 3.4.2 — WalkinForm

| # | Step | Check | Expected | Status |
|---|------|-------|----------|--------|
| 3.4.2a | Step 1 | Enter known customer phone | Auto-fills customer name | |
| 3.4.2b | Step 1 | Enter unknown phone | Allows manual name entry | |
| 3.4.2c | Step 2 | Select services | Shows branch prices | |
| 3.4.2d | Step 3 | Select barber | Shows barbers on shift today | |
| 3.4.2e | Step 3 | Select time slot | Available slots shown | |
| 3.4.2f | Step 4 | Preview shown | Summary of booking | |
| 3.4.2g | Submit | `type=walkin`, `status=confirmed` immediately | No pending step | |
| 3.4.2h | New walk-in appears in TodayTimeline | Refreshes | |

### 3.4.3 — ShiftCalendar

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.4.3a | 7-day view loads | Shows barbers in rows, days in columns | |
| 3.4.3b | Click empty cell | Add shift modal opens | |
| 3.4.3c | Add shift (start, end time) | Shift saved, shown in calendar | |
| 3.4.3d | Click existing shift | Edit/delete options | |
| 3.4.3e | Double-book barber same day same branch | Error or warning | |
| 3.4.3f | Barber has shift at another branch same day | Conflict detected, warning shown | |

### 3.4.4 — QuickStats

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.4.4a | Stats cards load | Shows 3 cards | |
| 3.4.4b | "Transaksi Hari Ini" count | Matches completed bookings today | |
| 3.4.4c | "Omset Hari Ini" revenue | Matches sum of completed receipts | |
| 3.4.4d | "Barber On-Shift" count | Matches barbers with shift today | |
| 3.4.4e | Stats auto-refresh every 30 seconds | Updates without page reload | |
| 3.4.4f | Stats scoped to kasir's branch | Different kasir sees different numbers | |

---

## 3.5 Customer Profile

**PATCH** `/api/customer/profile` *(customer token)*

| # | Body | Expected | Status |
|---|------|----------|--------|
| 3.5.1 | Update `name` only | `200`, name updated | |
| 3.5.2 | Update `email` | `200`, email updated | |
| 3.5.3 | Update `password` | `200`, new password works on next login | |
| 3.5.4 | Update `phone` to taken number | `422` unique violation | |
| 3.5.5 | Kasir token (not customer) | `403` | |

---

## 3.6 Customer — My Bookings

**GET** `/api/customer/bookings` *(customer token)*

| # | Filter | Expected | Status |
|---|--------|----------|--------|
| 3.6.1 | No filter | All bookings for this customer | |
| 3.6.2 | `?status=upcoming` | Only pending/confirmed/in_progress | |
| 3.6.3 | `?status=completed` | Only completed bookings | |
| 3.6.4 | `?status=cancelled` | Only cancelled/expired bookings | |
| 3.6.5 | Another customer's bookings not shown | Scoped to token owner | |

---

## 3.7 Customer — Reschedule

**PATCH** `/api/customer/bookings/{id}/reschedule` *(customer token)*

**Body:**
```json
{
  "scheduled_at": "2026-06-20 14:00:00"
}
```

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 3.7.1 | Valid reschedule (1st time, >1hr ahead) | `200`, new `scheduled_at` saved, `reschedule_count=1` | |
| 3.7.2 | `original_scheduled_at` preserved | Original time stored, not overwritten | |
| 3.7.3 | Reschedule 2nd time (count already 1) | `422` max reschedule limit reached | |
| 3.7.4 | Reschedule booking < 1 hr away | `422` too close to scheduled time | |
| 3.7.5 | Reschedule completed booking | `422` wrong status | |
| 3.7.6 | Reschedule another customer's booking | `403` or `404` | |
| 3.7.7 | New slot unavailable | `409` or `422` slot conflict | |

---

## 3.8 Customer — Cancel Booking

**DELETE** `/api/customer/bookings/{id}` *(customer token)*

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 3.8.1 | Cancel `pending_confirmation` booking >1hr ahead | `200`, status → `"cancelled"` | |
| 3.8.2 | Cancel booking < 1hr ahead | `422` cancellation window passed | |
| 3.8.3 | Cancel `confirmed` booking (customer) | `422` cannot cancel confirmed as customer | |
| 3.8.4 | Cancel `completed` booking | `422` | |
| 3.8.5 | Cancel another customer's booking | `403` or `404` | |

---

## 3.9 Customer — Rate Booking

**POST** `/api/customer/bookings/{id}/rate` *(customer token)*

**Body:**
```json
{
  "stars": 5,
  "comment": "Barbernya keren!",
  "is_anonymous": false
}
```

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 3.9.1 | Rate completed booking | `201`, rating saved, barber avg_rating updates | |
| 3.9.2 | Rate non-completed booking | `422` only completed bookings | |
| 3.9.3 | Rate same booking twice | `422` already rated | |
| 3.9.4 | `stars` = 0 | `422` | |
| 3.9.5 | `stars` = 6 | `422` | |
| 3.9.6 | `is_anonymous=true` | Review shows no customer name | |
| 3.9.7 | Rating appears on `GET /api/barbers/{slug}` | Visible in reviews | |

---

## 3.10 Customer — Loyalty

**GET** `/api/customer/loyalty` *(customer token)*

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.10.1 | Fresh customer (0 punches) | `punch_count: 0`, `next_reward_at: 10` | |
| 3.10.2 | After 5 bookings completed | `punch_count: 5` | |
| 3.10.3 | After 10 bookings completed | `punch_count: 0` (reset), `last_rewarded_at` set | |

---

## 3.11 Customer — Promos

**GET** `/api/customer/promos` *(customer token)*

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.11.1 | Returns active promos | `is_active=true`, within `valid_from`–`valid_until` | |
| 3.11.2 | Expired promos excluded | Past `valid_until` not shown | |
| 3.11.3 | Full `max_uses` promo excluded | `used_count >= max_uses` not shown | |
| 3.11.4 | `required_role=registered_only` shown | Customer is registered | |

---

## 3.12 Booking Expiry Job

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 3.12.1 | Run `php artisan schedule:run` | No errors | |
| 3.12.2 | Pending booking >15min past scheduled_at | Status → `"expired"`, `expired_at` set | |
| 3.12.3 | Pending booking < 15min | NOT expired yet | |
| 3.12.4 | Confirmed booking > 15min past | NOT expired (only pending_confirmation) | |

---

---

# Phase 4 — POS & Receipts

> *(Not yet implemented — tests to be filled when Phase 4 is complete)*

---

## 4.1 POS Modal (Kasir)

| # | Step | Check | Expected | Status |
|---|------|-------|----------|--------|
| 4.1.1 | Step 1 | "Selesai" on in_progress booking | POS Modal opens | ⏭️ |
| 4.1.2 | Step 1 | Booking summary shown | Services, durations, prices listed | ⏭️ |
| 4.1.3 | Step 2 | Enter promo code | Validates via `POST /api/promos/validate` | ⏭️ |
| 4.1.4 | Step 2 | Valid promo applied | Discount reflected in subtotal | ⏭️ |
| 4.1.5 | Step 2 | Invalid/expired promo | Error message shown | ⏭️ |
| 4.1.6 | Step 3 | Enter tip amount | Tip added to total | ⏭️ |
| 4.1.7 | Step 4 | Select payment method | cash / bank_transfer / qris_external | ⏭️ |
| 4.1.8 | Step 5 | Confirm payment | Receipt created, booking → completed | ⏭️ |

---

## 4.2 Receipt

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 4.2.1 | Receipt number format | `RCP-YYYYMMDD-XXXX` | ⏭️ |
| 4.2.2 | Receipt items match booking services | Correct names and prices | ⏭️ |
| 4.2.3 | Promo discount saved | `promo_discount` field in receipt | ⏭️ |
| 4.2.4 | Tip saved | `tip_amount` field in receipt | ⏭️ |
| 4.2.5 | Total = subtotal - discount + tip | Math correct | ⏭️ |

---

## 4.3 Promo Validation Endpoint

**POST** `/api/promos/validate`

| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 4.3.1 | Valid promo code | `200`, returns discount details | ⏭️ |
| 4.3.2 | Non-existent code | `404` | ⏭️ |
| 4.3.3 | Expired promo | `422` | ⏭️ |
| 4.3.4 | Max uses reached | `422` | ⏭️ |
| 4.3.5 | User already used promo (max_per_user) | `422` | ⏭️ |
| 4.3.6 | `required_role=registered_only` as guest | `422` | ⏭️ |
| 4.3.7 | Promo for different branch | `422` | ⏭️ |

---

## 4.4 Loyalty Punch on Completion

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 4.4.1 | Booking completed via POS | `punch_count` increments +1 | ⏭️ |
| 4.4.2 | PunchCardHistory entry created | `action=punch` logged | ⏭️ |
| 4.4.3 | 10th punch | Auto-generate LOYALTY-XXXXXXXX promo code | ⏭️ |
| 4.4.4 | After reward | `punch_count` resets to 0 | ⏭️ |
| 4.4.5 | Reward promo | `last_rewarded_at` set, history logged `action=reward` | ⏭️ |

---

---

# Phase 5 — AI & Admin Analytics

> *(Not yet implemented)*

---

## 5.1 Hair Analysis

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 5.1.1 | POST `/api/hair-analysis` with image | Proxied to LightX API | ⏭️ |
| 5.1.2 | Returns style recommendations | AI response parsed correctly | ⏭️ |
| 5.1.3 | No image provided | `422` | ⏭️ |

---

## 5.2 Admin Analytics (Filament)

| # | Widget | Expected | Status |
|---|--------|----------|--------|
| 5.2.1 | StatsOverview | Total bookings, revenue, customers | ⏭️ |
| 5.2.2 | RevenueChart | Monthly revenue line chart | ⏭️ |
| 5.2.3 | BookingTrend | Daily booking count trend | ⏭️ |
| 5.2.4 | BarberPerformance | Ratings and booking count per barber | ⏭️ |

---

## 5.3 Admin Filament — Phase 5 Resources

| # | Resource | Expected | Status |
|---|----------|----------|--------|
| 5.3.1 | PromoResource | Create/edit/list promos | ⏭️ |
| 5.3.2 | CustomerPunchCardResource | View punch history per customer | ⏭️ |
| 5.3.3 | FeedbackResource | View/mark-read feedback | ⏭️ |

---

---

# Cross-Cutting Concerns

---

## A. Role-Based Access Control

| # | Endpoint | Role | Expected | Status |
|---|----------|------|----------|--------|
| A.1 | `POST /api/kasir/bookings/{id}/confirm` | Admin | `403` | |
| A.2 | `POST /api/kasir/bookings/{id}/confirm` | Customer | `403` | |
| A.3 | `GET /api/customer/bookings` | Kasir | `403` | |
| A.4 | `GET /api/customer/bookings` | Admin | `403` | |
| A.5 | Admin Filament `/admin` | Kasir token | Redirected / `403` | |
| A.6 | Kasir Filament `/kasir` | Admin | Can access (admin sees all) | |

---

## B. Data Isolation (Branch Scoping)

| # | Check | Expected | Status |
|---|-------|----------|--------|
| B.1 | Kasir A confirms booking at Branch B | `403` or `404` | |
| B.2 | Kasir A sees TodayTimeline | Only Branch A bookings shown | |
| B.3 | Kasir A QuickStats | Only Branch A revenue/transactions | |
| B.4 | Kasir A WalkinForm barbers | Only barbers assigned to Branch A | |

---

## C. Booking Status Machine

Test every invalid transition:

| # | From Status | Attempted Action | Expected | Status |
|---|-------------|------------------|----------|--------|
| C.1 | `completed` | confirm | `422` | |
| C.2 | `expired` | confirm | `422` | |
| C.3 | `cancelled` | start | `422` | |
| C.4 | `pending_confirmation` | start (skip confirm) | `422` | |
| C.5 | `in_progress` | cancel (customer) | `422` | |

---

## D. Slot Locking (Race Condition Prevention)

| # | Check | Expected | Status |
|---|-------|----------|--------|
| D.1 | Two simultaneous booking requests for same slot | Only 1 succeeds, other gets `409` | |
| D.2 | Redis lock expires after 5 min | Slot becomes bookable again | |
| D.3 | Booking created → slot released from Redis | No stale lock | |

---

## E. UUID Consistency

| # | Check | Expected | Status |
|---|-------|----------|--------|
| E.1 | All model `id` fields are UUID strings | Not integers | |
| E.2 | API responses use UUID for IDs | No integer IDs exposed | |
| E.3 | `personal_access_tokens.tokenable_id` is UUID | Auth works correctly | |

---

*Last updated: 2026-06-12*
