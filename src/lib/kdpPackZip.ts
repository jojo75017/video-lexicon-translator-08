/**
 * Export "Pack KDP complet" en ZIP.
 * Regroupe PDF (déjà généré ou à régénérer), couverture, metadata, README publication.
 */
import JSZip from 'jszip';

export interface KdpPackOptions {
  ebookTitle: string;
  authorName: string;
  subtitle?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
  kdpCategories?: string[];
  pdfBlob?: Blob | null;
  coverFrontUrl?: string | null;
  coverFullUrl?: string | null;
  audioFiles?: Array<{ name: string; blob: Blob }>;
}

const slugify = (s: string) =>
  (s || 'ebook')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase()
    .slice(0, 60) || 'ebook';

const fetchAsBlob = async (url: string): Promise<Blob | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
};

const buildMetadata = (opts: KdpPackOptions): string => {
  const keywords = (opts.kdpKeywords || '')
    .split(/[,\n;]+/)
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 7);
  return [
    '=== METADATA KDP ===',
    '',
    `Titre : ${opts.ebookTitle}`,
    opts.subtitle ? `Sous-titre : ${opts.subtitle}` : null,
    `Auteur : ${opts.authorName}`,
    '',
    '--- Description (≤ 4000 caractères) ---',
    (opts.kdpDescription || '').trim() || '[À compléter]',
    '',
    `--- 7 mots-clés (${keywords.length}/7) ---`,
    ...keywords.map((k, i) => `${i + 1}. ${k}`),
    ...(keywords.length < 7
      ? Array.from({ length: 7 - keywords.length }, (_, i) => `${keywords.length + i + 1}. [à compléter]`)
      : []),
    '',
    '--- Catégories (max 3) ---',
    ...(opts.kdpCategories && opts.kdpCategories.length
      ? opts.kdpCategories.slice(0, 3).map((c, i) => `${i + 1}. ${c}`)
      : ['1. [à choisir sur KDP]', '2. [à choisir sur KDP]']),
    '',
    `Généré le : ${new Date().toLocaleString('fr-FR')}`,
  ]
    .filter(Boolean)
    .join('\n');
};

const buildReadme = (opts: KdpPackOptions): string => {
  return `=== PACK KDP — CHECKLIST DE PUBLICATION ===

Bonjour ${opts.authorName || 'auteur'} 👋

Ce dossier contient tout ce qu'il te faut pour publier "${opts.ebookTitle}" sur Amazon KDP.

📂 CONTENU DU PACK
──────────────────
• manuscrit-kdp.pdf       → Manuscrit prêt à uploader (format A4/A5 conforme KDP)
• couverture-front.jpg    → Couverture seule (pour l'aperçu KDP)
• couverture-full.jpg     → Couverture complète avec dos+tranche (PDF imprimable)
• metadata-kdp.txt        → Titre, description, 7 mots-clés, catégories — à recopier sur KDP
• audio/                  → (si présent) Fichiers audio de l'audiobook
• README.txt              → Ce fichier

✅ CHECKLIST DE PUBLICATION SUR KDP
───────────────────────────────────
1. [ ] Va sur https://kdp.amazon.com → "Créer un livre broché" ou "eBook Kindle"
2. [ ] Copie le titre + sous-titre depuis metadata-kdp.txt
3. [ ] Renseigne ton nom d'auteur (identique à ton compte KDP)
4. [ ] Colle la description (max 4000 caractères, formatage HTML autorisé)
5. [ ] Ajoute les 7 mots-clés un par un
6. [ ] Choisis 2 catégories pertinentes
7. [ ] Upload "manuscrit-kdp.pdf"
8. [ ] Upload "couverture-full.jpg" (broché) OU "couverture-front.jpg" (Kindle)
9. [ ] Active "DRM" si tu veux protéger ton ebook
10. [ ] Définis le prix (recommandation : 9,99€ – 14,99€ pour 70% de royalties)
11. [ ] Vérifie l'aperçu KDP (Kindle Previewer)
12. [ ] Publie 🎉

💡 ASTUCES PRO
──────────────
• Active KDP Select pour profiter de Kindle Unlimited (royalties bonus)
• Lance ton livre à un prix promo 0,99€ pendant 48h pour booster les avis
• Demande à 5 bêta-lecteurs un avis le jour de la sortie
• Crée une page auteur sur Amazon Author Central

Bonne publication !

— EbookStudio.fr · Généré le ${new Date().toLocaleString('fr-FR')}
`;
};

export const generateKdpPackZip = async (opts: KdpPackOptions): Promise<Blob> => {
  const zip = new JSZip();
  const folderName = slugify(opts.ebookTitle);
  const root = zip.folder(folderName)!;

  // PDF
  if (opts.pdfBlob) {
    root.file('manuscrit-kdp.pdf', opts.pdfBlob);
  }

  // Couvertures
  if (opts.coverFrontUrl) {
    const b = await fetchAsBlob(opts.coverFrontUrl);
    if (b) root.file('couverture-front.jpg', b);
  }
  if (opts.coverFullUrl) {
    const b = await fetchAsBlob(opts.coverFullUrl);
    if (b) root.file('couverture-full.jpg', b);
  }

  // Audio
  if (opts.audioFiles && opts.audioFiles.length) {
    const audio = root.folder('audio')!;
    for (const f of opts.audioFiles) {
      audio.file(f.name, f.blob);
    }
  }

  // Metadata + README
  root.file('metadata-kdp.txt', buildMetadata(opts));
  root.file('README.txt', buildReadme(opts));

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
};

export const downloadKdpPack = async (opts: KdpPackOptions) => {
  const blob = await generateKdpPackZip(opts);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(opts.ebookTitle)}-pack-kdp.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
