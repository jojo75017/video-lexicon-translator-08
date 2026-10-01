import type { IllustrationStyle } from '@/config/kidsBookConfig';

export const ALBUM_PAGE_COUNTS = [16, 20, 24, 28, 30] as const;

export interface AlbumCharacter {
  id: string;
  name: string;
  age: string;
  physical: string;
  outfit: string;
  distinctiveFeatures: string;
  personality: string;
  referenceUrl?: string;
  locked: boolean;
}

export interface AlbumPage {
  id: string;
  pageNumber: number;
  text: string;
  scene: string;
  characters: string[];
  illustrationUrl?: string;
}

export interface IllustratedAlbumDraft {
  title: string;
  authorName: string;
  targetAge: string;
  pitch: string;
  moral: string;
  pageCount: (typeof ALBUM_PAGE_COUNTS)[number];
  style: IllustrationStyle;
  characters: AlbumCharacter[];
  pages: AlbumPage[];
  coverUrl?: string;
  backCoverText: string;
}

export const createAlbumCharacter = (): AlbumCharacter => ({
  id: crypto.randomUUID(),
  name: '',
  age: '4 ans',
  physical: '',
  outfit: '',
  distinctiveFeatures: '',
  personality: '',
  locked: false,
});

export const createIllustratedAlbumDraft = (): IllustratedAlbumDraft => ({
  title: '',
  authorName: '',
  targetAge: '3-6 ans',
  pitch: '',
  moral: '',
  pageCount: 24,
  style: 'storybook',
  characters: [createAlbumCharacter()],
  pages: [],
  backCoverText: '',
});

export function buildLockedCharactersPrompt(characters: AlbumCharacter[]): string {
  return characters.map((character, index) => [
    `PERSONNAGE DE RÉFÉRENCE ${index + 1}: ${character.name}, ${character.age}.`,
    `Apparence immuable: ${character.physical}.`,
    `Tenue immuable: ${character.outfit}.`,
    character.distinctiveFeatures ? `Signes distinctifs immuables: ${character.distinctiveFeatures}.` : '',
    character.personality ? `Personnalité: ${character.personality}.` : '',
    'Conserver exactement le même visage, la même silhouette, les mêmes couleurs et les mêmes vêtements sur toutes les pages.',
  ].filter(Boolean).join(' ')).join('\n');
}