const express = require('express');
const mongoose = require('mongoose');
const { data, persist } = require('../db');
const mongo = require('../mongo');
const { normalizeIndianPhone } = require('../validators');
const useMongo = !!process.env.MONGO_URI;
const TransactionModel = useMongo ? mongo.models.Transaction : null;
const WalletModel = useMongo ? mongo.models.Wallet : null;
const UserModel = useMongo ? mongo.models.User : null;
const router = express.Router();

async function resolveWalletUserId(identifier) {
  const value = String(identifier || '').trim();
  if (!value) return null;

  const directWallet = await WalletModel.findOne({ userId: value }).lean();
  if (directWallet) return directWallet.userId;

  const userConditions = [{ id: value }, { email: value }];
  if (mongoose.Types.ObjectId.isValid(value)) {
    userConditions.push({ _id: value });
  }
  const normalizedPhone = normalizeIndianPhone(value);
  if (normalizedPhone) {
    userConditions.push({ phone: { $in: [normalizedPhone, `+91${normalizedPhone}`] } });
  }

  const user = await UserModel.findOne({ $or: userConditions }).lean();
  if (!user) return null;
  return String(user._id);
}

// Wallet to wallet
router.post('/wallet', async (req, res) => {
  const { from, to, amount } = req.body;
  const transferAmount = Number(amount);
  if (!from || !to || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ error: 'from, to and valid amount are required' });
  }
  const txnObj = { id: `tx_${Date.now()}`, from, to, amount: transferAmount, status: 'success', date: Date.now() };
  if (useMongo) {
    const senderUserId = await resolveWalletUserId(from);
    if (!senderUserId) return res.status(404).json({ error: 'Sender wallet not found' });

    const wallet = await WalletModel.findOne({ userId: senderUserId });
    if (!wallet) return res.status(404).json({ error: 'Sender wallet not found' });
    if (wallet.balance < transferAmount) return res.status(400).json({ error: 'Insufficient balance' });

    wallet.balance -= transferAmount;
    wallet.updatedAt = Date.now();
    await wallet.save();

    const txn = await TransactionModel.create({ id: txnObj.id, from: senderUserId, to, amount: transferAmount, status: 'success' });
    
    return res.json({ ok: true, txn });
  }
  data.transactions.push(txnObj);
  
  // Deduct from sender's wallet
  let wallet = data.wallets.find(w => w.userId === from);
  if (wallet) {
    wallet.balance = Math.max(0, wallet.balance - Number(amount));
    wallet.updatedAt = Date.now();
  }
  
  persist();
  res.json({ ok: true, txn: txnObj });
});

// Bank transfer (simulate pending)
router.post('/bank', async (req, res) => {
  const { from, account, ifsc, amount } = req.body;
  const transferAmount = Number(amount);
  if (!from || !account || !ifsc || !Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ error: 'from, account, ifsc and valid amount are required' });
  }
  const txnObj = { id: `tx_${Date.now()}`, from, to: account, amount: transferAmount, status: 'pending', method: 'bank', date: Date.now() };
  if (useMongo) {
    const senderUserId = await resolveWalletUserId(from);
    if (!senderUserId) return res.status(404).json({ error: 'Sender wallet not found' });

    const wallet = await WalletModel.findOne({ userId: senderUserId });
    if (!wallet) return res.status(404).json({ error: 'Sender wallet not found' });
    if (wallet.balance < transferAmount) return res.status(400).json({ error: 'Insufficient balance' });

    wallet.balance -= transferAmount;
    wallet.updatedAt = Date.now();
    await wallet.save();

    const txn = await TransactionModel.create({ id: txnObj.id, from: senderUserId, to: account, amount: transferAmount, status: 'pending', method: 'bank' });
    
    return res.json({ ok: true, txn });
  }
  data.transactions.push(txnObj);
  
  // Deduct from sender's wallet (for pending transfers as well)
  let wallet = data.wallets.find(w => w.userId === from);
  if (wallet) {
    wallet.balance = Math.max(0, wallet.balance - Number(amount));
    wallet.updatedAt = Date.now();
  }
  
  persist();
  res.json({ ok: true, txn: txnObj });
});

// History
router.get('/history', async (req, res) => {
  if (useMongo) {
    const txns = await TransactionModel.find().sort({ date: -1 }).lean();
    return res.json({ ok: true, transactions: txns });
  }
  res.json({ ok: true, transactions: data.transactions.slice().reverse() });
});

module.exports = router;
