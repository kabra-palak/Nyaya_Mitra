'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FORM_TYPES = [
  { id: 'rti', label: 'RTI Application', description: 'Right to Information request' },
  { id: 'consumer', label: 'Consumer Complaint', description: 'File a consumer forum complaint' },
  { id: 'bail', label: 'Bail Application', description: 'Application for bail' },
  { id: 'affidavit', label: 'General Affidavit', description: 'Sworn statement document' },
]

const questions: Record<string, { label: string; key: string }[]> = {
  rti: [
    { label: 'Your full name', key: 'name' },
    { label: 'Your address', key: 'address' },
    { label: 'Name of the public authority', key: 'authority' },
    { label: 'Information you are seeking', key: 'information' },
    { label: 'Time period of information', key: 'period' },
  ],
  consumer: [
    { label: 'Your full name', key: 'name' },
    { label: 'Your address', key: 'address' },
    { label: 'Name of company/seller', key: 'company' },
    { label: 'Product or service purchased', key: 'product' },
    { label: 'Description of complaint', key: 'complaint' },
    { label: 'Relief sought', key: 'relief' },
  ],
  bail: [
    { label: 'Applicant full name', key: 'name' },
    { label: 'FIR number', key: 'fir' },
    { label: 'Police station', key: 'station' },
    { label: 'Sections charged under', key: 'sections' },
    { label: 'Grounds for bail', key: 'grounds' },
  ],
  affidavit: [
    { label: 'Your full name', key: 'name' },
    { label: 'Your age', key: 'age' },
    { label: 'Your address', key: 'address' },
    { label: 'Purpose of affidavit', key: 'purpose' },
    { label: 'Statement of facts', key: 'facts' },
  ],
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

export default function FormsPage() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generatedForm, setGeneratedForm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch('/api/forms/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType: selectedForm, answers }),
    })
    const data = await res.json()
    if (res.ok) setGeneratedForm(data.form)
    setLoading(false)
  }

  function handleReset() {
    setSelectedForm(null)
    setAnswers({})
    setGeneratedForm('')
    setStep(0)
  }

  // Screen 1: Form type selection
  if (!selectedForm) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Form Assistant</h1>
        <p className="text-slate-500">Select a legal form to get started.</p>
        <div className="grid grid-cols-2 gap-4">
          {FORM_TYPES.map(form => (
            <button
              key={form.id}
              onClick={() => { setSelectedForm(form.id); setStep(0); setAnswers({}) }}
              className="p-6 border rounded-lg text-left hover:bg-slate-50 space-y-1"
            >
              <h2 className="font-semibold">{form.label}</h2>
              <p className="text-sm text-slate-500">{form.description}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Screen 2: Generated form display
  if (generatedForm) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Generated Form</h1>
        <div
          className="border rounded-lg p-8 text-sm bg-white leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedForm) }}
        />
        <div className="flex gap-4">
          <Button onClick={() => {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Legal Form</title>
          <style>
            body { font-family: serif; padding: 40px; line-height: 1.8; }
            strong { font-weight: bold; }
            em { font-style: italic; }
          </style>
        </head>
        <body>${renderMarkdown(generatedForm)}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}}>
  Print / Save as PDF
</Button>
          <Button variant="outline" onClick={handleReset}>Start Over</Button>
        </div>
      </div>
    )
  }

  // Screen 3: Step-by-step questions
  const currentQuestions = questions[selectedForm] || []
  const currentQuestion = currentQuestions[step]

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">
        {FORM_TYPES.find(f => f.id === selectedForm)?.label}
      </h1>
      <p className="text-slate-500">Step {step + 1} of {currentQuestions.length}</p>

      <div className="space-y-2">
        <Label>{currentQuestion.label}</Label>
        <Input
          value={answers[currentQuestion.key] || ''}
          onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
          placeholder="Type your answer..."
          onKeyDown={e => {
            if (e.key === 'Enter' && step < currentQuestions.length - 1) setStep(s => s + 1)
          }}
        />
      </div>

      <div className="flex gap-4">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
        )}
        {step < currentQuestions.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!answers[currentQuestion.key]}>
            Next
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={loading || !answers[currentQuestion.key]}>
            {loading ? 'Generating...' : 'Generate Form'}
          </Button>
        )}
      </div>
    </div>
  )
}