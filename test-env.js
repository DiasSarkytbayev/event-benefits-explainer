import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== ENV FILE DIAGNOSTIC ===\n')

// Test 1: Check if .env exists
const envPath = path.join(__dirname, '.env')
console.log('1. Checking .env file path:', envPath)
console.log('   File exists:', fs.existsSync(envPath))

if (fs.existsSync(envPath)) {
  // Test 2: Check file size
  const stats = fs.statSync(envPath)
  console.log('   File size:', stats.size, 'bytes')
  
  // Test 3: Read file content
  try {
    const content = fs.readFileSync(envPath, 'utf8')
    console.log('   File content length:', content.length)
    console.log('   First 50 chars:', content.substring(0, 50))
    console.log('   Lines:', content.split('\n').length)
  } catch (err) {
    console.log('   ERROR reading file:', err.message)
  }
}

// Test 4: Try loading with dotenv
console.log('\n2. Loading with dotenv...')
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.log('   ERROR:', result.error.message)
} else {
  console.log('   SUCCESS! Loaded variables:', Object.keys(result.parsed || {}).length)
}

// Test 5: Check process.env
console.log('\n3. Checking process.env:')
console.log('   GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Found (' + process.env.GROQ_API_KEY.substring(0, 10) + '...)' : 'Missing')
console.log('   HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? 'Found (' + process.env.HUGGINGFACE_API_KEY.substring(0, 10) + '...)' : 'Missing')
console.log('   PORT:', process.env.PORT || 'Missing')

console.log('\n=== END DIAGNOSTIC ===')
