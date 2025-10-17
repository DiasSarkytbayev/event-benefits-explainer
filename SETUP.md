# Harbour.Space Events Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Google Gemini API key
- Cloudinary account (optional, for image uploads)

---

## 📦 Step 1: Install Dependencies

```bash
cd c:\Users\Dias\CascadeProjects\event-benefits-explainer
npm install
```

---

## 🔑 Step 2: Setup Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Fill in your `.env` file with actual values:

### Required Variables:

#### **Google Gemini API Key**
```env
GOOGLE_GEMINI_API_KEY=your_actual_key_here
```
- Get it at: https://makersuite.google.com/app/apikey
- Free tier: 60 requests per minute

#### **MongoDB Database**
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/harbour-events
```
- Sign up at: https://www.mongodb.com/cloud/atlas/register
- Free tier: 512MB storage
- Create a cluster and get connection string

#### **JWT Secret**
```env
JWT_SECRET=generate_a_long_random_string_here
```
- Use a password generator or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### **Cloudinary (Optional - for image uploads)**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- Sign up at: https://cloudinary.com
- Free tier: 25GB storage + 25GB bandwidth

---

## 🗄️ Step 3: Setup MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Paste into `.env` as `DATABASE_URL`

### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Then use:
DATABASE_URL=mongodb://localhost:27017/harbour-events
```

---

## 🎯 Step 4: Run the Application

### Start Backend Server:
```bash
npm run server
```

You should see:
```
✅ MongoDB Connected: cluster0.mongodb.net
✅ Server running on http://localhost:3001
✅ Gemini API: Connected
```

### Start Frontend (in a new terminal):
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

---

## 👤 Step 5: Create Admin Account

### Method 1: Via API (Postman/Thunder Client)

**POST** `http://localhost:3001/api/auth/register`

```json
{
  "email": "admin@harbour.space",
  "password": "admin123456",
  "role": "admin",
  "profile": {
    "firstName": "Admin",
    "lastName": "User",
    "isStaff": true,
    "department": "Administration",
    "position": "Administrator",
    "interests": ["technology", "education"],
    "location": "Barcelona"
  }
}
```

### Method 2: Via MongoDB Compass

1. Connect to your database
2. Find the `users` collection
3. Update a user's `role` field to `"admin"`

---

## 📱 Step 6: Test the Application

### 1. Register a Student Account:
```json
{
  "email": "student@harbour.space",
  "password": "student123",
  "role": "student",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "isStudent": true,
    "faculty": "Computer Science",
    "course": 2,
    "major": "Data Science",
    "interests": ["AI", "machine learning", "data science"],
    "location": "Barcelona"
  }
}
```

### 2. Login:
```json
{
  "email": "student@harbour.space",
  "password": "student123"
}
```

Save the returned `token` for authenticated requests.

### 3. Create an Event (as Admin):
**POST** `http://localhost:3001/api/events`

Headers:
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

Body:
```json
{
  "title": "AI & Machine Learning Workshop",
  "description": "Learn the fundamentals of AI and ML with hands-on projects",
  "image": "https://example.com/image.jpg",
  "date": "2025-11-01T10:00:00Z",
  "location": "Harbour.Space Campus, Barcelona",
  "category": ["technology", "workshop"],
  "targetAudience": ["students", "faculty:computer-science"],
  "price": 0,
  "maxParticipants": 50
}
```

### 4. Get AI Analysis (as Student):
**POST** `http://localhost:3001/api/ai-analysis/EVENT_ID`

Headers:
```
Authorization: Bearer YOUR_STUDENT_TOKEN
```

---

## 🏗️ Project Structure

```
event-benefits-explainer/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Event.js             # Event schema
│   │   └── Registration.js      # Registration schema
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── events.js            # Event CRUD
│   │   └── ai-analysis.js       # AI analysis
│   ├── services/
│   │   ├── geminiService.js     # Gemini AI integration
│   │   └── cloudinaryService.js # Image uploads
│   └── server.js                # Main server file
├── src/                         # React frontend (to be built)
└── .env                         # Environment variables
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Check your `DATABASE_URL` in `.env` file

### Gemini API Error
```
Error: API key not valid
```
**Solution**: Verify your `GOOGLE_GEMINI_API_KEY` in `.env`

### JWT Error
```
Error: jwt malformed
```
**Solution**: Make sure you're sending the token in the format: `Bearer YOUR_TOKEN`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**: Change `PORT` in `.env` or kill the process using port 3001

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- Body: `{ email, password, role, profile }`
- Returns: `{ user, token }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ user, token }`

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer TOKEN`
- Returns: `{ user }`

### Event Endpoints

#### Get All Events
- **GET** `/api/events?category=technology&upcoming=true`
- Public access
- Returns: `{ events }`

#### Get Single Event
- **GET** `/api/events/:id`
- Public access
- Returns: `{ event }`

#### Create Event (Admin)
- **POST** `/api/events`
- Headers: `Authorization: Bearer ADMIN_TOKEN`
- Body: Event data
- Returns: `{ event }`

#### Register for Event
- **POST** `/api/events/:id/register`
- Headers: `Authorization: Bearer TOKEN`
- Returns: `{ registration }`

### AI Analysis Endpoint

#### Get Personalized Analysis
- **POST** `/api/ai-analysis/:eventId`
- Headers: `Authorization: Bearer TOKEN`
- Returns: `{ analysis, benefits, recommendations }`

---

## 🎨 Next Steps

1. Build the React frontend pages
2. Implement admin panel UI
3. Add event listing page
4. Create event detail page with AI analysis button
5. Make UI responsive for mobile

---

## 📞 Support

If you encounter any issues, check:
1. All environment variables are set correctly
2. MongoDB is connected
3. API keys are valid
4. Node.js version is 18+

---

## 🔐 Security Notes

- Never commit `.env` file to Git
- Use strong JWT secret in production
- Enable MongoDB IP whitelist in production
- Use HTTPS in production
- Implement rate limiting for API endpoints

---

Happy coding! 🚀
