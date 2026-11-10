import type { FlipPage } from '@/components/flipbook/IllustratedFlipbook';

const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {};
const text = (value: unknown): string => typeof value === 'string' ? value : '';

/** Read saved pages without inventing missing text or illustrations. */
export function savedFlipbookPages(chapters: unknown, images: unknown): FlipPage[] {
  const illustrations = Array.isArray(images) ? images.map(record) : [];
  return (Array.isArray(chapters) ? chapters : []).flatMap((value, index) => {
    const chapter = record(value);
    const subs = Array.isArray(chapter.subChapters) ? chapter.subChapters : [];
    const content = [text(chapter.content || chapter.contenu || chapter.text), ...subs.map(v => text(record(v).content))].filter(Boolean).join('\n\n');
    const image = illustrations.find(v => v.type !== 'front_cover' && (v.page === index + 1 || (typeof chapter.id === 'string' && v.story_id === chapter.id) || v.chapter_number === index + 1));
    const imageUrl = text(chapter.illustration_url || chapter.illustrationUrl || image?.url);
    if (!content.trim() && !imageUrl) return [];
    return [{ title: text(chapter.title) || `Page ${index + 1}`, text: content, imageUrl: imageUrl || undefined }];
  });
}