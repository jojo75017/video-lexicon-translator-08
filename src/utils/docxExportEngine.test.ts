import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { generateProfessionalDocx, validateDocxChapters } from './docxExportEngine';

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
  it('bloque un manuscrit avec titres JSON, titre générique et chapitres vides', async () => {
    const audit = validateDocxChapters(messyChapters);
    expect(audit.valid).toBe(false);
    expect(audit.readyCount).toBeLessThan(audit.totalCount);
    expect(audit.chapters.some((chapter) => chapter.issues.includes('Chapitre vide'))).toBe(true);
    expect(audit.chapters.some((chapter) => chapter.issues.includes('Titre manquant ou générique'))).toBe(true);

    await expect(generateProfessionalDocx({
      title: 'Mon Livre Test',
      authorName: 'Nanakia',
      chapters: messyChapters,
      includeTableOfContents: true,
      includeCoverPage: true,
      includeCopyrightPage: true,
    })).rejects.toThrow(/export bloqué/i);
  });

  it('conserve un chapitre court mais réellement rédigé', async () => {
    const blob = await generateProfessionalDocx({
      title: 'Livre court',
      chapters: [{ title: 'Une vraie scène', content: 'Enfin, elle rentra.', subChapters: [] }],
    });
    const all = texts(await docXml(blob)).map((t) => t.trim()).filter(Boolean);
    expect(all).toContain('Chapitre 1 – Une vraie scène');
    expect(all).toContain('Enfin, elle rentra.');
  });

  it('refuse un DOCX vide au lieu de produire un livre sans sommaire', async () => {
    await expect(generateProfessionalDocx({
      title: 'Livre vide',
      chapters: [{ title: 'Chapitre 1', content: '[Contenu à rédiger]', subChapters: [] }],
    })).rejects.toThrow(/export bloqué/i);
  });

  it('refuse un titre dont le numéro ne correspond pas à sa position', () => {
    const audit = validateDocxChapters([
      { title: 'Chapitre 15 Le café froid', content: 'Un vrai contenu rédigé.', subChapters: [] },
    ]);
    expect(audit.valid).toBe(false);
    expect(audit.chapters[0].issues.join(' ')).toMatch(/numéro incohérent/i);
  });

  it('génère un sommaire propre lorsque tous les chapitres sont complets', async () => {
    const blob = await generateProfessionalDocx({
      title: 'Livre prêt',
      chapters: [
        { title: 'La Porte close', content: 'La pluie frappait les vitres.', subChapters: [] },
        { title: 'Le Dernier Indice', content: 'Valérie relut le rapport en silence.', subChapters: [] },
      ],
    });
    const all = texts(await docXml(blob)).map((text) => text.trim()).filter(Boolean).join(' | ');
    expect(all).toMatch(/Chapitre 1 – La Porte close/);
    expect(all).toMatch(/Chapitre 2 – Le Dernier Indice/);
    expect(all).not.toMatch(/en cours de rédaction/i);
  });
});
