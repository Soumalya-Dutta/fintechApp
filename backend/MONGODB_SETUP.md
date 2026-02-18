# MongoDB Setup Guide for FintechApp

Your FintechApp is now configured to use **MongoDB** exclusively for data storage. No more JSON file storage!

## Prerequisites

You need one of the following:

### Option 1: Local MongoDB (Recommended for Development)

1. **Download and Install MongoDB Community Edition**
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/
   - Linux: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

2. **Start MongoDB Service**
   - Windows: MongoDB should start automatically
   - Mac/Linux: Run `mongod` in terminal

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)

## Configuration

### Step 1: Update `.env` file

Edit `backend/.env` with your MongoDB connection string:

**For Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/fintechapp
PORT=4000
```

**For MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fintechapp?retryWrites=true&w=majority
PORT=4000
```

> Replace `username`, `password`, and `cluster` with your actual credentials from MongoDB Atlas

### Step 2: Verify MongoDB is Running

- **Local MongoDB**: Run `mongod` in a separate terminal
- **MongoDB Atlas**: It's always running (cloud service)

### Step 3: Start the Backend

```bash
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on http://localhost:4000
```

## Data Collections

Your MongoDB database `fintechapp` will automatically have these collections:

| Collection | Purpose |
|-----------|---------|
| `users` | User accounts with email, phone, password, PIN |
| `kycs` | KYC documents and verification status |
| `merchants` | Merchant account information |
| `transactions` | Transaction history |
| `wallets` | User wallet balances |

## Data Stored in MongoDB

When users:
- **Register** → User data saved to `users` collection
- **Login** → Credentials verified against MongoDB
- **Set PIN** → PIN saved to `users` collection
- **Upload KYC** → Files metadata saved to `kycs` collection
- **Create Wallet** → Wallet created in `wallets` collection

## Troubleshooting

### Error: "Failed to connect to MongoDB"
- ✓ Ensure MongoDB is running locally with `mongod`
- ✓ Check `MONGO_URI` in `.env` is correct
- ✓ For Atlas, verify IP whitelist includes your machine

### Error: "User not found" or Registration Issues
- ✓ Restart the backend server
- ✓ Verify MongoDB connection
- ✓ Check that the database `fintechapp` exists (MongoDB creates it automatically)

### Port Already in Use
- Change `PORT` in `.env` to an available port (e.g., 4001)

## Verifying Data in MongoDB

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect using your `MONGO_URI`
3. Browse collections and documents

### Using MongoDB Shell (CLI)
```bash
mongosh "mongodb://localhost:27017/fintechapp"
# Then run queries like:
db.users.find()
db.wallets.find()
```

## Migration from JSON to MongoDB

Your old `data.json` file is no longer used. All data is now stored in MongoDB!

---

**Your FintechApp is now MongoDB-powered! 🚀**
