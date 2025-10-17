import { useState, useRef } from 'react'
import { Upload, FileText, Image as ImageIcon, File, ArrowLeft, Sparkles, X, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
  onBack: () => void
  loading: boolean
  error: string | null
}

const FileUpload = ({ onFileUpload, onBack, loading, error }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    const validFiles = files.filter(file => validTypes.includes(file.type))
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-purple-400" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-400" />
    } else {
      return <File className="w-8 h-8 text-blue-400" />
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Upload Files</h2>
        <p className="text-gray-400">
          Upload 1-5 screenshots or documents. AI will analyze them automatically.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium mb-1">Unable to process files</p>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            dragActive
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={handleChange}
          multiple
        />

        {selectedFiles.length === 0 ? (
          <>
            <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">
              Drag and drop files here
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Upload up to 5 files (Images, PDF, Word, PowerPoint)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              Choose Files
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {selectedFiles.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                disabled={loading}
              >
                + Add more files ({5 - selectedFiles.length} remaining)
              </button>
            )}
          </div>
        )}
      </div>

        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing {selectedFiles.length} file(s)...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        )}

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            💡 <strong>Tip:</strong> For best results, use the <strong>"Paste Event URL"</strong> option if the event has a webpage
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Screenshots</p>
            <p className="text-gray-500 text-xs">JPG, PNG, WebP</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <FileText className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">PDF Files</p>
            <p className="text-gray-500 text-xs">Event brochures</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <File className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Documents</p>
            <p className="text-gray-500 text-xs">PPTX, DOCX, TXT</p>
          </div>
        </div>
    </div>
  )
}

export default FileUpload
