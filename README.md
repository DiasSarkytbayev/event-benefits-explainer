# 🎓 Harbour.Space Event Benefits Explainer 🎯

**Harbour.Space University - Complete Event Management Platform**

An AI-powered full-stack web application that combines event management with intelligent parsing and personalized analysis using Groq AI. Discover events, register, and understand their benefits tailored to your academic profile.

## ✨ Core Features

### 🎯 **Dual Platform**
1. **Event Parser** (Landing Page) - Parse external events from URL/Screenshot/Text
2. **Event Management** (Internal) - Full CRUD for Harbour.Space events

### 👥 **Multi-Role System**
- **Students** - Register for events, get personalized AI insights
- **Staff** - Create events, manage registrations
- **Admins** - Full control (edit/delete events, view analytics)

### 🤖 **Smart AI Analysis (Groq)**
- **Personalized insights** based on your major, degree, and interests
- **Context-aware** - Mentions academic connections when relevant
- **Honest analysis** - No forced connections for non-relevant events
- **100% English** responses with multiple enforcement layers

### 📅 **Complete Event Lifecycle**
- **Discover** - Search & filter events (upcoming/past)
- **Register** - One-click registration with status tracking
- **Unregister** - Easy cancellation with confirmation
- **Analyze** - AI-powered benefit analysis
- **Manage** - Create, edit (admin), delete events

### 👤 **Profile Management**
- **Edit Profile** - Update academic info, interests, bio
- **Degree Tracking** - Bachelor, Master's, PhD options
- **Personalization** - AI uses profile for tailored recommendations

### 🎨 **Modern UI/UX**
- **Blur backgrounds** for event images (no distortion)
- **Color-coded cards** for quick information scanning
- **Blue-themed search** bar for consistency
- **Responsive design** for all devices

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (fast build tool)
- TailwindCSS (styling)
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- **Groq AI** (llama-3.3-70b-versatile)
- JWT Authentication
- Multer (file uploads)
- Cheerio (URL parsing)
- Tesseract.js (OCR)
- bcrypt (password hashing)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB: https://www.mongodb.com/try/download/community
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string

### 3. Get Groq API Key (FREE)

1. Go to https://console.groq.com/
2. Sign up (free)
3. Create API key
4. Copy the key

### 4. Configure Environment Variables

Create `.env` file in root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/event-benefits

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-this

# AI Service
GROQ_API_KEY=gsk_your_groq_api_key_here

# Server
PORT=5000
NODE_ENV=development
```

### 5. Run the Application

**Development Mode** (runs both frontend + backend):
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 6. Create First Admin User

After registering a user, promote to admin:
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## 📖 Usage Guide

### 🏠 Landing Page - Event Parser
Parse external events from any source:

**Method 1: URL Parsing**
1. Paste event URL (Eventbrite, Meetup, etc.)
2. Click "Parse"
3. Get extracted event data + AI analysis

**Method 2: Screenshot Upload**
1. Upload event poster/flyer image
2. OCR extracts text
3. AI analyzes and provides insights

**Method 3: Manual Text**
1. Copy-paste event description
2. AI processes and analyzes
3. Get personalized recommendations

### 🎓 Internal Platform - Event Management

**For Students:**
1. **Register** → Create account with major, degree
2. **Browse Events** → Search and filter
3. **View Details** → See event info
4. **Register** → One-click registration
5. **AI Analysis** → Get personalized insights
6. **Edit Profile** → Update your info

**For Staff:**
- Everything students can do, PLUS:
- **Create Events** → Add new events

**For Admins:**
- Everything staff can do, PLUS:
- **Edit Events** → Modify any event
- **Delete Events** → Remove events
- **Admin Panel** → View analytics

## 🤖 AI Analysis Features

### Personalized Output:
- ✅ **Summary** - Why this event matters to YOU
- ✅ **Benefits** - 4 specific advantages
- ✅ **Skills Development** - 4 skills you'll gain
- ✅ **Career Impact** - Realistic assessment
- ✅ **Recommendations** - 3 actionable steps
- ✅ **Networking** - Opportunity description

### Smart Relevance Detection:
```
IF event matches your field:
  → "As a Master's in Data Science student, 
     this ML workshop will help you..."
     
IF event doesn't match:
  → "While not directly related to your major,
     this offers great networking opportunities..."
```

## 🔌 Key API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

**Events:**
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (staff/admin)
- `PUT /api/events/:id` - Update event (admin)
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/unregister` - Cancel registration
- `GET /api/events/:id/check-registration` - Check status

**Event Parsing:**
- `POST /api/parse/url` - Parse event URL
- `POST /api/parse/file` - Parse screenshot/file
- `POST /api/parse/text` - Parse text

**AI Analysis:**
- `POST /api/ai-analysis/:eventId` - Get personalized analysis

*Full API documentation: see `FINAL_DOCUMENTATION.md`*

## 📂 Project Structure

```
event-benefits-explainer/
├── src/                          # Frontend
│   ├── components/
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx             # Event Parser
│   │   ├── Events.tsx           # Event Discovery
│   │   ├── EventDetail.tsx      # Event Details
│   │   ├── CreateEvent.tsx      # Create Event
│   │   ├── EditEvent.tsx        # Edit Event (Admin)
│   │   ├── EditProfile.tsx      # Edit Profile
│   │   ├── Login.tsx            # Login
│   │   └── Register.tsx         # Registration
│   ├── store/
│   │   └── authStore.ts         # Auth State
│   └── lib/
│       └── api.ts               # API Client
├── server/                       # Backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── parse.js
│   │   └── aiAnalysis.js
│   ├── services/
│   │   └── groqService.js
│   └── middleware/
│       └── auth.js
└── Documentation/
    ├── FINAL_DOCUMENTATION.md   # Complete docs
    ├── AI_ANALYSIS_IMPROVEMENTS.md
    └── CHANGELOG_AI_IMPROVEMENTS.md
```

## 🔒 Security

✅ **Implemented:**
- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- CORS configuration
- File upload restrictions

## 📚 Documentation

- **README.md** (this file) - Quick start guide
- **FINAL_DOCUMENTATION.md** - Complete system documentation
- **AI_ANALYSIS_IMPROVEMENTS.md** - AI optimization guide
- **CHANGELOG_AI_IMPROVEMENTS.md** - Recent updates
- **IMAGE_UPLOAD_GUIDE.md** - Image upload instructions

## 🎯 Key Features Checklist

- ✅ Event Parser (URL/Screenshot/Text)
- ✅ Event Management (CRUD)
- ✅ User Authentication (JWT)
- ✅ Multi-role System (Student/Staff/Admin)
- ✅ Event Registration System
- ✅ Unregistration with Confirmation
- ✅ Personalized AI Analysis
- ✅ Profile Management (with degree field)
- ✅ Admin Event Editing
- ✅ Search & Filter Events
- ✅ Upcoming/Past Event Separation
- ✅ Responsive Design
- ✅ Image Upload Support

## 🚀 Production Deployment

**Recommended:**
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (for images)

**Environment:**
```bash
NODE_ENV=production
MONGODB_URI=<your-atlas-connection-string>
JWT_SECRET=<strong-random-secret>
GROQ_API_KEY=<your-groq-key>
```

## 📄 License

MIT License - Free to use for educational purposes

## 💬 Support

**Questions?**
- Read `FINAL_DOCUMENTATION.md` for complete details
- Check API documentation section
- Review code comments

**Version**: 2.1.0  
**Last Updated**: October 2025  
**Status**: ✅ Production Ready
