'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const FEATURES = [
  { icon: '⚖️', title: 'JusticeAI', sub: 'For Judges', desc: 'Case summaries, precedent analysis, order drafting & hearing prep', color: 'from-blue-500 to-cyan-500' },
  { icon: '📋', title: 'AdvocateAI', sub: 'For Lawyers', desc: 'Pleading drafting, evidence organization & strategy simulation', color: 'from-purple-500 to-pink-500' },
  { icon: '🗂️', title: 'ClerkAI', sub: 'For Court Clerks', desc: 'Filing validation, cause list generation & notice automation', color: 'from-green-500 to-teal-500' },
  { icon: '⚡', title: 'ProsecutorAI', sub: 'For Prosecutors', desc: 'Charge sheet drafting, witness preparation & case tracking', color: 'from-orange-500 to-red-500' },
  { icon: '🌐', title: 'CitizenAI', sub: 'For Litigants', desc: 'Case status, document help & next-step guidance in simple language', color: 'from-indigo-500 to-blue-500' },
]

const STATS = [
  { value: '50K+', label: 'Cases Processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '5x', label: 'Faster Drafting' },
  { value: '8+', label: 'Indian Languages' },
]

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('scroll', handleScroll)
    return () => { window.removeEventListener('mousemove', handleMouse); window.removeEventListener('scroll', handleScroll) }
  }, [])

  return (
    <div className="min-h-screen bg-animated relative overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Mouse follower */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto glass flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
              ⚖️
            </div>
            <span className="text-xl font-bold text-white">Lawvanta</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Agents', 'Security'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-white/60 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/70 hover:text-white px-4 py-2 rounded-xl transition-colors">
              Login
            </Link>
            <Link href="/register" className="btn-glow px-5 py-2 text-sm rounded-xl">
              <span>Get Started →</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-5xl mx-auto text-center animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-blue-400 mb-8 border border-blue-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Court Operating System for India
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-white">Your Personal</span>
            <br />
            <span className="text-shimmer">AI Co-Pilot</span>
            <br />
            <span className="text-white">in the Courtroom</span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Lawvanta transforms chaotic court processes into a smooth, guided experience through
            personalized AI agents for every role — judges, lawyers, clerks, and litigants.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register" className="btn-glow px-8 py-4 text-base rounded-2xl inline-block">
              <span>Start Free Trial →</span>
            </Link>
            <Link href="/login" className="glass px-8 py-4 text-base rounded-2xl text-white/80 hover:text-white transition-all hover:bg-white/10 inline-block text-center">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="glass p-4 rounded-2xl text-center card-3d">
                <div className="text-3xl font-black text-shimmer">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D floating scales */}
        <div className="absolute right-10 top-1/3 hidden xl:block animate-spin-slow opacity-10">
          <div className="text-9xl">⚖️</div>
        </div>
      </section>

      {/* ── AGENTS ── */}
      <section id="agents" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge badge-blue mb-4">AI AGENTS</div>
            <h2 className="text-5xl font-black text-white mb-4">Meet Your AI Team</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Every role gets a dedicated AI agent tuned to their specific needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass card-3d p-6 rounded-2xl group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <div className="badge badge-blue mb-3 text-xs">{f.sub}</div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge badge-purple mb-4">FEATURES</div>
            <h2 className="text-5xl font-black text-white mb-4">Everything You Need</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'AI-Powered Chat', desc: 'Real-time conversations with memory, context, and legal knowledge' },
              { icon: '📄', title: 'Document Intelligence', desc: 'Auto-summarize, extract issues, suggest citations from any legal document' },
              { icon: '⚡', title: 'One-Click Orders', desc: 'Generate bail orders, notices, summons in seconds with proper legal format' },
              { icon: '🔍', title: 'Precedent Search', desc: 'Semantic search across IPC, CrPC, CPC, Evidence Act and SC judgments' },
              { icon: '🌐', title: 'Multi-Language', desc: 'English, Hindi, Tamil, Telugu and 5 more Indian languages' },
              { icon: '🔒', title: 'Bank-Grade Security', desc: 'End-to-end encryption, audit logs, data residency in India' },
            ].map((f, i) => (
              <div key={i} className="glass-strong p-6 rounded-2xl card-3d">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong p-16 rounded-3xl neon-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-5xl font-black text-white mb-4">Ready to Transform<br />Your Court Experience?</h2>
              <p className="text-white/50 text-lg mb-8">Join legal professionals already using Lawvanta</p>
              <Link href="/register" className="btn-glow px-10 py-4 text-lg rounded-2xl inline-block">
                <span>Get Started Free →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/30 text-sm">
        © 2026 Lawvanta · Made with ⚖️ in India
      </footer>
    </div>
  )
}
