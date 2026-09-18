import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  ajouterParAsin,
  estAsin,
  listerLivres,
  livreEnCours,
  type LivreBiblio,
} from '@/lib/kdp/bibliotheque';

interface Props {
  /** Appelé quand l'auteur choisit un livre enregistré. */
  onChoisir: (livre: LivreBiblio) => void;
  /** ASIN actuellement saisi dans la page : permet de l'ajouter à la bibliothèque. */
  asinSaisi?: string;
  marketplaceSaisi?: string;
  /** Propose automatiquement le livre marqué « en cours » au premier affichage. */
  autoLivreEnCours?: boolean;
}

/**
 * Encart réutilisable : choisir un livre déjà enregistré dans « Ma bibliothèque »
 * pour remplir la page sans recoller son ASIN.
 */
export default function SelecteurLivreBiblio({
  onChoisir,
  asinSaisi = '',
  marketplaceSaisi = 'fr',
  autoLivreEnCours = false,
}: Props) {
  const [livres, setLivres] = useState<LivreBiblio[]>([]);
  const [choix, setChoix] = useState('');
  const [ajout, setAjout] = useState(false);

  useEffect(() => {
    const liste = listerLivres();
    setLivres(liste);
    if (autoLivreEnCours) {
      const encours = livreEnCours();
      if (encours) setChoix(encours.id);
    }
  }, [autoLivreEnCours]);

  const asinPropre = asinSaisi.trim().toUpperCase();
  const dejaEnregistre = useMemo(
    () => livres.some((l) => l.asin === asinPropre && l.marketplace === marketplaceSaisi),
    [livres, asinPropre, marketplaceSaisi],
  );

  const utiliser = (id: string) => {
    setChoix(id);
    const livre = livres.find((l) => l.id === id);
    if (livre) {
      onChoisir(livre);
      toast.success(`« ${livre.titre} » chargé depuis votre bibliothèque`);
    }
  };

  const ajouter = async () => {
    if (!estAsin(asinPropre)) {
      toast.error('Collez d’abord un ASIN de 10 caractères.');
      return;
    }
    setAjout(true);
    try {
      const livre = await ajouterParAsin(asinPropre, marketplaceSaisi);
      setLivres(listerLivres());
      setChoix(livre.id);
      toast.success(`« ${livre.titre} » ajouté à votre bibliothèque`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ajout impossible.');
    } finally {
      setAjout(false);
    }
  };

  return (
    <div
      className="mb-4 rounded-2xl border p-4"
      style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)' }}
    >
      <p className="mb-2 inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
        <BookMarked className="h-4 w-4" /> Choisir un livre de ma bibliothèque
      </p>

      {livres.length === 0 ? (
        <p className="text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
          Votre bibliothèque est vide.{' '}
          <Link to="/v3/kdp/bibliotheque" className="underline" style={{ color: 'var(--v3-emerald)' }}>
            Enregistrez vos livres une fois
          </Link>{' '}
          et vous les retrouverez sur toutes les pages KDP.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={choix}
            onChange={(e) => utiliser(e.target.value)}
            className="h-10 min-w-[260px] flex-1 rounded-md border bg-white px-3 text-sm"
            style={{ borderColor: 'var(--v3-line)' }}
          >
            <option value="">— Choisir un livre enregistré —</option>
            {livres.map((l) => (
              <option key={l.id} value={l.id}>
                {l.statut === 'concurrent' ? '[concurrent] ' : ''}
                {l.titre} · {l.asin} · {l.marketplace.toUpperCase()}
                {l.enCours ? ' · livre en cours' : ''}
              </option>
            ))}
          </select>
          <Link to="/v3/kdp/bibliotheque" className="text-[12.5px] underline" style={{ color: 'var(--v3-muted)' }}>
            Gérer ma bibliothèque
          </Link>
        </div>
      )}

      {estAsin(asinPropre) && !dejaEnregistre && (
        <Button
          type="button"
          size="sm"
          onClick={() => void ajouter()}
          disabled={ajout}
          className="mt-3 gap-1.5 [background:var(--v3-action-orange)!important] [color:var(--v3-action-orange-text)!important] hover:[background:var(--v3-action-orange-hover)!important]"
        >
          {ajout ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Ajouter {asinPropre} à ma bibliothèque
        </Button>
      )}
    </div>
  );
}
