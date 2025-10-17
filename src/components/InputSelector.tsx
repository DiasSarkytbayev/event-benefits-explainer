import { Link2, Upload, Edit3 } from 'lucide-react'

interface InputSelectorProps {
  onSelectURL: () => void
  onSelectFile: () => void
  onSelectManual: () => void
}

const InputSelector = ({ onSelectURL, onSelectFile, onSelectManual }: InputSelectorProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          How would you like to add event information?
        </h2>
        <p className="text-gray-400 text-lg">
          Choose your preferred method to get started
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* URL Option */}
        <button
          onClick={onSelectURL}
          className="group relative bg-black border-2 border-pink-500/30 hover:border-pink-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 neon-glow-pink"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
              <Link2 className="w-8 h-8 text-pink-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              Paste URL
            </h3>
            <p className="text-gray-400 mb-4">
              Enter a link to an event page and we'll extract all the details automatically
            </p>
            
            <div className="inline-block px-4 py-2 bg-pink-500/10 rounded-lg text-pink-500 text-sm font-medium">
              Recommended
            </div>
          </div>
        </button>

        {/* File Upload Option */}
        <button
          onClick={onSelectFile}
          className="group relative bg-black border-2 border-blue-500/30 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 neon-glow-blue"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              Upload File
            </h3>
            <p className="text-gray-400 mb-4">
              Upload images, PDFs, PowerPoint, or documents with event information
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-blue-500/10 rounded text-blue-500 text-xs">PDF</span>
              <span className="px-3 py-1 bg-blue-500/10 rounded text-blue-500 text-xs">Image</span>
              <span className="px-3 py-1 bg-blue-500/10 rounded text-blue-500 text-xs">PPTX</span>
            </div>
          </div>
        </button>

        {/* Manual Entry Option */}
        <button
          onClick={onSelectManual}
          className="group relative bg-black border-2 border-purple-500/30 hover:border-purple-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 neon-glow-purple"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <Edit3 className="w-8 h-8 text-purple-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              Manual Entry
            </h3>
            <p className="text-gray-400 mb-4">
              Fill out the event details manually using our simple form
            </p>
            
            <div className="inline-block px-4 py-2 bg-purple-500/10 rounded-lg text-purple-500 text-sm font-medium">
              Full Control
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default InputSelector
