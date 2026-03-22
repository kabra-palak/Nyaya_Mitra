'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteDocumentButton({ documentId, storagePath }: { documentId: string; storagePath: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this document and its chat history?')) return

    // Delete from storage
    await supabase.storage.from('documents').remove([storagePath])

    // Delete from DB (chunks and messages cascade automatically)
    await supabase.from('documents').delete().eq('id', documentId)

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
    >
      Delete
    </button>
  )
}