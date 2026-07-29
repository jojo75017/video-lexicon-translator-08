import { Link } from 'react-router-dom';
import { Search, ListTree, Target, TrendingUp, Gift, ArrowRight, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/v3/BackButton';

const TOOLS = [
  {
    to: '/kdp-keywords',
    icon: Search,
    title: 'Recherche par mots-clés',
    desc: "Découvrez des pépites cachées et des mots-clés rentables pour maximiser la visibilité de votre livre.",
  },
  {
    to: '/v3/outils/categories',
    icon: ListTree,
    title: 'Recherche par catégorie',
    desc: "Explorez plus de 6 000 catégories d'Amazon et trouvez celle qui correspond parfaitement à votre livre.",
  },
  {
    to: '/v3/outils/espion-concurrents',
    icon: Target,
    title: 'Analyseur de concurrence',
    desc: "Jetez un coup d'œil dans les coulisses et découvrez les ventes, classements et stratégies de vos concurrents.",
  },
  {
    to: '/v3/outils/ams-keywords',
    icon: TrendingUp,
    title: 'Générateur de mots-clés Amazon',
    desc: "Gagnez des heures de recherche fastidieuse grâce à des milliers de mots-clés générés automatiquement.",
  },
];

export default function V3OutilsOffertsPage() {
  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <BackButton />

      <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-600 text-white p-8">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5" />
          <span className="text-sm">
            Rejoignez plus de <strong>1 247 auteurs sérieux</strong> qui utilisent Ebookstudio pour vendre plus de livres.
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Outils offerts — Paiement unique aujourd'hui : gratuit</h1>
        <p className="mt-2 text-emerald-50 max-w-2xl">
          4 outils professionnels pour trouver votre niche, vos mots-clés et espionner vos concurrents — 100 % offerts, sans carte bancaire.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.to} className="border-emerald-200 hover:border-emerald-400 transition">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                  </div>
                  <Badge className="bg-amber-400 text-emerald-950 hover:bg-amber-400">
                    <Gift className="h-3 w-3 mr-1" /> Offert
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800">
                  <Link to={t.to}>
                    Ouvrir — Offert <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
