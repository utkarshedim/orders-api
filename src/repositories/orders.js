const db = require('../db');

async function getOrderById(id) {
  const [rows] = await db.query(
    'SELECT id, customer_id, status, created_at FROM orders WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function getItemsByOrderId(orderId) {
  const [rows] = await db.query(
    `SELECT oi.product_id, p.name AS product_name, oi.quantity, oi.unit_price_paise
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.id`,
    [orderId]
  );
  return rows;
}

module.exports = { getOrderById, getItemsByOrderId };
