const express = require('express');
const {
  ORDER_STATUSES,
  getOrderById,
  getItemsByOrderId,
  listOrders,
} = require('../repositories/orders');
const { getCustomerById } = require('../repositories/customers');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const router = express.Router();

// Returns the parsed value, the fallback when the param is absent, or null when invalid.
function parsePositiveInt(value, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 ? n : null;
}

router.get('/', async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);
    const { status } = req.query;

    if (page === null) return res.status(400).json({ error: 'page must be a positive integer' });
    if (limit === null || limit > MAX_LIMIT) {
      return res.status(400).json({ error: `limit must be an integer between 1 and ${MAX_LIMIT}` });
    }
    if (status !== undefined && !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${ORDER_STATUSES.join(', ')}` });
    }

    const { orders, total } = await listOrders({ limit, offset: (page - 1) * limit, status });
    res.json({ data: orders, page, limit, total });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = await getItemsByOrderId(order.id);
    const customer = await getCustomerById(order.customer_id);
    const totalPaise = items.reduce((sum, i) => sum + i.quantity * i.unit_price_paise, 0);

    res.json({
      id: order.id,
      status: order.status,
      created_at: order.created_at,
      customer: customer ? { id: customer.id, name: customer.name } : null,
      items,
      total_paise: totalPaise,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
