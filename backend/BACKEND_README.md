# FintechApp - MERN Backend

A complete MERN stack backend for a fintech application with user authentication, KYC management, merchant onboarding, and transaction handling.

## Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (optional) + File-based DB (fallback)
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer

## Project Structure

```
src/
├── config.js                 # Configuration management
├── db.js                     # File-based database
├── mongo.js                  # MongoDB connection & schemas
├── middleware/
│   └── auth.js              # JWT authentication middleware
└── routes/
    ├── auth.js              # Authentication endpoints
    ├── kyc.js               # KYC (Know Your Customer) endpoints
    ├── merchant.js          # Merchant onboarding endpoints
    ├── transactions.js      # Transaction history endpoints
    └── transfers.js         # Fund transfer endpoints
```

## Installation

1. **Clone and navigate to project**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update values
```

4. **Start the server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:4000` (or port specified in `.env`)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /verify-otp` - Verify OTP
- `POST /reset` - Password reset request
- `POST /set-pin` - Set transaction PIN

### KYC (`/api/kyc`)
- `POST /upload` - Upload KYC documents
- `GET /:userId/status` - Check KYC status

### Merchant (`/api/merchant`)
- `POST /onboard` - Onboard merchant
- `POST /generate-qr` - Generate payment QR code
- `GET /:id/payments` - Get merchant payments

### Transfers (`/api/transfers`)
- `POST /wallet` - Wallet-to-wallet transfer
- `POST /bank` - Bank transfer
- `GET /history` - Transaction history

### Transactions (`/api/transactions`)
- `GET /` - List transactions (with filters)
- `GET /:id` - Get transaction details

## Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database (optional - uses file-based DB if not set)
MONGO_URI=mongodb://localhost:27017/fintechapp

# JWT
JWT_SECRET=your-secret-key-here

# File Uploads
UPLOAD_DIR=uploads

# CORS
CORS_ORIGIN=*
```

## Database Options

### Option 1: File-based Database (Default)
- Uses JSON file storage (`data.json`)
- No setup required
- Perfect for development and testing
- Data persists in `data.json`

### Option 2: MongoDB
- Set `MONGO_URI` environment variable
- Automatically uses MongoDB models when connected
- Better for production

## Features

✅ User authentication with JWT
✅ Password hashing with bcryptjs
✅ File upload handling
✅ KYC document verification
✅ Merchant onboarding
✅ Money transfers
✅ Transaction management
✅ Dual database support (File-based + MongoDB)
✅ CORS enabled
✅ Error handling

## Development

### Watch mode (auto-reload)
```bash
npm run dev
```

### Test endpoints
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"John Doe","email":"john@example.com","phone":"9999999999","password":"123456"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"john@example.com","password":"123456"}'

# Health check
curl http://localhost:4000/api/health
```

## Security Notes

⚠️ **Development Only**: Default JWT secret is for development. Change `JWT_SECRET` in `.env` for production.

⚠️ **CORS**: Default allows all origins. Restrict `CORS_ORIGIN` in production.

⚠️ **File Uploads**: Implement file validation and size limits in production.

## License

MIT
