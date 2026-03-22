'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'lawyer'>('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    })
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
        <h1 className="text-2xl font-bold">Create Account</h1>
        <div className="space-y-2">
          <Label>I am a...</Label>
          <div className="flex gap-4">
            <button
              onClick={() => setRole('client')}
              className={`flex-1 py-2 border rounded ${role === 'client' ? 'bg-slate-900 text-white' : ''}`}
            >
              Client
            </button>
            <button
              onClick={() => setRole('lawyer')}
              className={`flex-1 py-2 border rounded ${role === 'lawyer' ? 'bg-slate-900 text-white' : ''}`}
            >
              Lawyer
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleSignup} disabled={loading} className="w-full">
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
        <p className="text-sm text-center">
          Have an account? <a href="/login" className="underline">Login</a>
        </p>
      </div>
    </div>
  )
}