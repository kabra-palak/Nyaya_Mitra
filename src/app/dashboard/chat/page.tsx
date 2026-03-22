'use client'

import { useState, useEffect, useRef } from 'react'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => { fetchSessions() }, [])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    if (activeSession === sessionId) { setActiveSession(null); setMessages([]) }
  }

  async function createNewSession() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: 'New Chat' })
      .select().single()
    if (data) {
      setSessions(prev => [data, ...prev])
      setActiveSession(data.id)
      setMessages([])
    }
  }

  async function handleAsk() {
    if (!question.trim() || !activeSession) return
    setLoading(true)
    const currentQuestion = question
    setMessages(prev => [...prev, { role: 'user', content: currentQuestion }])
    setQuestion('')

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: currentQuestion, history, sessionId: activeSession }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      if (messages.length === 0) {
        const title = currentQuestion.slice(0, 40)
        await supabase.from('chat_sessions').update({ title }).eq('id', activeSession)
        fetchSessions()
      }
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
    }
    setLoading(false)
  }

  const suggestedQuestions = [
    'What are my rights if arrested?',
    'How do I file an RTI application?',
    'Process for consumer complaint?',
    'Can landlord evict without notice?',
  ]

  return (
    <div className="flex bg-transparent w-full h-screen">
      {/* Sessions sidebar */}
      <div className="w-64 bg-transparent flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Legal Chat</h3>
          </div>
          <button
            onClick={createNewSession}
            className="w-full bg-slate-900 text-white border-0 rounded-md py-2.5 px-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <span className="text-lg">+</span> New Chat
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 pt-3 pb-2 flex-shrink-0">
          History
        </p>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 min-w-0">
          {sessions.length === 0 && (
            <p className="text-xs text-slate-500 px-3 py-2">No chats yet</p>
          )}
          {sessions.map(session => (
            <div
              key={session.id}
              className={`flex items-center rounded-md transition-all group ${
                activeSession === session.id
                  ? 'bg-slate-50 border border-slate-200'
                  : 'bg-transparent border border-transparent hover:bg-slate-100'
              }`}
            >
              <button
                onClick={() => loadSession(session.id)}
                className={`flex-1 text-left px-3 py-2.5 text-sm rounded-md cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-medium transition-colors ${
                  activeSession === session.id
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-700 group-hover:text-slate-900'
                }`}
                title={session.title}
              >
                💬 {session.title}
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteSessionButton sessionId={session.id} onDelete={deleteSession} />
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">

        {/* Header */}
        <div className="px-6 py-4 bg-transparent flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {activeSession ? sessions.find(s => s.id === activeSession)?.title || 'Legal Chat' : 'Legal Chat'}
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">Powered by Nyaya Mitra AI · Indian Law</p>
          </div>
          <div className="text-slate-600 text-xs font-semibold">
            ⚖️ AI Legal Assistant
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-transparent">

          {!activeSession && (
            <div className="flex flex-col items-center justify-center flex-1 gap-8 py-12">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mx-auto mb-6">
                  ⚖️
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  How can I help you?
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  Ask any legal question in English, Hindi, or any Indian language.
                  Get clear answers grounded in Indian law.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={async () => {
                      await createNewSession()
                      setQuestion(q)
                    }}
                    className="bg-white border border-slate-200 rounded-md px-4 py-3 text-sm text-slate-700 font-medium text-left hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm transition-all leading-snug"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loadingMessages && (
            <div className="text-center text-slate-500 text-sm py-8 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              <span>Loading messages...</span>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-3 animate-in fade-in duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  ⚖️
                </div>
              )}
              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.role === 'assistant'
                    ? msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                        .replace(/###\s?(.*?)(\n|$)/g, '<p class="font-semibold mt-3 mb-1 text-sm">$1</p>')
                        .replace(/\n/g, '<br/>')
                    : msg.content
                }}
              />
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-end animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                ⚖️
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-slate-600 text-sm">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 bg-transparent flex gap-3 items-center flex-shrink-0">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleAsk()}
            placeholder={activeSession ? 'Ask a legal question...' : 'Start a new chat first...'}
            disabled={loading || !activeSession}
            className="flex-1 border border-slate-200 rounded-md px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-400 outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim() || !activeSession}
            className={`py-3 px-5 font-semibold rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              loading || !question.trim() || !activeSession
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  )
}