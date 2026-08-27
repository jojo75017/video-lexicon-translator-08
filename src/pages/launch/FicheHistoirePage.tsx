import { BookOpen, PenLine, TrendingUp } from 'lucide-react';
import FicheShell from '@/components/launch/FicheShell';

/** Fiche J1 — L'histoire : Marie & Rachel, « la nouvelle voie ».
 *  Pré-vend par le récit, un seul bouton vers /commander. */
export default function FicheHistoirePage() {
  return (
    <FicheShell
      badge="Leur histoire"
      title="Marie n'y connaissait rien aux livres. Rachel, elle, avait une autre histoire."
      metaTitle="Marie et Rachel — EbookStudio"
      metaDescription="Deux histoires vraies d'auteures débutantes sur Amazon KDP, et la nouvelle voie qui les a menées à la publication."
      gateSurface="fiche-histoire"
    >
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008296]/10">
            <BookOpen className="h-5 w-5 text-[#008296]" />
          </span>
          <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Marie, 52 ans — « je n'y connais rien »</h2>
        </div>
        <p className="mt-4 leading-relaxed text-[#5B5245]">
          Marie voulait écrire un guide pour les grands-parents qui s'occupent de leurs petits-enfants.
          Elle n'avait jamais publié quoi que ce soit. Elle a dicté ses idées, chapitre par chapitre,
          et l'atelier a fait le reste : le sommaire, la rédaction, la correction, la couverture,
          la fiche Amazon. Trois semaines plus tard, son livre était en ligne.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008296]/10">
            <PenLine className="h-5 w-5 text-[#008296]" />
          </span>
          <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Rachel — « j'avais déjà tout essayé »</h2>
        </div>
        <p className="mt-4 leading-relaxed text-[#5B5245]">
          Rachel avait acheté deux formations et passé des mois sur un manuscrit jamais terminé.
          Le problème n'était pas ses idées : c'était l'absence de méthode. Avec un plan validé
          avant d'écrire et des chapitres corrigés au fur et à mesure, elle a fini en quelques soirées
          ce qu'elle traînait depuis deux ans.
        </p>
      </section>

      <section className="rounded-2xl bg-[#0F2E1F] p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20">
            <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
          </span>
          <h2 className="v3-serif text-xl font-bold text-white">La nouvelle voie</h2>
        </div>
        <p className="mt-4 leading-relaxed text-white/85">
          Ni formation de 600 pages, ni logiciel compliqué. Vous donnez votre idée, vous validez
          le sommaire, les chapitres sont écrits et corrigés sous vos yeux, et vous repartez avec
          les fichiers prêts pour Amazon : manuscrit, couverture au bon format, description et
          mots-clés. C'est exactement le chemin qu'ont suivi Marie et Rachel.
        </p>
        <p className="mt-4 text-sm text-white/70">
          Jusqu'au 30 septembre, l'accès complet est à 47 € en un seul paiement. Ensuite, place à la V3
          par abonnement.
        </p>
      </section>
    </FicheShell>
  );
}
