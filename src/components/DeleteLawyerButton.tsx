'use client'

import { createClient } from '@/lib/supabase/client'

export default function DeleteLawyerButton({ lawyerId, lawyerName, onDelete }: { lawyerId: string, lawyerName: string, onDelete: (id: string) => void }) {
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Delete profile of "${lawyerName}"? This cannot be undone.`)) return
    await supabase.from('lawyer_profiles').delete().eq('id', lawyerId)
    onDelete(lawyerId)
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50"
    >
      Delete Profile
    </button>
  )
}