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

    const queryEmbedding = await generateEmbedding(question)

    // Search user document chunks
    const { data: docChunks } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_document_id: documentId,
      match_count: 5,
    })

    // Search knowledge base chunks
    const { data: knowledgeChunks } = await supabase.rpc('match_knowledge_chunks', {
      query_embedding: queryEmbedding,
      match_count: 3,
    })

    const docContext = docChunks?.map((c: any) => c.content).join('\n\n') || ''
    const knowledgeContext = knowledgeChunks?.map((c: any) => `[${c.source}]: ${c.content}`).join('\n\n') || ''

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })
    const prompt = `You are a legal assistant. Use the following context to answer the question.

Document Context:
${docContext}

${knowledgeContext ? `Legal Knowledge Base:\n${knowledgeContext}` : ''}

Question: ${question}

Answer:`

    const result = await model.generateContent(prompt)
    const answer = result.response.text()

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