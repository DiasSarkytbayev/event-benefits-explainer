import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Target, Lightbulb, CheckCircle, ArrowLeft, Calendar, MapPin } from 'lucide-react';

export default function AnalysisResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventData, analysis } = location.state || {};

  if (!eventData || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No data to display</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Parser
        </button>

        {/* Event Info */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{eventData.title || eventData.eventName}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {eventData.date && (
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span>{eventData.date}</span>
              </div>
            )}
            {eventData.location && (
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>{eventData.location}</span>
              </div>
            )}
          </div>

          {eventData.description && (
            <p className="text-gray-300 leading-relaxed">{eventData.description}</p>
          )}
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg border border-pink-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-10 h-10 text-pink-500" />
            <h2 className="text-3xl font-bold">Personalized AI Analysis</h2>
          </div>

          {/* Summary */}
          {analysis.summary && (
            <div className="mb-8">
              <p className="text-lg text-gray-200 leading-relaxed">{analysis.summary}</p>
            </div>
          )}

          {/* Benefits */}
          {analysis.benefits && analysis.benefits.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold">Key Benefits</h3>
              </div>
              <ul className="space-y-3">
                {analysis.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Development */}
          {analysis.skillsDevelopment && analysis.skillsDevelopment.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold">Skills Development</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {analysis.skillsDevelopment.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Career Impact */}
          {analysis.careerImpact && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold">Career Impact</h3>
              </div>
              <p className="text-gray-200 bg-white/5 p-4 rounded-lg">{analysis.careerImpact}</p>
            </div>
          )}

          {/* Key Takeaways */}
          {analysis.keyTakeaways && analysis.keyTakeaways.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Key Takeaways</h3>
              </div>
              <ul className="space-y-3">
                {analysis.keyTakeaways.map((takeaway: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                    <span className="text-yellow-400 text-xl">💡</span>
                    <span className="text-gray-200">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                    <span className="text-yellow-400 text-xl">→</span>
                    <span className="text-gray-200">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-all"
          >
            Analyze Another Event
          </button>
          <button
            onClick={() => navigate('/events')}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            View Harbour.Space Events
          </button>
        </div>
      </div>
    </div>
  );
}
