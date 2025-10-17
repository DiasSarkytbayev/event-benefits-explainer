import express from 'express';
import { body, validationResult } from 'express-validator';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, search, upcoming } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Show only upcoming events
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = 'upcoming';
    }
    
    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }
    
    const events = await Event.find(query)
      .populate('createdBy', 'profile.firstName profile.lastName email')
      .sort({ date: 1 });
    
    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'profile.firstName profile.lastName email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event (Admin only)
// @access  Private/Admin
router.post('/', [protect, admin], [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required'),
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (Admin only)
// @access  Private/Admin
router.put('/:id', [protect, admin], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update event
    Object.assign(event, req.body);
    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (Admin only)
// @access  Private/Admin
router.delete('/:id', [protect, admin], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if event is full
    if (event.maxParticipants && event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Create registration
    const registration = await Registration.create({
      event: event._id,
      user: req.user._id,
    });

    // Update event registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      success: true,
      registration,
    });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/events/:id/check-registration
// @desc    Check if user is registered for an event
// @access  Private
router.get('/:id/check-registration', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.id,
      user: req.user._id,
    });

    res.json({
      success: true,
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/events/:id/unregister
// @desc    Unregister from an event
// @access  Private
router.delete('/:id/unregister', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find and delete registration
    const registration = await Registration.findOneAndDelete({
      event: event._id,
      user: req.user._id,
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Update event registered count
    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.json({
      success: true,
      message: 'Successfully unregistered from the event',
    });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/events/:id/registrations
// @desc    Get registrations for an event (Admin only)
// @access  Private/Admin
router.get('/:id/registrations', [protect, admin], async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id })
      .populate('user', 'email profile');

    res.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
