import React, { useMemo, useState } from 'react';
import { ChevronDown, Info, BookOpen } from 'lucide-react';
import { EbookAdvancedExport } from '@/components/ebook/EbookAdvancedExport';
import type { Chapter } from '@/hooks/useSubscriptionGeneration';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const INK = '#2A2118';
const GREEN = '#1f9d6b';

/** Gabarits KDP courants (en pouces) avec équivalent cm. */
export const KDP_TRIM_SIZES: { id: string; label: string; w: number; h: number; cm: string }[] = [
  { id: '5x8', label: '5 × 8 po', w: 5, h: 8, cm: '12,7 × 20,3 cm' },
  { id: '5.25x8', label: '5,25 × 8 po', w: 5.25, h: 8, cm: '13,34 × 20,3 cm' },
  { id: '5.5x8.5', label: '5,5 × 8,5 po', w: 5.5, h: 8.5, cm: '13,97 × 21,59 cm' },
  { id: '6x9', label: '6 × 9 po (recommandé)', w: 6, h: 9, cm: '15,24 × 22,86 cm' },
  { id: '7x10', label: '7 × 10 po', w: 7, h: 10, cm: '17,78 × 25,4 cm' },
  { id: '8.5x11', label: '8,5 × 11 po', w: 8.5, h: 11, cm: '21,59 × 27,94 cm' },
];

