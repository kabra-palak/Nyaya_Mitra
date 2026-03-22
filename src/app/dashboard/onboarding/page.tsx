'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [barCouncilId, setBarCouncilId] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [bio, setBio] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const specializationArray = specialization.split(',').map(s => s.trim()).filter(Boolean)

    const { error: profileError } = await supabase
      .from('lawyer_profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        bar_council_id: barCouncilId,
        specialization: specializationArray,
        bio,
        hourly_rate: parseFloat(hourlyRate),
        verified: false,
      })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // Update user_profiles full_name
    await supabase
      .from('user_profiles')
      .update({ full_name: fullName, city })
      .eq('id', user.id)

    router.push('/dashboard')
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Complete Your Lawyer Profile</h1>
      <p className="text-slate-500">Fill in your details to appear in the lawyer directory.</p>

      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Adv. Your Name" />
      </div>

      <div className="space-y-2">
        <Label>Bar Council ID</Label>
        <Input value={barCouncilId} onChange={e => setBarCouncilId(e.target.value)} placeholder="e.g. D/123/2010" />
      </div>

      <div className="space-y-2">
        <Label>Specializations (comma separated)</Label>
        <Input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Criminal Law, Family Law, RTI" />
      </div>

      <div className="space-y-2">
        <Label>City</Label>
        <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. New Delhi" />
      </div>

      <div className="space-y-2">
        <Label>Hourly Rate (₹)</Label>
        <Input value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} type="number" placeholder="e.g. 2500" />
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Brief description of your experience..."
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-xs text-slate-400">Your profile will be reviewed and verified before appearing in the directory.</p>

      <Button onClick={handleSubmit} disabled={loading || !fullName || !barCouncilId} className="w-full">
        {loading ? 'Saving...' : 'Submit Profile'}
      </Button>
    </div>
  )
}