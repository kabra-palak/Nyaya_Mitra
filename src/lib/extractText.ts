// @ts-ignore
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
// @ts-ignore
import mammoth from 'mammoth'

export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
  if (fileType === 'application/pdf') {
    const data = await pdfParse(buffer)
    return data.text
  }

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  if (fileType.startsWith('image/')) {
    return 'Image document uploaded. OCR processing not yet implemented.'
  }

  return ''
}