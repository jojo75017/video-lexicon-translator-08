import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, ArrowRight } from 'lucide-react';

const PromoMerciPage = () => {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState<string>('/lead-magnets/5-niches-rentables-2026.pdf');

  useEffect(() => {
    const stateUrl = (location.state as any)?.url;
    if (stateUrl) setPdfUrl(stateUrl);
  }, [location.state]);

  return (
    <FunnelLayout>
      <SeoHead
        title="Merci ! Votre guide est prêt"
        description="Téléchargez votre guide PDF gratuit et découvrez l'outil EbookStudio."
        canonical="/promo/merci"
        noindex
      />
      <section className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <CheckCircle2 className="w-20 h-20 text-[#008296] mx-auto" />
        <h1 className="text-3xl md:text-4xl font-bold">Merci ! Votre guide est prêt 🎉</h1>
        <p className="text-lg text-gray-700">
          Vous allez recevoir le PDF par email dans quelques secondes. En attendant, téléchargez-le directement ici&nbsp;:
        </p>

        <Button
          asChild
          className="bg-[#008296] hover:bg-[#006d7e] text-white font-bold py-6 px-8 text-base"
        >
          <a
            href="/lead-magnets/5-niches-rentables-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="5-niches-rentables-2026.pdf"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le guide PDF
          </a>
        </Button>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 text-left mt-12">
          <h2 className="text-2xl font-bold text-[#232F3E]">
            🚀 Et si vous publiiez votre 1er ebook cette semaine ?
          </h2>
          <p className="text-gray-700">
            EbookStudio est l'outil tout-en-un qui transforme une simple idée en ebook prêt pour Amazon KDP en moins de 30 minutes&nbsp;: plan, chapitres, couverture, mots-clés SEO, fichiers KDP-compliant.
          </p>
          <Link to="/promo/decouverte">
            <Button className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold w-full md:w-auto py-6 px-8">
              Découvrir l'outil <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* RECRUTEMENT AFFILIÉ */}
        <div className="bg-gradient-to-br from-[#008296]/10 to-[#FF9E2D]/10 border border-[#008296]/30 rounded-xl p-8 text-left">
          <p className="text-xs uppercase tracking-wide text-[#008296] font-bold mb-2">💰 Bonus</p>
          <h2 className="text-2xl font-bold text-[#232F3E] mb-2">
            Vous adorez EbookStudio ? Gagnez 20€ par recommandation
          </h2>
          <p className="text-gray-700 mb-4">
            Notre programme d'affiliation vous reverse <strong>30% de commission</strong> (soit 20,10€) sur chaque vente que vous générez. Cookie 30 jours, paiement PayPal.
          </p>
          <Link to="/promo/affilie">
            <Button variant="outline" className="border-[#008296] text-[#008296] hover:bg-[#008296] hover:text-white">
              Devenir affilié <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </FunnelLayout>
  );
};

export default PromoMerciPage;
