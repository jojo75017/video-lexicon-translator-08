import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ListOrdered, Rocket, UserRound } from 'lucide-react';
import { readBookBrief, type BookBrief } from '@/lib/v3/bookBrief';

/**
 * Récapitulatif « Livre en préparation » affiché sur l'accueil V3 :
 * l'auteur voit sa fiche, son sommaire validé et ses personnages
 * avant de lancer le workflow.
 */
export default function V3BriefRecap() {
  const [brief, setBrief] = useState<BookBrief | null>(null);

  useEffect(() => {
    setBrief(readBookBrief());
  }, []);

  if (!brief) return null;

  const outline = brief.outline || [];
  const characters = (brief.characters || []).filter((c) => (c.name || '').trim());

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <div className="rounded-[28px] border p-6 md:p-8" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <span className="v3-chip v3-chip-orange"><BookOpen className="h-3.5 w-3.5" /> Livre en préparation</span>
            <h2 className="v3-serif mt-3 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
              {brief.title || 'Projet sans titre'}
            </h2>
            {brief.subtitle && <p className="text-sm" style={{ color: 'var(--v3-muted)' }}>{brief.subtitle}</p>}
            <p className="mt-2 text-xs" style={{ color: 'var(--v3-muted)' }}>
              {[brief.author, brief.category, brief.tone].filter(Boolean).join(' · ')}
              {brief.chapters ? ` · ${brief.chapters} chapitres` : ''}
              {brief.wordsPerChapter ? ` · ${brief.wordsPerChapter.toLocaleString('fr-FR')} mots/chapitre` : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to="/v3/create" className="v3-btn v3-btn-primary">
              <Rocket className="h-4 w-4" /> Reprendre mon livre
            </Link>
            <Link to="/v3/outils/sommaire-ultime" className="v3-btn v3-btn-outline">
              <ListOrdered className="h-4 w-4" /> Sommaire Ultime
            </Link>
          </div>
        </div>

        {brief.description && (
          <p className="mt-5 rounded-2xl border px-4 py-3 text-sm leading-relaxed" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-orange-50)' }}>
            {brief.description}
          </p>
        )}

        {brief.promesseCentrale && (
          <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--v3-ink)' }}>✨ {brief.promesseCentrale}</p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
              Sommaire validé ({outline.length})
            </h3>
            {outline.length === 0 ? (
              <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Aucun sommaire enregistré pour le moment.</p>
            ) : (
              <ol className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-2">
                {outline.map((chapter, index) => (
                  <li key={`${chapter.numero}-${index}`} className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--v3-border)' }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Chapitre {index + 1}</span>
                    <p className="v3-serif text-base font-bold" style={{ color: 'var(--v3-ink)' }}>{chapter.titre}</p>
                    {chapter.objectif && <p className="text-xs" style={{ color: 'var(--v3-muted)' }}>{chapter.objectif}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
              Personnages ({characters.length})
            </h3>
            {characters.length === 0 ? (
              <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Aucun personnage défini.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {characters.map((character, index) => (
                  <li key={index} className="rounded-xl border px-3 py-2 text-sm" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }}>
                    <span className="flex items-center gap-2 font-bold"><UserRound className="h-3.5 w-3.5" /> {character.name}</span>
                    <span className="text-xs" style={{ color: 'var(--v3-muted)' }}>{[character.role, character.description || character.traits].filter(Boolean).join(' — ')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
