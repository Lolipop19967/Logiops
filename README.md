# LogiCRM — Firebase Edition

A full-featured logistics CRM built with Next.js 14, Tailwind CSS, and **Firebase Firestore** for real-time data.

## Tech Stack

- **Next.js 14** (App Router)
- **Firebase Firestore** — real-time database (replaces Supabase)
- **Tailwind CSS** — dark purple theme
- **Recharts** — analytics charts
- **Lucide React** — icons

## Firebase Project

```
Project: logistics-53406
Region: Default
```

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:3000/seed](http://localhost:3000/seed) and click **"Seed All Collections"** to populate Firestore with demo data.

## Firestore Collections

| Collection    | Records | Description                        |
|---------------|---------|------------------------------------|
| `customers`   | 15      | Logistics accounts across SA       |
| `contacts`    | 15      | Key contacts per customer          |
| `leads`       | 12      | Sales pipeline (Kanban + List)     |
| `shipments`   | 20      | Active / historical shipments      |
| `quotes`      | 12      | Rate quotes with margin tracking   |
| `invoices`    | 14      | Billing with overdue tracking      |
| `vehicles`    | 12      | Fleet with roadworthy expiry       |
| `drivers`     | 10      | Drivers with fatigue monitoring    |
| `routes`      | 12      | Lane definitions + base rates      |
| `warehouses`  | 7       | Storage nodes with capacity        |
| `carriers`    | 7       | 3PL & subcontractor ratings        |
| `compliance`  | 14      | Document expiry tracking           |
| `config`      | 1       | Charts config (revenue, OTIF)      |

## Key Files

```
src/
  lib/
    firebase.ts   — Firebase init & Firestore export
    hooks.ts      — useCollection<T>() real-time hook
    seed.ts       — Full seed data + seedAll() function
  app/
    seed/         — One-time seed UI page
    dashboard/    — Live KPIs from Firestore
    customers/    — CRUD with real-time updates
    ... (all 14 pages)
```

## useCollection Hook

Every page uses the same reusable hook:

```ts
const { data, loading, error, add, update, remove } = useCollection<Customer>('customers')
```

- `data` — real-time array, updates live via `onSnapshot`
- `add(item)` — writes to Firestore, auto-generates ID or uses provided `id`
- `update(id, changes)` — partial update
- `remove(id)` — delete document

## Firestore Security Rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Replace with auth rules for production
    }
  }
}
```
