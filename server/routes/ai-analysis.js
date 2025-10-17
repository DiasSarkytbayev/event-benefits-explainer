import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';
import { generatePersonalizedEventAnalysis } from '../services/groqService.js';

const router = express.Router();

// @route   POST /api/ai-analysis/:eventId
// @desc    Get personalized AI analysis for an event
// @access  Private
router.post('/:eventId', protect, async (req, res) => {
  try {
    // Get event
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get user profile from authenticated user
    const userProfile = req.user.profile;

    // Generate personalized analysis using Gemini AI
    const analysisResult = await generatePersonalizedEventAnalysis(event, userProfile);

    res.json({
      success: true,
      event: {
        id: event._id,
        title: event.title,
      },
      user: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        role: req.user.role,
      },
      ...analysisResult,
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI analysis',
      message: error.message 
    });
  }
});

export default router;
