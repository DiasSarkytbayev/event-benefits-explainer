import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Link as LinkIcon, Upload, FileText, ArrowRight } from 'lucide-react';

type InputMethod = 'url' | 'file' | 'text' | null;

// API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (import.meta.env.MODE === 'production' 
    ? 'https://event-benefits-explainer-4.onrender.com'
    : 'http://localhost:5000');

export default function Home() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (selectedMethod === 'url') {
        response = await fetch(`${API_BASE_URL}/api/parse/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      } else if (selectedMethod === 'file') {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        
        response = await fetch(`${API_BASE_URL}/api/parse/file`, {
          method: 'POST',
          body: formData,
        });
      } else if (selectedMethod === 'text') {
        response = await fetch(`${API_BASE_URL}/api/parse/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      }

      const data = await response!.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to parse event');
      }

      // Redirect to analysis page with event data
      navigate('/analyze', { state: { eventData: data.eventData, analysis: data.analysis } });
    } catch (err: any) {
      setError(err.message || 'Failed to process input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="w-16 h-16 text-pink-500 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Event Benefits Explainer
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover personalized benefits of any event with AI analysis
          </p>
          <div className="mt-4 inline-block px-6 py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-400 text-sm font-medium">
            Powered by Harbour.Space University
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!selectedMethod ? (
            /* Method Selection */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setSelectedMethod('url')}
                className="group p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
              >
                <LinkIcon className="w-12 h-12 text-pink-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Event Link</h3>
                <p className="text-gray-400 text-sm">
                  Paste event URL (Eventbrite, Meetup, etc.)
                </p>
              </button>

              <button
                onClick={() => setSelectedMethod('file')}
                className="group p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Upload File</h3>
                <p className="text-gray-400 text-sm">
                  PNG, JPEG, PDF, PowerPoint
                </p>
              </button>

              <button
                onClick={() => setSelectedMethod('text')}
                className="group p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Enter Text</h3>
                <p className="text-gray-400 text-sm">
                  Describe the event manually
                </p>
              </button>
            </div>
          ) : (
            /* Input Form */
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
              <button
                onClick={() => {
                  setSelectedMethod(null);
                  setError(null);
                }}
                className="mb-6 text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {selectedMethod === 'url' && (
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Paste event link
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.eventbrite.com/e/..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                  />
                </div>
              )}

              {selectedMethod === 'file' && (
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Upload file
                  </label>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
                    <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".png,.jpg,.jpeg,.pdf,.ppt,.pptx"
                      multiple
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-purple-400 hover:text-purple-300"
                    >
                      Click to select files
                    </label>
                    <p className="text-sm text-gray-400 mt-2">
                      PNG, JPEG, PDF, PowerPoint
                    </p>
                    {files.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-300">Selected files: {files.length}</p>
                        {files.map((file, i) => (
                          <p key={i} className="text-xs text-gray-400">{file.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedMethod === 'text' && (
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Describe the event
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    placeholder="Event name, date, location, description..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || (selectedMethod === 'url' && !url) || (selectedMethod === 'file' && files.length === 0) || (selectedMethod === 'text' && !text)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze with AI
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Link to Harbour.Space Events */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">or</p>
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 hover:border-white/50 transition-all"
            >
              View Harbour.Space Events →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
