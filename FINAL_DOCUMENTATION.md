# 📚 Harbour.Space Event Benefits Explainer - Final Documentation

## 🎯 Project Overview

**Harbour.Space Event Benefits Explainer** is a comprehensive event management platform designed specifically for Harbour.Space University. The platform combines event management with AI-powered analysis to help students and staff discover relevant events and understand their personalized benefits.

### Key Features:
- 🎨 **Dual Interface**: Event Parser (landing page) + Internal Event Management
- 🤖 **AI-Powered Analysis**: Personalized event benefits using Groq AI
- 👥 **Multi-Role System**: Student, Staff, and Admin roles
- 📅 **Complete Event Lifecycle**: Create, View, Edit, Register, and Analyze
- 🔐 **Secure Authentication**: JWT-based auth system
- 📊 **Profile Management**: Customizable user profiles with academic/professional data

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIENT (React + TypeScript)                │
├──────────────────────────────────────────────────────────────┤
│  Pages:                                                       │
│  • Home (Event Parser)       • Events (Discovery)            │
│  • EventDetail              • CreateEvent                    │
│  • EditEvent (Admin)        • EditProfile                    │
│  • Login / Register         • AdminPanel                     │
│  • AnalysisResult                                            │
├──────────────────────────────────────────────────────────────┤
│  State Management: Zustand                                    │
│  Routing: React Router                                        │
│  UI: Tailwind CSS + Lucide Icons                             │
└──────────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js + Express)                 │
├──────────────────────────────────────────────────────────────┤
│  Routes:                                                      │
│  • /api/auth          → Authentication                       │
│  • /api/events        → Event CRUD                           │
│  • /api/parse         → Event parsing (URL/File/Text)        │
│  • /api/ai-analysis   → AI event analysis                    │
│  • /api/upload        → Image uploads                        │
├──────────────────────────────────────────────────────────────┤
│  Services:                                                    │
│  • groqService.js     → AI analysis with Groq                │
│  • multer            → File upload handling                  │
├──────────────────────────────────────────────────────────────┤
│  Middleware:                                                  │
│  • protect           → JWT authentication                    │
│  • admin             → Admin-only access                     │
│  • optionalAuth      → Optional authentication               │
└──────────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                         │
├──────────────────────────────────────────────────────────────┤
│  Collections:                                                 │
│  • users             → User accounts & profiles              │
│  • events            → Event details                         │
│  • registrations     → Event registrations                   │
└──────────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                          │
├──────────────────────────────────────────────────────────────┤
│  • Groq API          → AI analysis (llama-3.3-70b)           │
│  • Tesseract OCR     → Image text extraction                 │
│  • Cheerio           → Web scraping                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
event-benefits-explainer/
│
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   └── Navbar.tsx           # Navigation with user menu + edit profile button
│   │
│   ├── lib/
│   │   └── api.ts               # API client (axios)
│   │
│   ├── pages/
│   │   ├── Home.tsx             # Event Parser (landing page)
│   │   ├── AnalysisResult.tsx   # Parsed event analysis
│   │   ├── Login.tsx            # User login
│   │   ├── Register.tsx         # User registration (with degree field)
│   │   ├── Events.tsx           # Event discovery (upcoming/past)
│   │   ├── EventDetail.tsx      # Event details + AI analysis + registration
│   │   ├── CreateEvent.tsx      # Create new event (admin/staff)
│   │   ├── EditEvent.tsx        # Edit event (admin only)
│   │   ├── EditProfile.tsx      # Edit user profile
│   │   └── AdminPanel.tsx       # Admin dashboard
│   │
│   ├── store/
│   │   └── authStore.ts         # Auth state management (Zustand)
│   │
│   ├── App.tsx                  # Main app with routing
│   └── main.tsx                 # Entry point
│
├── server/                       # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js              # User schema (with degree field)
│   │   ├── Event.js             # Event schema
│   │   └── Registration.js      # Registration schema
│   │
│   ├── routes/
│   │   ├── auth.js              # Auth routes + profile update
│   │   ├── events.js            # Event CRUD + register/unregister
│   │   ├── parse.js             # Event parsing (with personalization)
│   │   ├── aiAnalysis.js        # AI analysis routes
│   │   └── upload.js            # Image upload routes
│   │
│   ├── services/
│   │   └── groqService.js       # AI analysis with Groq (personalized)
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT auth middleware
│   │
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   │
│   └── server.js                # Server entry point
│
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── vite.config.ts               # Vite configuration
└── tailwind.config.js           # Tailwind CSS configuration
```

---

## 🔐 User Roles & Permissions

### 👤 **Student**
**Can:**
- View all events
- Register/unregister for events
- Get personalized AI analysis based on major/degree
- Edit own profile
- Parse external events

**Cannot:**
- Create events
- Edit events
- Access admin panel

### 👔 **Staff**
**Can:**
- Everything students can do
- Create new events
- Get personalized AI analysis based on department/position

**Cannot:**
- Edit events created by others
- Access admin panel

### 👑 **Admin**
**Can:**
- Everything staff can do
- **Edit ANY event** (including title, description, date, etc.)
- Delete events
- Access admin panel
- View all registrations

---

## 🎨 Key Features Breakdown

### 1️⃣ **Event Parser (Home Page)**

**Purpose**: Parse external event information from various sources

**Input Methods:**
- 📎 **URL**: Paste event website URL
- 📸 **Screenshot**: Upload event poster/flyer image
- ✍️ **Manual**: Paste event text

**AI Processing:**
- Extracts: Title, Date, Location, Description, Organizer
- Analyzes: Benefits, Skills, Career Impact, Recommendations
- **Personalization**: If logged in, AI considers user profile

**Technologies:**
- Cheerio (web scraping)
- Tesseract OCR (image text extraction)
- Groq AI (analysis)

---

### 2️⃣ **Event Management System**

#### **Event Discovery** (`/events`)
- **Search**: Real-time search by title/description (blue-themed search bar)
- **Filter**: By category (technology, business, design, etc.)
- **Sections**: 
  - 📅 **Upcoming Events** (ascending order)
  - 📚 **Past Events** (descending order, slightly faded)
- **Visual**: Event cards with image, date, location, price, capacity

#### **Event Detail** (`/events/:id`)
- **Hero Section**: 
  - Blur background effect
  - Main image (properly scaled, no distortion)
  - Category badges
  - **Admin**: Edit button (blue)
- **Information Cards**: Color-coded
  - 🔵 Date & Time
  - 🟣 Location
  - 🟢 Participants
  - 🟠 Entry Fee
- **Registration**:
  - Shows **"Register Now"** if not registered
  - Shows **"Already Registered"** + **"Cancel Registration"** if registered
  - Status persists on page refresh
  - Confirmation dialog for unregistration
- **AI Analysis Button**: Personalized insights

#### **Create Event** (`/create-event`)
- **Access**: Staff and Admin only
- **Fields**: Title, Description, Date, Location, Price, Max Participants, Categories, Image
- **Image Upload**: File upload (5MB max) OR URL
- **Categories**: Multi-select buttons

#### **Edit Event** (`/events/:id/edit`)
- **Access**: Admin only
- **Features**: Pre-filled form with existing data
- **Same UI**: As CreateEvent
- **Date Formatting**: Converts MongoDB date to HTML datetime-local format

---

### 3️⃣ **User Profile Management**

#### **Registration** (`/register`)
- **Fields**: Email, Password, Name, Role (Student/Staff)
- **Student-Specific**: Faculty, Course Year, Major, **Degree** (Bachelor/Master/PhD/Other)
- **Staff-Specific**: Department, Position
- **Common**: Interests, Location

#### **Edit Profile** (`/profile/edit`)
- **Access**: All logged-in users
- **Features**:
  - Update all profile fields except email
  - Pre-filled with current data
  - Role-specific sections (Student/Staff)
  - Settings icon in navbar

---

### 4️⃣ **AI Analysis**

#### **How It Works:**

```javascript
// Step 1: Check if event is relevant to user's profile
IF event.category matches user.major/field:
    → Personalized analysis with academic/career connections
    → Mentions user's degree, major, faculty
    → Specific benefits for their studies/career
