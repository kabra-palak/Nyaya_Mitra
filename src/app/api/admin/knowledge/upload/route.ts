export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { extractText } from '@/lib/extractText'
import { chunkText } from '@/lib/chunkText'
import { generateEmbedding } from '@/lib/embeddings'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const source = formData.get('source') as string

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!source) return NextResponse.json({ error: 'No source name provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const text = await extractText(buffer, file.type)
    console.log('Extracted text length:', text.length, 'File type:', file.type)
    if (!text) return NextResponse.json({ error: 'Could not extract text' }, { status: 400 })

    const chunks = chunkText(text)
    let inserted = 0

    console.log('Total chunks:', chunks.length)
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i])
      const { error } = await supabase.from('knowledge_chunks').insert({
        content: chunks[i],
        embedding,
        source,
        chunk_index: i,
      })
      if (error) console.error(`Chunk ${i} error:`, error)
      else inserted++
      await new Promise(r => setTimeout(r, 500))
    }

    return NextResponse.json({ success: true, chunks: inserted, source })

  } catch (err: any) {
    console.error('Knowledge upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}