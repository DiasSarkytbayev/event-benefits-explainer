import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, DollarSign, Clock, Sparkles, Edit3 } from 'lucide-react'
import { EventData } from '../types'

interface EventFormProps {
  initialData: Partial<EventData>
  onSubmit: (data: EventData) => void
  onBack: () => void
  loading: boolean
}

const EventForm = ({ initialData, onSubmit, onBack, loading }: EventFormProps) => {
  const [formData, setFormData] = useState<EventData>({
    eventName: '',
    eventType: '',
    date: '',
    location: '',
    description: '',
    organizer: '',
    targetAudience: '',
    cost: '',
    duration: '',
    additionalInfo: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClass =
    'w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
  const labelClass = 'block text-gray-300 font-medium mb-2'

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
      >
        ← Back to options
      </button>

      <div className="bg-black border-2 border-purple-500/30 rounded-2xl p-8 neon-glow-purple">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Event Details</h2>
            <p className="text-gray-400">Fill in the information about the event</p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className={labelClass}>
              Event Name *
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g., Tech Conference 2024"
            />
          </div>

          {/* Event Type */}
          <div>
            <label htmlFor="eventType" className={labelClass}>
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select type</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="networking">Networking</option>
              <option value="webinar">Webinar</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className={labelClass}>
              <Calendar className="w-4 h-4 inline mr-2" />
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={labelClass}>
              <MapPin className="w-4 h-4 inline mr-2" />
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g., New York, NY or Online"
            />
          </div>

          {/* Organizer */}
          <div>
            <label htmlFor="organizer" className={labelClass}>
              Organizer *
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g., Tech Corp"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="targetAudience" className={labelClass}>
              <Users className="w-4 h-4 inline mr-2" />
              Target Audience *
            </label>
            <input
              type="text"
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g., Developers, Students"
            />
          </div>

          {/* Cost */}
          <div>
            <label htmlFor="cost" className={labelClass}>
              <DollarSign className="w-4 h-4 inline mr-2" />
              Cost *
            </label>
            <input
              type="text"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g., Free, $50, $100-200"
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className={labelClass}>
              <Clock className="w-4 h-4 inline mr-2" />
              Duration *
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="e.g., 2 hours, 3 days"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className={inputClass}
            placeholder="Describe the event, its goals, and what attendees can expect..."
          />
        </div>

        {/* Additional Info */}
        <div>
          <label htmlFor="additionalInfo" className={labelClass}>
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Any other relevant details, speakers, agenda, etc."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg neon-glow-purple"
        >
          {loading ? (
            'Analyzing...'
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Event Benefits
            </>
          )}
        </button>
      </form>
      </div>
    </div>
  )
}

export default EventForm
