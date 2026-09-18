import { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { listerLivres, type LivreBiblio } from '@/lib/kdp/bibliotheque';

interface Props {
  marche: string;
  /** Contenu du champ « ASIN concurrents » de la page (texte libre). */
  valeur: string;
  onChange: (valeur: string) => void;
}

const codes = (texte: string): string[] =>
  texte.split(/[\s,;]+/).map((v) => v.trim().toUpperCase()).filter(Boolean);

/**
 * Cocher des livres de la bibliothèque pour les cibler comme concurrents,
 * sans jamais inventer d'ASIN : seuls les livres enregistrés sont proposés.
 */
export default function ConcurrentsBibliotheque({ marche, valeur, onChange }: Props) {
  const [livres, setLivres] = useState<LivreBiblio[]>([]);

  useEffect(() => { setLivres(listerLivres()); }, []);

  const proposables = useMemo(() => livres.filter((l) => l.marketplace === marche), [livres, marche]);
  const actifs = useMemo(() => new Set(codes(valeur)), [valeur]);

  if (proposables.length === 0) return null;

  const basculer = (asin: string) => {
    const liste = codes(valeur);
    const suite = liste.includes(asin) ? liste.filter((a) => a !== asin) : [...liste, asin];
    onChange(suite.join(', '));
  };

  return (
    <div className="mb-4 rounded-2xl border p-4" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)' }}>
      <p className="mb-2 inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
        <Users className="h-4 w-4" /> Cibler des livres de ma bibliothèque comme concurrents
      </p>
      <div className="flex flex-wrap gap-2">
        {proposables.map((l) => {
          const actif = actifs.has(l.asin);
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => basculer(l.asin)}
              className="max-w-[320px] truncate rounded-full border px-3 py-1.5 text-left text-[12px]"
              style={actif
                ? { background: 'var(--v3-action-orange)', color: 'var(--v3-action-orange-text)', borderColor: 'var(--v3-action-orange)' }
                : { background: 'var(--v3-paper)', color: 'var(--v3-ink)', borderColor: 'var(--v3-line)' }}
            >
              {l.titre} · {l.asin}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11.5px]" style={{ color: 'var(--v3-muted)' }}>
        Les ASIN cochés s'ajoutent au champ ci-dessous. Vous pouvez aussi en saisir d'autres à la main.
      </p>
    </div>
  );
}
