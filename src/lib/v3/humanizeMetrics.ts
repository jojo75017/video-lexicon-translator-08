export type SentenceSignal = {
  text: string;
  level: 'natural' | 'regular' | 'predictable';
  reason: string;
};

export type StylometricMetrics = {
  aiRisk: number;
  vocabularyVariety: number;
  rhythmVariety: number;
  clichéDensity: number;
  sentences: SentenceSignal[];
};

const AI_CLICHES = [
  'en conclusion',
  'il est important de',
  'il convient de',
  'en somme',
  'au cœur de',
  'crucial',
  'de plus',
  'par ailleurs',
  'notamment',
];

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function analyzeStylometry(text: string, aiScore?: number): StylometricMetrics {
  const sentences = splitSentences(text);
  const words = text.toLocaleLowerCase('fr-FR').match(/[\p{L}\p{N}'’-]+/gu) ?? [];
  const uniqueWords = new Set(words);
  const lengths = sentences.map(countWords);
  const average = lengths.length ? lengths.reduce((sum, value) => sum + value, 0) / lengths.length : 0;
  const variance = lengths.length
    ? lengths.reduce((sum, value) => sum + (value - average) ** 2, 0) / lengths.length
    : 0;
  const coefficient = average ? Math.sqrt(variance) / average : 0;
  const rhythmVariety = clamp(coefficient * 145);
  const vocabularyVariety = words.length ? clamp((uniqueWords.size / words.length) * 145) : 0;
  const lowered = text.toLocaleLowerCase('fr-FR');
  const clichéHits = AI_CLICHES.reduce((total, phrase) => total + lowered.split(phrase).length - 1, 0);
  const clichéDensity = words.length ? clamp((clichéHits / words.length) * 1000) : 0;
  const heuristicRisk = clamp(70 - rhythmVariety * 0.42 - vocabularyVariety * 0.22 + clichéDensity * 0.48);

  return {
    aiRisk: clamp(aiScore ?? heuristicRisk),
    vocabularyVariety,
    rhythmVariety,
    clichéDensity,
    sentences: sentences.map((sentence, index) => {
      const sentenceWords = countWords(sentence);
      const hasCliché = AI_CLICHES.some((phrase) => sentence.toLocaleLowerCase('fr-FR').includes(phrase));
      const previousLength = index > 0 ? lengths[index - 1] : null;
      const tooRegular = previousLength !== null && Math.abs(sentenceWords - previousLength) <= 2;
      if (hasCliché) return { text: sentence, level: 'predictable', reason: 'Expression ou transition souvent associée aux textes automatisés.' };
      if (tooRegular) return { text: sentence, level: 'regular', reason: 'Longueur très proche de la phrase précédente : le rythme paraît régulier.' };
      return { text: sentence, level: 'natural', reason: 'Rythme et formulation suffisamment variés.' };
    }),
  };
}