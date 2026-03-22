import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { formType, answers } = await request.json()

    const formLabels: Record<string, string> = {
      rti: 'RTI Application under Right to Information Act, 2005',
      consumer: 'Consumer Complaint under Consumer Protection Act, 2019',
      bail: 'Bail Application',
      affidavit: 'General Affidavit',
    }

    const prompt = `You are a legal document drafting assistant specializing in Indian law.
Generate a formal and complete ${formLabels[formType]} using the following details:

${Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join('\n')}

Format it as a proper legal document with:
- Appropriate heading and title
- Formal language
- Proper sections and numbering
- Place for date and signature at the bottom
- Any standard legal clauses required for this type of document

Generate only the document text, no explanations.`

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })
    const result = await model.generateContent(prompt)
    const form = result.response.text()

    return NextResponse.json({ form })

  } catch (err: any) {
    console.error('Form generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}