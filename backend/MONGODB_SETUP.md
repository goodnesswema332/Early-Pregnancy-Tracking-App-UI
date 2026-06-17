# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up with Google/GitHub or email
3. Choose "Shared Cluster" (FREE tier - M0)

## Step 2: Create Your Cluster

1. Click "Build a Database"
2. Select "M0 Free" tier
3. Choose region: **Mumbai (ap-south-1)** or **Frankfurt (eu-central-1)** (closest to Kenya)
4. Name your cluster: `pregnancy-app-cluster`
5. Click "Create Cluster" (takes 1-3 minutes)

## Step 3: Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `app_user` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add your server's specific IP
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to **Database** → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials
7. Add database name before `?`:
   ```
   mongodb+srv://app_user:yourpassword@cluster0.xxxxx.mongodb.net/pregnancy-prevention-app?retryWrites=true&w=majority
   ```

## Step 6: Update Backend Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add:
   ```env
   MONGODB_URI=mongodb+srv://app_user:yourpassword@cluster0.xxxxx.mongodb.net/pregnancy-prevention-app?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   NODE_ENV=development
   ```

3. Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## Step 7: Test Connection

1. Start the backend:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB Connected: ac-xxxxx.mongodb.net
   Server running on port 5000
   ```

## Production Deployment Checklist

- [ ] Use a strong, unique JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Restrict Network Access to your server's IP only
- [ ] Enable MongoDB Atlas backups
- [ ] Set up monitoring alerts in Atlas
- [ ] Consider upgrading to M10 ($9/month) for production SLA

## Troubleshooting

**Connection timeout?**

- Check if your IP is whitelisted in Network Access
- Verify username/password are URL-encoded (special characters)

**Authentication failed?**

- Double-check the database user credentials
- Ensure user has correct permissions

**SSL/TLS errors?**

- The connection string should include `retryWrites=true&w=majority`

## MongoDB Atlas Dashboard Link

[https://cloud.mongodb.com](https://cloud.mongodb.com)
