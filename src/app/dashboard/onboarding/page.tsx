'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LawyerOnboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    barRegistration: '',
    specializations: [] as string[],
    yearsOfExperience: '',
    location: '',
    description: '',
    phone: '',
    hourlyRate: '',
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role, full_name, city')
        .eq('id', user.id)
        .single()

      if (userProfile?.role !== 'lawyer') {
        router.push('/dashboard')
        return
      }

      const { data: lawyer } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (lawyer) {
        setFormData(prev => ({
          ...prev,
          fullName: lawyer.full_name || '',
          barRegistration: lawyer.bar_council_id || '',
          specializations: lawyer.specialization || [],
          description: lawyer.bio || '',
          hourlyRate: lawyer.hourly_rate?.toString() || '',
          phone: lawyer.phone?.toString() || '',
          yearsOfExperience: lawyer.years_of_experience || '',
          location: userProfile?.city || '',
        }))
        setVerified(lawyer.verified || false)
      } else if (userProfile) {
        setFormData(prev => ({
          ...prev,
          fullName: userProfile.full_name || '',
          location: userProfile.city || '',
        }))
      }

      setFetching(false)
    }
    loadProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }))
  }

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: profileError } = await supabase
      .from('lawyer_profiles')
      .upsert({
        id: user.id,
        full_name: formData.fullName,
        bar_council_id: formData.barRegistration,
        specialization: formData.specializations,
        bio: formData.description,
        hourly_rate: parseFloat(formData.hourlyRate) || 0,
        phone: formData.phone ? parseInt(formData.phone.replace(/\D/g, '')) : null,
        years_of_experience: formData.yearsOfExperience,
        verified: false,
      })

    if (profileError) {
      setError(profileError.message)
      setIsSubmitting(false)
      return
    }

    await supabase
      .from('user_profiles')
      .update({ full_name: formData.fullName, city: formData.location })
      .eq('id', user.id)

    setSuccessMessage('✓ Profile saved successfully!')
    setTimeout(() => router.push('/dashboard'), 2000)
    setIsSubmitting(false)
  }

  const specializations = [
    'Corporate Law', 'Criminal Law', 'Family Law', 'Real Estate',
    'Consumer Rights', 'Labor Law', 'Intellectual Property', 'Constitutional Law'
  ]

  if (fetching) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Loading profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Nyaya Mitra</h1>
              <p className="text-xs text-slate-500">Lawyer Onboarding</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Why Join?</h2>
                {verified ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Verified</span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { icon: '👥', title: 'Reach Clients', desc: 'Connect with verified individuals seeking legal help' },
                  { icon: '💰', title: 'Grow Revenue', desc: 'Monetize your expertise on the platform' },
                  { icon: '⭐', title: 'Build Reputation', desc: 'Establish credibility with client reviews' },
                  { icon: '📱', title: 'Digital Presence', desc: 'Professional online profile for your practice' }
                ].map((benefit, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{benefit.icon}</span>
                      <h3 className="font-semibold text-slate-900 text-sm">{benefit.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 ml-7">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {formStep === 1 ? 'Basic Information' : formStep === 2 ? 'Professional Details' : 'Profile Summary'}
                  </h2>
                  <div className="text-sm text-slate-600">Step {formStep} of 3</div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(formStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {formStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Bar Council Registration Number</label>
                    <input type="text" name="barRegistration" value={formData.barRegistration} onChange={handleInputChange}
                      placeholder="e.g. D/123/2010"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      placeholder="98765 43210"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Years of Experience</label>
                    <select name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all">
                      <option value="">Select years of experience</option>
                      <option value="0-2">0-2 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Hourly Rate (₹)</label>
                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange}
                      placeholder="e.g. 2500"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">Specializations</label>
                    <div className="grid grid-cols-2 gap-3">
                      {specializations.map(spec => (
                        <button key={spec} type="button" onClick={() => handleSpecializationToggle(spec)}
                          className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all text-sm ${
                            formData.specializations.includes(spec)
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-300'
                          }`}>
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Location / City</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Professional Bio</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange}
                      placeholder="Tell clients about your experience, approach, and why they should choose you..."
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all resize-none" />
                    <p className="text-xs text-slate-500 mt-1">{formData.description.length}/500 characters</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                {formStep > 1 && (
                  <button onClick={() => setFormStep(formStep - 1)}
                    className="px-6 py-3 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition-colors">
                    ← Back
                  </button>
                )}
                {formStep < 3 ? (
                  <button onClick={() => setFormStep(formStep + 1)}
                    className="ml-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Continue →
                  </button>
                ) : (
                  <button onClick={handleCompleteOnboarding} disabled={isSubmitting}
                    className={`ml-auto px-8 py-3 rounded-lg font-semibold transition-colors ${
                      isSubmitting ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : 'Save Profile'}
                  </button>
                )}
              </div>

              {successMessage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium text-sm">
                  {successMessage}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">ℹ️ Verification:</span> All lawyers are verified through their Bar Council registration. Your profile will appear in the directory after admin approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}