ELSE:
    → General analysis (social, networking, work-life balance)
    → No forced academic connections
```

#### **Analysis Includes:**
- ✅ **Summary**: 2-3 sentences explaining value
- ✅ **Benefits**: 4 specific benefits
- ✅ **Skills Development**: 4 skills (can be soft skills)
- ✅ **Networking Opportunities**: Professional or social
- ✅ **Career Impact**: Realistic assessment
- ✅ **Recommendations**: 3 actionable steps

#### **Language Enforcement:**
- **100% English**: Multiple "CRITICAL" instructions in prompts
- No Russian or other languages

#### **Where It Works:**
- ✅ Event Detail page (`/events/:id`)
- ✅ Event Parser - URL (`/`)
- ✅ Event Parser - Screenshot (`/`)
- ✅ Event Parser - Text (`/`)

---

### 5️⃣ **Registration System**

#### **Features:**
- Check registration status on page load
- **Two States:**
  - Not registered: Blue "Register Now" button
  - Registered: Green "Already Registered" + Gray "Cancel Registration"
- Confirmation dialog for cancellation
- Real-time capacity tracking
- "Event Full" state handling

#### **Technical:**
```
GET  /api/events/:id/check-registration  → Check if user is registered
POST /api/events/:id/register            → Register for event
DELETE /api/events/:id/unregister        → Cancel registration
```

---

## 🔧 Technical Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Zustand | State management |
| React Router | Routing |
| Axios | HTTP client |
| date-fns | Date formatting |
| Lucide React | Icons |

### **Backend**
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Multer | File uploads |
| Groq SDK | AI analysis |
| Tesseract.js | OCR |
| Cheerio | Web scraping |

---

## 🚀 Setup & Installation

### **1. Prerequisites**
```bash
Node.js >= 18.x
MongoDB >= 5.x
```

### **2. Clone Repository**
```bash
git clone <repository-url>
cd event-benefits-explainer
```

### **3. Install Dependencies**
```bash
# Install all dependencies
npm install
```

### **4. Environment Variables**
Create `.env` file in root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/event-benefits

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# AI Service
GROQ_API_KEY=your-groq-api-key-here

# Server
PORT=5000
NODE_ENV=development
```