/** Découpe un manuscrit (texte brut / markdown) en chapitres exploitables par l'exporteur. */
export function manuscriptToChapters(text: string): Chapter[] {
  const cleaned = (text || '').replace(/^\s*-{3,}\s*$/gm, ''); // retire les séparateurs ---
  const lines = cleaned.split('\n');
  const isHeading = (l: string) =>
    /^#{1,3}\s+/.test(l.trim()) ||
    /^\s*(chapitre|chapter|partie|section)\b/i.test(l.trim());

  const chapters: Chapter[] = [];
  let cur: { title: string; body: string[] } | null = null;
  const push = () => {
    if (cur && (cur.title.trim() || cur.body.join('').trim())) {
      chapters.push({
        id: `ch-${chapters.length + 1}`,
        title: cur.title.trim() || `Chapitre ${chapters.length + 1}`,
        subChapters: [],
        content: cur.body.join('\n').trim(),
      });
    }
  };

  for (const l of lines) {
    if (isHeading(l)) {
      push();
      cur = { title: l.replace(/^#{1,3}\s+/, '').trim(), body: [] };
    } else if (cur) {
      cur.body.push(l);
    } else if (l.trim()) {
      cur = { title: 'Chapitre 1', body: [l] };
    }
  }
  push();

  if (chapters.length === 0 && cleaned.trim()) {
    chapters.push({ id: 'ch-1', title: 'Chapitre 1', subChapters: [], content: cleaned.trim() });
  }
  return chapters;
}

interface V3ExportPanelProps {
  manuscript: string;
  title: string;
  subtitle?: string;
  author?: string;
}

/**
 * Bloc d'export complet du parcours V3 :
 * - 6 formats (DOCX KDP, EPUB 3, PDF Impression, PDF Digital, TXT, HTML) via le moteur v2
 * - sélecteur de gabarit KDP (pilote les dimensions du PDF Impression)
 * - panneau pédagogique : gabarits, marges, fonds perdus, DPI images.
 */
const V3ExportPanel: React.FC<V3ExportPanelProps> = ({ manuscript, title, subtitle, author }) => {
  const [trimId, setTrimId] = useState('6x9');
  const [infoOpen, setInfoOpen] = useState(false);
  const trim = KDP_TRIM_SIZES.find((t) => t.id === trimId) ?? KDP_TRIM_SIZES[3];

  const chapters = useMemo(() => manuscriptToChapters(manuscript), [manuscript]);
  const ready = (manuscript || '').trim().length >= 50;

  if (!ready) {
    return (
      <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: `${GREEN}40`, background: '#f3fbf7' }}>
        <div className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: GREEN }}>
          <BookOpen className="h-4 w-4" /> Exporter ton livre
        </div>
        <p className="mt-1 text-[12px]" style={{ color: '#5f7a6c' }}>
          Génère ou importe ton manuscrit à l'étape « Développer le manuscrit » pour activer l'export multi-format (DOCX KDP, EPUB, PDF impression/digital, TXT, HTML).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: `${GREEN}40`, background: '#f3fbf7' }}>
      <div className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: GREEN }}>
        <BookOpen className="h-4 w-4" /> Exporter ton livre — 6 formats prêts à publier
      </div>
      {/* Rappel du livre réellement exporté : évite d'exporter le manuscrit d'un autre projet. */}
      <div className="mt-1.5 rounded-lg border px-3 py-2 text-[12px]" style={{ borderColor: '#cfe6da', background: '#fff' }}>
        <span style={{ color: '#5f7a6c' }}>Livre exporté : </span>
        <strong style={{ color: INK }}>« {title || 'Mon livre'} »</strong>
        {author ? <span style={{ color: '#5f7a6c' }}> — {author}</span> : null}
        <span className="ml-2" style={{ color: '#5f7a6c' }}>
          ({chapters.length} chapitre{chapters.length > 1 ? 's' : ''} · {manuscript.trim().split(/\s+/).filter(Boolean).length.toLocaleString('fr-FR')} mots détectés)
        </span>
        <div className="mt-1 text-[11px]" style={{ color: '#8a7a5c' }}>
          Vérifie que c'est bien le bon livre. Sinon, recharge le projet voulu (section « Rouvrir un projet ») avant d'exporter.
        </div>
      </div>

      {/* Sélecteur de gabarit KDP */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="text-[12px] font-semibold" style={{ color: INK }}>Gabarit du livre (broché) :</label>
        <select
          value={trimId}
          onChange={(e) => setTrimId(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-[12px] font-medium bg-white"
          style={{ borderColor: '#cfe6da', color: INK }}
        >
          {KDP_TRIM_SIZES.map((t) => (
            <option key={t.id} value={t.id}>{t.label} — {t.cm}</option>
          ))}
        </select>
        <span className="text-[11px]" style={{ color: '#5f7a6c' }}>
          Pilote les dimensions du PDF Impression.
        </span>
      </div>

      {/* Panneau d'infos KDP (repliable) */}
      <div className="mt-3 rounded-xl border overflow-hidden" style={{ borderColor: '#eadfc9', background: '#FFFDF8' }}>
        <button
          type="button"
          onClick={() => setInfoOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#FFF3DF]"
          aria-expanded={infoOpen}
        >
          <span className="inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: AMBER_DEEP }}>
            <Info className="h-4 w-4" /> Marges, gabarits & fonds perdus (guide KDP)
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${infoOpen ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
        </button>
        {infoOpen && (
          <div className="px-4 pb-4 pt-1 text-[12px] leading-relaxed" style={{ color: INK }}>
            <p className="font-semibold mt-2" style={{ color: AMBER_DEEP }}>📐 Gabarits courants</p>
            <div className="mt-1 overflow-x-auto">
              <table className="w-full text-[11.5px] border-collapse">
                <thead>
                  <tr style={{ background: '#FFF3DF' }}>
                    <th className="text-left px-2 py-1 border" style={{ borderColor: '#eadfc9' }}>Format</th>
                    <th className="text-left px-2 py-1 border" style={{ borderColor: '#eadfc9' }}>Pouces</th>
                    <th className="text-left px-2 py-1 border" style={{ borderColor: '#eadfc9' }}>Centimètres</th>
                  </tr>
                </thead>
                <tbody>
                  {KDP_TRIM_SIZES.map((t) => (
                    <tr key={t.id}>
                      <td className="px-2 py-1 border" style={{ borderColor: '#eadfc9' }}>{t.label.replace(' (recommandé)', '')}</td>
                      <td className="px-2 py-1 border" style={{ borderColor: '#eadfc9' }}>{t.w} × {t.h} po</td>
                      <td className="px-2 py-1 border" style={{ borderColor: '#eadfc9' }}>{t.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-semibold mt-3" style={{ color: AMBER_DEEP }}>📏 Marges intérieures (reliure)</p>
            <ul className="list-disc ml-5 mt-1 space-y-0.5">
              <li>Jusqu'à 150 pages : <strong>9,6 mm (0,375")</strong></li>
              <li>151 à 300 pages : <strong>12,7 mm (0,5")</strong></li>
              <li>301 à 500 pages : <strong>15,9 mm (0,625")</strong></li>
              <li>501 à 700 pages : <strong>19,1 mm (0,75")</strong></li>
              <li>701 pages et + : <strong>22,2 mm (0,875")</strong></li>
            </ul>
            <p className="mt-1">Marges extérieures (haut, bas, ext.) : minimum <strong>6,4 mm (0,25")</strong>.</p>

            <p className="font-semibold mt-3" style={{ color: AMBER_DEEP }}>🩸 Fonds perdus (bleed)</p>
            <p className="mt-1">Pour toute image jusqu'au bord (couverture ou intérieur illustré), ajoute <strong>+3,2 mm (0,125")</strong> de chaque côté débordant.</p>

            <p className="font-semibold mt-3" style={{ color: AMBER_DEEP }}>🖼️ Images & DPI</p>
            <p className="mt-1">Résolution minimum <strong>300 DPI</strong> pour l'impression. Privilégie le JPEG/PNG haute qualité ; évite les images étirées sous 300 DPI (rendu flou refusé par KDP).</p>

            <p className="font-semibold mt-3" style={{ color: AMBER_DEEP }}>📕 Dos de couverture</p>
            <p className="mt-1">Épaisseur du dos ≈ nombre de pages × <strong>0,0572 mm</strong> (papier blanc). Génère la couverture aux cotes exactes via l'agent « Couverture KDP exacte ».</p>
          </div>
        )}
      </div>

      {/* Moteur d'export v2 complet */}
      <div className="mt-4">
        <EbookAdvancedExport
          ebookTitle={title || 'Mon livre'}
          authorName={author || ''}
          chapters={chapters}
          trimSize={{ w: trim.w, h: trim.h }}
        />
      </div>
    </div>
  );
};

export default V3ExportPanel;
