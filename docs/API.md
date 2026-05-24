# REST API reference

All paths are prefixed with `/api`. Responses are JSON. Protected routes expect an `Authorization: Bearer <jwt>` header — the token is returned by any of the `/api/auth/*` endpoints.

Error envelope:

```json
{ "error": "Human-readable message", "code": "optional-machine-code" }
```

Status codes follow HTTP semantics: `400` validation, `401` no/invalid token, `403` role mismatch or not the owner, `404` not found, `409` duplicate, `503` external service disabled.

---

## Auth

### `POST /api/auth/register`

Create a new account.

```json
{
  "role": "customer | host",
  "email": "anaya@example.com",
  "password": "at-least-8-chars",
  "full_name": "Anaya Mehra",
  "phone": "+91 9812345678"
}
```

Returns `201`:
```json
{
  "token": "ey…",
  "user": { "id": 1, "email": "…", "full_name": "…", "phone": "…", "role": "customer" }
}
```

### `POST /api/auth/login`

```json
{ "role": "customer | host", "email": "…", "password": "…" }
```

Same response shape as `/register`.

### `POST /api/auth/google`

```json
{ "role": "customer | host", "credential": "<Google ID token>" }
```

The backend verifies the ID token against Google's JWKS, then either looks up the user by `google_sub`, links Google to an existing email, or provisions a new account. Returns the standard `{ token, user }`.

Requires `GOOGLE_CLIENT_ID` to be set on the server; otherwise returns `503`.

### `GET /api/auth/me`

Auth required. Returns `{ user }` for the current session.

---

## Hotels

### `GET /api/hotels`

Public search.

Query parameters (all optional):

| key | type | notes |
|---|---|---|
| `location`   | string  | matches `city`, `region`, or `name` (ILIKE) |
| `region`     | string  | exact match |
| `min_price`  | integer | filters on `price_from` |
| `max_price`  | integer | filters on `price_from` |
| `min_rating` | number  | filters on `rating_avg` |
| `sort`       | enum    | `score` (default), `rating`, `price_asc`, `price_desc`, `newest` |

Returns up to 100 hotels with embedded amenities:

```json
{
  "hotels": [
    {
      "id": 1, "slug": "marigold-house", "name": "The Marigold House",
      "region": "Rajasthan", "city": "Udaipur",
      "hero_image_url": null, "hue": "sand", "badge": "Editor's pick",
      "price_from": 9800, "rating_avg": 4.7, "rating_count": 18, "score": 78,
      "amenities": [ { "key": "wifi", "label": "Fibre Wi-Fi", "icon": "wifi" }, … ]
    }
  ]
}
```

### `GET /api/hotels/destinations`

Aggregated city + region list for the home page.

```json
{ "destinations": [ { "name": "Udaipur", "region": "Rajasthan", "stays": 2, "hue": "sand" }, … ] }
```

### `GET /api/hotels/:slug`

Full hotel detail including amenities, rooms, recent reviews and gallery.

```json
{
  "hotel": {
    "id": 1, "slug": "marigold-house", "name": "…", "description": "…",
    "address": "…", "checkin_time": "15:00:00", "checkout_time": "11:00:00",
    "host_name": "Vikram Singh", "host_business": "Marigold Hospitality", "host_superhost": true,
    "amenities": [ … ],
    "rooms":     [ { "id": 1, "type": "Heritage Suite", "price_per_night": 14800, … } ],
    "reviews":   [ { "id": 1, "rating": 5, "comment": "…", "customer_name": "Anaya Mehra", "created_at": "…" } ],
    "gallery":   [ { "url": "…", "position": 0, "caption": null } ]
  }
}
```

### `POST /api/hotels`

Host only. Creates a new property. Body matches the editable columns (`name`, `slug`, `region`, `city`, `address`, `description`, `checkin_time`, `checkout_time`, `phone`, `hero_image_url`, `hue`, `badge`) plus an optional `amenities: ["wifi", "pool", …]` array of amenity `key`s. The host becomes the owner automatically.

Returns `201` with `{ hotel }`. Conflict (`409`) on slug clash.

### `PUT /api/hotels/:id`

Host (owner). Partial update — send only the fields you want to change. Returns `{ hotel }`.

### `DELETE /api/hotels/:id`

Host (owner). Returns `204` on success.

---

## Rooms

### `GET /api/rooms/:id`

Public. Full room detail with amenities and gallery.

### `GET /api/rooms/:id/availability?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD`

Public. Returns `{ available: true | false }` based on existing non-cancelled bookings overlap.

