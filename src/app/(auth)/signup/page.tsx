'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Nyaya Mitra</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Get Started</h1>
          <p className="text-slate-600">Join India's legal intelligence platform</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-md border border-slate-200 p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-slate-900 font-semibold block">I am a...</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole('client')}
                className={`py-3 px-4 rounded-md font-semibold border-2 transition-all ${
                  role === 'client'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                👤 Individual
              </button>
              <button
                onClick={() => setRole('lawyer')}
                className={`py-3 px-4 rounded-md font-semibold border-2 transition-all ${
                  role === 'lawyer'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                ⚖️ Lawyer
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-900 font-semibold">Email Address</Label>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="px-4 py-2.5 border border-slate-200 rounded-md focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-900 font-semibold">Password</Label>
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Create a strong password"
              className="px-4 py-2.5 border border-slate-200 rounded-md focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}

          <Button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-xs text-slate-600 text-center">
            By signing up, you agree to our terms of service
          </p>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-slate-600">
          Already have an account? <Link href="/login" className="text-slate-900 font-semibold hover:text-slate-700 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}