import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import axios from 'axios'
import * as cheerio from 'cheerio'
import mammoth from 'mammoth'
import rateLimit from 'express-rate-limit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') })

// Debug: Check if env variables are loaded
console.log('Environment variables loaded:')
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✓ Found' : '✗ Missing')
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✓ Found' : '✗ Missing')

// Check if required API keys are present
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY is missing in .env file!')
  console.error('Please create a .env file with:')
  console.error('GROQ_API_KEY=your_key_here')
  console.error('HUGGINGFACE_API_KEY=your_key_here')
  process.exit(1)
}

if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('❌ ERROR: HUGGINGFACE_API_KEY is missing in .env file!')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Create uploads directory
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
})

// Initialize Groq (only after checking keys exist)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Hugging Face API
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
const HF_API_URL = 'https://api-inference.huggingface.co/models'

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: { error: 'Too many requests, please try again in an hour.' }
})

// ============ HELPER FUNCTIONS ============

// Extract text from PDF (text-based PDFs only)
async function extractTextFromPDF(filePath) {
  try {
    // For now, return empty - PDF parsing requires additional libraries
    // Users can use Word documents or manual entry instead
    console.log('PDF text extraction not implemented yet')
    return ''
  } catch (error) {
    console.error('Error extracting PDF:', error)
    return ''
  }
}

// Extract text from Word document
async function extractTextFromWord(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (error) {
    console.error('Error extracting Word:', error)
    return ''
  }
}

// Extract text from image using Hugging Face OCR
async function extractTextFromImage(filePath, mimeType = 'image/jpeg') {
  try {
    const imageData = fs.readFileSync(filePath)
    
    console.log('Processing image with Hugging Face OCR, MIME:', mimeType)
    
    // Try multiple OCR models until one works
    const models = [
      'microsoft/trocr-base-printed',  // Smaller, more likely to be available
      'nlpconnect/vit-gpt2-image-captioning',  // Alternative captioning model
      'Salesforce/blip-image-captioning-base'  // Base version of BLIP
    ]
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`)
        const response = await axios.post(
          `${HF_API_URL}/${model}`,
          imageData,
          {
            headers: {
              'Authorization': `Bearer ${HF_API_KEY}`,
              'Content-Type': 'application/octet-stream'
            },
            timeout: 30000
          }
        )
        
        let extractedText = ''
        if (response.data && Array.isArray(response.data)) {
          extractedText = response.data.map(item => item.generated_text || '').join(' ')
        } else if (response.data && response.data.generated_text) {
          extractedText = response.data.generated_text
        } else if (typeof response.data === 'string') {
          extractedText = response.data
        }
        
        if (extractedText) {
          console.log(`✓ Success with ${model}`)
          console.log('Extracted text length:', extractedText.length)
          return extractedText
        }
      } catch (modelError) {
        console.log(`✗ Failed with ${model}:`, modelError.response?.status || modelError.message)
        continue
      }
    }
    
    console.log('All OCR models failed')
    return ''
  } catch (error) {
    console.error('Error extracting image text:', error.message)
    return ''
  }
}

// Parse URL with Cheerio
async function parseURLWithCheerio(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })
    
    const $ = cheerio.load(response.data)
    
    // Remove scripts and styles
    $('script, style, nav, footer').remove()
    
    // Get text content
    const text = $('body').text().replace(/\s+/g, ' ').trim()
    
    if (text.length < 100) {
      return { success: false, text: '' }
    }
    
    return { success: true, text: text.substring(0, 10000) } // Limit to 10k chars
  } catch (error) {
    console.error('Error parsing URL with Cheerio:', error)
    return { success: false, text: '' }
  }
}

// Extract event data using Groq
async function extractEventDataWithAI(text) {
  try {
    const prompt = `Extract event information from the following text and return ONLY a valid JSON object with these fields:
- eventName: string
- eventType: string (conference/workshop/seminar/networking/webinar/training/other)
- date: string (YYYY-MM-DD format if possible)
- location: string
- description: string
- organizer: string
- targetAudience: string
- cost: string
- duration: string

If a field is not found, use an empty string. Return ONLY the JSON object, no other text.

Text:
${text.substring(0, 5000)}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024
    })
    
    const responseText = completion.choices[0]?.message?.content || ''
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return {}
  } catch (error) {
    console.error('Error extracting event data:', error)
    return {}
  }
}

