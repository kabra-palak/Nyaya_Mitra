import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function LawyerProfilePage({ params }: { params: Promise<{ lawyerId: string }> }) {
  const { lawyerId } = await params
  const supabase = await createClient()

  const { data: lawyer } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('id', lawyerId)
    .single()

  if (!lawyer) notFound()

  return (
    <div className="max-w-2xl space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{lawyer.full_name}</h1>
          {lawyer.verified && (
            <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              ✓ Verified Professional
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Hourly Rate</p>
          <span className="text-xl font-bold text-slate-900">
            {lawyer.hourly_rate ? `₹${lawyer.hourly_rate.toLocaleString()}/hr` : 'Rate not listed'}
          </span>
        </div>
      </div>

      <hr className="border-slate-100" />

      {lawyer.specialization?.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Specializations</h2>
          <div className="flex flex-wrap gap-2">
            {lawyer.specialization.map((s: string) => (
              <span key={s} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md border border-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {lawyer.bio && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">About</h2>
          <p className="text-base text-slate-700 leading-relaxed">{lawyer.bio}</p>
        </div>
      )}

      {lawyer.bar_council_id && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h2 className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Bar Council ID</h2>
          <p className="text-sm font-mono text-slate-800">{lawyer.bar_council_id}</p>
        </div>
      )}

      <div className="pt-6 border-t flex gap-4">
        <Link
          href={`/dashboard/lawyers/${lawyerId}/contact`}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-all text-sm font-medium shadow-sm"
        >
          Contact Lawyer
        </Link>
        <Link 
          href="/dashboard/lawyers"
          className="px-8 py-3 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all"
        >
          Back to Directory
        </Link>
      </div>
    </div>
  )
}

