# ⚡ Quick Start Guide - 5 Minutes to Launch!

## 🎯 What You Need

1. **MongoDB Database** (Free)
   - Sign up: https://www.mongodb.com/cloud/atlas/register
   - Create cluster → Get connection string

2. **Gemini API Key** (Free)
   - Get it: https://makersuite.google.com/app/apikey
   - 60 requests/minute free tier

3. **Cloudinary** (Optional, for images)
   - Sign up: https://cloudinary.com
   - Get credentials from dashboard

---

## 🚀 Launch in 5 Steps

### Step 1: Create `.env` file
```bash
# Copy and paste this into .env file in root directory
GOOGLE_GEMINI_API_KEY=paste_your_gemini_key_here
DATABASE_URL=paste_your_mongodb_connection_string_here
JWT_SECRET=any_long_random_string_here
PORT=3001
NODE_ENV=development
```

### Step 2: Create `.env.local` file
```bash
# Copy and paste this into .env.local file in root directory
VITE_API_URL=http://localhost:3001/api
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Backend
```bash
npm run server
```

Wait for:
```
✅ MongoDB Connected
✅ Server running on http://localhost:3001
```

### Step 5: Start Frontend (new terminal)
```bash
npm run dev
```

Open: **http://localhost:5173**

---

## 🎉 You're Done!

### First Time Setup:

1. **Go to** http://localhost:5173/register
2. **Create admin account:**
   - Email: admin@harbour.space
   - Password: admin123456
   - Select "Staff"
   - Fill in name and details
   - Click "Create Account"

3. **Create your first event:**
   - Click "Admin Panel" in navbar
   - Click "Create Event"
   - Fill in details
   - Add image URL (or use: https://picsum.photos/800/600)
   - Click "Create Event"

4. **Test AI Analysis:**
   - Go to "Events"
   - Click on your event
   - Click "AI Analysis" button
   - See personalized insights!

---

## 📱 Mobile Testing

Open on your phone: `http://YOUR_IP:5173`

To find your IP:
- Windows: `ipconfig` (look for IPv4)
- Mac/Linux: `ifconfig` (look for inet)

---

## 🆘 Quick Fixes

### Can't connect to MongoDB?
- Check your IP is whitelisted in MongoDB Atlas
- Or allow access from anywhere (0.0.0.0/0)

### Gemini API not working?
- Verify your API key is correct
- Check quota at https://makersuite.google.com

### Port 3001 already in use?
```bash
npx kill-port 3001
```

---

## 🎯 What You Can Do Now

✅ Register users (student/staff/admin)  
✅ Create and manage events  
✅ Get AI-powered event analysis  
✅ Register for events  
✅ Use on mobile devices  

---

## 📚 Need More Help?

- **Full Setup Guide**: See `SETUP.md`
- **Complete Documentation**: See `COMPLETE.md`
- **API Testing**: See `PROGRESS.md`

---

**That's it! You're ready to go! 🚀**
