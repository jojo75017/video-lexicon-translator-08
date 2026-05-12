import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KdpKeywordWidgetProps {
  defaultSeed?: string;
  onSubmit: (seed: string) => void;
}

/**
 * Mini widget en haut du dashboard ebook-planner.
 * Sert d'aimant marketing : un champ de recherche rapide qui redirige vers
 * la page complète /kdp-keywords (Gemini BYOK, modes auto / niche / titre /
 * longue traîne / backend 7 mots-clés Amazon).
 */
export const KdpKeywordWidget: React.FC<KdpKeywordWidgetProps> = ({ defaultSeed = '', onSubmit }) => {
  const [seed, setSeed] = useState(defaultSeed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(seed.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border-2 bg-card p-4 sm:p-5 shadow-sm transition-all hover:shadow-md"
      style={{ borderColor: 'hsl(var(--primary) / 0.25)' }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Bloc gauche : icône + texte */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #008296 0%, #FF9E2D 100%)' }}
          >
            <Search className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base sm:text-lg leading-tight text-foreground flex items-center gap-2">
              Trouvez les mots-clés qui vendent sur Amazon
              <Sparkles className="h-4 w-4 text-accent" />
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Volume, difficulté, opportunité, longue traîne et <strong>backend 7 mots-clés Amazon</strong> - généré par IA.
            </p>
          </div>
        </div>

        {/* Bloc droit : input + CTA */}
        <div className="flex flex-col sm:flex-row gap-2 lg:w-[420px] lg:flex-shrink-0">
          <Input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Sujet, titre ou niche du livre…"
            className="flex-1"
            aria-label="Sujet ou titre pour la recherche de mots-clés"
          />
          <Button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm"
          >
            Rechercher
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default KdpKeywordWidget;
