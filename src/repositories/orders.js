const db = require('../db');

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'cancelled'];

// One row per order with its customer, item count and total, aggregated in SQL
// so a page of orders costs a single query. SUM over INT columns comes back as
// DECIMAL (a string in mysql2), hence the CAST.
const ORDER_SUMMARY_SELECT = `
  SELECT o.id, o.status, o.created_at,
         c.id AS customer_id, c.name AS customer_name, c.city AS customer_city,
         COUNT(oi.id) AS item_count,
         CAST(COALESCE(SUM(oi.quantity * oi.unit_price_paise), 0) AS SIGNED) AS total_paise
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    LEFT JOIN order_items oi ON oi.order_id = o.id`;

function toOrderSummary(row) {
  return {
    id: row.id,
    status: row.status,
    created_at: row.created_at,
    customer: { id: row.customer_id, name: row.customer_name, city: row.customer_city },
    item_count: row.item_count,
    total_paise: row.total_paise,
  };
}

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

async function listOrders({ limit, offset, status }) {
  const where = status ? 'WHERE o.status = ?' : '';
  const filterParams = status ? [status] : [];

  const [rows] = await db.query(
    `${ORDER_SUMMARY_SELECT}
      ${where}
      GROUP BY o.id, c.id
      ORDER BY o.created_at DESC, o.id DESC
      LIMIT ? OFFSET ?`,
    [...filterParams, limit, offset]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM orders o ${where}`,
    filterParams
  );
  return { orders: rows.map(toOrderSummary), total };
}

async function listOrdersByCustomerId(customerId) {
  const [rows] = await db.query(
    `${ORDER_SUMMARY_SELECT}
      WHERE o.customer_id = ?
      GROUP BY o.id, c.id
      ORDER BY o.created_at DESC, o.id DESC`,
    [customerId]
  );
  return rows.map(toOrderSummary);
}

module.exports = {
  ORDER_STATUSES,
  getOrderById,
  getItemsByOrderId,
  listOrders,
  listOrdersByCustomerId,
};
