'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-8 border rounded-lg">
        <h1 className="text-2xl font-bold">Login to Nyaya Mitra</h1>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <p className="text-sm text-center">
          No account? <a href="/signup" className="underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}