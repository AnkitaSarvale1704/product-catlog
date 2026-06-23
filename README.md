# Product Catalog Backend

A backend service for browsing ~200,000 products with category filtering and efficient pagination.

Built using Node.js, Express, PostgreSQL and Prisma.

---

## Features

- Browse products sorted by newest first.
- Filter products by category.
- Fast keyset pagination.
- Handles concurrent inserts and updates without duplicates or missing records.
- Seed script to generate ~200,000 products.
- Batch insertion for efficient database population.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Neon Database
- Faker.js

---

## Project Structure

```
product-catalog
│
├── src
│   ├── config
│   │      prisma.js
│   │
│   ├── controllers
│   │      productController.js
│   │
│   ├── routes
│   │      productRoutes.js
│   │
│   ├── seed
│   │      seed.js
│   │      add50Products.js
│   │
│   ├── app.js
│   └── server.js
│
├── prisma
│      schema.prisma
│
├── .env
├── package.json
└── README.md
```

---

## Database Schema

### Product

| Field | Type |
|---------|------|
| id | UUID |
| name | String |
| category | String |
| price | Float |
| created_at | DateTime |
| updated_at | DateTime |

### Indexes

```prisma
@@index([updated_at(sort: Desc), id(sort: Desc)])
@@index([category, updated_at(sort: Desc), id(sort: Desc)])
```

These indexes improve sorting, filtering, and pagination performance.

---

## Pagination Strategy

Products are sorted using:

```sql
ORDER BY updated_at DESC, id DESC
```

### Why not OFFSET pagination?

OFFSET pagination becomes slower as offsets grow and can lead to duplicate or missing records when data changes during browsing.

### Keyset Pagination

This project uses keyset pagination based on:

```
(updated_at, id)
```

Next pages are fetched using:

```sql
WHERE

updated_at < cursorUpdatedAt

OR

(updated_at = cursorUpdatedAt
AND id < cursorId)

ORDER BY updated_at DESC, id DESC
LIMIT 20
```

### Benefits

- Fast queries
- Stable ordering
- No duplicate records
- No missing records
- Handles concurrent inserts and updates

---

## Seed Script

Products are generated using Faker.

Instead of inserting products one by one, records are inserted in batches using:

```js
createMany()
```

This reduces the number of database calls and significantly improves insertion performance.

---

## API Endpoints

### Get Products

```http
GET /products
```

Returns the first page of products.

---

### Filter by Category

```http
GET /products?category=Books
```

Returns products belonging to a category.

---

### Pagination

```http
GET /products?cursorId=<id>&cursorUpdatedAt=<timestamp>
```

Returns the next page.

---

### Category + Pagination

```http
GET /products?category=Books&cursorId=<id>&cursorUpdatedAt=<timestamp>
```

Returns the next page within that category.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm run dev
```

Generate products:

```bash
node src/seed/seed.js
```

Insert 50 additional products for testing:

```bash
node src/seed/add50Products.js
```

---

## Deployment

- Backend: Render
- Database: Neon

---

## Design Decisions

- PostgreSQL was chosen for its indexing capabilities and reliability.
- Prisma simplifies database interaction and improves development speed.
- Keyset pagination was preferred over OFFSET pagination to maintain consistency while data changes.
- Batch insertion was used to efficiently generate large datasets.

---

## Author

Built as part of a backend assignment focused on efficient pagination, database design, and handling concurrent updates.