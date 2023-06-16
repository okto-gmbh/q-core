import PdfPrinter from 'pdfmake'

import type { TFontDictionary } from 'pdfmake/interfaces'

const initPdf = (fonts: TFontDictionary) => new PdfPrinter(fonts)

export const getBuffer = (pdf: PDFKit.PDFDocument) =>
    new Promise((resolve, reject) => {
        const chunks: any[] = []
        pdf.on('data', (chunk) => {
            chunks.push(chunk)
        })

        pdf.on('end', () => {
            resolve(Buffer.concat(chunks))
        })

        pdf.on('error', (e) => {
            reject(e)
        })

        pdf.end()
    })

export default initPdf
