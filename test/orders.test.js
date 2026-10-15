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

test('GET /orders returns a page of order summaries, newest first', async () => {
  const res = await request(app).get('/orders');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.page, 1);
  assert.strictEqual(res.body.limit, 20);
  assert.strictEqual(res.body.total, 4);
  assert.deepStrictEqual(res.body.data.map((o) => o.id), [4, 3, 2, 1]);

  const order = res.body.data.find((o) => o.id === 1);
  assert.strictEqual(order.status, 'paid');
  assert.ok(order.created_at);
  assert.deepStrictEqual(order.customer, { id: 1, name: 'Aarav Sharma', city: 'Kanpur' });
  assert.strictEqual(order.item_count, 2);
  assert.strictEqual(order.total_paise, 149900 + 2 * 19900);
});

test('GET /orders paginates with page and limit', async () => {
  const res = await request(app).get('/orders?page=2&limit=3');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.total, 4);
  assert.deepStrictEqual(res.body.data.map((o) => o.id), [1]);
});

test('GET /orders filters by status', async () => {
  const res = await request(app).get('/orders?status=shipped');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.total, 1);
  assert.strictEqual(res.body.data[0].id, 3);
  assert.strictEqual(res.body.data[0].total_paise, 12900 + 19900);
});

test('GET /orders rejects invalid query params', async () => {
  for (const qs of ['page=0', 'page=abc', 'limit=0', 'limit=101', 'status=lost']) {
    const res = await request(app).get(`/orders?${qs}`);
    assert.strictEqual(res.status, 400, qs);
  }
});
