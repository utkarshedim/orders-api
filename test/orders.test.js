const { test, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { resetDb } = require('../scripts/reset-db');

before(async () => {
  await resetDb();
});

after(async () => {
  await db.end();
});

test('GET /orders/:id returns order with items, customer and total', async () => {
  const res = await request(app).get('/orders/1');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.customer.name, 'Aarav Sharma');
  assert.strictEqual(res.body.items.length, 2);
  assert.strictEqual(res.body.total_paise, 149900 + 2 * 19900);
});

test('GET /orders/:id returns 404 for unknown id', async () => {
  const res = await request(app).get('/orders/999');
  assert.strictEqual(res.status, 404);
});
