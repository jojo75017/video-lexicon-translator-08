import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { useReferralTracking } from '@/hooks/useReferralTracking';
import { Check, Sparkles, Zap, Shield, BookOpen, TrendingUp, Star, ArrowRight, Gift, Clock } from 'lucide-react';

const OFFER_END = new Date('2026-06-30T23:59:59');
const GUIDE_10_NICHES_URL = 'https://www.trafic-affiliation.com/niches_ebookstudio';

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { days, hours, expired: diff === 0 };
}

const PromoDecouvertePage = () => {
  useReferralTracking();
  const { days, hours, expired } = useCountdown(OFFER_END);
  const offerActive = !expired;
  const price = '67';

  const features = [
    { icon: Sparkles, title: 'Plan d\'ebook IA', desc: 'Génération du plan complet en 30 secondes - pipeline 15 agents.' },
    { icon: BookOpen, title: 'Chapitres pro', desc: 'Rédaction chapitre par chapitre, ton et style adaptés à votre niche.' },
    { icon: Zap, title: 'Couverture KDP', desc: 'Couvertures photoréalistes Imagen 3, format Amazon respecté.' },
    { icon: TrendingUp, title: 'Recherche mots-clés', desc: 'Mots-clés Amazon ciblés + catégories KDP pour ranker.' },
    { icon: Shield, title: 'Export KDP-ready', desc: 'PDF interior + ePub conformes aux exigences Amazon (Modulo 10).' },
    { icon: Star, title: 'Audiobook + BD', desc: 'Bonus : convertir un ebook en livre audio ou en BD illustrée.' },
  ];

  const testimonials = [
    { name: 'Marie L.', role: 'Auteure indépendante', quote: 'J\'ai publié 4 ebooks en 2 mois. Premier chèque KDP : 312€.' },
    { name: 'Karim B.', role: 'Coach business', quote: 'L\'outil le plus complet que j\'ai testé. Les chapitres sont vraiment utilisables.' },
    { name: 'Sophie D.', role: 'Blogueuse', quote: 'Je transforme mes articles en ebook en 1h. Game changer.' },
  ];

  const faq = [
    { q: 'Faut-il être écrivain pour utiliser Ebookstudio Pro V2 ?', a: 'Non. L\'IA rédige pour vous, vous gardez la main sur le ton, le sujet et la structure.' },
    { q: 'Les ebooks sont-ils acceptés sur Amazon KDP ?', a: 'Oui. Tous nos exports respectent les normes KDP (typographie, dimensions, Modulo 10).' },
    { q: 'Combien d\'ebooks puis-je créer ?', a: 'Illimité, à vie, avec votre accès. Jusqu\'à 40 chapitres par projet.' },
    { q: 'Y a-t-il une garantie ?', a: 'Oui, satisfait ou remboursé sous 7 jours.' },
    { q: 'Puis-je revendre les ebooks créés ?', a: 'Oui. Licence commerciale incluse - vous gardez 100% des droits.' },
  ];

  return (
    <FunnelLayout>
      <SeoHead
        title="Ebookstudio Pro V2 - Créez et publiez des ebooks rentables avec l'IA"
        description="Plan, chapitres, couverture, mots-clés Amazon : créez un ebook prêt pour KDP en 30 minutes grâce à l'IA. Essai sans risque."
        canonical="/promo/decouverte"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Ebookstudio Pro V2',
          description: 'Outil IA tout-en-un pour créer et publier des ebooks rentables sur Amazon KDP.',
          brand: { '@type': 'Brand', name: 'Ebookstudio Pro V2' },
          offers: { '@type': 'Offer', price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '127' },
        }}
      />

      {/* BANDEAU OFFRE FONDATEUR */}
      {offerActive && (
        <div className="bg-gradient-to-r from-[#EC4899] via-[#FF9E2D] to-[#EC4899] text-white text-center py-2.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 flex-wrap">
          <Gift className="w-4 h-4" />
          <span>🎁 Offre fondateur — <strong>47€</strong> au lieu de 67€ + Licence commerciale + Guide 10 niches OFFERTS</span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
            <Clock className="w-3 h-3" /> {days}j {hours}h restants
          </span>
        </div>
      )}

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#008296]/5 to-transparent">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center space-y-6">
          <span className="inline-block bg-[#FF9E2D]/10 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
            ✨ Nouveau - Pipeline 15 agents IA · Ebookstudio Pro V2
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Créez un <span className="text-[#008296]">ebook rentable</span> en 30 minutes
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Ebookstudio Pro V2 génère plan, chapitres, couverture, mots-clés Amazon et fichiers KDP-compliant. Sans ligne d'écriture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to={offerActive ? "/coaching-vip" : "/promo/commande"}>
              <Button className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 px-8 text-base">
                🚀 Démarrer maintenant — {price}€ à vie
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" className="border-[#008296] text-[#008296] py-6 px-8 text-base">
                Voir la démo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">Garantie satisfait ou remboursé 7 jours · Licence commerciale incluse</p>
        </div>
      </section>

      {/* STORYTELLING */}
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h2 className="text-3xl font-bold">Le problème de 90% des auteurs débutants</h2>
        <p className="text-lg text-gray-700">
          Vous avez une idée d'ebook. Vous ouvrez Word. Page blanche. Trois semaines plus tard, vous abandonnez. C'est ce qui arrive à <strong>9 personnes sur 10</strong> qui veulent vivre de leurs livres.
        </p>
        <p className="text-lg text-gray-700">
          Ebookstudio Pro V2 a été créé pour briser ce mur. Notre pipeline de 15 agents IA spécialisés (plan, chapitres, dialogue, SEO Amazon, couverture…) écrit votre ebook avec vous, étape par étape, en respectant votre style.
        </p>
        <p className="text-lg text-gray-700">
          Résultat&nbsp;: un ebook complet, original, prêt à publier sur Amazon KDP. Et qui peut générer des revenus passifs pendant des années.
        </p>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tout ce dont vous avez besoin, dans un seul outil</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-xl p-6 hover:border-[#008296] transition">
                <Icon className="w-10 h-10 text-[#008296] mb-3" />
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <h2 className="text-3xl font-bold text-center">Ce que vous obtenez vraiment</h2>
        <ul className="space-y-3 mt-8">
          {[
            'Un ebook complet de 30 à 40 chapitres en moins d\'1 heure',
            'Une couverture professionnelle prête pour Amazon',
            'Les mots-clés et catégories KDP qui rankent vraiment',
            'Le PDF intérieur conforme (typographie, marges, Modulo 10)',
            'L\'ePub formaté pour Kindle',
            'L\'option audiobook : convertir en livre audio (OpenAI TTS)',
            'Le mode BD : illustrer pour le jeunesse / parascolaire',
            'Accès à la formation et au forum communautaire',
          ].map((b) => (
            <li key={b} className="flex items-start gap-3 text-lg">
              <Check className="w-6 h-6 text-[#008296] mt-1 flex-shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#008296]/5 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ils ont publié grâce à Ebookstudio Pro V2</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FF9E2D] text-[#FF9E2D]" />)}
                </div>
                <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Un seul tarif. Tout inclus.</h2>
        <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 mt-8 shadow-lg relative">
          {offerActive && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#EC4899] to-[#FF9E2D] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg animate-pulse">
              🎁 OFFRE FONDATEUR — JUSQU'AU 30 JUIN 2026
            </div>
          )}
          <p className="text-sm font-semibold text-[#FF9E2D] uppercase">Accès à vie</p>
          <p className="text-5xl font-bold my-4 flex items-baseline justify-center gap-3">
            {offerActive && <span className="text-2xl text-gray-400 line-through font-normal">67€</span>}
            <span>{price}€</span>
            <span className="text-xl text-gray-500 font-normal"> à vie</span>
          </p>
          {offerActive && (
            <span className="inline-block bg-[#EC4899]/10 text-[#EC4899] text-xs font-bold px-3 py-1 rounded-full mb-3">
              -30% · Économisez 20€
            </span>
          )}
          <p className="text-gray-600 mb-6">Paiement unique. Aucun abonnement. Accès illimité pour toujours.</p>

          {offerActive && (
            <div className="bg-gradient-to-br from-[#FF9E2D]/10 to-[#EC4899]/10 border-2 border-dashed border-[#FF9E2D] rounded-xl p-5 mb-6 text-left">
              <p className="text-sm font-black text-[#232F3E] uppercase mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#EC4899]" /> 2 Bonus offerts (valeur 97€)
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#008296] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Licence commerciale étendue</strong> — revendre, packager, white-label.{' '}
                    <Link to="/licence-etendue" className="text-[#008296] underline hover:text-[#FF9E2D]">
                      Voir conditions →
                    </Link>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#008296] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Guide des 10 niches KDP rentables 2026</strong> — mots-clés, exemples, prix de vente conseillés.
                  </span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-[#FF9E2D]/30 flex items-start gap-2 text-xs text-[#232F3E]/80 bg-white/60 rounded-lg p-2.5">
                <span className="text-base">🔒</span>
                <span>
                  <strong>Liens d'accès aux bonus envoyés par email après votre commande</strong> — réservés aux acheteurs uniquement. Vous recevrez tout dans les minutes suivant le paiement.
                </span>
              </div>
            </div>
          )}


          <ul className="text-left space-y-2 mb-8 max-w-md mx-auto">
            {['Ebooks illimités', 'Couvertures illimitées', 'Audiobook + BD inclus', 'Licence commerciale', 'Formation + Forum', 'Support email prioritaire'].map((x) => (
              <li key={x} className="flex gap-2"><Check className="w-5 h-5 text-[#008296]" /> {x}</li>
            ))}
          </ul>
          <Link to={offerActive ? "/coaching-vip" : "/promo/commande"}>
            <Button className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold w-full py-6 text-base">
              Je commande maintenant — {price}€ <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
        <div className="space-y-4">
          {faq.map((f) => (
            <details key={f.q} className="bg-white border border-gray-200 rounded-xl p-5 group">
              <summary className="font-bold cursor-pointer text-lg">{f.q}</summary>
              <p className="mt-3 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#232F3E] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Votre prochain ebook commence aujourd'hui</h2>
          <p className="text-lg opacity-90">Rejoignez les centaines d'auteurs qui publient avec Ebookstudio Pro V2.</p>
          <Link to={offerActive ? "/coaching-vip" : "/promo/commande"}>
            <Button className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 px-8 text-base">
              🚀 Commander — {price}€ à vie
            </Button>
          </Link>
          <p className="text-sm opacity-75 pt-4">
            Vous êtes blogueur, créateur ou formateur ?{' '}
            <Link to="/promo/affilie" className="text-[#FF9E2D] underline hover:text-white">
              Devenez affilié et touchez 30% par vente
            </Link>
          </p>
        </div>
      </section>
    </FunnelLayout>
  );
};

export default PromoDecouvertePage;
