import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';
import { protect } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Groq AI will be initialized when needed (after env vars are loaded)

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Extract text from PDF using OCR.space
async function extractTextFromPDF(filePath) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('apikey', process.env.OCR_SPACE_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const response = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: formData.getHeaders(),
    });

    if (response.data.IsErroredOnProcessing) {
      throw new Error(response.data.ErrorMessage?.[0] || 'OCR processing failed');
    }

    const text = response.data.ParsedResults?.[0]?.ParsedText || '';
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
}

// Extract text from image using OCR.space
async function extractTextFromImage(filePath) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('apikey', process.env.OCR_SPACE_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const response = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: formData.getHeaders(),
    });

    if (response.data.IsErroredOnProcessing) {
      throw new Error(response.data.ErrorMessage?.[0] || 'OCR processing failed');
    }

    const text = response.data.ParsedResults?.[0]?.ParsedText || '';
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    return '';
  }
}

// Parse URL content
async function parseURL(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Remove script and style tags
    $('script, style').remove();
    
    // Get text content
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error('Error parsing URL:', error);
    throw new Error('Failed to parse URL');
  }
}

// Analyze event with Groq AI
async function analyzeEventWithGroq(text, userProfile = null) {
  try {
    // Initialize Groq client with API key from environment
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const userInfo = userProfile ? `
USER PROFILE:
Name: ${userProfile.firstName} ${userProfile.lastName}
Role: ${userProfile.isStudent ? 'Student' : userProfile.isStaff ? 'Staff' : 'User'}
${userProfile.isStudent ? `Degree: ${userProfile.degree || 'Not specified'}\nFaculty: ${userProfile.faculty || 'N/A'}\nCourse Year: ${userProfile.course || 'N/A'}\nMajor: ${userProfile.major || 'N/A'}` : ''}
${userProfile.isStaff ? `Department: ${userProfile.department || 'N/A'}\nPosition: ${userProfile.position || 'N/A'}` : ''}
Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
` : '';

    const prompt = `
Analyze this event information and provide a detailed ${userProfile ? 'PERSONALIZED ' : ''}analysis in English.

Event Information:
${text}

${userInfo}

IMPORTANT: ${userProfile ? `
- Analyze if this event is relevant to the user's field of study or work
- If relevant (e.g., tech event for CS student): mention their major/degree and explain specific academic/career connections
- If NOT relevant (e.g., party for programmer): focus on general benefits like networking, relaxation, social skills
- Be honest and natural - don't force connections where they don't exist
` : 'Provide a general analysis without user-specific personalization.'}

Please extract and analyze:
1. Event details (title, date, location, description)
2. Benefits of attending${userProfile ? ' (personalized for this user when relevant)' : ''}
3. Key takeaways
4. Skills that can be developed
5. Career/life impact${userProfile ? ' (realistic about relevance to user)' : ''}
6. Recommendations for attendees

CRITICAL: You MUST respond ONLY in ENGLISH. Do NOT use Russian or any other language.

Return a JSON object with this structure:
{
  "eventData": {
    "title": "Event title (in English)",
    "date": "Event date",
    "location": "Event location",
    "description": "Event description (in English)",
    "organizer": "Organizer name"
  },
  "analysis": {
    "summary": "Brief 2-3 sentence summary${userProfile ? ' explaining value for this user (academic, social, or recreational)' : ''} - MUST BE IN ENGLISH",
    "benefits": [
      "Benefit 1 (in English)",
      "Benefit 2 (in English)",
      "Benefit 3 (in English)",
      "Benefit 4 (in English)"
    ],
    "keyTakeaways": [
      "Key takeaway 1 (in English)",
      "Key takeaway 2 (in English)",
      "Key takeaway 3 (in English)"
    ],
    "skillsDevelopment": [
      "Skill 1 they can develop (can be soft skills) - in English",
      "Skill 2 - in English",
      "Skill 3 - in English",
      "Skill 4 - in English"
    ],
    "careerImpact": "How this impacts career/life - be realistic - MUST BE IN ENGLISH",
    "recommendations": [
      "Actionable recommendation 1 (in English)",
      "Actionable recommendation 2 (in English)",
      "Actionable recommendation 3 (in English)"
    ]
  }
}

IMPORTANT RULES:
1. ${userProfile ? 'Make it personalized but realistic based on user profile' : 'Provide general analysis'}
2. ALL TEXT MUST BE IN ENGLISH - NO RUSSIAN OR OTHER LANGUAGES
3. Be specific and actionable
4. Focus on real value

Return ONLY valid JSON, no additional text.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Groq AI Error:', error);
    throw new Error('Error analyzing event with AI: ' + error.message);
  }
}

// Optional auth middleware - allows both auth and non-auth requests
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    // If token exists, use protect middleware
    protect(req, res, next);
  } else {
    // If no token, continue without user
    req.user = null;
    next();
  }
};

// @route   POST /api/parse/url
// @desc    Parse event from URL
// @access  Public (personalized if logged in)
router.post('/url', optionalAuth, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    console.log('📎 Parsing URL:', url);

    // Parse URL content
    const text = await parseURL(url);

    // Analyze with AI (with user profile if logged in)
    const userProfile = req.user ? req.user.profile : null;
    const result = await analyzeEventWithGroq(text, userProfile);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error parsing URL:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse URL',
    });
  }
});

// @route   POST /api/parse/file
// @desc    Parse event from uploaded files
// @access  Public (personalized if logged in)
router.post('/file', optionalAuth, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    console.log(`📸 Processing ${req.files.length} file(s)...`);

    let extractedText = '';

    // Process each file
    for (const file of req.files) {
      const filePath = file.path;
      const fileType = file.mimetype;

      if (fileType.startsWith('image/')) {
        // Extract text from image
        const text = await extractTextFromImage(filePath);
        extractedText += text + '\n\n';
      } else if (fileType === 'application/pdf') {
        // Extract text from PDF
        const text = await extractTextFromPDF(filePath);
        extractedText += text + '\n\n';
      } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
        // For PowerPoint, we'll use image extraction (convert to images first would be ideal)
        // For now, just inform user
        extractedText += 'PowerPoint file detected. Please convert to PDF for better results.\n\n';
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from files',
      });
    }

    // Analyze with AI (with user profile if logged in)
    const userProfile = req.user ? req.user.profile : null;
    const result = await analyzeEventWithGroq(extractedText, userProfile);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error processing files:', error);
    
    // Clean up files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process files',
    });
  }
});

// @route   POST /api/parse/text
// @desc    Parse event from manual text input
// @access  Public (personalized if logged in)
router.post('/text', optionalAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    console.log('✍️ Analyzing text input...');

    // Analyze with AI (with user profile if logged in)
    const userProfile = req.user ? req.user.profile : null;
    const result = await analyzeEventWithGroq(text, userProfile);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze text',
    });
  }
});

export default router;
