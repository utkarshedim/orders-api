const express = require('express');
const { getCustomerById, listCustomers } = require('../repositories/customers');
const { listOrdersByCustomerId } = require('../repositories/orders');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await listCustomers());
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/orders', async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(await listOrdersByCustomerId(customer.id));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
