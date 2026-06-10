import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Pin, Link2, ArrowRight, Lock } from 'lucide-react';

const TEAL = '#008296';

/**
 * Lanceur du Hub Communauté KDP Premium.
 * La communauté complète vit sur /communaute (forum existant) :
 * encarts par rubriques KDP, solutions épinglées et liens directs vers les outils.
 * Ce composant sert d'entrée depuis le Hub V3 pour les modules :
 *   community-kdp-hub, community-pinned-solutions, community-tool-deeplinks.
 */
const CommunityKdpHub: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'Encarts par rubriques KDP',
      desc: 'Marketing & Promotion, Page Amazon, Paiements & Royalties, Compte KDP & Conformité, Couverture & Mise en forme, Audiobooks & Voix… façon communauté officielle Amazon KDP.',
    },
    {
      icon: Pin,
      title: 'Solutions & FAQ épinglées',
      desc: 'Articles de solutions types épinglés en haut de chaque rubrique (compte suspendu, royalties retenues, blocage de contenu, conformité…), éditables par l’admin.',
    },
    {
      icon: Link2,
      title: 'Liens directs vers l’outil',
      desc: 'Chaque rubrique renvoie vers le module du générateur qui résout le blocage (conformité, couverture, prix, mots-clés…).',
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Communauté premium façon forum officiel Amazon KDP. Lecture publique (SEO),
        écriture réservée aux abonnés.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="border-joy-ink/10">
            <CardContent className="p-4 space-y-2">
              <f.icon className="h-5 w-5" style={{ color: TEAL }} />
              <h4 className="text-sm font-bold text-joy-ink">{f.title}</h4>
              <p className="text-[11px] text-joy-ink/60 leading-snug">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button onClick={() => navigate('/communaute')} style={{ background: TEAL, color: 'white' }} className="gap-1.5">
          Ouvrir la communauté <ArrowRight className="h-4 w-4" />
        </Button>
        <span className="inline-flex items-center gap-1 text-[11px] text-joy-ink/50">
          <Lock className="h-3 w-3" /> Lecture libre · participation abonnés
        </span>
      </div>
    </div>
  );
};

export default CommunityKdpHub;