// Analyze event with Groq
async function analyzeEventWithAI(eventData) {
  try {
    const prompt = `Analyze this event and provide insights. Return ONLY a valid JSON object with these fields:
- benefits: array of 5-7 key benefits (strings)
- personalizedInsights: detailed paragraph explaining value (string)
- keyTakeaways: array of 4-6 main takeaways (strings)
- recommendations: array of 3-5 actionable recommendations (strings)
- overallScore: number from 0-100 based on value, relevance, and quality

Event Data:
${JSON.stringify(eventData, null, 2)}

Return ONLY the JSON object, no other text.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048
    })
    
    const responseText = completion.choices[0]?.message?.content || ''
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Error analyzing event:', error)
    throw error
  }
}

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server running with Groq + Hugging Face',
    textModel: 'llama-3.3-70b-versatile',
    ocrModel: 'Salesforce/blip-image-captioning-large'
  })
})

// Parse URL and analyze automatically
app.post('/api/analyze-url', limiter, async (req, res) => {
  try {
    const { url } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    
    console.log('📎 Analyzing URL:', url)
    
    // Step 1: Parse URL
    const cheerioResult = await parseURLWithCheerio(url)
    
    if (!cheerioResult.success) {
      return res.json({
        success: false,
        message: 'Could not parse this URL. The website may block automated access. Please try uploading a screenshot or entering text manually.'
      })
    }
    
    // Step 2: Extract event data with AI
    const extractedData = await extractEventDataWithAI(cheerioResult.text)
    
    if (!extractedData || Object.keys(extractedData).length === 0) {
      return res.json({
        success: false,
        message: 'Could not extract event information from this URL.'
      })
    }
    
    console.log('✓ Extracted event data:', extractedData.eventName)
    
    // Step 3: Analyze event automatically
    console.log('🤖 Generating AI analysis...')
    const analysis = await analyzeEventWithAI(extractedData)
    
    console.log('✓ Analysis complete')
    
    // Return both extracted data and analysis
    res.json({
      success: true,
      eventData: extractedData,
      analysis: analysis
    })
    
  } catch (error) {
    console.error('Error analyzing URL:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to analyze URL',
      message: error.message
    })
  }
})

// Analyze uploaded file(s) automatically
app.post('/api/analyze-file', limiter, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    console.log(`📸 Analyzing ${req.files.length} file(s)`)
    
    let combinedText = ''

    // Process all uploaded files
    for (const file of req.files) {
      const filePath = file.path
      const fileType = file.mimetype
      let extractedText = ''

      console.log(`Processing: ${file.originalname} (${fileType})`)

      // Extract text based on file type
      if (fileType.startsWith('image/')) {
        extractedText = await extractTextFromImage(filePath, fileType)
      } else if (fileType === 'application/pdf') {
        extractedText = await extractTextFromPDF(filePath)
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromWord(filePath)
      } else if (fileType.startsWith('text/')) {
        extractedText = fs.readFileSync(filePath, 'utf-8')
      }
      
      combinedText += extractedText + '\n\n'
      
      // Clean up file
      fs.unlinkSync(filePath)
    }

    console.log('Combined text length:', combinedText.length)

    if (combinedText.trim().length === 0) {
      // Check if all files were images
      const allImages = req.files.every(file => file.mimetype.startsWith('image/'))
      
      if (allImages) {
        return res.json({
          success: false,
          message: 'OCR is currently unavailable. Please try: (1) Paste the event URL instead, or (2) Copy text from the page and use "Describe Event" option.'
        })
      } else {
        return res.json({
          success: false,
          message: 'Could not extract text from uploaded files. Please try a different file format or paste the event URL.'
        })
      }
    }

    // Step 1: Extract event data with AI
    const extractedData = await extractEventDataWithAI(combinedText)
    
    if (!extractedData || Object.keys(extractedData).length === 0) {
      return res.json({
        success: false,
        message: 'Could not extract event information from files.'
      })
    }

    console.log('✓ Extracted event data:', extractedData.eventName)

    // Step 2: Analyze event automatically
    console.log('🤖 Generating AI analysis...')
    const analysis = await analyzeEventWithAI(extractedData)
    
    console.log('✓ Analysis complete')

    res.json({
      success: true,
      eventData: extractedData,
      analysis: analysis
    })
  } catch (error) {
    console.error('Error processing files:', error)
    
    // Clean up files if they exist
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
      })
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to process files',
      message: error.message
    })
  }
})

// Analyze text (manual entry)
app.post('/api/analyze-text', limiter, async (req, res) => {
  try {
    const { text } = req.body

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' })
    }

    console.log('✍️ Analyzing manual text input')

    // Step 1: Extract event data from text
    const extractedData = await extractEventDataWithAI(text)
    
    if (!extractedData || Object.keys(extractedData).length === 0) {
      return res.json({
        success: false,
        message: 'Could not extract event information from text.'
      })
    }

    console.log('✓ Extracted event data:', extractedData.eventName)

    // Step 2: Analyze event automatically
    console.log('🤖 Generating AI analysis...')
    const analysis = await analyzeEventWithAI(extractedData)
    
    console.log('✓ Analysis complete')

    res.json({
      success: true,
      eventData: extractedData,
      analysis: analysis
    })
  } catch (error) {
    console.error('Error analyzing text:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to analyze text',
      message: error.message
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`🤖 Using Groq (Llama 3.3 70B) + Hugging Face OCR`)
  console.log(`⚡ Rate limit: 5 requests/hour per IP`)
  console.log(`📝 Supported: URL parsing, Images (OCR), Word documents, Manual entry`)
  console.log(`🔄 OCR will try multiple models automatically`)
})
