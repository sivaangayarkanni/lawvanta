'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const QUICK_ACTIONS = [
  { href: '/dashboard/chat',      icon: '🤖', label: 'Chat with AI',    desc: 'Ask anything',          color: 'from-blue-500 to-cyan-500' },
  { href: '/dashboard/cases',     icon: '📁', label: 'My Cases',        desc: 'View & manage',         color: 'from-purple-500 to-pink-500' },
  { href: '/dashboard/documents', icon: '📄', label: 'Documents',       desc: 'Upload & analyze',      color: 'from-green-500 to-teal-500' },
  { href: '/dashboard/analytics', icon: '📊', label: 'Analytics',       desc: 'View insights',         color: 'from-orange-500 to-red-500' },
]

const AGENT_MAP: Record<string, { name: string; color: string; icon: string; prompts: string[] }> = {
  JUDGE:      { name: 'JusticeAI',    color: 'from-blue-500 to-cyan-500',    icon: '⚖️', prompts: ['Summarize pending cases', 'Draft a bail order', 'Find IPC Section 302 precedents'] },
  LAWYER:     { name: 'AdvocateAI',   color: 'from-purple-500 to-pink-500',  icon: '📋', prompts: ['Draft anticipatory bail petition', 'Analyze evidence', 'Suggest arguments for Section 420'] },
  CLERK:      { name: 'ClerkAI',      color: 'from-green-500 to-teal-500',   icon: '🗂️', prompts: ["Generate today's cause list", 'Create notice for CS/2024/001', 'Check filing requirements'] },
  PROSECUTOR: { name: 'ProsecutorAI', color: 'from-orange-500 to-red-500',   icon: '⚡', prompts: ['Draft charge sheet', 'Prepare witness questions', 'Track case CR/2024/045'] },
  LITIGANT:   { name: 'CitizenAI',    color: 'from-indigo-500 to-blue-500',  icon: '🌐', prompts: ['Check my case status', 'What documents do I need?', 'When is my next hearing?'] },
}

const RECENT = [
  { title: 'Case WP/2024/123 assigned', time: '2h ago', type: 'info' },
  { title: 'Document analysis completed', time: '5h ago', type: 'success' },
  { title: 'Hearing scheduled: CS/2024/001', time: '1d ago', type: 'warning' },
  { title: 'New precedent found for IPC 302', time: '2d ago', type: 'info' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  if (!user) return null

  const agent = AGENT_MAP[user.role] || AGENT_MAP.JUDGE
  const firstName = user.name?.split(' ').pop() || user.name

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">
            Good morning, <span className="text-shimmer">{firstName}</span> 👋
          </h1>
          <p className="text-white/40 mt-1">{agent.name} is ready to assist you today</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-lg`}>
          {agent.icon}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Cases', value: '12', icon: '📁', change: '+2 this week' },
          { label: 'Hearings This Week', value: '5', icon: '📅', change: 'Next: Tomorrow' },
          { label: 'Docs Processed', value: '28', icon: '📄', change: '+5 today' },
          { label: 'AI Interactions', value: '156', icon: '🤖', change: 'This month' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs text-white/30">{s.change}</span>
            </div>
            <div className="text-3xl font-black text-white">{s.value}</div>
            <div className="text-sm text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((a, i) => (
            <Link key={i} href={a.href} className="glass card-3d p-5 rounded-2xl group block">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                {a.icon}
              </div>
              <div className="font-semibold text-white">{a.label}</div>
              <div className="text-xs text-white/40 mt-1">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  r.type === 'success' ? 'bg-green-400' : r.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-sm text-white/80">{r.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat Prompt */}
        <div className="glass p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl`}>
              {agent.icon}
            </div>
            <div>
              <div className="font-bold text-white">{agent.name}</div>
              <div className="text-xs text-white/40">Try asking...</div>
            </div>
          </div>
          <div className="space-y-2">
            {agent.prompts.map((p, i) => (
              <Link
                key={i}
                href={`/dashboard/chat?q=${encodeURIComponent(p)}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
              >
                <span className="text-blue-400 text-sm">→</span>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">{p}</span>
              </Link>
            ))}
          </div>
          <Link href="/dashboard/chat" className="btn-glow w-full py-3 rounded-xl text-sm font-semibold mt-4 block text-center">
            <span>Open AI Chat →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
