const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { validateEmail, validateIndianPhone, normalizeIndianPhone, validatePassword } = require('../validators');
const mongo = require('../mongo');
const { secret } = require('../middleware/auth');
const router = express.Router();

const UserModel = mongo.models.User;

const getPhoneVariants = (phone) => {
  const normalized = normalizeIndianPhone(phone);
  if (!normalized) return [];
  return [normalized, `+91${normalized}`];
};

const findUserByIdentifier = async (identifier) => {
  const conditions = [];
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    conditions.push({ _id: identifier });
  }
  conditions.push({ id: identifier });
  conditions.push({ email: identifier });
  const phoneVariants = getPhoneVariants(identifier);
  if (phoneVariants.length) {
    conditions.push({ phone: { $in: phoneVariants } });
  }
  return UserModel.findOne({ $or: conditions });
};

// Register with validation - MongoDB ONLY
router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;
    if (!email && !phone) return res.status(400).json({ error: 'Email or phone required' });
    
    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate phone if provided
    if (phone && !validateIndianPhone(phone)) {
      return res.status(400).json({ error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9' });
    }

    const phoneVariants = phone ? getPhoneVariants(phone) : [];
    const phoneToStore = phoneVariants.length ? phoneVariants[1] : '';
    
    // Validate password
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user already exists
    const existsConditions = [];
    if (email) existsConditions.push({ email });
    if (phoneVariants.length) existsConditions.push({ phone: { $in: phoneVariants } });
    const exists = await UserModel.findOne({ $or: existsConditions }).lean();
    if (exists) return res.status(409).json({ error: 'User already exists' });
    
    // Hash password and create user
    const hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ 
      fullname, 
      email, 
      phone: phoneToStore,
      password: hash,
      id: `u_${Date.now()}`
    });
    
    res.json({ ok: true, user: { id: user._id, fullname, email, phone } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login with validation - MongoDB ONLY
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Validate identifier (email or phone)
    const isEmail = validateEmail(identifier);
    const isPhone = validateIndianPhone(identifier);
    if (!isEmail && !isPhone) {
      return res.status(400).json({ error: 'Invalid email or phone number format' });
    }
    
    // Validate password is provided
    if (!password) return res.status(400).json({ error: 'Password is required' });
    
    // Find user
    const phoneVariants = isPhone ? getPhoneVariants(identifier) : [];
    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        ...(phoneVariants.length ? [{ phone: { $in: phoneVariants } }] : [])
      ]
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Compare password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '7d' });
    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || ''
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// OTP verification - MongoDB ONLY
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) return res.status(400).json({ error: 'Email/phone and OTP required' });
    
    // Validate identifier format
    const isEmail = validateEmail(identifier);
    const isPhone = validateIndianPhone(identifier);
    if (!isEmail && !isPhone) {
      return res.status(400).json({ error: 'Invalid email or phone number format' });
    }
    
    const phoneVariants = isPhone ? getPhoneVariants(identifier) : [];
    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        ...(phoneVariants.length ? [{ phone: { $in: phoneVariants } }] : [])
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ ok: true, message: 'OTP accepted' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Password reset - MongoDB ONLY
router.post('/reset', async (req, res) => {
  try {
    const { identifier } = req.body;
    
    // Validate identifier format
    const isEmail = validateEmail(identifier);
    const isPhone = validateIndianPhone(identifier);
    if (!isEmail && !isPhone) {
      return res.status(400).json({ error: 'Invalid email or phone number format' });
    }
    
    const phoneVariants = isPhone ? getPhoneVariants(identifier) : [];
    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        ...(phoneVariants.length ? [{ phone: { $in: phoneVariants } }] : [])
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.json({ ok: true, resetToken: token });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Get profile - MongoDB ONLY
router.get('/profile/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier) return res.status(400).json({ error: 'User identifier required' });

    const user = await findUserByIdentifier(identifier);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      ok: true,
      user: {
        id: user._id,
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || ''
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile - MongoDB ONLY
router.put('/profile/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { fullname, email, phone } = req.body;
    if (!identifier) return res.status(400).json({ error: 'User identifier required' });

    const user = await findUserByIdentifier(identifier);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const nextFullname = typeof fullname === 'string' ? fullname.trim() : user.fullname;
    const nextEmail = typeof email === 'string' ? email.trim() : user.email;
    const rawPhone = typeof phone === 'string' ? phone.trim() : user.phone;

    if (!nextFullname || nextFullname.length < 3) {
      return res.status(400).json({ error: 'Full name must be at least 3 characters' });
    }
    if (nextEmail && !validateEmail(nextEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (rawPhone && !validateIndianPhone(rawPhone)) {
      return res.status(400).json({ error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9' });
    }

    const normalizedPhone = rawPhone ? normalizeIndianPhone(rawPhone) : null;
    const nextPhone = normalizedPhone ? `+91${normalizedPhone}` : '';

    const duplicateChecks = [];
    if (nextEmail) duplicateChecks.push({ email: nextEmail });
    if (nextPhone) duplicateChecks.push({ phone: { $in: [normalizedPhone, nextPhone] } });
    if (duplicateChecks.length) {
      const exists = await UserModel.findOne({ _id: { $ne: user._id }, $or: duplicateChecks }).lean();
      if (exists) return res.status(409).json({ error: 'Email or phone already in use' });
    }

    user.fullname = nextFullname;
    user.email = nextEmail || '';
    user.phone = nextPhone;
    await user.save();

    return res.json({
      ok: true,
      user: {
        id: user._id,
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || ''
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Set PIN - MongoDB ONLY
router.post('/set-pin', async (req, res) => {
  try {
    const { id, pin } = req.body;
    if (!id) return res.status(400).json({ error: 'User identifier required' });
    if (!/^\d{4}$/.test(String(pin || ''))) {
      return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
    }
    
    const user = await findUserByIdentifier(String(id).trim());
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.pin = String(pin);
    await user.save();
    
    res.json({ ok: true });
  } catch (err) {
    console.error('Set PIN error:', err);
    res.status(500).json({ error: 'Failed to set PIN' });
  }
});

module.exports = router;
