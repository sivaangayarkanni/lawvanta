'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Case {
  id: string; caseNumber: string; caseType: string; status: string
  title: string; description?: string; filingDate: string
  nextHearingDate?: string; priority?: string
}

const STATUS_STYLE: Record<string, string> = {
  FILED: 'badge-purple', PENDING: 'badge-orange',
  HEARING: 'badge-blue', JUDGMENT_RESERVED: 'badge-orange',
  DISPOSED: 'badge-green', CLOSED: 'badge-green'
}
const TYPE_STYLE: Record<string, string> = {
  CIVIL: 'badge-blue', CRIMINAL: 'badge-red', WRIT: 'badge-purple',
  FAMILY: 'badge-green', COMMERCIAL: 'badge-orange', APPEAL: 'badge-blue'
}
const PRIORITY_COLOR: Record<string, string> = {
  LOW: 'text-green-400', MEDIUM: 'text-yellow-400',
  HIGH: 'text-orange-400', URGENT: 'text-red-400'
}

const CASE_TYPES = ['CIVIL', 'CRIMINAL', 'FAMILY', 'COMMERCIAL', 'CONSTITUTIONAL', 'WRIT', 'APPEAL', 'REVISION']

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    caseNumber: '', caseType: 'CIVIL', title: '', description: '',
    filingDate: new Date().toISOString().split('T')[0],
    nextHearingDate: '', courtId: '', priority: 'MEDIUM',
    petitionerName: '', respondentName: ''
  })

  useEffect(() => { fetchCases() }, [])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setCases(data.data)
    } catch { } finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const token = localStorage.getItem('token')
      const parties = []
      if (form.petitionerName) parties.push({ name: form.petitionerName, type: 'PETITIONER' })
      if (form.respondentName) parties.push({ name: form.respondentName, type: 'RESPONDENT' })

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, parties, acts: [] })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create case')

      setSuccess('Case created successfully!')
      setShowModal(false)
      setForm({ caseNumber: '', caseType: 'CIVIL', title: '', description: '', filingDate: new Date().toISOString().split('T')[0], nextHearingDate: '', courtId: '', priority: 'MEDIUM', petitionerName: '', respondentName: '' })
      fetchCases()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  const filtered = cases.filter(c =>
    (filter === 'ALL' || c.status === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
     c.caseNumber.toLowerCase().includes(search.toLowerCase()))
  )

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.status === 'PENDING').length,
    hearing: cases.filter(c => c.status === 'HEARING').length,
    filed: cases.filter(c => c.status === 'FILED').length,
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Cases</h1>
          <p className="text-white/40 mt-1">Manage and track all your cases</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold">
          <span>+ New Case</span>
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: stats.total, icon: '📁', color: 'text-blue-400' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'text-orange-400' },
          { label: 'In Hearing', value: stats.hearing, icon: '🔔', color: 'text-blue-400' },
          { label: 'Filed', value: stats.filed, icon: '📋', color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search cases..." className="input-glass flex-1 min-w-48" />
        {['ALL', 'FILED', 'PENDING', 'HEARING', 'DISPOSED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'glass text-white/50 hover:text-white'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Cases list */}
      {loading ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-5xl mb-4 animate-spin-slow">⚖️</div>
          <p>Loading cases...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <div key={i} className="glass card-3d p-5 rounded-2xl group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-mono text-blue-400 font-bold">{c.caseNumber}</span>
                    <span className={`badge ${TYPE_STYLE[c.caseType] || 'badge-blue'}`}>{c.caseType}</span>
                    <span className={`badge ${STATUS_STYLE[c.status] || 'badge-blue'}`}>{c.status}</span>
                    {c.metadata?.priority && (
                      <span className={`text-xs font-semibold ${PRIORITY_COLOR[c.metadata.priority] || 'text-white/40'}`}>
                        ● {c.metadata.priority}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-3">{c.title}</h3>
                  {c.description && <p className="text-white/40 text-sm mb-3 line-clamp-1">{c.description}</p>}
                  <div className="flex items-center gap-6 text-xs text-white/40">
                    <span>📅 Filed: {c.filingDate}</span>
                    {c.nextHearingDate && <span>🔔 Next: {c.nextHearingDate}</span>}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Link href={`/dashboard/chat?q=${encodeURIComponent(`Analyze case ${c.caseNumber}: ${c.title}`)}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                    🤖 Ask AI
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 text-white/30">
              <div className="text-5xl mb-4">📁</div>
              <p className="mb-4">No cases found</p>
              <button onClick={() => setShowModal(true)} className="btn-glow px-6 py-2.5 rounded-xl text-sm">
                <span>+ Create First Case</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── NEW CASE MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong w-full max-w-2xl rounded-3xl p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">New Case</h2>
              <button onClick={() => { setShowModal(false); setError('') }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Case Number *</label>
                  <input value={form.caseNumber} onChange={e => setForm(f => ({ ...f, caseNumber: e.target.value }))}
                    required className="input-glass" placeholder="CS/2024/001" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Case Type *</label>
                  <select value={form.caseType} onChange={e => setForm(f => ({ ...f, caseType: e.target.value }))}
                    className="input-glass">
                    {CASE_TYPES.map(t => <option key={t} value={t} style={{ background: '#0d1b3e' }}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Case Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required className="input-glass" placeholder="Ram Kumar vs. State Bank of India" />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="input-glass" rows={3} placeholder="Brief description of the case..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Petitioner / Complainant</label>
                  <input value={form.petitionerName} onChange={e => setForm(f => ({ ...f, petitionerName: e.target.value }))}
                    className="input-glass" placeholder="Ram Kumar" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Respondent / Accused</label>
                  <input value={form.respondentName} onChange={e => setForm(f => ({ ...f, respondentName: e.target.value }))}
                    className="input-glass" placeholder="State Bank of India" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Filing Date</label>
                  <input type="date" value={form.filingDate} onChange={e => setForm(f => ({ ...f, filingDate: e.target.value }))}
                    className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Next Hearing</label>
                  <input type="date" value={form.nextHearingDate} onChange={e => setForm(f => ({ ...f, nextHearingDate: e.target.value }))}
                    className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    className="input-glass">
                    {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => (
                      <option key={p} value={p} style={{ background: '#0d1b3e' }}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Court ID (Optional)</label>
                <input value={form.courtId} onChange={e => setForm(f => ({ ...f, courtId: e.target.value }))}
                  className="input-glass" placeholder="DLH-HC-001" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setError('') }}
                  className="flex-1 py-3 rounded-xl glass text-white/60 hover:text-white transition-all text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-glow py-3 rounded-xl text-sm font-semibold">
                  <span>{saving ? 'Creating...' : 'Create Case →'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
