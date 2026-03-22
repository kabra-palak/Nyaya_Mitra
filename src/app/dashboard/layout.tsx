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
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Nyaya Mitra</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium">
            <span>🏠</span>
            <span>Home</span>
          </a>
          <a href="/dashboard/legal-desk" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium">
            <span>📄</span>
            <span>Legal Desk</span>
          </a>
          <a href="/dashboard/chat" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium">
            <span>💬</span>
            <span>Legal Chat</span>
          </a>
          <a href="/dashboard/lawyers" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium">
            <span>⚖️</span>
            <span>Find Lawyers</span>
          </a>
          <a href="/dashboard/forms" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium">
            <span>📝</span>
            <span>Form Assistant</span>
          </a>
          {isLawyer && (
            <a href="/dashboard/onboarding" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-900 hover:bg-slate-100 font-medium border border-slate-200">
              <span>👨‍⚖️</span>
              <span>My Lawyer Profile</span>
            </a>
          )}
        </nav>
        
        <div className="border-t border-slate-200 p-4 space-y-3">
          <div className="px-4 py-2 bg-slate-50 rounded-md">
            <p className="text-xs text-slate-600 font-medium">LOGGED IN AS</p>
            <p className="text-sm text-slate-900 font-medium truncate mt-1">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}