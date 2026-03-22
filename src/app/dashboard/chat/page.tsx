'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import DeleteSessionButton from '@/components/DeleteSessionButton'

interface Session {
  id: string
  title: string
  created_at: string
}

export default function LegalChatPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setSessions(data)
  }

  async function loadSession(sessionId: string) {
    setActiveSession(sessionId)
    setLoadingMessages(true)
    const { data } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
    setLoadingMessages(false)
  }

  async function deleteSession(sessionId: string) {
    await supabase.from('chat_sessions').delete().eq('id', sessionId)
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (activeSession === sessionId) {
      setActiveSession(null)
      setMessages([])
    }
  }

  async function createNewSession() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: 'New Chat' })
      .select()
      .single()

    if (data) {
      setSessions(prev => [data, ...prev])
      setActiveSession(data.id)
      setMessages([])
    }
  }

  async function handleAsk() {
    if (!question.trim() || !activeSession) return
    setLoading(true)

    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history, sessionId: activeSession }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])

      if (messages.length === 0) {
        const title = question.slice(0, 40)
        await supabase
          .from('chat_sessions')
          .update({ title })
          .eq('id', activeSession)
        fetchSessions()
      }
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
    }

    setLoading(false)
  }

  return (
    <div className="flex h-[85vh] gap-4">
      {/* Sessions sidebar */}
      <div className="w-56 flex flex-col gap-2 border-r pr-4">
        <Button onClick={createNewSession} className="w-full">+ New Chat</Button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map(session => (
            <div key={session.id} className={`flex items-center rounded hover:bg-slate-100 ${
              activeSession === session.id ? 'bg-slate-100' : ''
            }`}>
              <button
                onClick={() => loadSession(session.id)}
                className="flex-1 text-left px-3 py-2 text-sm truncate"
              >
                {session.title}
              </button>
              <DeleteSessionButton sessionId={session.id} onDelete={deleteSession} />
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Legal Chat</h1>

        <div className="flex-1 overflow-y-auto space-y-4 border rounded-lg p-4 mb-4">
          {!activeSession && (
            <p className="text-slate-400 text-center mt-8">Start a new chat or select an existing one.</p>
          )}
          {loadingMessages && (
            <p className="text-slate-400 text-center mt-8">Loading messages...</p>
          )}
          {activeSession && !loadingMessages && messages.length === 0 && (
            <p className="text-slate-400 text-center mt-8">Ask any legal question...</p>
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
                        .replace(/###\s?(.*?)\n/g, '<h3 class="font-bold mt-2">$1</h3>')
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
            placeholder={activeSession ? 'Ask a legal question...' : 'Start a new chat first...'}
            disabled={loading || !activeSession}
          />
          <Button onClick={handleAsk} disabled={loading || !question.trim() || !activeSession}>
            Ask
          </Button>
        </div>
      </div>
    </div>
  )
}