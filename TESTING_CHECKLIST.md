# ✅ Testing Checklist - Harbour.Space Event Benefits Explainer

## 🎯 Complete Testing Guide

Use this checklist to verify all features are working correctly.

---

## 1️⃣ User Authentication

### Registration
- [ ] Register as **Student**
  - [ ] Fill all required fields
  - [ ] Select faculty, course, major
  - [ ] Select **degree** (Bachelor/Master/PhD/Other)
  - [ ] Add interests (comma-separated)
  - [ ] Successfully register
  - [ ] Redirected to `/events`

- [ ] Register as **Staff**
  - [ ] Fill all required fields
  - [ ] Enter department and position
  - [ ] Successfully register
  - [ ] Redirected to `/events`

### Login
- [ ] Login with correct credentials → Success
- [ ] Login with wrong password → Error message
- [ ] Login with non-existent email → Error message
- [ ] After login, see user name in navbar
- [ ] After login, see Settings icon

### Logout
- [ ] Click Logout button
- [ ] Redirected to login page
- [ ] Can't access protected routes

---

## 2️⃣ Profile Management

### View Profile
- [ ] Click Settings icon in navbar
- [ ] Redirected to `/profile/edit`
- [ ] See pre-filled form with current data
- [ ] Email field is disabled (read-only)

### Edit Profile
- [ ] Update first name
- [ ] Update last name
- [ ] Update bio
- [ ] Update interests
- [ ] Update location
- [ ] **Student**: Update faculty, course, major, degree
- [ ] **Staff**: Update department, position
- [ ] Click "Save Changes"
- [ ] See success message
- [ ] Changes persist after page reload

### Cancel Edit
- [ ] Make changes
- [ ] Click "Cancel"
- [ ] Redirected to `/events`
- [ ] Changes not saved

---

## 3️⃣ Event Discovery

### Search Functionality
- [ ] Go to `/events`
- [ ] Search bar has **blue icon** (not black)
- [ ] Type event title → results filter
- [ ] Type event description text → results filter
- [ ] Clear search → all events show

### Category Filter
- [ ] Click different categories
- [ ] Events filter correctly
- [ ] "All" shows all events

### Event Sections
- [ ] **Upcoming Events** section exists
- [ ] Shows count (e.g., "Upcoming Events (5)")
- [ ] Events sorted ascending by date
- [ ] **Past Events** section exists
- [ ] Shows count
- [ ] Events sorted descending by date
- [ ] Past events have slightly faded appearance
- [ ] "Past Event" badge visible

### No Events State
- [ ] Filter to category with no events
- [ ] See "No events found" message

---

## 4️⃣ Event Detail Page

### Basic Display
- [ ] Click an event card
- [ ] Redirected to `/events/:id`
- [ ] **Blur background** visible
- [ ] Main image displayed (not distorted)
- [ ] **Back button** with dark semi-transparent background
- [ ] Category badges top-right

### Information Cards
- [ ] See 4 color-coded cards:
  - [ ] 🔵 Blue - Date & Time
  - [ ] 🟣 Purple - Location  
  - [ ] 🟢 Green - Participants
  - [ ] 🟠 Orange - Entry Fee

### Event Description
- [ ] Full description visible
- [ ] Organizer name shown

### Admin Edit Button
- [ ] Login as **admin**
- [ ] See blue **"Edit"** button next to Back
- [ ] Click Edit → redirected to `/events/:id/edit`
- [ ] As **student/staff** → No Edit button visible

---

## 5️⃣ Event Registration

### Register for Event
- [ ] Not logged in → Click "Register Now"
- [ ] Redirected to `/login`
- [ ] Login and return to event
- [ ] Click "Register Now"
- [ ] Button changes to **"Already Registered"** (green)
- [ ] See **"Cancel Registration"** button (gray)
- [ ] **Refresh page** → still shows "Already Registered"

