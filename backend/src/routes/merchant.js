const express = require('express');
const { data, persist } = require('../db');
const mongo = require('../mongo');
const useMongo = !!process.env.MONGO_URI;
const MerchantModel = useMongo ? mongo.models.Merchant : null;
const TransactionModel = useMongo ? mongo.models.Transaction : null;
const router = express.Router();

// Onboard merchant
router.post('/onboard', async (req, res) => {
  const { business_name, contact, phone } = req.body;
  if (useMongo) {
    const m = await MerchantModel.create({ business_name, contact, phone });
    return res.json({ ok: true, merchant: m });
  }
  const m = { id: `m_${Date.now()}`, business_name, contact, phone, createdAt: Date.now() };
  data.merchants.push(m);
  persist();
  res.json({ ok: true, merchant: m });
});

// Generate QR (placeholder)
router.post('/generate-qr', (req, res) => {
  const { merchant_id, amount } = req.body;
  const payload = { merchant_id, amount, ts: Date.now() };
  res.json({ ok: true, qr: payload });
});

// Get merchant payments (simple filter)
router.get('/:id/payments', async (req, res) => {
  const id = req.params.id;
  if (useMongo) {
    const payments = await TransactionModel.find({ $or: [{ to: id }, { merchantId: id }] }).lean();
    return res.json({ ok: true, payments });
  }
  const payments = data.transactions.filter(t => t.to === id || t.merchantId === id);
  res.json({ ok: true, payments });
});

module.exports = router;
