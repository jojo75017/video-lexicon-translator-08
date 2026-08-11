import ReferralKitCard from '@/components/referral/ReferralKitCard';
import SeoHead from '@/components/funnel/SeoHead';

/** Espace parrainage de l'abonné : lien, statistiques et textes prêts à publier. */
export default function ReferralKitPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <SeoHead
        title="Mon parrainage — EbookStudio"
        description="Votre lien de parrainage EbookStudio, vos commissions et des textes prêts à publier pour recommander l'outil."
        canonical="https://ebookstudio.fr/mon-parrainage"
      />
      <h1 className="mb-6 text-2xl font-black">Parrainage</h1>
      <ReferralKitCard />
    </main>
  );
}
