const express = require('express');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
