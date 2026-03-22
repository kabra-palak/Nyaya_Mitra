'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function KnowledgeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [source, setSource] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload() {
    if (!file || !source.trim()) return
    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('source', source)

    const res = await fetch('/api/admin/knowledge/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      setMessage(`✅ Uploaded ${data.chunks} chunks from "${data.source}"`)
      setFile(null)
      setSource('')
    } else {
      setMessage(`❌ Error: ${data.error}`)
    }

    setUploading(false)
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="font-medium">Upload Legal Document to Knowledge Base</h3>

      <div className="space-y-2">
        <Label>Source Name</Label>
        <Input
          value={source}
          onChange={e => setSource(e.target.value)}
          placeholder="e.g. Indian Penal Code, RTI Act 2005"
        />
      </div>

      <div className="space-y-2">
        <Label>Document (PDF or DOCX)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
          <p className="font-semibold text-indigo-600 group-hover:text-indigo-700 mb-1">Choose File</p>
          <p className="text-sm text-slate-600">Click to browse or drag and drop</p>
          <p className="text-xs text-slate-500 mt-2">Supported: PDF, DOCX</p>
        </button>
        {file && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-medium text-indigo-900">{file.name}</p>
              <p className="text-xs text-indigo-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}
      </div>

      {message && <p className="text-sm">{message}</p>}

      <Button
  type="button"
  onClick={handleUpload}
  disabled={uploading || !file || !source.trim()}
>
  {uploading ? 'Uploading & Embedding...' : 'Upload to Knowledge Base'}
</Button>
    </div>
  )
}