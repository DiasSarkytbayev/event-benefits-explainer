import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

/**
 * Analyzes event information using Gemini Pro
 * @param {string} text - The event text to analyze
 * @returns {Promise<Object>} - The analyzed event data
 */
export async function analyzeEventWithGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Analyze this event information and extract key details in Russian:
      
      ${text}
      
      Format the response as JSON with these fields:
      {
        "title": "Event Title",
        "date": "Event Date",
        "location": "Event Location",
        "key_topics": ["topic1", "topic2"],
        "recommendations": ["suggestion1", "suggestion2"]
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean and parse the response
    const jsonString = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Error analyzing event with Gemini: ' + error.message);
  }
}

/**
 * Extracts text from an image using Gemini Vision
 * @param {string} imagePath - Path to the image file
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<string>} - Extracted text from the image
 */
export async function extractTextFromImageWithGemini(imagePath, mimeType) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Read image file
    const imageData = await fs.promises.readFile(imagePath);
    const base64Image = imageData.toString('base64');
    
    const image = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    const prompt = "Extract all text from this image. Return only the text, no additional commentary.";
    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    
    return response.text();
    
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw new Error('Error extracting text from image: ' + error.message);
  }
}

/**
 * Generate personalized event analysis based on user profile
 * @param {Object} event - Event data
 * @param {Object} userProfile - User profile data
 * @returns {Promise<Object>} - Personalized analysis and benefits
 */
export async function generatePersonalizedEventAnalysis(event, userProfile) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
You are an expert event advisor for Harbour.Space University. Analyze this event and provide personalized insights for the user.

EVENT INFORMATION:
Title: ${event.title}
Description: ${event.description}
Date: ${new Date(event.date).toLocaleDateString()}
Location: ${event.location}
Category: ${event.category.join(', ')}
Price: ${event.price === 0 ? 'Free' : `$${event.price}`}

USER PROFILE:
Name: ${userProfile.firstName} ${userProfile.lastName}
Role: ${userProfile.isStudent ? 'Student' : userProfile.isStaff ? 'Staff' : 'User'}
${userProfile.isStudent ? `Faculty: ${userProfile.faculty || 'N/A'}\nCourse: ${userProfile.course || 'N/A'}\nMajor: ${userProfile.major || 'N/A'}` : ''}
${userProfile.isStaff ? `Department: ${userProfile.department || 'N/A'}\nPosition: ${userProfile.position || 'N/A'}` : ''}
Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
Location: ${userProfile.location || 'Not specified'}

TASK:
Provide a personalized analysis in JSON format with these fields (respond in Russian):

{
  "relevanceScore": 85,
  "summary": "Brief 2-3 sentence summary of why this event is relevant to this user",
  "benefits": [
    "Specific benefit 1 for this user",
    "Specific benefit 2 for this user",
    "Specific benefit 3 for this user"
  ],
  "skillsDevelopment": [
    "Skill 1 they can develop",
    "Skill 2 they can develop"
  ],
  "networkingOpportunities": "Description of networking opportunities relevant to their profile",
  "careerImpact": "How this event can impact their career/studies",
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2"
  ],
  "similarInterests": ["Related topic 1", "Related topic 2"]
}

Make the analysis highly personalized based on their role, interests, and background.
Return ONLY valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      analysis,
      generatedAt: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error('Personalized Analysis Error:', error);
    throw new Error('Error generating personalized analysis: ' + error.message);
  }
}
