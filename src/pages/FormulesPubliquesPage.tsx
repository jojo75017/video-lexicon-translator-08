import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { usePageMeta } from '@/hooks/usePageMeta';
import offresHero from '@/assets/offres-hero.jpg';

// Page publique à partager : uniquement les 3 formules mensuelles, sans menu ni accueil.
export default function FormulesPubliquesPage() {
  usePageMeta({ title: 'Formules EbookStudio — dès 19 €/mois', description: 'Plan Débutant 19 €/mois, Plan Auteur 29 €/mois et Plan Édition VIP 59 €/mois. Sans engagement.' });
  return <main className="dark v3-plans-dark min-h-screen px-4 py-10" style={{ background: '#0b1120', color: '#f5f5f5' }}>
    <div className="mx-auto max-w-7xl">
      <img src={offresHero} alt="Les offres EbookStudio" width={1600} height={560} className="w-full h-48 md:h-64 object-cover rounded-2xl mb-6" />
      <h1 className="text-center text-4xl font-bold">Les offres EbookStudio</h1>
      <V3PricingOverview />
    </div>
  </main>;
}
