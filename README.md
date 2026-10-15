# orders-api-demo

A small orders API for an electronics kit store. Express + MySQL.

## Run locally

1. `docker compose up -d` starts MySQL on port 3306.
2. `cp .env.example .env` sets the connection details.
3. `npm install` installs dependencies.
4. `npm run db:reset` creates the tables and loads seed data.
5. `npm test` runs the tests.
6. `npm start` starts the API on port 3000.

## Endpoints

- `GET /health`
- `GET /customers`
- `GET /customers/:id`
- `GET /customers/:id/orders` returns all of a customer's orders as summaries (same shape as `GET /orders` items).
- `GET /orders` returns a paginated list of order summaries, newest first. Query params: `page` (default 1), `limit` (default 20, max 100), `status` (optional: `pending`, `paid`, `shipped`, `cancelled`). Response: `{ data, page, limit, total }`, where each summary has `id`, `status`, `created_at`, `customer` (`id`, `name`, `city`), `item_count` (line items) and `total_paise`.
- `GET /orders/:id` returns an order with its customer, items and total.

Money is stored as integer paise.
