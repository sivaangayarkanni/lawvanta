'use client'

const METRICS = [
  { label: 'Cases Handled', value: 45, max: 60, color: '#3b82f6', icon: '📁' },
  { label: 'Orders Generated', value: 23, max: 30, color: '#8b5cf6', icon: '📋' },
  { label: 'Docs Processed', value: 67, max: 80, color: '#10b981', icon: '📄' },
  { label: 'AI Interactions', value: 234, max: 300, color: '#f59e0b', icon: '🤖' },
]

const CASE_TYPES = [
  { type: 'Civil', count: 20, color: '#3b82f6' },
  { type: 'Criminal', count: 15, color: '#ef4444' },
  { type: 'Writ', count: 10, color: '#8b5cf6' },
  { type: 'Family', count: 8, color: '#10b981' },
  { type: 'Commercial', count: 5, color: '#f59e0b' },
]

const WEEKLY = [
  { day: 'Mon', cases: 8, orders: 3 },
  { day: 'Tue', cases: 12, orders: 5 },
  { day: 'Wed', cases: 6, orders: 2 },
  { day: 'Thu', cases: 15, orders: 7 },
  { day: 'Fri', cases: 10, orders: 4 },
  { day: 'Sat', cases: 4, orders: 1 },
  { day: 'Sun', cases: 2, orders: 0 },
]

const maxCases = Math.max(...WEEKLY.map(w => w.cases))

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Analytics</h1>
        <p className="text-white/40 mt-1">Your productivity insights and performance metrics</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{m.icon}</span>
              <span className="text-xs text-white/30">{Math.round((m.value / m.max) * 100)}%</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{m.value}</div>
            <div className="text-xs text-white/40 mb-3">{m.label}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(m.value / m.max) * 100}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}aa)` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly bar chart */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Weekly Activity</h2>
          <div className="flex items-end gap-3 h-40">
            {WEEKLY.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1" style={{ height: '120px', justifyContent: 'flex-end' }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${(w.cases / maxCases) * 100}%`,
                      background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                      minHeight: '4px'
                    }}
                  />
                </div>
                <span className="text-xs text-white/40">{w.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-xs text-white/40">Cases</span></div>
          </div>
        </div>

        {/* Case type distribution */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Case Distribution</h2>
          <div className="space-y-4">
            {CASE_TYPES.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/70">{c.type}</span>
                  <span className="text-sm font-semibold text-white">{c.count}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(c.count / 20) * 100}%`,
                      background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance summary */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4">AI Usage Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Avg Response Time', value: '3.2s', icon: '⚡', sub: 'Per AI query' },
            { label: 'Accuracy Rate', value: '94%', icon: '🎯', sub: 'Legal citations' },
            { label: 'Time Saved', value: '12h', icon: '⏱️', sub: 'This week' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/5">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-shimmer">{s.value}</div>
              <div className="text-sm font-semibold text-white mt-1">{s.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
