'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LegalChatPage() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!question.trim()) return
    setLoading(true)

    const userMessage = { role: 'user', content: question }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setQuestion('')

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history }),
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
      <h1 className="text-2xl font-bold mb-4">Legal Chat</h1>
      <p className="text-slate-500 mb-4">Ask any legal question. Supports Hindi and other Indian languages.</p>

      <div className="flex-1 overflow-y-auto space-y-4 border rounded-lg p-4 mb-4">
        {messages.length === 0 && (
          <p className="text-slate-400 text-center mt-8">Ask any legal question...</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
            }`}>
              {msg.content}
            </div>
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
          placeholder="Ask a legal question..."
          disabled={loading}
        />
        <Button onClick={handleAsk} disabled={loading || !question.trim()}>
          Ask
        </Button>
      </div>
    </div>
  )
}