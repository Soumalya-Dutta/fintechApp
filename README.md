# FintechApp - Complete Structure

This project has been organized into **Backend** and **Frontend** folders for better project organization and separation of concerns.

## Project Structure

```
fintechApp3/
├── backend/                  # Node.js/Express backend server
│   ├── src/
│   │   ├── routes/          # API endpoints (auth, kyc, merchant, etc.)
│   │   ├── middleware/      # JWT authentication
│   │   ├── config.js        # Configuration
│   │   ├── db.js            # File-based database
│   │   └── mongo.js         # MongoDB schemas (optional)
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   ├── data.json            # File-based database store
│   └── BACKEND_README.md    # Backend documentation
│
├── frontend/                 # HTML/CSS/JavaScript frontend
│   ├── assets/              # Stylesheets and static files
│   ├── photo_assets/        # Images
│   ├── auth/                # Authentication pages
│   ├── kyc/                 # KYC verification pages
│   ├── merchant/            # Merchant onboarding pages
│   ├── profile/             # User profile pages
│   ├── transactions/        # Transaction history pages
│   ├── transfers/           # Fund transfer pages
│   ├── index.html           # Main landing page
│   └── README.md            # Frontend documentation
│
└── uploads/                 # File uploads (created at runtime)
```

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:4000` by default.

### Frontend Setup

Simply open `frontend/index.html` in your browser, or serve it using a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server frontend
```

Then visit `http://localhost:8000` (or your configured port).

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (optional) + File-based JSON DB (default)
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Dev Tools**: Nodemon

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **JavaScript**: Vanilla JS (no frameworks)
- **Design**: Dark theme with purple accents

## API Architecture

The backend serves both API endpoints and static frontend files.

### API Base URL
```
http://localhost:4000/api
```

### Main Endpoints

**Authentication** (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-otp` - OTP verification
- `POST /reset` - Password reset
- `POST /set-pin` - Set transaction PIN

**KYC** (`/api/kyc`)
- `POST /upload` - Upload documents
- `GET /:userId/status` - Check status

**Merchant** (`/api/merchant`)
- `POST /onboard` - Onboard merchant
- `POST /generate-qr` - Generate QR code
- `GET /:id/payments` - Get payments

**Transfers** (`/api/transfers`)
- `POST /wallet` - Wallet transfer
- `POST /bank` - Bank transfer
- `GET /history` - Transfer history

**Transactions** (`/api/transactions`)
- `GET /` - List transactions
- `GET /:id` - Get transaction details

**Wallet** (`/api/wallet`)
- `GET /balance` - Get balance
- `POST /deduct` - Deduct amount
- `POST /add` - Add amount
- `GET /:userId` - Get wallet details

## Database

### File-based Database (Default)
- **Location**: `backend/data.json`
- **No setup required** - perfect for development
- **Automatically created** on first run

### MongoDB (Optional)
- Set `MONGO_URI` environment variable
- Automatically switches to MongoDB models when configured
- Better for production environments

## Configuration

Create a `.env` file in the `backend` folder:

```env
# Server
PORT=4000
NODE_ENV=development

# Database (optional)
MONGO_URI=

# JWT
JWT_SECRET=your-secret-key-here

# File Uploads
UPLOAD_DIR=uploads

# CORS
CORS_ORIGIN=*
```

## Features

✅ User authentication with JWT  
✅ Password hashing (bcryptjs)  
✅ File upload handling  
✅ KYC document verification  
✅ Merchant onboarding  
✅ Wallet management  
✅ Fund transfers (wallet/bank/UPI)  
✅ Transaction history tracking  
✅ Dual database support  
✅ Responsive design  
✅ Dark theme UI  

## Development

### Running Both Server and Frontend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (optional, if not using npm server):**
```bash
cd frontend
# Serve using your preferred tool or just open index.html
```

## Security Notes

⚠️ **Development Only**: Change JWT_SECRET in production  
⚠️ **CORS**: Restrict CORS_ORIGIN in production  
⚠️ **File Uploads**: Add validation in production  

## Troubleshooting

**Port 4000 already in use?**
```bash
# Change PORT in .env
PORT=5000
```

**Cannot find modules?**
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
```

**File permissions error?**
```bash
# Create uploads folder
mkdir backend/uploads
```

## License

MIT

## Support

For issues or questions, refer to the documentation in:
- Backend: `backend/BACKEND_README.md`
- Frontend: `frontend/README.md`
