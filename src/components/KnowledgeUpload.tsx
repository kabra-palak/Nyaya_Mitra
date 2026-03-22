'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function KnowledgeUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [source, setSource] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

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
          type="file"
          accept=".pdf,.docx"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block"
        />
        {file && <p className="text-sm text-slate-500">Selected: {file.name}</p>}
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