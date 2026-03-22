'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import DeleteDocumentButton from '@/components/DeleteDocumentButton'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Document {
  id: string
  file_name: string
  created_at: string
  storage_path: string
}

export default function LegalDeskPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching documents:', error)
    } else if (data) {
      setDocuments(data as Document[])
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(`✅ Uploaded: ${data.fileName}`)
        setFile(null)
        fetchDocuments()
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      setMessage('❌ Connection error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return '📄'
      case 'docx':
      case 'doc':
        return '📝'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️'
      default:
        return '📎'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Legal Desk</h1>
        <p className="text-slate-600 text-lg mt-2">Upload and analyze your legal documents with AI-powered insights</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`p-8 text-center transition-all`}
        >
          <div className="space-y-4">
            {!file ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-md p-8 text-center transition-all cursor-pointer group ${
                    dragActive
                      ? 'border-slate-400 bg-slate-50'
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📄</div>
                  <p className="font-semibold text-slate-700 group-hover:text-slate-800 mb-1 text-lg">Choose File</p>
                  <p className="text-sm text-slate-600">Or drag and drop here</p>
                  <p className="text-xs text-slate-600 mt-2">Supported: PDF, DOCX, JPG, PNG (Max 10MB)</p>
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">{getFileIcon(file.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-600">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    type="button"
                    className="text-slate-400 hover:text-slate-600 font-bold text-2xl leading-none flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-md transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Document'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`px-8 py-4 border-t ${
            message.startsWith('✅')
              ? 'bg-green-50 border-t-green-200 text-green-800'
              : 'bg-red-50 border-t-red-200 text-red-800'
          }`}>
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Documents</h2>
        {documents.length === 0 && !uploading ? (
          <div className="text-center py-12 bg-slate-50 rounded-md border border-slate-200">
            <p className="text-slate-600 text-lg">No documents yet. Upload your first document to get started.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc) => (
              <Link href={`/dashboard/legal-desk/${doc.id}`} key={doc.id}>
                <div className="bg-white p-4 rounded-md border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{getFileIcon(doc.file_name)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-slate-700 transition-colors">
                          {doc.file_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(doc.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-800 px-3 py-1 bg-slate-100 rounded-md transition-colors">
                        💬 Chat
                      </span>
                      <DeleteDocumentButton documentId={doc.id} storagePath={doc.storage_path} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}