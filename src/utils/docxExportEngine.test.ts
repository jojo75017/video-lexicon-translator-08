import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { generateProfessionalDocx, validateDocxChapters } from './docxExportEngine';
import { manuscriptToChapters, dropTrailingEmptyChapters } from '@/components/admin/V3ExportPanel';

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
  it('signale les titres JSON, titres génériques et chapitres vides sans perdre le texte rédigé', async () => {
    const audit = validateDocxChapters(messyChapters);
    expect(audit.valid).toBe(false);
    expect(audit.readyCount).toBeLessThan(audit.totalCount);
    expect(audit.chapters.some((chapter) => chapter.issues.includes('Chapitre vide'))).toBe(true);
    expect(audit.chapters.some((chapter) => chapter.issues.includes('Titre manquant ou générique'))).toBe(true);

    const blob = await generateProfessionalDocx({
      title: 'Mon Livre Test',
      authorName: 'Nanakia',
      chapters: messyChapters,
      includeTableOfContents: true,
      includeCoverPage: true,
      includeCopyrightPage: true,
    });
    const all = texts(await docXml(blob)).map((t) => t.trim()).filter(Boolean).join(' | ');
    expect(all).toMatch(/Le vent soufflait sur la lande/);
    expect(all).toMatch(/La nuit tomba très vite/);
    expect(all).toMatch(/Il restait une lueur/);
    expect(all).not.toMatch(/numero"/);
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
  });

  it('exporte les 40 chapitres demandés, chacun avec son texte', async () => {
    const chapters = Array.from({ length: 40 }, (_, i) => ({
      title: `Titre réel ${i + 1}`,
      content: `Chapitre ${i + 1} du récit : Marek referma la porte. `.repeat(12),
      subChapters: [],
    }));
    const blob = await generateProfessionalDocx({
      title: 'Noces de Vendetta',
      chapters,
      expectedChapterCount: 40,
      includeTableOfContents: true,
    });
    const all = texts(await docXml(blob)).map((t) => t.trim()).filter(Boolean).join(' | ');
    for (const n of [1, 17, 40]) expect(all).toMatch(new RegExp(`Chapitre ${n} – Titre réel ${n}`));
    expect(all).not.toMatch(/Chapitre 41/);
    expect(all).not.toMatch(/Contenu à rédiger/);
  });
});

describe('découpage d’un manuscrit collé', () => {
  it('ne crée pas de faux chapitre sur une phrase commençant par « Chapitre »', () => {
    const text = [
      '# Chapitre 1 – L’Ombre du Sang',
      '',
      'Chapitre après chapitre, elle relut le dossier sans trouver la faille du récit.',
      'Section fermée, il repartit.',
      '',
      '# Chapitre 2 – Le Pacte',
      '',
      'La nuit tomba sur le port.',
    ].join('\n');
    const out = manuscriptToChapters(text);
    expect(out).toHaveLength(2);
    expect(out[0].content).toMatch(/Chapitre après chapitre/);
    expect(out[1].content).toMatch(/La nuit tomba/);
  });

  it('ignore un chapitre fantôme vide en fin de manuscrit', () => {
    const out = dropTrailingEmptyChapters([
      { id: 'ch-1', title: 'A', subChapters: [], content: 'Texte du premier chapitre.' },
      { id: 'ch-2', title: 'B', subChapters: [], content: '   ' },
    ] as any);
    expect(out).toHaveLength(1);
  });
});

