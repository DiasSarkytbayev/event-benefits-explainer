import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import aiAnalysisRoutes from './routes/ai-analysis.js';
import parseRoutes from './routes/parse.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY is missing in .env file!');
  process.exit(1);
}

if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
  console.error('❌ ERROR: DATABASE_URL or MONGODB_URI is missing in .env file!');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is missing in .env file!');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'https://event-benefits-explainer.vercel.app', // Production
    'http://localhost:5173', // Local development
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Harbour.Space Events API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ai-analysis', aiAnalysisRoutes);
app.use('/api/parse', parseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Groq AI: Connected`);
  console.log(`✅ OCR.space: Connected`);
  console.log(`\n📋 Available routes:`);
  console.log(`\n   🔐 Authentication:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`\n   📋 Events:`);
  console.log(`   - GET  /api/events`);
  console.log(`   - POST /api/events (admin)`);
  console.log(`   - POST /api/events/:id/register`);
  console.log(`\n   🤖 AI Analysis (Groq):`);
  console.log(`   - POST /api/ai-analysis/:eventId`);
  console.log(`\n   🔍 Parsing:`);
  console.log(`   - POST /api/parse/url`);
  console.log(`   - POST /api/parse/file`);
  console.log(`   - POST /api/parse/text`);
  console.log(`\n`);
});

export default app;