### Unregister from Event
- [ ] Click "Cancel Registration"
- [ ] See confirmation dialog
- [ ] Click "Cancel" in dialog → no change
- [ ] Click "Cancel Registration" again
- [ ] Confirm → Button changes back to "Register Now"
- [ ] Refresh page → shows "Register Now"

### Full Event
- [ ] Register until event is full
- [ ] Try to register another user
- [ ] See "Event Full" button (disabled)

---

## 6️⃣ AI Analysis (Event Detail)

### Generate Analysis
- [ ] Click "AI Analysis" button
- [ ] Button shows "Analyzing..."
- [ ] Analysis appears below (purple/blue gradient background)
- [ ] Title: "Personalized AI Analysis"
- [ ] **No Relevance Score** displayed

### Analysis Content
- [ ] **Summary** section with explanation
- [ ] **Key Benefits** (4 items with checkmarks)
- [ ] **Skills Development** (4 skills in colored tags)
- [ ] **Career Impact** paragraph
- [ ] **Recommendations** (3 items with arrows)

### Personalization
- [ ] As **Data Science student**, analyze tech event
  - [ ] Analysis mentions "Data Science", "Master's", etc.
- [ ] As **Data Science student**, analyze party event
  - [ ] Analysis focuses on social/networking benefits
  - [ ] Does NOT force academic connections

### Language Check
- [ ] All text is in **English**
- [ ] No Russian words
- [ ] No other languages

### Not Logged In
- [ ] Logout
- [ ] Try to click "AI Analysis"
- [ ] See "Sign in to get AI analysis" message

---

## 7️⃣ Event Parser (Landing Page)

### Access
- [ ] Go to `/` (root)
- [ ] See dark theme with neon colors
- [ ] No navbar visible
- [ ] Three input methods visible

### Parse URL
- [ ] Select "Paste URL" tab
- [ ] Paste event URL (e.g., Eventbrite)
- [ ] Click "Parse URL"
- [ ] Loading indicator appears
- [ ] Event data extracted
- [ ] AI analysis generated
- [ ] Redirected to `/analyze` with results

### Upload Screenshot
- [ ] Select "Upload File" tab
- [ ] Upload event poster image
- [ ] OCR extracts text
- [ ] AI analyzes
- [ ] See results on `/analyze`

### Manual Text
- [ ] Select "Manual Entry" tab
- [ ] Paste event description text
- [ ] Click "Analyze"
- [ ] AI analyzes
- [ ] See results

### Personalization (Logged In)
- [ ] Login first
- [ ] Parse any event
- [ ] Analysis should be personalized
- [ ] Mentions your profile when relevant

### Personalization (Not Logged In)
- [ ] Logout
- [ ] Parse any event
- [ ] Analysis is general (no user-specific info)

### Analysis Result Page
- [ ] All text in **English**
- [ ] **No Relevance Score** displayed
- [ ] See sections:
  - [ ] Summary
  - [ ] Key Benefits
  - [ ] Skills Development
  - [ ] Career Impact
  - [ ] Key Takeaways
  - [ ] Recommendations
- [ ] "Analyze Another Event" button works
- [ ] "View Harbour.Space Events" button → `/events`

---

## 8️⃣ Event Management (Staff/Admin)

### Create Event (Staff or Admin)
- [ ] Login as **staff** or **admin**
- [ ] See "Create Event" button in navbar
- [ ] Click → redirected to `/create-event`
- [ ] Fill form:
  - [ ] Title
  - [ ] Description
  - [ ] Date & Time
  - [ ] Location
  - [ ] Price
  - [ ] Max Participants
  - [ ] Select categories (at least 1)
  - [ ] Upload image OR paste URL
  - [ ] See image preview
- [ ] Click "Create Event"
- [ ] Redirected to `/events`
- [ ] New event visible

### Edit Event (Admin Only)
- [ ] Login as **admin**
- [ ] Go to any event detail
- [ ] See **"Edit"** button (blue, next to Back)
- [ ] Click Edit → `/events/:id/edit`
- [ ] Form pre-filled with current data
- [ ] Date formatted correctly
- [ ] Update any field
- [ ] Click "Update Event"
- [ ] Redirected to event detail
- [ ] Changes saved

