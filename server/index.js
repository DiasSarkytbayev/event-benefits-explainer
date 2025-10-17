import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pdfParse from 'pdf-parse'
import axios from 'axios'
import * as cheerio from 'cheerio'
import mammoth from 'mammoth'
import rateLimit from 'express-rate-limit'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: 'Too many requests, please try again later.'
})

// Extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdfParse(dataBuffer)
    return data.text
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    return ''
  }
}

// Extract text from image using OCR
async function extractTextFromImage(filePath) {
  try {
    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => console.log(m),
    })
    return result.data.text
  } catch (error) {
    console.error('Error extracting text from image:', error)
    return ''
  }
}

// Extract text from text file
function extractTextFromTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error('Error reading text file:', error)
    return ''
  }
}

// Extract event data using OpenAI
async function extractEventDataWithAI(text) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting event information from text. Extract the following fields if available: eventName, eventType, date, location, description, organizer, targetAudience, cost, duration. Return a JSON object with these fields. If a field is not found, leave it as an empty string.`,
        },
        {
          role: 'user',
          content: `Extract event information from this text:\n\n${text}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0].message.content)
  } catch (error) {
    console.error('Error extracting event data with AI:', error)
    return {}
  }
}

// Analyze event with AI
async function analyzeEventWithAI(eventData) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert event analyst. Analyze the event and provide:
1. benefits: Array of key benefits (5-7 items)
2. personalizedInsights: A detailed paragraph explaining why this event is valuable
3. keyTakeaways: Array of main takeaways (4-6 items)
4. recommendations: Array of actionable recommendations (3-5 items)
5. overallScore: A score from 0-100 based on value, relevance, and quality

Return a JSON object with these fields.`,
        },
        {
          role: 'user',
          content: `Analyze this event:\n\n${JSON.stringify(eventData, null, 2)}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0].message.content)
  } catch (error) {
    console.error('Error analyzing event with AI:', error)
    throw error
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Extract data from uploaded file
app.post('/api/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = req.file.path
    const fileType = req.file.mimetype
    let extractedText = ''

    // Extract text based on file type
    if (fileType.startsWith('image/')) {
      extractedText = await extractTextFromImage(filePath)
    } else if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(filePath)
    } else if (fileType.startsWith('text/')) {
      extractedText = extractTextFromTextFile(filePath)
    }

    // Use AI to extract structured event data
    const extractedData = await extractEventDataWithAI(extractedText)

    // Clean up uploaded file
    fs.unlinkSync(filePath)

    res.json({
      success: true,
      extractedData,
      rawText: extractedText.substring(0, 500), // Return first 500 chars for debugging
    })
  } catch (error) {
    console.error('Error processing file:', error)
    res.status(500).json({ error: 'Failed to process file' })
  }
})

// Analyze event
app.post('/api/analyze', async (req, res) => {
  try {
    const eventData = req.body

    if (!eventData || !eventData.eventName) {
      return res.status(400).json({ error: 'Invalid event data' })
    }

    const analysis = await analyzeEventWithAI(eventData)

    res.json(analysis)
  } catch (error) {
    console.error('Error analyzing event:', error)
    res.status(500).json({ error: 'Failed to analyze event' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Make sure to set OPENAI_API_KEY in .env file`)
})
