/**
 * Chargeur pdfjs unique pour toute l'app.
 * Corrige l'erreur « No "GlobalWorkerOptions.workerSrc" specified » :
 * le worker est fourni par Vite sous forme d'URL de module.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: any | null = null;

export async function loadPdfjs(): Promise<any> {
  if (cached) return cached;
  const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const workerUrl = (await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  cached = pdfjs;
  return pdfjs;
}

/** Ouvre un PDF depuis un ArrayBuffer avec le worker correctement configuré. */
export async function openPdf(data: ArrayBuffer): Promise<any> {
  const pdfjs = await loadPdfjs();
  return pdfjs.getDocument({ data, isEvalSupported: false }).promise;
}
