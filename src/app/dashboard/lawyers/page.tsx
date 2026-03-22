'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Lawyer {
  id: string
  full_name: string
  specialization: string[]
  bio: string
  hourly_rate: number
  verified: boolean
  city?: string
}

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  async function fetchLawyers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('lawyer_profiles')
      .select('*')
      .eq('verified', true)
    
    if (error) {
      console.error('Error fetching lawyers:', error)
    } else if (data) {
      setLawyers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLawyers()
  }, [])

  const filtered = lawyers.filter(l =>
    l.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.specialization?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Find a Lawyer</h1>
        <p className="text-slate-600">Browse verified legal professionals.</p>
      </header>

      <input
        type="text"
        placeholder="Search by name or specialization..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400"
      />

      {loading && (
        <p className="text-slate-600 text-sm animate-pulse">Loading lawyers...</p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-slate-600 text-sm">No lawyers found.</p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(lawyer => (
          <div key={lawyer.id} className="border border-slate-200 rounded-md p-6 space-y-4 bg-white hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{lawyer.full_name}</h2>
                {lawyer.city && <p className="text-xs text-slate-600">{lawyer.city}</p>}
              </div>
              {lawyer.verified && (
                <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>

            {lawyer.specialization && lawyer.specialization.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {lawyer.specialization.map(s => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {lawyer.bio && (
              <p className="text-sm text-slate-600 line-clamp-2 italic">
                "{lawyer.bio}"
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-900">
                {lawyer.hourly_rate ? `₹${lawyer.hourly_rate.toLocaleString()}/hr` : 'Rate not listed'}
              </span>
              
              <Link
                href={`/dashboard/lawyers/${lawyer.id}`}
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}