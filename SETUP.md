# Setup Instructions - Early Pregnancy Prevention App

Complete setup guide for the Early Pregnancy Prevention mobile app with Node.js backend.

## System Requirements

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** v6.0 or higher (local) OR MongoDB Atlas account
- **Expo CLI:** Latest version
- **Mobile Device:** iOS/Android phone with Expo Go app OR emulator

## Step-by-Step Setup

### 1. Install Global Dependencies

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
node --version
npm --version
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended for Development)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier)
3. Create database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/pregnancy-app`

#### Option B: Local MongoDB

```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Linux
sudo apt-get install mongodb
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
# Install and run as service
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file
nano .env  # or use any text editor
```

**Configure `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-very-secret-random-string-change-this
FRONTEND_URL=http://localhost:8081
```

**Generate a secure JWT secret:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Start the backend server:**
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm run build
npm start
```

**Verify backend is running:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"Early Pregnancy Prevention API is running",...}
```

### 4. Mobile App Setup

```bash
# Navigate to mobile directory
cd ../mobile

# Install dependencies
npm install

# Configure API URL (if needed)
# Edit src/services/api.ts and update API_URL
```

**Start the mobile app:**
```bash
npm start
```

This will:
1. Start Metro bundler
2. Open Expo Developer Tools in browser
3. Display QR code

### 5. Testing on Device/Emulator

#### Option A: Physical Device (Easiest)

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code displayed in terminal/browser
3. App will load on your device

**Important for Physical Device:**
- Your phone and computer must be on the same WiFi network
- Update `API_URL` in `mobile/src/services/api.ts` to your computer's local IP:
  ```typescript
  const API_URL = __DEV__
    ? 'http://192.168.1.X:5000/api'  // Replace X with your IP
    : 'https://your-production-api.com/api';
  ```

**Find your local IP:**
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

#### Option B: iOS Simulator (macOS only)

1. Install Xcode from Mac App Store
2. Install Command Line Tools: `xcode-select --install`
3. Press `i` in Expo CLI or click "Run on iOS simulator"

#### Option C: Android Emulator

1. Install Android Studio
2. Set up Android emulator via AVD Manager
3. Press `a` in Expo CLI or click "Run on Android device/emulator"

### 6. Create Test Account

1. Open the mobile app
2. Click "Create New Account"
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Accept terms and create account
5. You should be logged in automatically

### 7. Verify Everything Works

**Check Backend:**
```bash
# In backend directory
npm run dev

# You should see:
# ✅ MongoDB Connected: ...
# 🚀 Server running on port 5000
```

**Check Mobile App:**
- Can create account
- Can login
- Dashboard loads with user name
- Navigation between tabs works

## Common Issues & Solutions

### Backend Won't Start

**Issue:** `MongoDB Connection Error`
- **Solution:** Check MongoDB is running and connection string is correct
- **Solution:** For Atlas, verify IP whitelist and user credentials

**Issue:** `Port 5000 already in use`
- **Solution:** Change PORT in `.env` file to different port (e.g., 5001)
- **Solution:** Or kill process using port: `lsof -ti:5000 | xargs kill`

### Mobile App Issues

**Issue:** Can't connect to backend
- **Solution:** Update API_URL in `mobile/src/services/api.ts` with correct IP
- **Solution:** Ensure phone and computer on same WiFi
- **Solution:** Check backend is running (`curl http://localhost:5000/api/health`)

**Issue:** Metro bundler cache issues
- **Solution:** Clear cache: `expo start -c`

**Issue:** Dependencies not installing
- **Solution:** Delete `node_modules` and `package-lock.json`, run `npm install` again
- **Solution:** Try using `yarn` instead of `npm`

### iOS Simulator Issues

**Issue:** Simulator not appearing
- **Solution:** Open Xcode → Preferences → Locations → verify Command Line Tools selected
- **Solution:** Run: `sudo xcode-select --switch /Applications/Xcode.app`

### Android Emulator Issues

**Issue:** Emulator won't start
- **Solution:** Check Android Studio AVD Manager
- **Solution:** Ensure virtualization enabled in BIOS
- **Solution:** Try creating new virtual device

## Development Workflow

### 1. Start Development Session

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Mobile
cd mobile
npm start
```

### 2. Making Changes

- **Backend:** Changes auto-reload with `ts-node-dev`
- **Mobile:** Shake device → "Reload" or press `r` in terminal

### 3. Testing Features

Test the following features work:
- [ ] User registration
- [ ] User login
- [ ] Dashboard displays correctly
- [ ] Progress tracking updates
- [ ] Goals CRUD operations
- [ ] Quiz submission
- [ ] Navigation between screens

## Next Steps

1. **Implement remaining screens:**
   - FAQ Screen
   - Myth Busting Screen
   - Anonymous Chat
   - Health Services
   - Goals Management
   - Videos
   - Quiz & Games

2. **Add features:**
   - Push notifications
   - Offline support
   - Image uploads
   - Real-time chat

3. **Deploy to production:**
   - Backend: Deploy to Heroku/Railway/DigitalOcean
   - Database: MongoDB Atlas production cluster
   - Mobile: Build with EAS and deploy to App Store/Play Store

## Getting Help

If you encounter issues:

1. Check this SETUP.md file
2. Review backend/README.md and mobile/README.md
3. Check console logs for errors
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed

## Project Team

- Mercy Wanjiku
- Mary Muthoni
- Kiambu Township Junior School
- Young Scientist Kenya 2026
