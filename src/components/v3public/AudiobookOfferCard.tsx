import { useState } from 'react';
import { Headphones, X, Check } from 'lucide-react';

type Props = {
  bookId?: string;
  bookTitle?: string;
  compact?: boolean;
};

/**
 * Carte OPTIONNELLE proposant la conversion du livre en audiobook (9,99 €).
 * Aucune génération automatique : l'utilisateur clique uniquement s'il le souhaite.
 */
export default function AudiobookOfferCard({ bookId, bookTitle, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try { return !!localStorage.getItem(`v3_audio_offer_dismissed_${bookId || 'global'}`); }
    catch { return false; }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem(`v3_audio_offer_dismissed_${bookId || 'global'}`, '1'); } catch {}
    setDismissed(true);
  };

  return (
    <>
      <div
        className={`v3-card relative ${compact ? 'p-4' : 'p-5'} border border-[color:var(--v3-orange)]/25 bg-gradient-to-br from-[#FFF6E8] to-[#FFE9C7]`}
      >
        <button
          onClick={dismiss}
          aria-label="Fermer la proposition"
          className="absolute top-2 right-2 p-1 rounded hover:bg-black/5 text-[var(--v3-muted)]"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--v3-orange)]/15 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5 text-[var(--v3-orange-600)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-[var(--v3-orange-600)] font-semibold">
              Option — pas obligatoire
            </div>
            <h3 className="v3-serif text-lg font-bold mt-0.5 text-[var(--v3-ink)]">
              Convertir en audiobook · 9,99 €
            </h3>
            <p className={`text-sm text-[var(--v3-muted)] mt-1 ${compact ? 'line-clamp-2' : ''}`}>
              Transformez {bookTitle ? `« ${bookTitle} »` : 'ce livre'} en version audio avec votre propre
              clé Azure Speech (voix naturelles). Vous ne payez que si vous le souhaitez.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setOpen(true)}
                className="v3-btn v3-btn-primary text-sm"
              >
                <Headphones className="w-4 h-4" /> En savoir plus
              </button>
              <button
                onClick={dismiss}
                className="v3-btn v3-btn-outline text-sm"
              >
                Non merci
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="v3-chip v3-chip-orange text-xs">
                  <Headphones className="w-3.5 h-3.5" /> Audiobook optionnel
                </span>
                <h3 className="v3-serif text-2xl font-bold mt-2">Version audio · 9,99 €</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-black/5"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[var(--v3-muted)] mt-4">
              Cette option est <strong>totalement facultative</strong>. Vous pouvez continuer à utiliser
              votre livre sans l'activer.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              {[
                'Paiement unique de 9,99 € pour ce livre uniquement',
                'Vous fournissez votre propre clé Azure Speech (voix neuronales fr-FR)',
                'Le coût Azure reste à votre charge (≈ 3–5 € pour un livre de 40 000 mots)',
                'Livraison en MP3 unique + option chapitres séparés',
                'Aucun abonnement, aucune reconduction',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[var(--v3-orange-600)] mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              La conversion arrive bientôt. Cliquez sur <strong>M'avertir</strong> pour être prévenu·e
              par email dès qu'elle sera disponible sur ce livre.
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="v3-btn v3-btn-outline">
                Plus tard
              </button>
              <button
                onClick={() => {
                  try {
                    const list = JSON.parse(localStorage.getItem('v3_audio_waitlist') || '[]');
                    if (bookId && !list.includes(bookId)) list.push(bookId);
                    localStorage.setItem('v3_audio_waitlist', JSON.stringify(list));
                  } catch {}
                  setOpen(false);
                }}
                className="v3-btn v3-btn-primary"
              >
                <Headphones className="w-4 h-4" /> M'avertir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
