import Groq from 'groq-sdk';

// Initialize Groq client lazily
let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

/**
 * Generate personalized event analysis based on user profile using Groq AI
 * @param {Object} event - Event data
 * @param {Object} userProfile - User profile data
 * @returns {Promise<Object>} - Personalized analysis and benefits
 */
export async function generatePersonalizedEventAnalysis(event, userProfile) {
  try {
    const prompt = `
You are an expert event advisor for Harbour.Space University. Analyze this event and provide personalized insights for the user.

EVENT INFORMATION:
Title: ${event.title}
Description: ${event.description}
Date: ${new Date(event.date).toLocaleDateString()}
Location: ${event.location}
Category: ${event.category.join(', ')}
Price: ${event.price === 0 ? 'Free' : `€${event.price}`}

USER PROFILE:
Name: ${userProfile.firstName} ${userProfile.lastName}
Role: ${userProfile.isStudent ? 'Student' : userProfile.isStaff ? 'Staff' : 'User'}
${userProfile.isStudent ? `Degree: ${userProfile.degree || 'Not specified'}\nFaculty: ${userProfile.faculty || 'N/A'}\nCourse Year: ${userProfile.course || 'N/A'}\nMajor: ${userProfile.major || 'N/A'}` : ''}
${userProfile.isStaff ? `Department: ${userProfile.department || 'N/A'}\nPosition: ${userProfile.position || 'N/A'}` : ''}
Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
Location: ${userProfile.location || 'Not specified'}

IMPORTANT INSTRUCTIONS:
1. Analyze if this event is professionally/academically relevant to the user's profile
2. If the event is relevant to their field of study or work (e.g., Data Science event for Data Science student, Business event for Business major):
   - Reference their major, degree, faculty in the analysis
   - Explain how it connects to their studies/career
   - Mention specific academic or career benefits
3. If the event is NOT directly relevant (e.g., party/social event for technical student, sports event for business student):
   - Focus on general benefits: networking, relaxation, social connections, cultural experience
   - DO NOT force connections to their academic profile
   - Keep it natural and honest about the event's purpose
4. Always be genuine - don't stretch connections where they don't exist

CRITICAL: You MUST respond ONLY in ENGLISH. Do NOT use any other language.

TASK:
Provide a personalized analysis in JSON format with these fields:

{
  "summary": "Brief 2-3 sentence summary explaining why this event could be valuable for this user. Be honest about the type of value (academic, social, recreational, etc.). MUST BE IN ENGLISH.",
  "benefits": [
    "Specific benefit 1 for this user (in English)",
    "Specific benefit 2 for this user (in English)",
    "Specific benefit 3 for this user (in English)",
    "Specific benefit 4 for this user (in English)"
  ],
  "skillsDevelopment": [
    "Skill 1 they can develop (can be soft skills) - in English",
    "Skill 2 they can develop - in English",
    "Skill 3 they can develop - in English",
    "Skill 4 they can develop - in English"
  ],
  "networkingOpportunities": "Description of networking opportunities (professional for relevant events, social for non-relevant events) - MUST BE IN ENGLISH",
  "careerImpact": "How this event can impact their life - be realistic. Social events help with work-life balance, professional events help with career growth. MUST BE IN ENGLISH.",
  "recommendations": [
    "Actionable recommendation 1 (in English)",
    "Actionable recommendation 2 (in English)",
    "Actionable recommendation 3 (in English)"
  ],
  "similarInterests": ["Related topic 1", "Related topic 2", "Related topic 3"]
}

IMPORTANT RULES:
1. Make the analysis personalized but realistic
2. Don't force academic connections where they don't exist
3. ALL TEXT MUST BE IN ENGLISH - NO RUSSIAN OR OTHER LANGUAGES
4. Be specific and actionable in recommendations
5. Focus on real value, not marketing speak

Return ONLY valid JSON, no additional text.`;

    const groq = getGroqClient();
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
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
    console.error('Groq Personalized Analysis Error:', error);
    throw new Error('Error generating personalized analysis: ' + error.message);
  }
}

/**
 * Analyze event information using Groq AI
 * @param {string} text - The event text to analyze
 * @returns {Promise<Object>} - The analyzed event data
 */
export async function analyzeEventWithGroq(text) {
  try {
    const prompt = `
Analyze this event information and extract key details in English:

${text}

Format the response as JSON with these fields:
{
  "title": "Event Title",
  "date": "Event Date",
  "location": "Event Location",
  "description": "Brief description",
  "key_topics": ["topic1", "topic2", "topic3"],
  "recommendations": ["suggestion1", "suggestion2"]
}

Return ONLY valid JSON, no additional text.`;

    const groq = getGroqClient();
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from AI response');
    }
    
    return JSON.parse(jsonMatch[0]);
    
  } catch (error) {
    console.error('Groq Analysis Error:', error);
    throw new Error('Error analyzing event with Groq: ' + error.message);
  }
}
