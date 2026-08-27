/**
 * ContentStudio Engine — types partagés.
 * Un livre KDP décliné en formation vidéo (scripts, slides, voix off, MP4).
 */

export type CsTone = 'professional' | 'inspiring' | 'informative' | 'storytelling';
export type CsChapterStatus = 'draft' | 'generating' | 'completed';

export interface CsProject {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  target_audience: string | null;
  tone: string;
  language_code: string;
  kdp_description: string | null;
  kdp_keywords: string[] | null;
  kdp_categories: string[] | null;
  cover_image_url: string | null;
  video_unlocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CsChapter {
  id: string;
  project_id: string;
  chapter_number: number;
  title: string;
  content_markdown: string | null;
  key_takeaways: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export type SlideLayout = 'title' | 'bullets' | 'comparison' | 'stat' | 'quote';

export interface Slide {
  slideNumber: number;
  layout: SlideLayout;
  title: string;
  bulletPoints?: string[];
  visualPrompt?: string;
}

export interface CsVideoLesson {
  id: string;
  chapter_id: string;
  video_title: string;
  script_hook: string | null;
  script_core: string | null;
  script_action: string | null;
  slides_json: Slide[] | null;
  audio_url: string | null;
  subtitle_vtt_url: string | null;
  video_mp4_url: string | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface CsOutlineChapter {
  chapter_number: number;
  title: string;
  key_takeaways: string[];
}

export const CS_TONE_LABELS: Record<CsTone, string> = {
  professional: 'Professionnel',
  inspiring: 'Inspirant',
  informative: 'Informatif',
  storytelling: 'Narratif',
};
