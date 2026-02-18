const express = require('express');
const { data } = require('../db');
const mongo = require('../mongo');
const useMongo = !!process.env.MONGO_URI;
const TransactionModel = useMongo ? mongo.models.Transaction : null;
const router = express.Router();

router.get('/', async (req, res) => {
  const { status, q } = req.query;
  if (useMongo) {
    let filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ id: new RegExp(q, 'i') }, { from: new RegExp(q, 'i') }, { to: new RegExp(q, 'i') }];
    const list = await TransactionModel.find(filter).sort({ date: -1 }).lean();
    return res.json({ ok: true, transactions: list });
  }
  let list = data.transactions.slice().reverse();
  if (status) list = list.filter(t => t.status === status);
  if (q) list = list.filter(t => t.id.includes(q) || (t.from && t.from.includes(q)) || (t.to && t.to.includes(q)));
  res.json({ ok: true, transactions: list });
});

router.get('/:id', async (req, res) => {
  if (useMongo) {
    const t = await TransactionModel.findOne({ id: req.params.id }).lean();
    if (!t) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true, transaction: t });
  }
  const t = data.transactions.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, transaction: t });
});

module.exports = router;
