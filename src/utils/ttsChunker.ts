/**
 * Smart text chunking for TTS: paragraph-aware splitting
 * at sentence boundaries to avoid cutting words mid-sentence.
 * Produces natural-sounding audio segments.
 */

const MAX_CHUNK_SIZE = 4800;
const MIN_CHUNK_SIZE = 200;

/**
 * Split text into TTS-friendly chunks at paragraph/sentence boundaries.
 * Priority: paragraph break > sentence end > clause break > hard cut.
 */
export function splitTextForTts(text: string, maxChunkSize = MAX_CHUNK_SIZE): string[] {
  if (!text || text.trim().length === 0) return [];
  if (text.length <= maxChunkSize) return [text.trim()];

  const chunks: string[] = [];

  // Step 1: Split by paragraphs first (most natural pause point)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();

    // Paragraph fits in current chunk
    if (currentChunk.length + trimmed.length + 2 <= maxChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
      continue;
    }

    // Flush current chunk
    if (currentChunk.trim().length >= MIN_CHUNK_SIZE) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }

    // Paragraph itself is too long — split by sentences
    if (trimmed.length > maxChunkSize) {
      const sentenceChunks = splitBySentences(trimmed, maxChunkSize);
      for (const sc of sentenceChunks) {
        if (currentChunk.length + sc.length + 2 <= maxChunkSize) {
          currentChunk += (currentChunk ? ' ' : '') + sc;
        } else {
          if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = sc;
        }
      }
    } else {
      currentChunk = trimmed;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  // Merge very short trailing chunks into previous
  return mergeShortChunks(chunks, maxChunkSize);
}

/**
 * Split a single paragraph into sentence-level chunks
 */
function splitBySentences(text: string, maxSize: number): string[] {
  // Match sentences ending with . ! ? … or their quoted variants
  const sentences = text.match(/[^.!?…]+(?:[.!?…]+["»)'\u2019]?\s*)/g) || [text];
  const result: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxSize) {
      if (current.trim().length > 0) {
        result.push(current.trim());
        current = '';
      }
      // Single sentence too long: split at clause boundaries
      if (sentence.length > maxSize) {
        const clauses = splitByClauses(sentence, maxSize);
        result.push(...clauses);
      } else {
        current = sentence;
      }
    } else {
      current += sentence;
    }
  }

  if (current.trim().length > 0) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Last resort: split at clause boundaries (commas, semicolons, dashes)
 */
function splitByClauses(text: string, maxSize: number): string[] {
  const parts = text.match(/[^,;–—]+[,;–—]?\s*/g) || [text];
  const result: string[] = [];
  let current = '';

  for (const part of parts) {
    if (current.length + part.length > maxSize && current.trim().length > 0) {
      result.push(current.trim());
      current = '';
    }
    current += part;
  }

  if (current.trim().length > 0) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Merge chunks shorter than MIN_CHUNK_SIZE into the previous chunk
 */
function mergeShortChunks(chunks: string[], maxSize: number): string[] {
  if (chunks.length <= 1) return chunks;

  const merged: string[] = [];
  for (const chunk of chunks) {
    if (
      merged.length > 0 &&
      chunk.length < MIN_CHUNK_SIZE &&
      merged[merged.length - 1].length + chunk.length + 2 <= maxSize
    ) {
      merged[merged.length - 1] += '\n\n' + chunk;
    } else {
      merged.push(chunk);
    }
  }

  return merged.filter(c => c.length > 0);
}

/**
 * Estimate audio duration in seconds for a text chunk
 * Based on average French speech rate (~150 words/minute)
 */
export function estimateAudioDuration(text: string, wordsPerMinute = 150): number {
  if (!text) return 0;
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  return Math.round((wordCount / wordsPerMinute) * 60);
}

/**
 * Format seconds into a human-readable duration string (HH:MM:SS or MM:SS)
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
