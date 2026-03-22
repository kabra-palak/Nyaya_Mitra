// @ts-ignore
import mammoth from 'mammoth'
// @ts-ignore
import PDFParser from 'pdf2json'

export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
  if (fileType === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser()
      pdfParser.on('pdfParser_dataError', (err: any) => reject(err))
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        const text = pdfData.Pages
          .map((page: any) =>
            page.Texts.map((t: any) => decodeURIComponent(t.R[0].T)).join(' ')
          )
          .join('\n')
        resolve(text)
      })
      pdfParser.parseBuffer(buffer)
    })
  }

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // @ts-ignore
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  if (fileType.startsWith('image/')) {
    return 'Image document uploaded. OCR processing not yet implemented.'
  }

  return ''
}