import React from 'react';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Sparkles,
  PenTool,
  Palette,
  Search,
  Rocket,
  CheckCircle2,
  Lock,
  Play,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { MASTERCLASS_MODULES } from '@/data/masterclassModules';

interface Props {
  onStart: () => void;
}

const BENEFITS = [
  {
    icon: PenTool,
    title: 'Générer le contenu par IA',
    desc: 'Un manuscrit complet et structuré grâce au pipeline éditorial.',
  },
  {
    icon: Palette,
    title: 'Couverture professionnelle',
    desc: 'Une couverture qui vend, créée par IA, sans logiciel de design.',
  },
  {
    icon: Search,
    title: 'Métadonnées & SEO Amazon KDP',
    desc: 'Catégories secrètes et mots-clés à fort volume pour être trouvé.',
  },
  {
    icon: Rocket,
    title: 'Automatisation & marketing',
    desc: 'Tunnels, distribution et lancement pour transformer le livre en ventes.',
  },
];

const MasterclassIntro: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <GraduationCap className="w-4 h-4" /> Formation gratuite · 5h · 5 modules
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-5">
            Masterclass EbookStudio Pro V2
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-8">
            Apprenez, étape par étape, à <strong className="text-foreground">créer</strong>,{' '}
            <strong className="text-foreground">designer</strong> et{' '}
            <strong className="text-foreground">vendre</strong> un ebook rentable sur Amazon KDP —
            de la première idée jusqu'au lancement.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={onStart}
              className="font-bold text-base gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-0"
            >
              <Play className="w-5 h-5" /> Commencer le Module 1 (gratuit)
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Module 1 100% gratuit · les suivants débloqués par email
            </p>
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">Ce que vous allez maîtriser</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card/50 p-5"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Aperçu des modules */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">Le programme en 5 modules</h2>
        <div className="flex flex-col gap-3">
          {MASTERCLASS_MODULES.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-muted flex items-center justify-center font-bold text-foreground">
                {m.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{m.titre}</p>
                  {m.isFree ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/15 rounded px-1.5 py-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Gratuit
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                      <Lock className="w-3 h-3" /> Email
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{m.summary}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="w-3.5 h-3.5" /> {m.duration}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            size="lg"
            onClick={onStart}
            className="font-bold text-base gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground border-0"
          >
            <Play className="w-5 h-5" /> Commencer le Module 1 (gratuit)
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            <Sparkles className="inline w-3.5 h-3.5 mr-1" />
            Accès immédiat · aucune carte bancaire
          </p>
        </div>
      </section>
    </div>
  );
};

export default MasterclassIntro;
