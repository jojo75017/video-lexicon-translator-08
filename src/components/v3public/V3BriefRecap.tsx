import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ListOrdered, Rocket, UserRound, Save, Check, ArrowRight } from 'lucide-react';
import { readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import V3TargetPromisePanel from './V3TargetPromisePanel';
import V3OutlinePanel from './V3OutlinePanel';

/** Mêmes catégories que le wizard V3 (liste déroulante scrollable). */
const CATEGORIES = [
  'Roman', 'Thriller / Policier', 'Policier / Enquête', 'Romance', 'Romance historique',
  'Fantasy / Fantastique', 'Science-fiction', 'Horreur / Suspense', 'Aventure',
  'Nouvelles / Récits courts', 'Biographie / Mémoires', 'Témoignage / Récit de vie',
  'Développement personnel', 'Productivité / Organisation', 'Business / Entrepreneuriat',
  'Finances personnelles / Investissement', 'Marketing / Vente en ligne',
  'Santé / Bien-être', 'Fitness / Sport', 'Nutrition / Régimes', 'Cuisine / Recettes',
  'Voyage / Guide', 'Enfants / Jeunesse', 'Livre illustré 3-7 ans', 'Éducation / Pédagogie',
  'Parentalité / Famille', 'Spiritualité', 'Psychologie / Relations', 'Histoire / Culture',
  'Nature / Animaux', 'Loisirs créatifs / DIY', 'Informatique / IA', 'Carnet / Journal / Cahier',
  'Poésie', 'Autre',
];

const TONES = ['Inspirant', 'Pédagogique', 'Émotionnel', 'Direct', 'Humoristique', 'Premium', 'Romanesque', 'Expert'];

const fieldStyle = { borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: '#fff' } as const;
const labelClass = 'text-[11px] font-bold uppercase tracking-widest';

type Props = {
  /** `compact` : récapitulatif en lecture (accueil). `full` : fiche complète éditable (/v3/create). */
  variant?: 'full' | 'compact';
  onLaunch?: () => void;
  /** Préselectionne le mode du Sommaire IA (dialogue guidé). */
  outlineMode?: 'full' | 'guided';
};

/**
 * Fiche du livre : saisie complète sur /v3/create, récapitulatif en lecture sur l'accueil.
 * La Cible & Promesse est générée par l'IA (aucun champ à remplir) et le sommaire
 * doit être validé avant de lancer le workflow.
 */
export default function V3BriefRecap({ variant = 'compact', onLaunch, outlineMode }: Props) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBrief(readBookBrief() || {});
  }, []);

  const patch = (values: Partial<BookBrief>) => {
    setSaved(false);
    setBrief((prev) => {
      const next = { ...prev, ...values };
      writeBookBrief(next);
      return next;
    });
  };

  const set = <K extends keyof BookBrief>(key: K, value: BookBrief[K]) => patch({ [key]: value } as Partial<BookBrief>);

  const save = () => {
    writeBookBrief(brief);
    setSaved(true);
  };

  const outline = brief.outline || [];
  const characters = (brief.characters || []).filter((c) => (c.name || '').trim());
  const chapters = Number(brief.chapters) || 0;
  const wordsPerChapter = Number(brief.wordsPerChapter) || 0;
  const totalWords = chapters * wordsPerChapter;

  // Obligatoire pour lancer : titre, auteur, synopsis. Le reste est recommandé
  // (le sommaire et la Cible & Promesse sont générés automatiquement si absents).
  const missing: string[] = [];
  if (!(brief.title || '').trim()) missing.push('le titre');
  if (!(brief.author || '').trim()) missing.push('le nom de l’auteur');
  if ((brief.description || '').trim().length < 30) missing.push('le synopsis');
  const recommended: string[] = [];
  if (!(brief.promesseCentrale || '').trim()) recommended.push('la Cible & Promesse (bouton IA)');
  if (!brief.outlineValidated || outline.length === 0) recommended.push('la validation du sommaire');
  const ready = missing.length === 0;


  /* ---------------------------- Variante compacte ---------------------------- */
  if (variant === 'compact') {
    return (
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="rounded-[28px] border p-6 md:p-8" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <span className="v3-chip v3-chip-orange"><BookOpen className="h-3.5 w-3.5" /> Mon livre en préparation</span>
              <h2 className="v3-serif mt-3 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                {brief.title?.trim() || 'Projet sans titre'}
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                {[brief.category, chapters ? `${chapters} chapitres` : null,
                  brief.outlineValidated && outline.length ? `sommaire validé (${outline.length})` : 'sommaire à valider',
                ].filter(Boolean).join(' · ')}
              </p>
              {brief.promesseCentrale?.trim() && (
                <p className="mt-2 text-sm italic" style={{ color: 'var(--v3-ink)' }}>✨ {brief.promesseCentrale}</p>
              )}
            </div>
            <Link to="/v3/create" className="v3-btn v3-btn-primary shrink-0">
              <ArrowRight className="h-4 w-4" /> Continuer mon livre
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------ Variante full ------------------------------ */
  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border p-6 md:p-8" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <span className="v3-chip v3-chip-orange"><BookOpen className="h-3.5 w-3.5" /> Fiche de mon livre</span>
            <h2 className="v3-serif mt-3 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
              {brief.title?.trim() || 'Projet sans titre'}
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--v3-muted)' }}>
              Tout est enregistré automatiquement — remplissez la fiche, laissez l’IA faire la Cible &amp; Promesse, validez le sommaire.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" onClick={save} className="v3-btn v3-btn-outline">
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? 'Enregistré' : 'Enregistrer la fiche'}
            </button>
            <Link to="/v3/outils/sommaire-ultime" className="v3-btn v3-btn-outline">
              <ListOrdered className="h-4 w-4" /> Sommaire Ultime
            </Link>
          </div>
        </div>

        {/* Champs du livre */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Titre du livre *</span>
            <input value={brief.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="Le titre de votre livre"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle} />
          </label>
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Sous-titre (optionnel)</span>
            <input value={brief.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} placeholder="Promesse courte, bénéfice…"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle} />
          </label>
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Nom de l'auteur *</span>
            <input value={brief.author || ''} onChange={(e) => set('author', e.target.value)} placeholder="Nom de plume"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle} />
          </label>
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Catégorie Amazon KDP * ({CATEGORIES.length})</span>
            <select value={brief.category || ''} onChange={(e) => set('category', e.target.value)} size={1}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle}>
              <option value="">— Choisir une catégorie —</option>
              {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Ton du livre</span>
            <select value={brief.tone || ''} onChange={(e) => set('tone', e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle}>
              <option value="">— Choisir un ton —</option>
              {TONES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Chapitres</span>
              <input type="number" min={3} max={60} value={brief.chapters ?? ''} onChange={(e) => set('chapters', Number(e.target.value) || undefined)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle} />
            </label>
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>Mots / chapitre</span>
              <input type="number" min={500} max={8000} step={100} value={brief.wordsPerChapter ?? ''} onChange={(e) => set('wordsPerChapter', Number(e.target.value) || undefined)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={fieldStyle} />
            </label>
          </div>
          <label className="block md:col-span-2">
            <span className={labelClass} style={{ color: 'var(--v3-muted)' }}>
              Synopsis * {brief.description ? `· ${brief.description.trim().split(/\s+/).filter(Boolean).length} mots` : ''}
            </span>
            <textarea value={brief.description || ''} onChange={(e) => set('description', e.target.value)} rows={5}
              placeholder="De quoi parle votre livre ? Pour qui ? Que va-t-il changer pour le lecteur ?"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm leading-relaxed outline-none" style={fieldStyle} />
          </label>
        </div>

        {totalWords > 0 && (
          <p className="mt-3 text-xs font-semibold" style={{ color: 'var(--v3-muted)' }}>
            Estimation : {chapters} chapitres · {totalWords.toLocaleString('fr-FR')} mots · ~{Math.max(1, Math.round(totalWords / 300))} pages
          </p>
        )}

        {characters.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
              Personnages ({characters.length})
            </h3>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {characters.map((character, index) => (
                <li key={index} className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }}>
                  <span className="flex items-center gap-2 font-bold"><UserRound className="h-3.5 w-3.5" /> {character.name}</span>
                  <span className="text-xs" style={{ color: 'var(--v3-muted)' }}>{[character.role, character.description || character.traits].filter(Boolean).join(' — ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Cible & Promesse — 100 % IA */}
      <V3TargetPromisePanel brief={brief} onChange={patch} />

      {/* Sommaire + validation */}
      <V3OutlinePanel brief={brief} onChange={patch} initialMode={outlineMode} />

      {/* Lancement du workflow */}
      <div className="rounded-[22px] border p-5" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
        <button
          type="button"
          onClick={() => { save(); onLaunch?.(); }}
          disabled={!ready}
          className="v3-btn v3-btn-primary w-full justify-center py-4 text-base disabled:opacity-50"
        >
          <Rocket className="h-5 w-5" /> Lancer le workflow
        </button>
        {!ready ? (
          <p className="mt-3 text-center text-xs" style={{ color: 'var(--v3-muted)' }}>
            Il manque encore : {missing.join(', ')}.
          </p>
        ) : recommended.length > 0 ? (
          <p className="mt-3 text-center text-xs" style={{ color: 'var(--v3-muted)' }}>
            Recommandé (généré automatiquement si vous lancez maintenant) : {recommended.join(', ')}.
          </p>
        ) : null}

      </div>
    </section>
  );
}
