import type { KdpPaperbackGeometry } from './kdpPaperbackSpecs';
import { fitSpineElements, ptToIn, type WrapComposition } from './wrapComposition';

export const WRAP_TEMPLATES = [
  { id: 'classique', label: 'Classique', font: 'Georgia, serif', titleY: 0.1, subtitleY: 0.34, authorY: 0.85, align: 'center', titlePt: 42 },
  { id: 'impact', label: 'Impact', font: 'Arial, Helvetica, sans-serif', titleY: 0.08, subtitleY: 0.32, authorY: 0.86, align: 'left', titlePt: 46 },
  { id: 'signature', label: 'Signature', font: 'Georgia, serif', titleY: 0.56, subtitleY: 0.77, authorY: 0.08, align: 'center', titlePt: 36 },
  { id: 'epure', label: 'Épuré', font: 'Arial, Helvetica, sans-serif', titleY: 0.37, subtitleY: 0.63, authorY: 0.86, align: 'center', titlePt: 38 },
  { id: 'editorial', label: 'Éditorial', font: 'Georgia, serif', titleY: 0.12, subtitleY: 0.39, authorY: 0.83, align: 'left', titlePt: 40 },
] as const;

export type WrapTemplate = typeof WRAP_TEMPLATES[number];

/** Layout only: never replace the subscriber's content, image or adjustments. */
export function applyWrapTemplate(composition: WrapComposition, geometry: KdpPaperbackGeometry, template: WrapTemplate): WrapComposition {
  return fitSpineElements({
    ...composition,
    elements: composition.elements.map((element) => {
      if (element.zone === 'spine') return { ...element, fontFamily: template.font };
      if (element.zone === 'back') return { ...element, fontFamily: template.font, align: template.align };
      const isTitle = element.role === 'title';
      const fontPt = isTitle
        ? Math.min(template.titlePt, element.text.length > 55 ? 28 : element.text.length > 35 ? 34 : template.titlePt)
        : element.role === 'subtitle' ? 18 : 22;
      return {
        ...element,
        nx: 0.1,
        nWidth: 0.8,
        ny: isTitle ? template.titleY : element.role === 'subtitle' ? template.subtitleY : template.authorY,
        fontFamily: template.font,
        fontSizeIn: ptToIn(fontPt * geometry.trimWidthIn / 6),
        align: template.align,
        bold: isTitle,
        italic: template.id === 'signature' && element.role === 'author',
        lineHeight: 1.15,
      };
    }),
  }, geometry);
}