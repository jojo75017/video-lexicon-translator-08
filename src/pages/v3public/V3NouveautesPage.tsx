import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ArrowRight, Clock, Sparkles } from 'lucide-react';
import {
  groupNouveautesByMonth,
  getUpcomingNouveautes,
  isRecent,
  markNouveautesSeen,
  V3_TIER_COLOR,
  V3_TIER_LABEL,
  type V3Nouveaute,
} from '@/data/v3Nouveautes';
import { getV3Plan } from '@/data/v3Pricing';

function NouveauteCard({ item }: { item: V3Nouveaute }) {
  const meta = V3_TIER_LABEL[item.tier];
  const color = V3_TIER_COLOR[item.tier];
  const nouveau = isRecent(item.date);

  const body = (
    <Card className="p-5 h-full transition-all border hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-[#232F3E] leading-snug">{item.title}</h3>
        {nouveau && <Badge className="bg-amber-500 hover:bg-amber-500 shrink-0">NOUVEAU</Badge>}
      </div>
      <p className="text-sm text-slate-600 mb-4">{item.desc}</p>
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-block text-xs px-2 py-1 rounded border ${color}`}>{meta}</span>
        {item.to && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#008296]">
            Ouvrir <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </Card>
  );

  return item.to ? <Link to={item.to}>{body}</Link> : <div>{body}</div>;
}

export default function V3NouveautesPage() {
  const months = groupNouveautesByMonth();
  const upcoming = getUpcomingNouveautes();
  const edition = getV3Plan('edition');

  useEffect(() => {
    markNouveautesSeen();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/v3" />

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" /> Nouveautés &amp; feuille de route V3
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#232F3E] mb-3">
            Tout ce qui vient d'arriver dans EbookStudio V3
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Les nouveautés du mois en premier, avec le forfait qui les contient et un accès
            direct à l'outil.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Badge className="bg-amber-500 hover:bg-amber-500">NOUVEAU</Badge>
            <span>signale une arrivée de moins de 30 jours.</span>
          </div>
        </header>

        {months.map((month) => (
          <section key={month.key} className="mb-10">
            <h2 className="text-2xl font-bold text-[#232F3E] mb-4">{month.label}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {month.items.map((item) => (
                <NouveauteCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#232F3E] mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" /> Bientôt disponible
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((item) => (
                <Card key={item.id} className="p-5 h-full border opacity-75">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-[#232F3E] leading-snug">{item.title}</h3>
                    <Badge variant="outline" className="text-xs shrink-0">Bientôt</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{item.desc}</p>
                  <span className={`inline-block text-xs px-2 py-1 rounded border ${V3_TIER_COLOR[item.tier]}`}>
                    {V3_TIER_LABEL[item.tier]}
                  </span>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-[#008296] to-emerald-700 text-white text-center">
          <Award className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">Vous n'avez pas encore le bon forfait ?</h3>
          <p className="mb-4 opacity-90">
            Le forfait Édition {edition?.monthlyPrice ?? 47} €/mois débloque tout : livres
            illimités, {edition?.agentsCount ?? 30} agents IA et tous les modules Pro inclus.
          </p>
          <Link
            to="/v3/forfaits"
            className="inline-block px-6 py-3 rounded-full bg-white text-[#008296] font-semibold hover:bg-yellow-100 transition"
          >
            Voir les forfaits
          </Link>
        </div>
      </div>
    </div>
  );
}
