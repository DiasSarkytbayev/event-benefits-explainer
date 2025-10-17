import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  endDate: {
    type: Date,
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
  },
  organizer: {
    type: String,
    required: true,
    default: 'Harbour.Space',
  },
  category: [{
    type: String,
    enum: ['technology', 'business', 'design', 'science', 'arts', 'sports', 'networking', 'workshop', 'conference', 'seminar', 'hackathon', 'other'],
  }],
  targetAudience: [{
    type: String,
    // Examples: 'students', 'staff', 'faculty:engineering', 'course:3'
  }],
  price: {
    type: Number,
    default: 0,
  },
  maxParticipants: {
    type: Number,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for searching
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
