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
