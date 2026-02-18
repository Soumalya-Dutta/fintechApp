// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Indian phone number validation (10 digits, starts with 6-9)
const normalizeIndianPhone = (phone) => {
  const cleaned = String(phone || '').replace(/\D/g, '');
  const tenDigit = cleaned.length === 12 && cleaned.startsWith('91') ? cleaned.slice(2) : cleaned;
  return /^[6-9]\d{9}$/.test(tenDigit) ? tenDigit : null;
};

const validateIndianPhone = (phone) => {
  return !!normalizeIndianPhone(phone);
};

// Password validation (minimum 6 characters, with uppercase, lowercase, and numeric)
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one numeric digit' };
  }
  return { valid: true };
};

module.exports = {
  validateEmail,
  validateIndianPhone,
  normalizeIndianPhone,
  validatePassword
};
