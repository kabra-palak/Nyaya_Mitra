import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { question, history, sessionId } = await request.json()
    if (!question) return NextResponse.json({ error: 'Missing question' }, { status: 400 })

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: `You are Nyaya Mitra, an expert AI legal assistant specializing in Indian law. 
You help users understand their legal rights, explain legal concepts in simple language, 
and provide guidance on legal procedures. Always clarify that your responses are for 
informational purposes only and not a substitute for professional legal advice.
Always respond in the same language the user wrote in. If the user writes in English, respond in English. Only switch to Hindi or other Indian languages if the user explicitly writes in that language.`,
    })

    const chat = model.startChat({
      history: history || [],
    })

    const result = await chat.sendMessage(question)
    const answer = result.response.text()

    await supabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: question, session_id: sessionId },
      { user_id: user.id, role: 'assistant', content: answer, session_id: sessionId },
    ])

    return NextResponse.json({ answer })

  } catch (err: any) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}