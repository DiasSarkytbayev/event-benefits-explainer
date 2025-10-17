import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, aiAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { 
  Calendar, MapPin, Users, DollarSign, ArrowLeft, 
  Sparkles, TrendingUp, Target, Lightbulb, CheckCircle, Edit 
} from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  endDate?: string;
  location: string;
  organizer: string;
  category: string[];
  price: number;
  registeredCount: number;
  maxParticipants?: number;
  status: string;
}

interface AIAnalysis {
  relevanceScore: number;
  summary: string;
  benefits: string[];
  skillsDevelopment: string[];
  networkingOpportunities: string;
  careerImpact: string;
  recommendations: string[];
  similarInterests: string[];
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
      checkRegistration();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getById(id!);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    if (!user) {
      setRegistered(false);
      return;
    }
    
    try {
      const response = await eventsAPI.checkRegistration(id!);
      setRegistered(response.data.isRegistered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await eventsAPI.register(id!);
      setRegistered(true);
      fetchEvent(); // Refresh to update count
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to register');
    }
  };

  const handleUnregister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    try {
      await eventsAPI.unregister(id!);
      setRegistered(false);
      fetchEvent(); // Refresh to update count
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to unregister');
    }
  };

  const handleAIAnalysis = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAnalyzing(true);
      const response = await aiAPI.analyzeEvent(id!);
      setAnalysis(response.data.analysis);
      setShowAnalysis(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Blur Background */}
      <div className="relative h-[500px] overflow-hidden bg-gray-900">
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
          style={{ 
            backgroundImage: `url(${event.image || 'https://via.placeholder.com/1200x400?text=Event'})`,
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Main Image (not stretched) */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src={event.image || 'https://via.placeholder.com/1200x400?text=Event'}
            alt={event.title}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-lg transition-colors shadow-lg z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        {/* Edit Button (Admin only) */}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate(`/events/${id}/edit`)}
            className="absolute top-6 left-28 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 backdrop-blur-sm text-white rounded-lg transition-colors shadow-lg z-10"
          >
            <Edit className="w-5 h-5" />
            Edit
          </button>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-6 right-6 flex gap-2 z-10">
          {event.category.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Date & Time</p>
                    <p className="font-semibold text-gray-900">{format(new Date(event.date), 'MMM dd, yyyy')}</p>
                    <p className="text-sm text-gray-600">{format(new Date(event.date), 'HH:mm')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600 font-medium mb-1">Participants</p>
                    <p className="font-semibold text-gray-900">
                      {event.registeredCount} registered
                      {event.maxParticipants && ` / ${event.maxParticipants} max`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 font-medium mb-1">Entry Fee</p>
                    <p className="font-semibold text-gray-900">
                      {event.price === 0 ? 'Free Event' : `€${event.price}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>

              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-gray-600">
                  Organized by <span className="font-semibold text-gray-900">{event.organizer}</span>
                </p>
              </div>
            </div>

            {/* AI Analysis Section */}
            {showAnalysis && analysis && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Personalized AI Analysis</h2>
                </div>

                {/* Summary */}
                <div className="mb-6 p-4 bg-white rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wide">Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Key Benefits</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Development */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Skills You'll Develop</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillsDevelopment.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Impact */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Career Impact</h3>
                  </div>
                  <p className="text-gray-700">{analysis.careerImpact}</p>
                </div>

                {/* Recommendations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">💡</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 space-y-4">
              {/* Registration Button */}
              {registered ? (
                <div className="space-y-3">
                  <div className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border-2 border-green-300">
                    <CheckCircle className="w-5 h-5" />
                    Already Registered
                  </div>
                  <button
                    onClick={handleUnregister}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={event.maxParticipants !== undefined && event.registeredCount >= event.maxParticipants}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {event.maxParticipants && event.registeredCount >= event.maxParticipants ? 'Event Full' : 'Register Now'}
                </button>
              )}

              <button
                onClick={handleAIAnalysis}
                disabled={analyzing || !user}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {analyzing ? 'Analyzing...' : 'AI Analysis'}
              </button>

              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  <a href="/login" className="text-blue-600 hover:underline">Sign in</a> to register and get AI analysis
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
