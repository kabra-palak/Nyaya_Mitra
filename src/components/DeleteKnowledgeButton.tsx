'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteKnowledgeButton({ source }: { source: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Delete all chunks from "${source}"?`)) return
    await supabase.from('knowledge_chunks').delete().eq('source', source)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50"
    >
      Delete
    </button>
  )
}