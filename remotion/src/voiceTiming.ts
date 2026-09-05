/**
 * Minutage réel de la voix off (mesuré avec ffprobe sur les 8 segments MP3).
 * Sert à caler les sous-titres exactement sur la voix.
 *
 * Construction de la piste voix : 1,5 s de silence, puis chaque séquence
 * séparée par 2,6 s de silence, puis 3 s de silence final.
 */
export const VOICE_LEAD_SECONDS = 1.5;
export const VOICE_GAP_SECONDS = 2.6;
export const VOICE_TAIL_SECONDS = 3.0;

/** Durée parlée de chaque séquence, en secondes. */
export const VOICE_DURATIONS = [
  49.375, 34.108, 52.978, 38.297, 40.517, 56.812, 46.751, 26.934,
];

