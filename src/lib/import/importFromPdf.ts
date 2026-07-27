/** Extraction texte d'un PDF côté client via pdfjs-dist. */
import { buildManuscriptFromText } from './buildManuscriptFromText';
import type { Manuscript } from '@/lib/bookperfect/types';

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfjs as any).GlobalWorkerOptions.workerSrc = '';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer, useWorker: false, isEvalSupported: false }).promise;
  let out = '';
  for (let p = 1; p <= pdf.numPages; p += 1) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const strings = content.items.map((it: any) => ('str' in it ? it.str : '')).filter(Boolean);
    out += strings.join(' ') + '\n\n';
  }
  return out.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

export async function importFromPdf(file: File): Promise<Manuscript> {
  const text = await extractTextFromPdf(file);
  if (!text) throw new Error("Impossible d'extraire du texte de ce PDF (peut-être scanné). Essayez d'exporter en .docx.");
  return buildManuscriptFromText(text, file.name);
}
