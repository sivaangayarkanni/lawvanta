'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface Message {
  id: string; role: 'USER' | 'ASSISTANT'; content: string; createdAt: Date
  metadata?: { model?: string; provider?: string; usage?: { total_tokens?: number } }
}

const AGENT_MAP: Record<string, { name: string; color: string; icon: string }> = {
  JUDGE:      { name: 'JusticeAI',    color: 'from-blue-500 to-cyan-500',    icon: '⚖️' },
  LAWYER:     { name: 'AdvocateAI',   color: 'from-purple-500 to-pink-500',  icon: '📋' },
  CLERK:      { name: 'ClerkAI',      color: 'from-green-500 to-teal-500',   icon: '🗂️' },
  PROSECUTOR: { name: 'ProsecutorAI', color: 'from-orange-500 to-red-500',   icon: '⚡' },
  LITIGANT:   { name: 'CitizenAI',    color: 'from-indigo-500 to-blue-500',  icon: '🌐' },
}

const SUGGESTIONS: Record<string, string[]> = {
  JUDGE:      ['Summarize pending cases', 'Draft a bail order for CR/2024/045', 'Find precedents on IPC Section 302', 'Prepare hearing notes for tomorrow'],
  LAWYER:     ['Draft anticipatory bail petition', 'Analyze evidence in my case', 'Suggest arguments for Section 420 IPC', 'Prepare cross-examination questions'],
  CLERK:      ["Generate today's cause list", 'Create notice for CS/2024/001', 'Check filing requirements for civil suit', 'Schedule hearings for next week'],
  PROSECUTOR: ['Draft charge sheet for CR/2024/045', 'Prepare witness examination questions', 'Find criminal law precedents', 'Track case progress'],
  LITIGANT:   ['What is the status of my case?', 'What documents do I need to file?', 'When is my next hearing?', 'Explain the court process to me'],
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) {
      const parsed = JSON.parse(u)
      setUser(parsed)
      createConversation(parsed)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && convId) { setInput(q) }
  }, [searchParams, convId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const createConversation = async (u: any) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: 'New Chat' }),
      })
      const data = await res.json()
      if (data.success) setConvId(data.data.id)
    } catch {}
  }

  const send = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || !convId || loading) return
    const token = localStorage.getItem('token')

    const userMsg: Message = { id: Date.now().toString(), role: 'USER', content: msg, createdAt: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: msg }),
      })
      const data = await res.json()
      if (data.success) {
        setMessages(prev => [...prev, data.data.aiMessage])
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ASSISTANT', content: 'Sorry, I encountered an error. Please try again.', createdAt: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (!user) return null
  const agent = AGENT_MAP[user.role] || AGENT_MAP.JUDGE
  const suggestions = SUGGESTIONS[user.role] || SUGGESTIONS.JUDGE

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 p-4 glass rounded-2xl">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-lg`}>
          {agent.icon}
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">{agent.name}</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/40">Online · Ready to assist</span>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => { setMessages([]); createConversation(user) }}
            className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-4xl mb-6 shadow-2xl`}>
              {agent.icon}
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Hello, {user.name?.split(' ')[0]}!</h2>
            <p className="text-white/40 mb-8 max-w-sm">I'm {agent.name}, your personal AI legal assistant. How can I help you today?</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="p-3 glass rounded-xl text-left text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <span className="text-blue-400 mr-2">→</span>{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ASSISTANT' && (
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg flex-shrink-0 shadow-lg`}>
                {agent.icon}
              </div>
            )}
            <div className={msg.role === 'USER' ? 'chat-user' : 'chat-ai'}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'ASSISTANT' && msg.metadata?.model && (
                <p className="text-xs opacity-40 mt-2 pt-2 border-t border-white/10">
                  ⚡ {msg.metadata.provider === 'groq' ? 'Groq' : msg.metadata.provider} · {msg.metadata.model}
                  {msg.metadata.usage?.total_tokens ? ` · ${msg.metadata.usage.total_tokens} tokens` : ''}
                </p>
              )}
            </div>
            {msg.role === 'USER' && (
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {user.name?.[0]}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg flex-shrink-0`}>
              {agent.icon}
            </div>
            <div className="chat-ai flex items-center gap-2">
              <div className="flex gap-1">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <span className="text-xs text-white/30 ml-2">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 glass p-3 rounded-2xl">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask ${agent.name} anything...`}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none resize-none py-2 px-1"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Send ↑</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs text-white/20">Enter to send · Shift+Enter for new line</span>
          <span className="text-xs text-white/20">⚡ Groq · llama-3.3-70b-versatile</span>
        </div>
      </div>
    </div>
  )
}
