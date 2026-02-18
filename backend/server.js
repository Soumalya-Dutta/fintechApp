const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const kycRoutes = require('./src/routes/kyc');
const merchantRoutes = require('./src/routes/merchant');
const transferRoutes = require('./src/routes/transfers');
const transactionRoutes = require('./src/routes/transactions');
const walletRoutes = require('./src/routes/wallet');
const mongo = require('./src/mongo');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from ../frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallet', walletRoutes);

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true, now: Date.now() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server - MongoDB connection is REQUIRED
(async () => {
  try {
    await mongo.connect();
    console.log('✓ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    console.error('Please ensure MongoDB is running and MONGO_URI is configured in .env file');
    process.exit(1);
  }
})();
