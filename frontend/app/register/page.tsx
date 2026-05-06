'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ROLES = [
  { value: 'JUDGE', label: 'Judge', icon: '⚖️', desc: 'Access JusticeAI', color: 'from-blue-500 to-cyan-500' },
  { value: 'LAWYER', label: 'Lawyer', icon: '📋', desc: 'Access AdvocateAI', color: 'from-purple-500 to-pink-500' },
  { value: 'CLERK', label: 'Court Clerk', icon: '🗂️', desc: 'Access ClerkAI', color: 'from-green-500 to-teal-500' },
  { value: 'PROSECUTOR', label: 'Prosecutor', icon: '⚡', desc: 'Access ProsecutorAI', color: 'from-orange-500 to-red-500' },
  { value: 'LITIGANT', label: 'Litigant', icon: '🌐', desc: 'Access CitizenAI', color: 'from-indigo-500 to-blue-500' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', name: '', role: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.role) { setError('Please select a role'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Registration failed')
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: '#0a0a1a' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="w-full max-w-lg animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-2xl shadow-blue-500/30">⚖️</div>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-white/40 mt-2">Join Lawvanta and get your AI co-pilot</p>
        </div>

        <div className="glass-strong p-8 rounded-3xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>
          )}

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm text-white/60 mb-3">Select Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    form.role === r.value
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-base flex-shrink-0`}>
                    {r.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.label}</div>
                    <div className="text-xs text-white/30">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="input-glass" placeholder="Justice Rajesh Sharma" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input-glass" placeholder="you@court.gov.in" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Phone (Optional)</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-glass" placeholder="+91-9876543210" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="input-glass" placeholder="Min 8 characters" minLength={8} />
            </div>
            <button type="submit" disabled={loading} className="btn-glow w-full py-3 rounded-xl text-base font-semibold mt-2">
              <span>{loading ? 'Creating Account...' : 'Create Account →'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
