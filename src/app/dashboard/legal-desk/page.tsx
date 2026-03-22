'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function LegalDeskPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

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

    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      setMessage(`✅ Uploaded: ${data.fileName}`)
    } else {
      setMessage(`❌ Error: ${data.error}`)
    }

    setUploading(false)
  }

  return (
    <div className="space-y-6">
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
          <p className="text-sm text-slate-600">Selected: <strong>{file.name}</strong></p>
        )}
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>

      {message && <p className="text-sm">{message}</p>}
    </div>
  )
}