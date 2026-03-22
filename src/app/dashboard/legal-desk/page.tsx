'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link' // Added this import
import DeleteDocumentButton from '@/components/DeleteDocumentButton'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

// Added a basic interface for better type safety than 'any'
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
        setFile(null) // Reset file input
        fetchDocuments() // Refresh list
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      setMessage('❌ Connection error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Legal Desk</h1>
      <p className="text-slate-500">Upload a PDF, Word doc, or image to analyze.</p>

      <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
        <p className="text-slate-400">Supported: PDF, DOCX, JPG, PNG</p>
        <input
          type="file"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="block mx-auto"
        />
        {file && (
          <p className="text-sm text-slate-600">
            Selected: <strong>{file.name}</strong>
          </p>
        )}
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>

      {message && (
        <p className={`text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Your Documents</h2>
        {documents.length === 0 && !uploading && (
          <p className="text-slate-400 text-sm">No documents yet.</p>
        )}
        
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <Link href={`/dashboard/legal-desk/${doc.id}`} className="flex-1">
              <p className="font-medium">{doc.file_name}</p>
              <p className="text-sm text-slate-400">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/legal-desk/${doc.id}`} className="text-sm text-slate-500">Chat</Link>
              <DeleteDocumentButton documentId={doc.id} storagePath={doc.storage_path} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}