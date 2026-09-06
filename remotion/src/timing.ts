/**
 * Calcul du minutage commun aux deux vidéos (vente et bienvenue).
 * Les durées de séquences sont calées sur la voix off réellement générée.
 */
import { TRANSITION_FRAMES } from "./theme";

export interface TimingInput {
  fps: number;
  /** Durée parlée de chaque séquence, en secondes. */
  voiceDurations: number[];
  /** Silence avant la première phrase. */
  lead: number;
  /** Silence entre deux séquences. */
  gap: number;
  /** Silence final. */
  tail: number;
  /** Lignes de sous-titres de chaque séquence. */
  lines: string[][];
}

export interface Timing {
  subtitleStart: number;
  lineDurations: number[][];
  sceneDurations: number[];
  total: number;
}

export function buildTiming({
  fps,
  voiceDurations,
  lead,
  gap,
  tail,
  lines,
}: TimingInput): Timing {
  const subtitleStart = Math.round(lead * fps);

  const lineDurations = lines.map((sceneLines, i) => {
    const total = Math.round(voiceDurations[i] * fps);
    const weights = sceneLines.map((l) => l.trim().split(/\s+/).length);
    const sum = weights.reduce((a, b) => a + b, 0);
    const frames = weights.map((w) => Math.max(60, Math.round((w / sum) * total)));
    const drift = total - frames.reduce((a, b) => a + b, 0);
    frames[frames.length - 1] = Math.max(60, frames[frames.length - 1] + drift);
    return frames;
  });

  const sceneDurations = voiceDurations.map((d, i) =>
    i < voiceDurations.length - 1
      ? Math.round((d + gap + (i === 0 ? lead : 0)) * fps) + TRANSITION_FRAMES
      : Math.round((d + tail) * fps),
  );

  return {
    subtitleStart,
    lineDurations,
    sceneDurations,
    total: sceneDurations.reduce((a, b) => a + b, 0),
  };
}