**Get API Keys:**
- **Groq**: https://console.groq.com/ (Free tier available)

### **5. Run the Application**

#### **Development Mode** (Frontend + Backend):
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

#### **Production Mode**:
```bash
# Build frontend
npm run build

# Start server
npm start
```

### **6. Create Admin User**

Use MongoDB or API to create first admin:
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@harbour.space" },
  { $set: { role: "admin" } }
)
```

---

## 📡 API Documentation

### **Authentication**

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@harbour.space",
  "password": "password123",
  "role": "student",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "isStudent": true,
    "faculty": "Computer Science",
    "course": 2,
    "major": "Data Science",
    "degree": "master",
    "interests": ["AI", "ML"],
    "location": "Barcelona"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@harbour.space",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "profile": {
    "bio": "Updated bio",
    "major": "Artificial Intelligence"
  }
}
```

---

### **Events**

#### Get All Events
```http
GET /api/events?category=technology&upcoming=false
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Staff/Admin)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI Workshop",
  "description": "Learn about AI...",
  "date": "2025-11-01T14:00:00",
  "location": "Campus Building A",
  "price": 0,
  "maxParticipants": 50,
  "category": ["technology", "workshop"],
  "image": "https://example.com/image.jpg"
}
```

#### Update Event (Admin)
```http
PUT /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 10
}
```

#### Delete Event (Admin)
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

#### Register for Event
```http
POST /api/events/:id/register
Authorization: Bearer <token>
```

#### Unregister from Event
```http
DELETE /api/events/:id/unregister
Authorization: Bearer <token>
```

#### Check Registration
```http
GET /api/events/:id/check-registration
Authorization: Bearer <token>

Response:
{
  "success": true,
  "isRegistered": true,
  "registration": { ... }
}
```

---

### **Event Parsing**

#### Parse URL
```http
POST /api/parse/url
Authorization: Bearer <token> (optional - for personalization)
Content-Type: application/json

{
  "url": "https://example.com/event"
}

Response:
{
  "success": true,
  "eventData": {
    "title": "...",
    "date": "...",
    "location": "...",
    "description": "..."
  },
  "analysis": {
    "summary": "...",
    "benefits": [...],
    "skillsDevelopment": [...],
    "careerImpact": "...",
    "recommendations": [...]
  }
}
```

#### Parse File (Screenshot)
```http
POST /api/parse/file
Authorization: Bearer <token> (optional)
Content-Type: multipart/form-data

files: [image file]
```

