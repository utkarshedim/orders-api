const express = require('express');
const { getOrderById, getItemsByOrderId } = require('../repositories/orders');
const { getCustomerById } = require('../repositories/customers');

const router = express.Router();

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
