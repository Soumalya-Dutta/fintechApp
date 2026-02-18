const mongoose = require('mongoose');
const { Schema } = mongoose;
const MONGO_URI = process.env.MONGO_URI || '';

async function connect() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI not set — MongoDB not connected. Falling back to file DB where available.');
    return null;
  }
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
  return mongoose.connection;
}

/* Schemas */
const UserSchema = new Schema({
  id: { type: String, index: true, unique: true },
  fullname: String,
  email: { type: String, index: true },
  phone: { type: String, index: true },
  password: String,
  pin: String,
  createdAt: { type: Date, default: Date.now }
});

const KYCSchema = new Schema({
  id: { type: String, index: true },
  userId: String,
  aadhaar: String,
  pan: String,
  files: Object,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const MerchantSchema = new Schema({
  id: { type: String, index: true },
  business_name: String,
  contact: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const TransactionSchema = new Schema({
  id: { type: String, index: true },
  from: String,
  to: String,
  merchantId: String,
  amount: Number,
  status: String,
  method: String,
  date: { type: Date, default: Date.now }
});

const WalletSchema = new Schema({
  userId: { type: String, index: true, unique: true },
  balance: { type: Number, default: 50000 },
  currency: { type: String, default: 'INR' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

/* Create and Export Models */
const models = {
  User: mongoose.model('User', UserSchema),
  KYC: mongoose.model('KYC', KYCSchema),
  Merchant: mongoose.model('Merchant', MerchantSchema),
  Transaction: mongoose.model('Transaction', TransactionSchema),
  Wallet: mongoose.model('Wallet', WalletSchema)
};

module.exports = {
  connect,
  models
};