### Edit Event (Staff/Student)
- [ ] Login as **staff** or **student**
- [ ] Go to event detail
- [ ] **No Edit button** visible

### Delete Event (Admin)
- [ ] Login as **admin**
- [ ] Go to admin panel
- [ ] Delete event
- [ ] Event removed from list

---

## 9️⃣ Admin Panel

### Access
- [ ] Login as **admin**
- [ ] See "Admin Panel" in navbar
- [ ] Click → `/admin`
- [ ] See event list
- [ ] See user statistics

### Non-Admin
- [ ] Login as **student** or **staff**
- [ ] No "Admin Panel" in navbar
- [ ] Direct access to `/admin` → redirected

---

## 🔟 UI/UX Elements

### Navbar
- [ ] Logo/title visible
- [ ] "Events" link
- [ ] "Create Event" (staff/admin only)
- [ ] "Admin Panel" (admin only)
- [ ] User name displayed
- [ ] "Admin" badge (admin only)
- [ ] **Settings icon** (gear) visible
- [ ] Logout button

### Search Bar (Events Page)
- [ ] Icon is **blue** (not black)
- [ ] Border is **blue**
- [ ] Focus state works correctly
- [ ] Placeholder text visible

### Event Cards
- [ ] Image displays correctly
- [ ] Category badge top-right
- [ ] "Past Event" badge (for past events)
- [ ] Hover effect (shadow increases)
- [ ] All information visible:
  - [ ] Title
  - [ ] Description (truncated)
  - [ ] Date & time
  - [ ] Location
  - [ ] Participants count
  - [ ] Price

### Event Detail - Hero Image
- [ ] **Blur background** visible
- [ ] Main image centered
- [ ] Image maintains aspect ratio (not stretched)
- [ ] Overlay for readability
- [ ] Buttons visible on any image

### Responsive Design
- [ ] Open on mobile viewport
- [ ] Layout adjusts correctly
- [ ] All buttons accessible
- [ ] Forms usable
- [ ] Images responsive

---

## 1️⃣1️⃣ Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try to load events
- [ ] See appropriate error message

### Invalid Data
- [ ] Try to register without login
- [ ] Try to create event with empty fields
- [ ] Upload invalid file type
- [ ] Paste invalid URL

### 404 Pages
- [ ] Go to `/nonexistent-page`
- [ ] Handle gracefully

---

## 1️⃣2️⃣ Security

### Protected Routes
- [ ] Try to access `/create-event` without login → redirect
- [ ] Try to access `/admin` as student → redirect
- [ ] Try to access `/profile/edit` without login → redirect

### API Security
- [ ] Try API calls without token → 401 error
- [ ] Try admin endpoint as student → 403 error

---

## 1️⃣3️⃣ Performance

### Load Times
- [ ] Events page loads quickly
- [ ] Images load progressively
- [ ] Search is responsive (no lag)

### AI Response Time
- [ ] AI Analysis completes in <10 seconds
- [ ] Event Parser completes in <15 seconds

---

## 🎯 Final Checks

### Documentation
- [ ] README.md is clear and accurate
- [ ] FINAL_DOCUMENTATION.md is comprehensive
- [ ] All API endpoints documented

### Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] No server errors in terminal

### Production Readiness
- [ ] `.env` file not committed
- [ ] All secrets secure
- [ ] Environment variables documented

---

## 📊 Test Results Summary

**Total Tests**: ~120  
**Date Tested**: _______________  
**Tested By**: _______________  
**Pass Rate**: _____ / 120  

### Issues Found:
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Notes:
_____________________________________________
_____________________________________________
_____________________________________________

---

## ✅ Sign-Off

- [ ] All critical features tested
- [ ] All bugs documented
- [ ] Ready for deployment

**Tester Signature**: _______________  
**Date**: _______________

---

**Status**: 
- ✅ All tests passed → **Production Ready**
- ⚠️ Minor issues → **Fix and retest**
- ❌ Major issues → **Not ready**
