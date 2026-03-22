'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerifyButton({ lawyerId }: { lawyerId: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleVerify() {
    await supabase
      .from('lawyer_profiles')
      .update({ verified: true })
      .eq('id', lawyerId)

    router.refresh()
  }

  return (
    <button
      onClick={handleVerify}
      className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      Verify Lawyer
    </button>
  )
}