const db = require('../db');

async function getCustomerById(id) {
  const [rows] = await db.query(
    'SELECT id, name, email, city FROM customers WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function listCustomers() {
  const [rows] = await db.query('SELECT id, name, email, city FROM customers ORDER BY id');
  return rows;
}

module.exports = { getCustomerById, listCustomers };
