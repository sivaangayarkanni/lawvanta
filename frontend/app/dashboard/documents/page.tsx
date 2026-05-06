'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface DocAnalysis {
  summary: string; keyPoints: string[]; suggestedCitations: string[]
  extractedEntities: { persons: string[]; dates: string[]; locations: string[]; laws: string[] }
  documentType: string; legalIssues: string[]; recommendations: string[]
  confidence: number; analyzedBy: string; wordCount?: number
}

interface Doc {
  id: string; title: string; type: string; fileUrl: string
  fileSize: number; mimeType: string; uploadedAt: string
  hasAnalysis: boolean; analysis: DocAnalysis | null
}

const TYPE_BADGE: Record<string, string> = {
  PLAINT: 'badge-blue', EVIDENCE: 'badge-red', PETITION: 'badge-purple',
  ORDER: 'badge-green', JUDGMENT: 'badge-orange', AFFIDAVIT: 'badge-blue',
  NOTICE: 'badge-orange', SUMMONS: 'badge-red', OTHER: 'badge-blue'
}

const DOC_TYPES = ['PLAINT', 'WRITTEN_STATEMENT', 'AFFIDAVIT', 'PETITION', 'ORDER', 'JUDGMENT', 'EVIDENCE', 'NOTICE', 'SUMMONS', 'VAKALATNAMA', 'OTHER']

