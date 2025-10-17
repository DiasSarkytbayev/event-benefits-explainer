# Event Benefits Explainer - Usage Guide

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd C:\Users\Dias\CascadeProjects\event-benefits-explainer
npm run server
```
Server will run on: `http://localhost:3001`

### 2. Start Frontend
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 📋 Features

### 1. **Event Parser** (Main Page)
Parse events from multiple sources:
- **URL**: Paste event link (Eventbrite, Meetup, etc.)
- **File Upload**: PNG, JPEG, PDF, PowerPoint
- **Manual Text**: Describe event manually

### 2. **AI Analysis** (Powered by Groq)
Get personalized insights:
- Event details extraction
- Benefits of attending
- Skills development opportunities
- Career impact analysis
- Personalized recommendations

### 3. **Events Listing**
Browse Harbour.Space events:
- Search and filter events
- View event details
- Register for events

### 4. **Admin Panel** (Admin Only)
- Create new events
- Manage existing events
- View all users

---

## 👥 User Roles

### **Student** (Default)
- Parse events
- View AI analysis
- Browse events
- Register for events

### **Staff**
- Same as Student
- Additional staff features

### **Admin** 👑
- All above features
- **+ Create Events** button
- Manage events
- View all users

---

## 🔐 How to Become Admin

### Option 1: Register as Admin
1. Go to `/register`
2. Select **"Admin 👑"** button
3. Fill in details
4. Login

### Option 2: Convert Existing Account
1. Login to your account
2. Open browser console (F12)
3. Run this command:
```javascript
fetch('http://localhost:3001/api/admin/make-me-admin', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => {
  console.log(data);
  location.reload();
});
```

---

## 🖼️ Image URLs for Events

When creating an event, you need an **Image URL** (optional).

### Where to get Image URLs:

#### **Unsplash** (Free high-quality photos)
1. Go to https://unsplash.com/
2. Search for your event type
3. Right-click on image → "Copy image address"
4. Example: `https://images.unsplash.com/photo-1540575467063-178a50c2df87`

#### **Imgur** (Upload your own)
1. Go to https://imgur.com/
2. Upload your image
3. Right-click → "Copy image address"
4. Example: `https://i.imgur.com/abc123.jpg`

### Quick URLs for Testing:
```
Technology: https://images.unsplash.com/photo-1540575467063-178a50c2df87
Business: https://images.unsplash.com/photo-1556761175-b413da4baf72
Design: https://images.unsplash.com/photo-1558655146-d09347e92766
Workshop: https://images.unsplash.com/photo-1552664730-d307ca884978
```

See `IMAGE_URL_GUIDE.md` for more details.

---

## 🎨 Navigation

### From Events Page → Main Page
Click **"← Back to Event Parser"** button (top left)

### From Main Page → Events Page
Click **"View Harbour.Space Events →"** button (bottom)

---

## 📱 Screen Optimization

The app is optimized for **15.6" laptops** (1366x768 and 1920x1080).

All pages are responsive and will adapt to your screen size.

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin only)
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Register for event

### Parsing
- `POST /api/parse/url` - Parse from URL
- `POST /api/parse/file` - Parse from file
- `POST /api/parse/text` - Parse from text

### Admin
- `PATCH /api/admin/make-me-admin` - Make yourself admin
- `GET /api/admin/users` - Get all users (admin only)

---

## 🔧 Technologies Used

### Frontend
- **React** + TypeScript
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Node.js** + Express
- **MongoDB** - Database
- **Groq AI** - LLM (Llama 3.3 70B)
- **OCR.space** - Image text extraction
- **JWT** - Authentication

---

## 📝 Environment Variables

Create a `.env` file:

```env
# AI
GROQ_API_KEY=your_groq_api_key
OCR_SPACE_API_KEY=your_ocr_space_key

# Database
DATABASE_URL=your_mongodb_url

# Auth
JWT_SECRET=your_jwt_secret

# Server
PORT=3001
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### Server won't start
- Check if `.env` file exists
- Verify all API keys are correct
- Make sure MongoDB is accessible

### Can't see "Add Event" button
- Make sure you're logged in as Admin
- Check browser console for errors
- Try making yourself admin using the console command

### OCR not working
- Verify OCR_SPACE_API_KEY is correct
- Check image format (PNG, JPEG, PDF supported)
- Try with a smaller image

### AI Analysis fails
- Verify GROQ_API_KEY is correct
- Check if you have API quota remaining
- Try again after a few seconds

---

## 📞 Support

For issues or questions, check:
1. Browser console (F12) for errors
2. Server logs in terminal
3. This guide and IMAGE_URL_GUIDE.md

---

## ✨ Tips

- Use **Unsplash** for event images (free, high quality)
- Test URLs before creating events
- Students can parse ANY event, not just Harbour.Space events
- Admin can create events that will show up for all users
- All AI analysis is in **English**

---

**Enjoy using Event Benefits Explainer! 🎉**
