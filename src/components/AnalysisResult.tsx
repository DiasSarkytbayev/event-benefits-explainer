import { CheckCircle, TrendingUp, Lightbulb, Star, RefreshCw } from 'lucide-react'
import { AnalysisResponse, EventData } from '../types'

interface AnalysisResultProps {
  analysis: AnalysisResponse
  eventData: EventData
  onReset: () => void
}

const AnalysisResult = ({ analysis, eventData, onReset }: AnalysisResultProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500'
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500'
    return 'bg-orange-500/20 border-orange-500'
  }

  return (
    <div className="space-y-6">
      {/* Event Summary Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">{eventData.eventName}</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Type:</span>
            <span className="text-white ml-2 font-medium">{eventData.eventType}</span>
          </div>
          <div>
            <span className="text-slate-400">Date:</span>
            <span className="text-white ml-2 font-medium">{eventData.date}</span>
          </div>
          <div>
            <span className="text-slate-400">Location:</span>
            <span className="text-white ml-2 font-medium">{eventData.location}</span>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`${getScoreBg(analysis.overallScore)} backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 text-center`}>
        <Star className={`w-16 h-16 ${getScoreColor(analysis.overallScore)} mx-auto mb-4`} />
        <h3 className="text-3xl font-bold text-white mb-2">
          Overall Score: <span className={getScoreColor(analysis.overallScore)}>{analysis.overallScore}/100</span>
        </h3>
        <p className="text-slate-300">
          {analysis.overallScore >= 80 && 'Highly Recommended Event'}
          {analysis.overallScore >= 60 && analysis.overallScore < 80 && 'Good Event Worth Considering'}
          {analysis.overallScore < 60 && 'Consider Your Options'}
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Key Benefits</h3>
        </div>
        <ul className="space-y-3">
          {analysis.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-300">
              <span className="text-green-400 mt-1">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Personalized Insights */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Personalized Insights</h3>
        </div>
        <p className="text-slate-200 leading-relaxed">{analysis.personalizedInsights}</p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Key Takeaways</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {analysis.keyTakeaways.map((takeaway, index) => (
            <div
              key={index}
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
            >
              <p className="text-slate-300">{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-300">
              <span className="text-blue-400 mt-1">→</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Analyze Another Event
      </button>
    </div>
  )
}

export default AnalysisResult
