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
- `GET /orders/:id` returns an order with its customer, items and total.

Money is stored as integer paise.
