'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/dashboard',           icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/chat',      icon: '🤖', label: 'AI Chat' },
  { href: '/dashboard/cases',     icon: '📁', label: 'Cases' },
  { href: '/dashboard/documents', icon: '📄', label: 'Documents' },
  { href: '/dashboard/analytics', icon: '📊', label: 'Analytics' },
]

const AGENT_MAP: Record<string, { name: string; color: string; icon: string }> = {
  JUDGE:      { name: 'JusticeAI',    color: 'from-blue-500 to-cyan-500',    icon: '⚖️' },
  LAWYER:     { name: 'AdvocateAI',   color: 'from-purple-500 to-pink-500',  icon: '📋' },
  CLERK:      { name: 'ClerkAI',      color: 'from-green-500 to-teal-500',   icon: '🗂️' },
  PROSECUTOR: { name: 'ProsecutorAI', color: 'from-orange-500 to-red-500',   icon: '⚡' },
  LITIGANT:   { name: 'CitizenAI',    color: 'from-indigo-500 to-blue-500',  icon: '🌐' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token || !userData) { router.push('/login'); return }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin-slow">⚖️</div>
        <p className="text-white/40">Loading Lawvanta...</p>
      </div>
    </div>
  )

  const agent = AGENT_MAP[user.role] || AGENT_MAP.JUDGE

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 transition-all duration-300 flex flex-col border-r border-white/5`}
        style={{ background: 'rgba(255,255,255,0.02)' }}>

        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0 shadow-lg shadow-blue-500/20">
            ⚖️
          </div>
          {sidebarOpen && <span className="text-lg font-bold text-white">Lawvanta</span>}
        </div>

        {/* Agent badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 p-3 rounded-2xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg flex-shrink-0`}>
                {agent.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{agent.name}</div>
                <div className="text-xs text-white/40">Your AI Agent</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-4">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                {user.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{user.name}</div>
                <div className="text-xs text-white/30 truncate">{user.role}</div>
              </div>
              <button
                onClick={() => { localStorage.clear(); router.push('/login') }}
                className="text-white/30 hover:text-red-400 transition-colors text-lg"
                title="Logout"
              >
                ↩
              </button>
            </div>
          ) : (
            <button
              onClick={() => { localStorage.clear(); router.push('/login') }}
              className="w-full flex justify-center p-2 text-white/30 hover:text-red-400 transition-colors text-xl"
            >
              ↩
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4 border-b border-white/5" style={{ background: 'rgba(10,10,26,0.8)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="text-white/40 hover:text-white transition-colors text-xl">
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/40">{agent.name} Active</span>
          </div>
        </div>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
