import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/embeddings'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { question, documentId } = await request.json()
    if (!question || !documentId) {
      return NextResponse.json({ error: 'Missing question or documentId' }, { status: 400 })
    }

    // Generate embedding for the question
    const queryEmbedding = await generateEmbedding(question)

    // Find relevant chunks
    const { data: chunks, error: searchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_document_id: documentId,
      match_count: 5,
    })

    if (searchError) {
      return NextResponse.json({ error: searchError.message }, { status: 500 })
    }

    const context = chunks.map((c: any) => c.content).join('\n\n')

    // Generate answer using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = `You are a legal assistant. Use the following context from a legal document to answer the question. If the answer is not in the context, say so.

Context:
${context}

Question: ${question}

Answer:`

    const result = await model.generateContent(prompt)
    const answer = result.response.text()

    // Save to chat history
    await supabase.from('chat_messages').insert([
      { user_id: user.id, document_id: documentId, role: 'user', content: question },
      { user_id: user.id, document_id: documentId, role: 'assistant', content: answer },
    ])

    return NextResponse.json({ answer })

  } catch (err: any) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}