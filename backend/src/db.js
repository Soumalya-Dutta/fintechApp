const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data.json');

let data = {
  users: [],
  kyc: [],
  merchants: [],
  transactions: [],
  wallets: []
};

function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      data = JSON.parse(raw);
    } else {
      persist();
    }
  } catch (e) {
    console.warn('DB load failed, starting with empty DB');
  }
}

function persist() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn('DB persist failed', e.message);
  }
}

load();

module.exports = {
  data,
  persist
};
