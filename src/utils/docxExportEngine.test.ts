import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { generateProfessionalDocx } from './docxExportEngine';

const messyChapters = [
  { title: '# L\'Écho des Absents', content: 'Le vent soufflait sur la lande. Elle avança sans se retourner.', subChapters: [] },
  { title: '```json\nnumero": 2,', content: '**Le Silence des Pierres**\n\nLa nuit tomba très vite sur le village endormi.', subChapters: [] },
  { title: '', content: '   ', subChapters: [] }, // chapitre vide -> doit disparaître
  { title: 'Chapitre 4 – Retour', content: '[Contenu à rédiger]', subChapters: [] }, // boilerplate -> doit disparaître
  { title: 'Les Cendres', content: 'Il restait une lueur au fond du foyer.', subChapters: [
    { title: 'Sous partie A', content: 'Un texte de sous-chapitre suffisamment long pour être conservé.' },
    { title: 'Vide', content: '' },
  ] },
];

async function docXml(blob: Blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  return zip.file('word/document.xml')!.async('string');
}

function texts(xml: string): string[] {
  return [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]);
}

describe('export DOCX', () => {
  it('produit un sommaire numéroté en continu sans chapitre vide', async () => {
    const blob = await generateProfessionalDocx({
      title: 'Mon Livre Test',
      authorName: 'Nanakia',
      chapters: messyChapters,
      includeTableOfContents: true,
      includeCoverPage: true,
      includeCopyrightPage: true,
    });

    const xml = await docXml(blob);
    const all = texts(xml).map((t) => t.trim()).filter(Boolean);
    const joined = all.join(' | ');

    // Aucun artefact JSON / markdown
    expect(joined).not.toMatch(/```/);
    expect(joined).not.toMatch(/numero"\s*:/);
    expect(joined).not.toMatch(/\[Contenu à rédiger\]/i);

    // Numérotation continue du sommaire
    const nums = all
      .map((t) => t.match(/^Chapitre\s+(\d+)\b/))
      .filter(Boolean)
      .map((m) => Number(m![1]));
    const unique = [...new Set(nums)].sort((a, b) => a - b);
    expect(unique).toEqual([1, 2, 3]); // 5 chapitres bruts -> 3 valides
    // Aucun titre résiduel de type "2,"
    const tocEntries = all.filter((t) => /^Chapitre\s+\d/.test(t));
    for (const e of tocEntries) expect(e).not.toMatch(/–\s*\d+[,.]?$/);
    expect(tocEntries[1]).toMatch(/Chapitre 2(?: – Le Silence des Pierres)?$/);
    // eslint-disable-next-line no-console
    console.log('Chapitres rendus:', unique, '\nEntrées:', all.filter((t) => /^Chapitre\s+\d/.test(t)));
  });
});
