import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_admin')
    .eq('id', user.id)
    .single()

  const isLawyer = profile?.role === 'lawyer'

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-4">Nyaya Mitra</h2>
        <a href="/dashboard" className="px-3 py-2 rounded hover:bg-slate-100">Home</a>
        <a href="/dashboard/legal-desk" className="px-3 py-2 rounded hover:bg-slate-100">Legal Desk</a>
        <a href="/dashboard/chat" className="px-3 py-2 rounded hover:bg-slate-100">Legal Chat</a>
        <a href="/dashboard/lawyers" className="px-3 py-2 rounded hover:bg-slate-100">Find Lawyers</a>
        <a href="/dashboard/forms" className="px-3 py-2 rounded hover:bg-slate-100">Form Assistant</a>
        {isLawyer && (
          <a href="/dashboard/onboarding" className="px-3 py-2 rounded hover:bg-slate-100 text-blue-600">
            My Lawyer Profile
          </a>
        )}
        
        <div className="mt-auto space-y-2">
          <p className="text-sm text-slate-500 px-3">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}