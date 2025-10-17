# 📸 How to Add Images to Events

## 2 Ways to Add Images:

### ✅ Method 1: Upload Your Own Image File

1. **Click "Upload Image" button** on Create Event form
2. **Select image from your computer**
   - Supported formats: JPEG, PNG, GIF, WebP
   - Max size: 5MB
3. **Wait for upload** (shows "Uploading...")
4. **Image preview appears** automatically
5. **Done!** The image is now hosted on your server

**Pros:**
- ✅ Easy - just click and select
- ✅ No need to find external URLs
- ✅ Images stored on your server
- ✅ Fast and reliable

**Example:**
```
Your file: party_photo.jpg
After upload: http://localhost:3001/uploads/images/event-1234567890-123456789.jpg
```

---

### ✅ Method 2: Use Image URL (from internet)

If you already have an image URL, paste it directly.

#### Where to get Image URLs:

**Option A: Unsplash (Free stock photos)**
1. Go to https://unsplash.com/
2. Search for your event theme (e.g., "technology", "business")
3. Click on an image
4. Right-click → "Copy image address"
5. Paste in the "Image URL" field

**Example URLs:**
```
Technology: https://images.unsplash.com/photo-1540575467063-178a50c2df87
Business: https://images.unsplash.com/photo-1556761175-b413da4baf72
Workshop: https://images.unsplash.com/photo-1552664730-d307ca884978
```

**Option B: Imgur (Upload your own)**
1. Go to https://imgur.com/
2. Click "New post"
3. Upload your image
4. Right-click on uploaded image → "Copy image address"
5. Paste in the "Image URL" field

---

## 🎯 Quick Tips:

### When to Upload vs Use URL:

**Upload** when:
- ✅ You have image on your computer
- ✅ It's your own photo/design
- ✅ You want full control

**Use URL** when:
- ✅ You found perfect stock photo online
- ✅ Image is already hosted somewhere
- ✅ You want to save server space

---

## 🖼️ Image Preview

After adding image (upload or URL), you'll see preview:

```
┌─────────────────────────────┐
│                             │
│     [Image Preview]         │
│                             │
└─────────────────────────────┘
```

If image doesn't load, default placeholder is used automatically.

---

## ❓ FAQ

**Q: What if I don't add an image?**
A: No problem! A default event image will be used automatically.

**Q: Can I change the image after uploading?**
A: Yes! Just upload a new one or paste a new URL. It will replace the old one.

**Q: Where are uploaded images stored?**
A: In `server/uploads/images/` folder on your server.

**Q: What's the best image size?**
A: Recommended: 1200x600px (16:9 ratio)

**Q: Image upload fails?**
A: Check:
- File size < 5MB
- File is an image (JPEG, PNG, GIF, WebP)
- Server is running
- You're logged in as admin

---

## 🎨 Recommended Image Sources:

1. **Unsplash** - https://unsplash.com/ (Best quality, free)
2. **Pexels** - https://www.pexels.com/ (Free stock photos)
3. **Pixabay** - https://pixabay.com/ (Free images)
4. **Your own photos** - Upload directly!

---

**That's it! Now you can easily add beautiful images to your events! 🎉**
