# 04 — User Flows

Flows below mirror what the current UI does; ⚠ marks steps whose rule is undefined.

## UF-1 Register & login
```mermaid
flowchart TD
  A[Open app] --> B{Has account?}
  B -- No --> C[Register form: name, role, ID, college, plate, car, phone, password]
  C --> D[Server validates + creates user + wallet + vehicle]
  D --> E[Welcome credit ⚠]
  B -- Yes --> F[Login: ID + password]
  E --> G[JWT issued]
  F --> G --> H[Dashboard]
```

## UF-2 Book a parking pass
```mermaid
flowchart TD
  A[Booking tab] --> B[Choose schedule pattern + college]
  B --> C[Choose tariff hourly/daily/monthly]
  C --> D[Hours if hourly]
  D --> E[Smart-share opt-in]
  E --> F[Price computed server-side ⚠ rules]
  F --> G[Confirm + wallet debit]
  G --> H[Digital pass + QR]
```

## UF-3 Flex-Share (owner → borrower)
```mermaid
sequenceDiagram
  participant O as Owner
  participant S as System
  participant B as Borrower
  participant G as ALPR Gate
  O->>S: Declare break (1–4h)
  S->>S: Spot -> FLEX_SHARE
  S->>B: Match by schedule/college ⚠ + notify
  B->>S: Accept reservation
  B->>G: Arrive, plate scanned
  G->>S: Validate pass
  S-->>G: Open barrier
  B->>S: Leaves
  S->>O: Spot returned + credit 5.75×h ⚠
```

## UF-4 Book peer tutoring
```mermaid
flowchart TD
  A[Tutoring hub + filter] --> B[Select session]
  B --> C[Review scope/time/place/price ⚠]
  C --> D{Balance >= price?}
  D -- No --> E[Error: top up]
  D -- Yes --> F[Debit student, credit tutor atomically]
  F --> G[Enrol student + notify tutor]
```

## UF-5 Tutor posts session
Tutor → "Create session" → course, scope, rate, location → publish → appears in hub.

## UF-6 Book faculty office hour
Faculty list → choose slot → topic + duration → confirm → slot booked → notification to faculty.

## UF-7 Book study room / lab
Rooms list → choose room → purpose + members + start/end → confirm → status in-use + countdown → extend +10 min / release.

## UF-8 Wallet & tuition
Wallet → view balance & history → Pay tuition → choose amount ≤ balance → confirm → ledger entry + tuition paid ↑ → receipt.

## UF-9 Notifications
Event (booking/payment) → notification row for target → bell badge → drawer → mark read.

