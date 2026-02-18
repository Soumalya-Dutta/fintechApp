const express = require('express');
const { data, persist } = require('../db');
const mongo = require('../mongo');
const useMongo = !!process.env.MONGO_URI;
const WalletModel = useMongo ? mongo.models.Wallet : null;
const router = express.Router();

// Get wallet balance
router.get('/balance', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    if (useMongo) {
      let wallet = await WalletModel.findOne({ userId }).lean();
      if (!wallet) {
        // Create wallet for new user
        wallet = await WalletModel.create({ userId, balance: 50000, currency: 'INR' });
      }
      return res.json({ ok: true, balance: wallet.balance, currency: wallet.currency || 'INR' });
    }

    // File DB fallback
    let wallet = data.wallets.find(w => w.userId === userId);
    if (!wallet) {
      // Create wallet for new user
      wallet = {
        id: `w_${Date.now()}`,
        userId,
        balance: 50000.00,
        currency: 'INR',
        createdAt: Date.now()
      };
      data.wallets.push(wallet);
      persist();
    }
    res.json({ ok: true, balance: wallet.balance, currency: 'INR' });
  } catch (err) {
    console.error('Error fetching wallet balance:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Deduct from wallet
router.post('/deduct', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId and amount required' });
    }

    const deductAmount = parseFloat(amount);
    if (deductAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    if (useMongo) {
      const wallet = await WalletModel.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      if (wallet.balance < deductAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      wallet.balance -= deductAmount;
      await wallet.save();
      return res.json({ ok: true, balance: wallet.balance });
    }

    // File DB
    let wallet = data.wallets.find(w => w.userId === userId);
    if (!wallet) {
      wallet = {
        id: `w_${Date.now()}`,
        userId,
        balance: 50000.00,
        currency: 'INR',
        createdAt: Date.now()
      };
      data.wallets.push(wallet);
    }

    if (wallet.balance < deductAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    wallet.balance -= deductAmount;
    wallet.updatedAt = Date.now();
    persist();
    res.json({ ok: true, balance: wallet.balance });
  } catch (err) {
    console.error('Error deducting from wallet:', err);
    res.status(500).json({ error: 'Failed to deduct from wallet' });
  }
});

// Add to wallet
router.post('/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId and amount required' });
    }

    const addAmount = parseFloat(amount);
    if (addAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    if (useMongo) {
      let wallet = await WalletModel.findOne({ userId });
      if (!wallet) {
        wallet = new WalletModel({ userId, balance: addAmount, currency: 'INR' });
      } else {
        wallet.balance += addAmount;
      }
      await wallet.save();
      return res.json({ ok: true, balance: wallet.balance });
    }

    // File DB
    let wallet = data.wallets.find(w => w.userId === userId);
    if (!wallet) {
      wallet = {
        id: `w_${Date.now()}`,
        userId,
        balance: addAmount,
        currency: 'INR',
        createdAt: Date.now()
      };
      data.wallets.push(wallet);
    } else {
      wallet.balance += addAmount;
      wallet.updatedAt = Date.now();
    }
    persist();
    res.json({ ok: true, balance: wallet.balance });
  } catch (err) {
    console.error('Error adding to wallet:', err);
    res.status(500).json({ error: 'Failed to add to wallet' });
  }
});

// Get wallet details
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (useMongo) {
      const wallet = await WalletModel.findOne({ userId }).lean();
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      return res.json({ ok: true, wallet });
    }

    const wallet = data.wallets.find(w => w.userId === userId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json({ ok: true, wallet });
  } catch (err) {
    console.error('Error fetching wallet:', err);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

module.exports = router;
