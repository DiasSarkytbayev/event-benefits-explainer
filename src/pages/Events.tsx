import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../lib/api';
import { Calendar, MapPin, Users, DollarSign, Search, Filter, Plus, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  category: string[];
  price: number;
  registeredCount: number;
  maxParticipants?: number;
  status: string;
}

export default function Events() {
  const { user, fetchUser } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'technology', 'business', 'design', 'science', 'arts', 'sports', 'networking', 'workshop'];

  useEffect(() => {
    // Load user if token exists
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      // Filter by category
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      const response = await eventsAPI.getAll(params);
      
      // Sort by date (newest first)
      const sortedEvents = response.data.events.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate events into upcoming and past
  const now = new Date();
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ascending
  
  const pastEvents = filteredEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Event Parser
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events</h1>
              <p className="text-xl text-blue-100">Find and join amazing events at Harbour.Space</p>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/create-event"
                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Event
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No events found</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Upcoming Events
                  <span className="text-sm font-normal text-gray-500">({upcomingEvents.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-gray-500" />
                  Past Events
                  <span className="text-sm font-normal text-gray-500">({pastEvents.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                  {pastEvents.map((event) => (
                    <EventCard key={event._id} event={event} isPast />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, isPast = false }: { event: any; isPast?: boolean }) {
  return (
    <Link
      to={`/events/${event._id}`}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group ${isPast ? 'border-2 border-gray-200' : ''}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || 'https://via.placeholder.com/400x300?text=Event'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 ${isPast ? 'bg-gray-500' : 'bg-blue-600'} text-white text-xs font-semibold rounded-full`}>
            {event.category[0]}
          </span>
        </div>
        {isPast && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gray-800 bg-opacity-75 text-white text-xs font-semibold rounded-full">
              Past Event
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            {format(new Date(event.date), 'MMM dd, yyyy • HH:mm')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            {event.location}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              {event.registeredCount}/{event.maxParticipants || '∞'}
            </div>
            <div className="flex items-center text-blue-600 font-semibold">
              <DollarSign className="w-4 h-4" />
              {event.price === 0 ? 'Free' : `€${event.price}`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
