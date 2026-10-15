const express = require('express');
const {
  ORDER_STATUSES,
  getOrderById,
  getItemsByOrderId,
  listOrders,
} = require('../repositories/orders');
const { getCustomerById } = require('../repositories/customers');
const { parsePagination } = require('./pagination');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset, error } = parsePagination(req.query);
    const { status } = req.query;

    if (error) return res.status(400).json({ error });
    if (status !== undefined && !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${ORDER_STATUSES.join(', ')}` });
    }

    const { orders, total } = await listOrders({ limit, offset, status });
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
