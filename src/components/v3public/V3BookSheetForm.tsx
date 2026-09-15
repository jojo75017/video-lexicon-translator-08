import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Download, Plus, QrCode, Save, Trash2 } from 'lucide-react';
import QRCode from 'qrcode';
import {
  BOOK_BRIEF_EVENT,
  parseBookSheet,
  readBookBrief,
  writeBookBrief,
  type BookBrief,
} from '@/lib/v3/bookBrief';

type SectionId = 'sheet' | 'identity' | 'author' | 'pitch' | 'characters' | 'ending' | 'review';

const SECTIONS: Array<{ id: SectionId; label: string; hint: string }> = [
  { id: 'sheet', label: 'Coller ma fiche complète', hint: 'Un document déjà écrit ? Collez-le, tout se range dans les bons champs.' },
  { id: 'identity', label: 'Identité du livre', hint: 'Titre, sous-titre, genre, format, nombre de chapitres.' },
  { id: 'author', label: 'Auteur et traducteur', hint: 'Nom d’auteur, nom de plume, traducteur.' },
  { id: 'pitch', label: 'Accroche et synopsis', hint: 'La phrase de vente et le résumé complet.' },
  { id: 'characters', label: 'Personnages', hint: 'Une fiche par personnage : nom, âge, rôle, personnalité, enjeu.' },
  { id: 'ending', label: 'Épilogue, pages auteur et remerciements', hint: 'Tout ce qui s’imprime en fin de livre.' },
  { id: 'review', label: 'Note d’avis et QR code', hint: 'Invitez le lecteur à laisser un avis, avec le QR code de vos livres.' },
];

const inputStyle = { borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' } as const;

function Field({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{label}</span>
      {rows ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-[12.5px] outline-none"
          style={inputStyle}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-[12.5px] outline-none"
          style={inputStyle}
        />
      )}
    </label>
  );
}

/**
 * Fiche complète du livre pour le parcours « J'ai déjà mon sommaire ».
 * Tout est enregistré localement dans la fiche du livre (aucun appel IA,
 * aucun crédit, aucune écriture en base depuis ce composant).
 */
