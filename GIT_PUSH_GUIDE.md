# GitHub Push Instructions

## Prerequisites
- GitHub account created
- Git installed on your machine

## Step-by-Step Guide

### 1. Create GitHub Repository
- Go to https://github.com/new
- **Repository name**: `fintechApp`
- **Description**: Fintech Application - Wallet & Payment System
- **Visibility**: Public or Private (your choice)
- **Skip**: Do NOT initialize with README, .gitignore, or license
- Click **Create repository**

### 2. Copy Repository URL
After creating the repo, you'll see a page with your repo URL. Copy the **HTTPS** URL.
- It looks like: `https://github.com/YOUR-USERNAME/fintechApp.git`

### 3. Push Your Code (Run these commands)

Open PowerShell and navigate to the project:
```powershell
cd "c:\Users\user\OneDrive\Desktop\fintechApp4"
```

Add GitHub remote:
```powershell
git remote add origin https://github.com/YOUR-USERNAME/fintechApp.git
```

Verify remote is added:
```powershell
git remote -v
```

Push to main branch:
```powershell
git branch -M main
git push -u origin main
```

**Note**: The first push might prompt for GitHub authentication. Follow the browser prompt or use a Personal Access Token.

### 4. Verify Upload
- Go to your GitHub repo URL: `https://github.com/YOUR-USERNAME/fintechApp`
- You should see all your files and folder structure

## Troubleshooting

### If authentication fails:
1. Use GitHub CLI: `gh auth login`
2. Or generate a Personal Access Token at https://github.com/settings/tokens
3. Use token as password when prompted

### If remote already exists:
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/fintechApp.git
```

### Check current status:
```powershell
git status
git log --oneline
git remote -v
```

## Project Structure in Repo
```
fintechApp/
├── backend/               # Express.js API server
│   ├── src/              # Routes, models, middleware
│   ├── server.js         # Entry point
│   └── package.json
├── frontend/             # Vanilla HTML/CSS/JS
│   ├── auth/             # Login, register, PIN, OTP
│   ├── profile/          # User profile management
│   ├── transfers/        # Payment transfers
│   ├── transactions/     # Transaction history
│   ├── merchant/         # Merchant dashboard
│   └── index.html        # Landing page
└── README.md             # Project documentation
```

## After Push
You can update your local setup with:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@github.com"
```

For future commits:
```powershell
git add .
git commit -m "Descriptive message"
git push
```
