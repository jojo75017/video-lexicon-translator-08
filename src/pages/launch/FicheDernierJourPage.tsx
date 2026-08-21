import { AlertTriangle, Check } from 'lucide-react';
import FicheShell, { FicheCountdown } from '@/components/launch/FicheShell';

const RECAP = [
  'Plan et rédaction du livre complet, chapitre par chapitre',
  'Export Word et PDF aux normes Amazon KDP',
  'Couverture complète : face avant, dos calculé, 4e de couverture',
  'Fiche Amazon : description, 7 mots-clés, catégories',
  'Livres illustrés pour enfants, traduction, recherche de niches',
  'La V3 incluse au 1er octobre, sans abonnement',
];

/** Fiche J5 — Dernier jour : urgence assumée, un seul bouton vers /commander. */
export default function FicheDernierJourPage() {
  return (
    <FicheShell
      badge="Dernier jour"
      title="Ce soir à minuit, l'accès à 47 € disparaît"
      ctaLabel="Profiter des 47 € avant ce soir"
      metaTitle="Dernier jour à 47 € — EbookStudio"
      metaDescription="Dernier jour pour obtenir l'accès complet EbookStudio à 47 € en paiement unique. Ensuite, la V3 passe par abonnement."
    >
      <div className="flex justify-center">
        <FicheCountdown dark />
      </div>

      <section className="rounded-2xl bg-[#0F2E1F] p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 flex-none text-[#D4AF37]" />
          <h2 className="v3-serif text-xl font-bold text-white">Après ce soir, il n'y a plus de paiement unique</h2>
        </div>
        <p className="mt-4 leading-relaxed text-white/85">
          Demain 1er septembre, les inscriptions à la V3 ouvrent avec le premier mois offert,
          pour une ouverture le 1er octobre — par abonnement mensuel. L'accès à vie à 47 €,
          lui, s'arrête ce soir et ne reviendra pas.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Ce que vous obtenez encore aujourd'hui pour 47 €</h2>
        <ul className="mt-4 space-y-2">
          {RECAP.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[#5B5245]">
              <Check className="mt-0.5 h-4 w-4 flex-none text-[#008296]" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm text-[#5B5245]">
        Paiement unique · accès conservé · rien à résilier, rien à surveiller.
      </p>
    </FicheShell>
  );
}
