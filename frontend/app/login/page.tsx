'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DEMO_ACCOUNTS = [
  { role: 'Judge', email: 'judge.sharma@court.gov.in', color: 'from-blue-500 to-cyan-500', icon: '⚖️' },
  { role: 'Lawyer', email: 'adv.mehta@lawfirm.com', color: 'from-purple-500 to-pink-500', icon: '📋' },
  { role: 'Clerk', email: 'clerk.kumar@court.gov.in', color: 'from-green-500 to-teal-500', icon: '🗂️' },
  { role: 'Prosecutor', email: 'pp.singh@gov.in', color: 'from-orange-500 to-red-500', icon: '⚡' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Mock auth - works without backend
    const mockUsers: Record<string, any> = {
      'judge.sharma@court.gov.in':   { id: '1', name: 'Justice Rajesh Sharma',  role: 'JUDGE',      email: 'judge.sharma@court.gov.in' },
      'adv.mehta@lawfirm.com':       { id: '2', name: 'Adv. Priya Mehta',       role: 'LAWYER',     email: 'adv.mehta@lawfirm.com' },
      'clerk.kumar@court.gov.in':    { id: '3', name: 'Ramesh Kumar',            role: 'CLERK',      email: 'clerk.kumar@court.gov.in' },
      'pp.singh@gov.in':             { id: '4', name: 'PP Vikram Singh',         role: 'PROSECUTOR', email: 'pp.singh@gov.in' },
    }

    try {
      // Try real backend first
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).catch(() => null)

      if (res && res.ok) {
        const data = await res.json()
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        router.push('/dashboard')
        return
      }

      // Fallback: mock login
      const mockUser = mockUsers[email.toLowerCase()]
      if (mockUser && password === 'Demo@123') {
        localStorage.setItem('token', 'mock-token-' + mockUser.id)
        localStorage.setItem('user', JSON.stringify(mockUser))
        router.push('/dashboard')
        return
      }

      throw new Error('Invalid email or password. Use Demo@123 for demo accounts.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword('Demo@123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: '#0a0a1a' }}>
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-2xl shadow-blue-500/30">
            ⚖️
          </div>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-white/40 mt-2">Sign in to your Lawvanta account</p>
        </div>

        {/* Card */}
        <div className="glass-strong p-8 rounded-3xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-glass"
                placeholder="judge@court.gov.in"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-glass"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full py-3 rounded-xl text-base font-semibold mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In →'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">Register here</Link>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 glass p-5 rounded-2xl">
          <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc, i) => (
              <button
                key={i}
                onClick={() => fillDemo(acc)}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-sm flex-shrink-0`}>
                  {acc.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{acc.role}</div>
                  <div className="text-xs text-white/30">Demo@123</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
