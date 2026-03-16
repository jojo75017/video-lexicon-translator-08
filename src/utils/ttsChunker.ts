/**
 * Smart text chunking for TTS: splits at sentence boundaries
 * to avoid cutting words mid-sentence, which causes audio glitches.
 */

const MAX_CHUNK_SIZE = 4800; // Leave margin under 5000 limit

/**
 * Split text into TTS-friendly chunks at sentence boundaries.
 * Never cuts mid-sentence unless a single sentence exceeds the limit.
 */
export function splitTextForTts(text: string, maxChunkSize = MAX_CHUNK_SIZE): string[] {
  if (!text || text.trim().length === 0) return [];
  if (text.length <= maxChunkSize) return [text];

  const chunks: string[] = [];
  // Split into sentences (keep the delimiter)
  const sentences = text.match(/[^.!?…]+[.!?…]+[\s]*/g) || [text];
  
  let currentChunk = '';

  for (const sentence of sentences) {
    // If adding this sentence exceeds the limit
    if (currentChunk.length + sentence.length > maxChunkSize) {
      // Save current chunk if not empty
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // If a single sentence is too long, split it at paragraph/comma boundaries
      if (sentence.length > maxChunkSize) {
        const subParts = sentence.match(/[^,;]+[,;]?\s*/g) || [sentence];
        for (const part of subParts) {
          if (currentChunk.length + part.length > maxChunkSize && currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
          }
          currentChunk += part;
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 0);
}
