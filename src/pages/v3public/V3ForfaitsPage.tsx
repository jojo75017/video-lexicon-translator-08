import { Link } from 'react-router-dom';
import { BackButton } from '@/components/v3/BackButton';
import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function V3ForfaitsPage() {
  usePageMeta({ title: 'Offres à vie et options — EbookStudio', description: 'EbookStudio à 47 € en paiement unique, Pack Édition Pro à 97 € en option. Les droits des clients actuels sont conservés.' });
  return <main className="min-h-screen bg-background px-4 py-10 text-foreground">
    <div className="mx-auto max-w-7xl"><BackButton className="mb-4" />
      <h1 className="text-center text-4xl font-bold">Les offres EbookStudio</h1>
      <V3PricingOverview />
      <section className="mt-8 border-t py-6"><h2 className="text-2xl font-semibold">Les services restent à la carte</h2>
        <p className="my-3 text-muted-foreground">Version audio d’un livre : 9,99 €. Studio Jeunesse : 47 €. Précommande Micro-Séries V4 : 67 €. Aucun de ces compléments n’est ajouté automatiquement.</p>
        <Button asChild variant="outline"><Link to="/v3/upsells">Voir toutes les options</Link></Button>
      </section>
      <p className="mt-6 text-sm text-muted-foreground">Les abonnements historiques se consultent dans <Link to="/v3/compte" className="underline">Mon compte</Link> ; aucune formule mensuelle ou annuelle n’est proposée aux nouveaux clients sur cette page.</p>
    </div>
  </main>;
}
