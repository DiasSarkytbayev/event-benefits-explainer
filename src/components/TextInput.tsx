import { useState } from 'react'
import { FileText, ArrowLeft, Sparkles } from 'lucide-react'

interface TextInputProps {
  onSubmit: (text: string) => void
  onBack: () => void
  loading: boolean
  error: string | null
}

export default function TextInput({ onSubmit, onBack, loading, error }: TextInputProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSubmit(text)
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
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Describe the Event</h2>
        <p className="text-gray-400">
          Paste or type event details and AI will analyze it automatically
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste event description, announcement, or any text about the event here...

Example:
Join us for the Annual Tech Conference 2025 on March 15-17 at Silicon Valley Convention Center. This three-day event features keynote speakers from leading tech companies, hands-on workshops, and networking opportunities. Registration fee: $299 for students, $499 for professionals."
          className="w-full h-64 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          disabled={loading}
          required
        />

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
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
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          AI will extract event details and generate insights automatically
        </p>
      </form>
    </div>
  )
}
