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

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const storagePath = `${user.id}/${Date.now()}_${file.name}`
    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, { contentType: file.type })

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 })
    }

    const { data: doc, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        storage_path: storagePath,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

const text = await extractText(buffer, file.type)
console.log('Extracted text length:', text.length)

if (text && !text.startsWith('Image')) {
  const chunks = chunkText(text)
  console.log('Number of chunks:', chunks.length)

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i])
    console.log(`Embedding ${i} dimensions:`, embedding.length)
    const { error: chunkError } = await supabase.from('document_chunks').insert({
      document_id: doc.id,
      content: chunks[i],
      embedding,
      chunk_index: i,
    })
    if (chunkError) console.error('Chunk insert error:', chunkError)
  }
}

    return NextResponse.json({ fileName: file.name, documentId: doc.id })

  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}