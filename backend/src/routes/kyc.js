const express = require('express');
const multer = require('multer');
const path = require('path');
const { data, persist } = require('../db');
const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads') });
const mongo = require('../mongo');
const useMongo = !!process.env.MONGO_URI;
const KYCModel = useMongo ? mongo.models.KYC : null;
const router = express.Router();

router.post('/upload', upload.fields([{ name: 'aadhaar_doc' }, { name: 'pan_doc' }, { name: 'other_id' }]), async (req, res) => {
  const { aadhaar, pan, userId } = req.body;
  const files = req.files || {};
  if (useMongo) {
    const rec = await KYCModel.create({ userId, aadhaar, pan, files, status: 'pending' });
    return res.json({ ok: true, record: rec });
  }
  const record = { id: `k_${Date.now()}`, userId, aadhaar, pan, files, status: 'pending', createdAt: Date.now() };
  data.kyc.push(record);
  persist();
  res.json({ ok: true, record });
});

router.get('/:userId/status', async (req, res) => {
  if (useMongo) {
    const rec = await KYCModel.findOne({ userId: req.params.userId }).lean();
    if (!rec) return res.json({ status: 'not_submitted' });
    return res.json({ status: rec.status, record: rec });
  }
  const rec = data.kyc.find(k => k.userId === req.params.userId);
  if (!rec) return res.json({ status: 'not_submitted' });
  res.json({ status: rec.status, record: rec });
});

module.exports = router;
