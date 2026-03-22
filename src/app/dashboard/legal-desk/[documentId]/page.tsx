'use client'

import { useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DocumentChatPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!question.trim()) return
    setLoading(true)

    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')

    const res = await fetch('/api/documents/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, documentId }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Chat with Document</h1>

      <div className="flex-1 overflow-y-auto space-y-4 border rounded-lg p-4 mb-4">
        {messages.length === 0 && (
          <p className="text-slate-400 text-center mt-8">Ask anything about your document...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
  className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
    msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
  }`}
  dangerouslySetInnerHTML={{
    __html: msg.role === 'assistant'
      ? msg.content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br/>')
      : msg.content
  }}
/>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg px-4 py-2 text-sm text-slate-500">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="Ask a question about your document..."
          disabled={loading}
        />
        <Button onClick={handleAsk} disabled={loading || !question.trim()}>
          Ask
        </Button>
      </div>
    </div>
  )
}