#### Parse Text
```http
POST /api/parse/text
Authorization: Bearer <token> (optional)
Content-Type: application/json

{
  "text": "Event details here..."
}
```

---

### **AI Analysis**

#### Analyze Event
```http
POST /api/ai-analysis/:eventId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "analysis": {
    "summary": "As a Master's student in Data Science...",
    "benefits": [...],
    "skillsDevelopment": [...],
    "networkingOpportunities": "...",
    "careerImpact": "...",
    "recommendations": [...],
    "similarInterests": [...]
  }
}
```

---

## 🎨 UI/UX Design Principles

### **Color Scheme**
- **Primary**: Blue (#2563eb) - Trust, professionalism
- **Secondary**: Indigo (#4f46e5) - Academic
- **Accent**: Purple (#9333ea) - AI/Innovation
- **Success**: Green (#10b981) - Registered state
- **Warning**: Orange (#f59e0b) - Important info
- **Neutral**: Gray (#6b7280) - Text, backgrounds

### **Key Design Decisions**

1. **Blur Background for Event Images**
   - Prevents distortion
   - Professional look
   - Works with any aspect ratio

2. **Color-Coded Information Cards**
   - Visual hierarchy
   - Quick scanning
   - Memorable

3. **Blue Search Bar** (not black)
   - Consistent with brand
   - More inviting
   - Better visibility

4. **Two-State Registration Button**
   - Clear current status
   - Easy to cancel
   - Prevents double registration

5. **Separated Upcoming/Past Events**
   - Clear context
   - Different visual weight
   - Chronological ordering

---

## 🧪 Testing Guide

### **1. User Registration & Login**
```
✓ Register as Student with all fields (including degree)
✓ Register as Staff with department/position
✓ Login with correct credentials
✓ Login with wrong credentials (should fail)
✓ Access protected routes without login (should redirect)
```

### **2. Profile Management**
```
✓ Click settings icon in navbar
✓ Edit profile fields
✓ Save changes
✓ Verify changes persist on reload
```

### **3. Event Discovery**
```
✓ Search events by title
✓ Search events by description
✓ Filter by category
✓ View upcoming events section
✓ View past events section
✓ Check event cards display correct info
```

### **4. Event Registration**
```
✓ Register for event → shows "Already Registered"
✓ Refresh page → still shows "Already Registered"
✓ Cancel registration → shows "Register Now"
✓ Try to register for full event → shows "Event Full"
```

### **5. Event Management (Admin)**
```
✓ Login as admin
✓ Create new event
✓ View event detail → see Edit button
✓ Click Edit → pre-filled form
✓ Update event → changes saved
✓ Delete event
```

### **6. AI Analysis**
```
✓ As Data Science student, parse ML event → mentions degree/major
✓ As Data Science student, parse party event → general benefits only
✓ Not logged in → general analysis
✓ Click AI Analysis on event detail → personalized
✓ Verify all text is in English (no Russian)
```

### **7. Event Parser**
```
✓ Parse URL → extracts event info
✓ Upload screenshot → OCR + analysis
✓ Paste text → analysis
✓ Logged in → personalized analysis
✓ Not logged in → general analysis
```

---

## 🐛 Known Issues & Limitations

### **Current Limitations:**

1. **OCR Accuracy**
   - Tesseract may struggle with stylized fonts
   - Solution: Use clearer images or manual text input

2. **AI Consistency**
   - Groq AI may occasionally use Russian words despite instructions
   - Solution: Multiple enforcement layers in prompts

3. **Image Upload**
   - 5MB size limit
   - Stored temporarily (consider cloud storage for production)

4. **Date Handling**
   - Timezone handling assumes local time
   - Solution: Add timezone selection

5. **Search Performance**
   - Client-side filtering (fine for < 1000 events)
   - Solution: Server-side search for larger datasets

---

## 🚀 Future Enhancements

### **Phase 1: UX Improvements**
- [ ] Real-time notifications for event updates
- [ ] Calendar view for events
- [ ] Event reminders (email/push)
- [ ] QR code for event check-in
- [ ] Social sharing buttons

### **Phase 2: AI Enhancements**
- [ ] Switch to GPT-4 for better quality
- [ ] Add caching for faster responses
- [ ] User feedback/rating system
- [ ] A/B testing for prompts
- [ ] RAG with past event data

### **Phase 3: Features**
- [ ] Event categories management (admin)
- [ ] User activity dashboard
- [ ] Event recommendations algorithm
- [ ] Attendance tracking
- [ ] Certificate generation
- [ ] Event reviews/ratings

### **Phase 4: Scale**
- [ ] Multi-tenancy (support multiple universities)
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Integration with university systems
- [ ] Automated event imports

---

## 📊 Performance Optimization

### **Current Performance:**
- **Frontend**: Vite (fast HMR, optimized builds)
- **Backend**: Express (minimal overhead)
- **Database**: MongoDB indexes on frequently queried fields

### **Optimizations Applied:**
1. **Frontend**:
   - Code splitting (React Router)
   - Lazy loading (images)
   - Zustand (lightweight state)

2. **Backend**:
   - JWT (stateless auth)
   - Mongoose lean queries
   - Error handling middleware

3. **Database**:
   - Indexes: `email`, `date`, `category`
   - Lean queries for read operations

### **Recommendations for Production:**
```javascript
// Add these in production:

// 1. Redis for caching
const cache = redis.createClient();
app.use('/api/events', cacheMiddleware);

// 2. CDN for images
const imageUrl = `https://cdn.example.com/${filename}`;

// 3. Rate limiting
import rateLimit from 'express-rate-limit';
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

// 4. Compression
import compression from 'compression';
app.use(compression());

// 5. MongoDB connection pooling
mongoose.connect(uri, { maxPoolSize: 50 });
```

---

## 🔒 Security Measures

### **Implemented:**
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Input validation (express-validator)
- ✅ CORS configuration
- ✅ File upload restrictions (size, type)
- ✅ SQL injection protection (Mongoose)

### **Production Checklist:**
```bash
# 1. Use HTTPS only
# 2. Set secure headers
npm install helmet
app.use(helmet());

# 3. Rate limiting
npm install express-rate-limit

# 4. Environment variables (never commit .env)
# 5. Regular dependency updates
npm audit fix

# 6. MongoDB authentication
# 7. API key rotation
# 8. Logging & monitoring
```

---

## 📞 Support & Contribution

### **Getting Help:**
1. Check this documentation
2. Review API documentation above
3. Check `CHANGELOG_AI_IMPROVEMENTS.md` for recent changes
4. See `AI_ANALYSIS_IMPROVEMENTS.md` for AI optimization tips

### **Reporting Bugs:**
1. Describe the issue
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Environment (OS, browser, Node version)

### **Contributing:**
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request with clear description

---

## 📄 License & Credits

### **Technologies Used:**
- React, TypeScript, Node.js, Express, MongoDB
- Groq AI (llama-3.3-70b-versatile)
- Tailwind CSS, Lucide Icons
- Tesseract.js, Cheerio, Multer

### **Created For:**
Harbour.Space University Barcelona

### **Version:**
2.1.0 (October 2025)

---

## 📝 Quick Start Checklist

```
For Development:
☐ Install Node.js 18+
☐ Install MongoDB
☐ Clone repository
☐ Run `npm install`
☐ Create `.env` file
☐ Get Groq API key
☐ Run `npm run dev`
☐ Create admin user
☐ Test features

For Production:
☐ Set up production MongoDB
☐ Configure environment variables
☐ Build frontend (`npm run build`)
☐ Set up reverse proxy (Nginx)
☐ Enable HTTPS
☐ Set up monitoring
☐ Configure backups
☐ Set up CI/CD
```

---

## 🎉 Project Status

**Current Version**: 2.1.0  
**Status**: ✅ Production Ready  
**Last Updated**: October 17, 2025

### **Completed Features:**
- ✅ Event Parser with AI
- ✅ Event Management (CRUD)
- ✅ User Authentication
- ✅ Profile Management (with degree field)
- ✅ Registration System (with unregister)
- ✅ Personalized AI Analysis
- ✅ Admin Panel
- ✅ Edit Event (Admin)
- ✅ Edit Profile (All Users)
- ✅ Responsive Design
- ✅ English-only AI responses
- ✅ Blue-themed search bar

---

**This platform is ready to help Harbour.Space students discover and benefit from amazing events! 🚀**
