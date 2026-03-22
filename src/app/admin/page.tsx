import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VerifyButton from '@/components/VerifyButton'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: lawyers } = await supabase
    .from('lawyer_profiles')
    .select('*, user_profiles(full_name, city)')
    .order('verified', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin — Lawyer Verification</h1>

      {lawyers?.length === 0 && (
        <p className="text-slate-400">No lawyer profiles yet.</p>
      )}

      <div className="space-y-4">
        {lawyers?.map(lawyer => (
          <div key={lawyer.id} className="border rounded-lg p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{lawyer.full_name}</h2>
                <p className="text-sm text-slate-500">Bar Council ID: {lawyer.bar_council_id}</p>
                <p className="text-sm text-slate-500">Rate: ₹{lawyer.hourly_rate}/hr</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                lawyer.verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {lawyer.verified ? '✓ Verified' : 'Pending'}
              </span>
            </div>

            {lawyer.specialization?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {lawyer.specialization.map((s: string) => (
                  <span key={s} className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {lawyer.bio && (
              <p className="text-sm text-slate-600">{lawyer.bio}</p>
            )}

            {!lawyer.verified && (
              <VerifyButton lawyerId={lawyer.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}