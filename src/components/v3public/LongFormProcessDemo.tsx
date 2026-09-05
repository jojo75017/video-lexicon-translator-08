import { useState } from 'react';
import { BookOpenText, Check, FileQuestion, Lightbulb, ListTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    icon: ListTree,
    eyebrow: '01 — Architecture',
    title: 'Plan détaillé H2/H3',
    description: 'Une structure hiérarchisée pour garder le cap sur plus de 100 pages.',
    preview: ['Partie I — Poser les fondations', 'Chapitre 1 — Comprendre le lecteur', '1.1 Ses attentes réelles', '1.2 Les erreurs à éviter'],
  },
  {
    icon: BookOpenText,
    eyebrow: '02 — Rédaction',
    title: 'Chapitres en profondeur',
    description: 'Chaque section est développée avec contexte, transitions et conclusion.',
    preview: ['Chapitre 4 — Construire une méthode', '2 860 mots rédigés', 'Introduction ✓', 'Développement ✓', 'Synthèse ✓'],
  },
  {
    icon: Lightbulb,
    eyebrow: '03 — Enrichissement',
    title: 'Exemples & analogies',
    description: 'Les idées abstraites deviennent concrètes grâce à des cas pratiques.',
    preview: ['Cas pratique', 'Une situation réelle expliquée', 'Analogie pédagogique', 'Application immédiate'],
  },
  {
    icon: FileQuestion,
    eyebrow: '04 — Finalisation',
    title: 'Couverture & FAQ',
    description: 'Le livre reçoit ses derniers éléments éditoriaux avant publication.',
    preview: ['Couverture HD ✓', 'FAQ lecteur — 8 réponses', 'Résumé commercial ✓', 'Fichiers prêts à exporter'],
  },
] as const;

export default function LongFormProcessDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const active = STEPS[activeStep];

  return (
    <section aria-labelledby="long-form-demo-title" className="border-y border-border bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Le parcours Version Longue</p>

          <h2 id="long-form-demo-title" className="mt-3 text-3xl font-black text-foreground sm:text-4xl">
            D'une idée à un livre complet et structuré
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Fini les textes superficiels de 5 pages : créez de véritables livres d'autorité, romans et guides pratiques prêts à publier.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label="Étapes de création d'un ebook long">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const selected = index === activeStep;
              return (
                <Button
                  key={step.title}
                  type="button"
                  variant="ghost"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setActiveStep(index)}
                  className={cn(
                    'h-auto min-h-24 w-full justify-start whitespace-normal border px-4 py-4 text-left transition-all',
                    selected ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_24px_hsl(var(--primary)/0.14)]' : 'border-border bg-background/40 text-muted-foreground hover:bg-muted',
                  )}
                >
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md border', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card')}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-primary">{step.eyebrow}</span>
                    <span className="mt-1 block font-bold">{step.title}</span>
                    <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{step.description}</span>
                  </span>
                </Button>
              );
            })}
          </div>

          <div role="tabpanel" className="min-h-[26rem] border border-border bg-background p-5 shadow-[0_24px_70px_hsl(var(--background)/0.7)] sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Aperçu du manuscrit</p>
                <h3 className="mt-1 text-xl font-black text-foreground">Le Guide de l'Auteur Indépendant</h3>
              </div>
              <span className="border border-accent/40 bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase text-accent">Démonstration</span>
            </div>
            <div className="mt-6 border-l-2 border-primary pl-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{active.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-black text-foreground">{active.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{active.description}</p>
            </div>
            <div className="mt-7 space-y-3">
              {active.preview.map((line, index) => (
                <div key={line} className="flex items-center gap-3 border border-border bg-card px-4 py-3 text-sm text-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    {index === active.preview.length - 1 ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Projet complet</span>
              <strong className="text-foreground">104 pages estimées</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}