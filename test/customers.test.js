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

test('GET /customers lists all customers', async () => {
  const res = await request(app).get('/customers');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.length, 3);
});

test('GET /customers/:id returns one customer', async () => {
  const res = await request(app).get('/customers/2');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.name, 'Diya Verma');
});

test('GET /customers/:id returns 404 for unknown id', async () => {
  const res = await request(app).get('/customers/999');
  assert.strictEqual(res.status, 404);
});

test('GET /customers/:id/orders returns that customer\'s order summaries', async () => {
  const res = await request(app).get('/customers/1/orders');
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.map((o) => o.id), [2, 1]);
  assert.deepStrictEqual(res.body[0], {
    id: 2,
    status: 'pending',
    created_at: res.body[0].created_at,
    customer: { id: 1, name: 'Aarav Sharma', city: 'Kanpur' },
    item_count: 1,
    total_paise: 4 * 9900,
  });
});

test('GET /customers/:id/orders returns null city when unset', async () => {
  const res = await request(app).get('/customers/3/orders');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.length, 1);
  assert.strictEqual(res.body[0].customer.city, null);
});

test('GET /customers/:id/orders paginates with page and limit', async () => {
  const res = await request(app).get('/customers/1/orders?page=2&limit=1');
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.map((o) => o.id), [1]);
});

test('GET /customers/:id/orders rejects invalid page and limit', async () => {
  for (const qs of ['page=0', 'page=abc', 'limit=0', 'limit=101']) {
    const res = await request(app).get(`/customers/1/orders?${qs}`);
    assert.strictEqual(res.status, 400, qs);
  }
});

test('GET /customers/:id/orders returns 404 for unknown customer', async () => {
  const res = await request(app).get('/customers/999/orders');
  assert.strictEqual(res.status, 404);
});
