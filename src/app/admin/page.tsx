'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import VerifyButton from '@/components/VerifyButton'
import KnowledgeUpload from '@/components/KnowledgeUpload'
import DeleteKnowledgeButton from '@/components/DeleteKnowledgeButton'
import DeleteLawyerButton from '@/components/DeleteLawyerButton'

interface Lawyer {
  id: string
  full_name: string
  bar_council_id: string
  hourly_rate: number
  verified: boolean
  specialization: string[]
  bio?: string
  years_of_experience?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'knowledge' | 'lawyers'>('knowledge')
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [sources, setSources] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [lawyersRes, sourcesRes] = await Promise.all([
        supabase.from('lawyer_profiles').select('*').order('verified', { ascending: true }),
        supabase.from('knowledge_chunks').select('source'),
      ])
      if (lawyersRes.data) setLawyers(lawyersRes.data)
      if (sourcesRes.data) {
        const uniqueSources = [...new Set(sourcesRes.data.map(k => k.source))]
        setSources(uniqueSources)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function handleDeleteLawyer(lawyerId: string) {
    setLawyers(prev => prev.filter(l => l.id !== lawyerId))
  }

  function handleDeleteSource(source: string) {
    setSources(prev => prev.filter(s => s !== source))
  }

  const verifiedCount = lawyers.filter(l => l.verified).length
  const pendingCount = lawyers.length - verifiedCount

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚖</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              </div>
              <p className="text-sm text-slate-600">Manage knowledge base and verify lawyers</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'knowledge'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              📚 Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab('lawyers')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'lawyers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚖️ Lawyer Verification ({pendingCount})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <section className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-slate-600 text-sm font-medium mb-1">Total Documents</div>
              <div className="text-4xl font-bold text-indigo-600">{sources.length}</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Uploaded Sources</h2>
              {sources.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No documents uploaded yet.</p>
              ) : (
                <div className="grid gap-3">
                  {sources.map(source => (
                    <div key={source} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <span className="font-medium text-slate-900">{source}</span>
                      </div>
                      <DeleteKnowledgeButton source={source} onDelete={handleDeleteSource} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Document</h2>
              <KnowledgeUpload />
            </div>
          </section>
        )}

        {/* Lawyer Verification Tab */}
        {activeTab === 'lawyers' && (
          <section className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-slate-600 text-sm font-medium mb-1">Total Lawyers</div>
                <div className="text-3xl font-bold text-slate-900">{lawyers.length}</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-green-600 text-sm font-medium mb-1">Verified</div>
                <div className="text-3xl font-bold text-green-600">{verifiedCount}</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="text-amber-600 text-sm font-medium mb-1">Pending</div>
                <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Lawyer Profiles</h2>
              {lawyers.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No lawyer profiles yet.</p>
              ) : (
                <div className="space-y-4">
                  {lawyers.map(lawyer => (
                    <div key={lawyer.id} className={`border-2 rounded-xl p-6 transition-all ${
                      lawyer.verified ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold text-slate-900">{lawyer.full_name}</h3>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              lawyer.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {lawyer.verified ? '✓ Verified' : '⏳ Pending'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-sm">
                              <p className="text-slate-600 font-medium">Bar Council ID</p>
                              <p className="text-slate-900 font-mono">{lawyer.bar_council_id}</p>
                            </div>
                            <div className="text-sm">
                              <p className="text-slate-600 font-medium">Hourly Rate</p>
                              <p className="text-slate-900 font-semibold">₹{lawyer.hourly_rate}/hr</p>
                            </div>
                            {lawyer.years_of_experience && (
                              <div className="text-sm">
                                <p className="text-slate-600 font-medium">Experience</p>
                                <p className="text-slate-900">{lawyer.years_of_experience}</p>
                              </div>
                            )}
                          </div>

                          {lawyer.specialization && lawyer.specialization.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-slate-600 mb-2">Specializations</p>
                              <div className="flex flex-wrap gap-2">
                                {lawyer.specialization.map((s: string) => (
                                  <span key={s} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-full font-medium">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {lawyer.bio && (
                            <p className="text-sm text-slate-700 bg-white bg-opacity-50 rounded px-3 py-2">{lawyer.bio}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {!lawyer.verified && <VerifyButton lawyerId={lawyer.id} />}
                          <DeleteLawyerButton lawyerId={lawyer.id} lawyerName={lawyer.full_name} onDelete={handleDeleteLawyer} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}