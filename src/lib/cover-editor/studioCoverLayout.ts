export type StudioCoverFormat = 'kindle' | 'album';

export function studioCoverSize(format: StudioCoverFormat) {
  return { width: 1600, height: format === 'album' ? 1600 : 2560 };
}

export function studioCompositionPrompt(format: StudioCoverFormat, titleAtTop: boolean) {
  const orientation = format === 'album' ? 'Square composition, aspect ratio 1:1' : 'Vertical portrait composition';
  return `${orientation}. ONE single continuous scene with a coherent sky, landscape and lighting. No stacked panels, horizontal seams, collage, duplicated moon or separate title band. Keep all main characters fully visible, including ears, feet and tails, safely inside the frame. Leave natural uncluttered space ${titleAtTop ? 'above' : 'below'} the characters within this SAME scene for later typography, never a separate background panel.`;
}

export function fitArtwork(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale, h = sourceHeight * scale;
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}