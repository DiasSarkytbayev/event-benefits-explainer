import { useState } from 'react'
import { Link2, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react'

interface URLInputProps {
  onSubmit: (url: string) => void
  onBack: () => void
  loading: boolean
  error: string | null
}

const URLInput = ({ onSubmit, onBack, loading, error }: URLInputProps) => {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      // Validate URL
      try {
        new URL(url)
        onSubmit(url)
      } catch {
        // Invalid URL - will be handled by parent
      }
    }
  }

  return (
    <div className="glass-card p-8 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        disabled={loading}
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Link2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Paste Event URL</h2>
        <p className="text-gray-400">
          AI will automatically extract and analyze the event
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://eventbrite.com/e/..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Event
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          AI will extract event details and generate insights automatically
        </p>
      </form>
    </div>
  )
}

export default URLInput