export default function V3BookSheetForm() {
  const [brief, setBrief] = useState<BookBrief>(() => readBookBrief() || {});
  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    sheet: true,
    identity: true,
    author: false,
    pitch: false,
    characters: false,
    ending: false,
    review: false,
  });
  const [pasted, setPasted] = useState('');
  const [qr, setQr] = useState('');

  useEffect(() => {
    const sync = () => setBrief(readBookBrief() || {});
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const qrUrl = brief.reviewQrUrl || '';
  useEffect(() => {
    let alive = true;
    if (!qrUrl.trim()) { setQr(''); return; }
    QRCode.toDataURL(qrUrl.trim(), { width: 900, margin: 1, errorCorrectionLevel: 'H' })
      .then((data) => { if (alive) setQr(data); })
      .catch(() => { if (alive) setQr(''); });
    return () => { alive = false; };
  }, [qrUrl]);

  const set = (patch: Partial<BookBrief>) => setBrief((prev) => ({ ...prev, ...patch }));

  const save = () => {
    const current = readBookBrief() || {};
    const next: BookBrief = { ...current, ...brief, creationPath: 'existing-outline', outlineFirst: true };
    writeBookBrief(next);
    window.dispatchEvent(new Event(BOOK_BRIEF_EVENT));
    toast.success('Fiche enregistrée : le Génie s’appuiera dessus sans rien réécrire.');
  };

  const importSheet = () => {
    const parsed = parseBookSheet(pasted);
    const recognised = Object.keys(parsed).length;
    if (!recognised) { toast.error('Rien n’a été reconnu. Gardez les lignes « Titre : … », « Chapitre 1 : … ».'); return; }
    const current = readBookBrief() || {};
    const next: BookBrief = {
      ...current,
      ...brief,
      ...parsed,
      chapters: parsed.outline?.length || brief.chapters || current.chapters,
      outline: parsed.outline?.length ? parsed.outline : current.outline,
      outlineValidated: false,
      outlineFirst: true,
      creationPath: 'existing-outline',
    };
    writeBookBrief(next);
    setBrief(next);
    window.dispatchEvent(new Event(BOOK_BRIEF_EVENT));
    setPasted('');
    setOpen((prev) => ({ ...prev, identity: true, characters: true }));
    toast.success(
      `Fiche lue : ${parsed.outline?.length || 0} chapitre(s), ${parsed.characters?.length || 0} personnage(s). Vérifiez et corrigez librement.`,
    );
  };

  const characters = useMemo(() => brief.characters || [], [brief.characters]);
  const updateCharacter = (index: number, patch: Partial<NonNullable<BookBrief['characters']>[number]>) => {
    const list = [...characters];
    list[index] = { ...list[index], ...patch };
    set({ characters: list });
  };

  const downloadQr = () => {
    if (!qr) return;
    const a = document.createElement('a');
    a.href = qr;
    a.download = 'qr-code-avis-lecteurs.png';
    a.click();
  };

  const toggle = (id: SectionId) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="v3-card mb-4" style={{ borderColor: 'var(--v3-gold, #c9a84c)' }}>
      <h2 className="v3-serif text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>La fiche de votre livre</h2>
      <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
        Tous les champs d’une vraie fiche d’édition : titre, sous-titre, auteur, traducteur, catégories,
        synopsis, personnages, épilogue, pages auteur, remerciements et note d’avis avec QR code.
      </p>

      <div className="mt-4 space-y-3">
        {SECTIONS.map((section) => (
          <div key={section.id} className="rounded-xl border bg-white" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left"
            >
              {open[section.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{section.label}</span>
              <span className="ml-auto hidden text-[11px] sm:inline" style={{ color: 'var(--v3-muted)' }}>{section.hint}</span>
            </button>

            {open[section.id] && (
              <div className="border-t px-3 py-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                {section.id === 'sheet' && (
                  <div className="space-y-2">
                    <textarea
                      value={pasted}
                      rows={7}
                      onChange={(e) => setPasted(e.target.value)}
                      placeholder={'Titre : …\nSous-titre : …\nGenre : …\nPERSONNAGES\n1. Nom – rôle\nPLAN DÉTAILLÉ\nChapitre 1 : …'}
                      className="w-full rounded-xl border bg-white px-3 py-2 text-[12.5px] outline-none"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={importSheet}
                      className="v3-btn v3-btn-action-orange text-xs"
                    >
                      Lire ma fiche et remplir les champs
                    </button>
                  </div>
                )}

                {section.id === 'identity' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Titre" value={brief.title || ''} onChange={(v) => set({ title: v })} />
                    <Field label="Sous-titre" value={brief.subtitle || ''} onChange={(v) => set({ subtitle: v })} />
                    <Field label="Genre" value={brief.genre || ''} onChange={(v) => set({ genre: v })} />
                    <Field label="Catégories (Amazon / KDP)" value={brief.category || ''} onChange={(v) => set({ category: v })} />
                    <Field label="Format visé" value={brief.format || ''} onChange={(v) => set({ format: v })} />
                    <Field label="Pages visées" value={brief.targetPages || ''} onChange={(v) => set({ targetPages: v })} />
                    <Field label="Mots visés" value={brief.targetWords || ''} onChange={(v) => set({ targetWords: v })} />
                    <label className="block">
                      <span className="text-[11.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Nombre de chapitres</span>
                      <input
                        type="number"
                        min={3}
                        max={40}
                        value={brief.chapters || 0}
                        onChange={(e) => set({ chapters: Math.min(40, Math.max(0, Number(e.target.value) || 0)) })}
                        className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-[12.5px] outline-none"
                        style={inputStyle}
                      />
                    </label>
                  </div>
                )}

                {section.id === 'author' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nom d’auteur (ou nom de plume)" value={brief.author || ''} onChange={(v) => set({ author: v })} />
                    <Field label="Traducteur" value={brief.translator || ''} onChange={(v) => set({ translator: v })} />
                  </div>
                )}

                {section.id === 'pitch' && (
                  <div className="space-y-3">
                    <Field label="Accroche commerciale (quatrième de couverture)" rows={3} value={brief.hook || ''} onChange={(v) => set({ hook: v })} />
                    <Field label="Synopsis" rows={6} value={brief.synopsis || brief.description || ''} onChange={(v) => set({ synopsis: v })} />
                  </div>
                )}

                {section.id === 'characters' && (
                  <div className="space-y-3">
                    {characters.length === 0 && (
                      <p className="text-[12px]" style={{ color: 'var(--v3-muted)' }}>Aucun personnage pour l’instant.</p>
                    )}
                    {characters.map((character, index) => (
                      <div key={index} className="rounded-xl border p-3" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <Field label="Nom" value={character.name || ''} onChange={(v) => updateCharacter(index, { name: v })} />
                          <Field label="Âge" value={character.age || ''} onChange={(v) => updateCharacter(index, { age: v })} />
                          <Field label="Rôle" value={character.role || ''} onChange={(v) => updateCharacter(index, { role: v })} />
                        </div>
                        <div className="mt-2 grid gap-2">
                          <Field label="Personnalité" rows={2} value={character.traits || ''} onChange={(v) => updateCharacter(index, { traits: v })} />
                          <Field label="Enjeu / description" rows={2} value={character.description || ''} onChange={(v) => updateCharacter(index, { description: v })} />
                        </div>
                        <button
                          type="button"
                          onClick={() => set({ characters: characters.filter((_, i) => i !== index) })}
                          className="v3-btn v3-btn-outline mt-2 text-[11px]"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Retirer ce personnage
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => set({ characters: [...characters, { name: '' }] })}
                      className="v3-btn v3-btn-action-orange text-xs"
                    >
                      <Plus className="h-3.5 w-3.5" /> Ajouter un personnage
                    </button>
                  </div>
                )}

                {section.id === 'ending' && (
                  <div className="space-y-3">
                    <Field label="Épilogue" rows={4} value={brief.epilogue || ''} onChange={(v) => set({ epilogue: v })} />
                    <Field
                      label="Page auteur 1 — À propos de l’auteur"
                      rows={3}
                      value={brief.authorPages?.about || ''}
                      onChange={(v) => set({ authorPages: { ...(brief.authorPages || {}), about: v } })}
                    />
                    <Field
                      label="Page auteur 2 — Mes autres livres"
                      rows={3}
                      value={brief.authorPages?.otherBooks || ''}
                      onChange={(v) => set({ authorPages: { ...(brief.authorPages || {}), otherBooks: v } })}
                    />
                    <Field
                      label="Page auteur 3 — Contact / lettre aux lecteurs"
                      rows={3}
                      value={brief.authorPages?.contact || ''}
                      onChange={(v) => set({ authorPages: { ...(brief.authorPages || {}), contact: v } })}
                    />
                    <Field label="Remerciements" rows={3} value={brief.acknowledgements || ''} onChange={(v) => set({ acknowledgements: v })} />
                  </div>
                )}

                {section.id === 'review' && (
                  <div className="space-y-3">
                    <Field
                      label="Note pour les avis lecteurs"
                      rows={3}
                      placeholder="Votre avis compte : quelques lignes sur Amazon aident d’autres lecteurs à découvrir ce livre."
                      value={brief.reviewNote || ''}
                      onChange={(v) => set({ reviewNote: v })}
                    />
                    <Field
                      label="Lien du QR code (page auteur ou fiche du livre)"
                      placeholder="https://www.amazon.fr/..."
                      value={brief.reviewQrUrl || ''}
                      onChange={(v) => set({ reviewQrUrl: v })}
                    />
                    {qr ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <img src={qr} alt="QR code vers vos livres pour laisser un avis" className="h-32 w-32 rounded-lg border bg-white p-1" />
                        <button type="button" onClick={downloadQr} className="v3-btn v3-btn-action-orange text-xs">
                          <Download className="h-3.5 w-3.5" /> Télécharger le QR code (PNG)
                        </button>
                      </div>
                    ) : (
                      <p className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                        <QrCode className="h-4 w-4" /> Collez un lien pour voir apparaître le QR code.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        className="v3-btn v3-btn-action-orange mt-4 min-h-12 px-6 text-sm font-bold"
      >
        <Save className="h-3.5 w-3.5" /> Enregistrer ma fiche
      </button>
    </div>
  );
}