function formatSize(bytes: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  const [reanalyzing, setReanalyzing] = useState<string | null>(null)
  const [uploadType, setUploadType] = useState('OTHER')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchDocs() }, [])

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setDocs(data.data)
    } catch { } finally { setLoading(false) }
  }

  const handleUpload = async (file: File) => {
    setUploading(true); setUploadProgress(0); setError('')
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''))
    formData.append('type', uploadType)

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 15, 85))
    }, 200)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      clearInterval(interval)
      setUploadProgress(100)
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed')

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        fetchDocs()
      }, 800)
    } catch (err: any) {
      clearInterval(interval)
      setUploading(false)
      setUploadProgress(0)
      setError(err.message)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleReanalyze = async (docId: string) => {
    setReanalyzing(docId)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}/reanalyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setDocs(prev => prev.map(d => d.id === docId ? { ...d, hasAnalysis: true, analysis: data.data } : d))
        if (selectedDoc?.id === docId) setSelectedDoc(prev => prev ? { ...prev, hasAnalysis: true, analysis: data.data } : null)
      }
    } catch { } finally { setReanalyzing(null) }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Documents</h1>
        <p className="text-white/40 mt-1">Upload legal documents for AI-powered analysis</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">⚠️ {error}</div>
      )}

      {/* Upload zone */}
      <div className="grid md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-2">
          {/* Type selector */}
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-white/60 flex-shrink-0">Document Type:</label>
            <select value={uploadType} onChange={e => setUploadType(e.target.value)} className="input-glass flex-1">
              {DOC_TYPES.map(t => <option key={t} value={t} style={{ background: '#0d1b3e' }}>{t}</option>)}
            </select>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileRef.current?.click()}
            className={`relative p-10 rounded-3xl border-2 border-dashed cursor-pointer transition-all text-center ${
              dragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-blue-500/40 hover:bg-white/5'
            }`}
          >
            <input ref={fileRef} type="file" className="hidden"
              accept=".pdf,.doc,.docx,.txt" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />

            {uploading ? (
              <div>
                <div className="text-4xl mb-3 animate-spin-slow">⚙️</div>
                <p className="text-white font-semibold mb-3">Uploading & analyzing...</p>
                <div className="progress-bar w-64 mx-auto">
                  <div className="progress-fill transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-white/30 text-xs mt-2">{uploadProgress}%</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">📤</div>
                <p className="text-white font-semibold">Drop document here or click to browse</p>
                <p className="text-white/40 text-sm mt-2">PDF, DOC, DOCX, TXT · Max 50MB</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                  🤖 AI will auto-analyze and extract legal insights
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {[
            { label: 'Total Documents', value: docs.length, icon: '📄' },
            { label: 'Analyzed', value: docs.filter(d => d.hasAnalysis).length, icon: '✅' },
            { label: 'Pending Analysis', value: docs.filter(d => !d.hasAnalysis).length, icon: '⏳' },
          ].map((s, i) => (
            <div key={i} className="stat-card flex items-center gap-4">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents list + Analysis panel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Documents ({docs.length})</h2>
          {loading ? (
            <div className="text-center py-12 text-white/30">
              <div className="text-4xl mb-3 animate-spin-slow">⚙️</div>
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((d, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDoc(d)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedDoc?.id === d.id
                      ? 'border border-blue-500/40 bg-blue-500/10'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                      {d.mimeType === 'application/pdf' ? '📕' : '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white truncate">{d.title}</span>
                        <span className={`badge ${TYPE_BADGE[d.type] || 'badge-blue'} flex-shrink-0 text-xs`}>{d.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{formatSize(d.fileSize)}</span>
                        <span>{new Date(d.uploadedAt).toLocaleDateString('en-IN')}</span>
                        {d.hasAnalysis
                          ? <span className="text-green-400">✓ Analyzed</span>
                          : <span className="text-orange-400">⏳ Pending</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {docs.length === 0 && (
                <div className="text-center py-12 text-white/30">
                  <div className="text-4xl mb-3">📄</div>
                  <p>No documents yet. Upload one above!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            {selectedDoc ? 'Document Analysis' : 'Select a document to view analysis'}
          </h2>

          {!selectedDoc ? (
            <div className="glass p-8 rounded-2xl text-center text-white/30">
              <div className="text-5xl mb-4">🔍</div>
              <p>Click any document to view its AI analysis</p>
            </div>
          ) : (
            <div className="glass p-5 rounded-2xl space-y-4">
              {/* Doc header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{selectedDoc.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${TYPE_BADGE[selectedDoc.type] || 'badge-blue'}`}>{selectedDoc.type}</span>
                    <span className="text-xs text-white/40">{formatSize(selectedDoc.fileSize)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleReanalyze(selectedDoc.id)}
                  disabled={reanalyzing === selectedDoc.id}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors flex-shrink-0"
                >
                  {reanalyzing === selectedDoc.id ? '⚙️ Analyzing...' : '🔄 Re-analyze'}
                </button>
              </div>

              {!selectedDoc.hasAnalysis ? (
                <div className="text-center py-8 text-white/40">
                  <div className="text-3xl mb-3 animate-spin-slow">⚙️</div>
                  <p className="text-sm">Analysis in progress...</p>
                  <button onClick={() => handleReanalyze(selectedDoc.id)}
                    className="mt-3 btn-glow px-4 py-2 rounded-xl text-xs">
                    <span>Analyze Now</span>
                  </button>
                </div>
              ) : selectedDoc.analysis ? (
                <div className="space-y-4 text-sm">
                  {/* Confidence */}
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-xs">Confidence:</span>
                    <div className="flex-1 progress-bar">
                      <div className="progress-fill" style={{ width: `${(selectedDoc.analysis.confidence || 0) * 100}%` }} />
                    </div>
                    <span className="text-white/60 text-xs">{Math.round((selectedDoc.analysis.confidence || 0) * 100)}%</span>
                    <span className="text-white/30 text-xs">{selectedDoc.analysis.analyzedBy}</span>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">📋 Summary</p>
                    <p className="text-white/80 leading-relaxed">{selectedDoc.analysis.summary}</p>
                  </div>

                  {/* Key Points */}
                  {selectedDoc.analysis.keyPoints?.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">🎯 Key Points</p>
                      <ul className="space-y-1">
                        {selectedDoc.analysis.keyPoints.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70">
                            <span className="text-blue-400 flex-shrink-0">•</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Legal Issues */}
                  {selectedDoc.analysis.legalIssues?.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">⚖️ Legal Issues</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoc.analysis.legalIssues.map((issue, i) => (
                          <span key={i} className="badge badge-orange">{issue}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Citations */}
                  {selectedDoc.analysis.suggestedCitations?.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">📚 Suggested Citations</p>
                      <ul className="space-y-1">
                        {selectedDoc.analysis.suggestedCitations.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-blue-400 text-xs">
                            <span className="flex-shrink-0">→</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Entities */}
                  {selectedDoc.analysis.extractedEntities && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">🔍 Extracted Entities</p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedDoc.analysis.extractedEntities).map(([key, vals]) =>
                          (vals as string[]).length > 0 ? (
                            <div key={key}>
                              <p className="text-white/30 text-xs capitalize mb-1">{key}</p>
                              <div className="flex flex-wrap gap-1">
                                {(vals as string[]).slice(0, 3).map((v, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/60">{v}</span>
                                ))}
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {selectedDoc.analysis.recommendations?.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">💡 Recommendations</p>
                      <ul className="space-y-1">
                        {selectedDoc.analysis.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/60 text-xs">
                            <span className="text-green-400 flex-shrink-0">✓</span>{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ask AI */}
                  <Link
                    href={`/dashboard/chat?q=${encodeURIComponent(`Analyze this document: ${selectedDoc.title}. Summary: ${selectedDoc.analysis.summary}`)}`}
                    className="btn-glow w-full py-2.5 rounded-xl text-xs font-semibold block text-center mt-2"
                  >
                    <span>🤖 Discuss with AI →</span>
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
