import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })
    const result = await model.embedContent('Test legal document text')
    return NextResponse.json({ 
      success: true, 
      dimensions: result.embedding.values.length,
      sample: result.embedding.values.slice(0, 5)
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}