### `POST /api/rooms`

Host (owner of the hotel). Body:

```json
{
  "hotel_id": 1, "type": "Heritage Suite", "view": "Lake view",
  "beds": "King bed", "size_sqm": 42, "price_per_night": 14800,
  "image_url": "https://…", "hue": "sand",
  "amenities": ["wifi", "ac", "tv"]
}
```

### `PUT /api/rooms/:id`

Host (owner). Partial update.

### `DELETE /api/rooms/:id`

Host (owner). Returns `204`.

---

## Bookings

All booking endpoints require authentication.

### `POST /api/bookings`

Customer only.

```json
{ "room_id": 1, "checkin_date": "2026-07-12", "checkout_date": "2026-07-15", "guests": 2 }
```

The backend opens a transaction, locks the room row, checks for date overlap, computes `base_amount` × nights, `tax_amount` (18% GST) and `total_amount`. Returns `201` with the new booking row. `409` on date overlap.

### `GET /api/bookings/my`

Customer's own bookings, newest first, with embedded hotel and room metadata.

### `GET /api/bookings/:id`

Auth required. Visible to the booking's customer **or** the hosting host. Anyone else gets `403`.

### `PUT /api/bookings/:id/cancel`

Customer only. Cancels a `pending` or `confirmed` booking. `404` if the booking doesn't exist or isn't cancellable.

---

## Reviews

### `POST /api/reviews`

Customer only. The customer must be the booking's owner and the booking must be `completed`.

```json
{
  "booking_id": 12,
  "hotel_rating": 4.5,
  "hotel_comment": "Restorative.",
  "room_rating":  5,
  "room_comment":  "Worth the upgrade."
}
```

Either `hotel_rating` or `room_rating` (or both) must be present. Returns `201` with whichever reviews were created. `409` if the customer already reviewed this booking. The Bayesian rating recompute triggers fire automatically.

### `GET /api/reviews/booking/:id`

Auth required. Returns `{ hotel_review, room_review }` (either may be `null`).

---

## Profile

### `GET /api/profile`

Auth required. Returns the rich profile shape for the current user (Customer or Host columns depending on role).

### `PUT /api/profile`

Auth required. Partial update. Only the role's allow-listed columns are accepted — extra keys in the body are silently ignored.

### `PUT /api/profile/change-password`

```json
{ "current_password": "…", "new_password": "at-least-8-chars" }
```

`current_password` is required when the account already has a password set. For Google-only accounts it can be omitted to set a password for the first time.

---

## Host workspace

All host endpoints require the host role.

### `GET /api/host/properties`

Returns the host's hotels with extra per-property KPIs computed in SQL:

```json
{
  "properties": [
    {
      "id": 1, "name": "…", "slug": "…", "hue": "sand",
      "rooms_count": 3,
      "revenue_mtd": "482400.00",
      "occupancy": 82
    }
  ]
}
```

### `GET /api/host/stats`

Aggregate dashboard KPIs:

```json
{
  "revenue": 1413600,    "revenue_delta": 18.4,
  "bookings": 47,         "bookings_delta": 12,
  "rating": 4.83,         "rating_delta": 0.1,
  "occupancy": 78,        "occupancy_delta": 0
}
```

`*_delta` is the percentage change versus the previous calendar month.

### `GET /api/host/bookings`

Bookings across all the host's properties, newest checkin first. Up to 200 rows. Optional query params: `status` (matches the `booking_status` enum), `from`, `to`.

### `GET /api/host/earnings`

```json
{
  "monthly": [ { "month": "2026-01", "revenue": 184400 }, … ],
  "transactions": [ { "id": 84, "created_at": "…", "total_amount": 49728, "status": "completed", "guest_name": "…", "hotel_name": "…" }, … ]
}
```

Only `confirmed` and `completed` bookings are counted.

---

## Upload

Host only. Both endpoints accept `multipart/form-data` with a single field `image`. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`. Max size 5 MB.

### `POST /api/upload/hotel-image`

Returns:

```json
{ "url": "https://<project>.supabase.co/storage/v1/object/public/hotel-images/hotels/<id>.<ext>", "path": "hotels/<id>.<ext>" }
```

### `POST /api/upload/room-image`

Same shape, files land in the `rooms/` subfolder of the bucket.

`503` if Supabase credentials aren't configured on the server.

---

## Health

### `GET /api/health`

```json
{ "ok": true, "ts": "2026-05-24T12:34:56.789Z" }
```

No auth, no DB hit. Use for liveness probes.
