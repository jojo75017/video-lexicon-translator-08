import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Ruler, BookOpen, Wand2, CheckCircle2 } from 'lucide-react';
import { EbookAICoverStudio } from './EbookAICoverStudio';
import KdpCoverStudio from './KdpCoverStudio';
import { EbookBackCoverGenerator } from './EbookBackCoverGenerator';
import coverHero from '@/assets/cover-studio-hero.jpg';

interface UnifiedCoverStudioProps {
  ebookTitle?: string;
  authorName?: string;
  chapters?: any[];
  isGenerating?: boolean;
  onGenerateBackCover?: (tone: string, audience: string, highlights: string) => Promise<string>;
  onCoverGenerated?: (url: string) => void;
  defaultTab?: 'ai' | 'technical' | 'backcover';
}

export const UnifiedCoverStudio: React.FC<UnifiedCoverStudioProps> = ({
  ebookTitle = '',
  authorName = '',
  chapters = [],
  isGenerating = false,
  onGenerateBackCover,
  onCoverGenerated,
  defaultTab = 'ai',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HERO PROFESSIONNEL */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-xl">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src={coverHero}
            alt="Studio Couverture KDP — couvertures de livres professionnelles"
            className="w-full h-full object-cover"
            width={1920}
            height={640}
          />
          {/* Voile dégradé pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        {/* Contenu hero */}
        <div className="relative px-6 sm:px-10 py-10 sm:py-14 max-w-3xl">
          <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Studio Couverture KDP — Tout-en-un
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-3">
            Concevez une couverture <br />
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              digne d'un best-seller Amazon
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-xl">
            Génération IA, dimensions KDP exactes, quatrième de couverture rédigée par l'IA — tout est réuni au même endroit.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Conforme spécifications KDP 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Export 300 DPI haute résolution
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Calculateur de tranche intégré
            </span>
          </div>
        </div>
      </div>

      {/* ONGLETS UNIFIÉS — 3 SEULEMENT */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full h-auto p-1.5 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="ai"
            className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg"
          >
            <Wand2 className="w-4 h-4 text-primary" />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-sm">Studio IA</div>
              <div className="text-[10px] text-muted-foreground">Génération automatique</div>
            </div>
            <span className="sm:hidden text-xs font-medium">Studio IA</span>
          </TabsTrigger>

          <TabsTrigger
            value="technical"
            className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg"
          >
            <Ruler className="w-4 h-4 text-primary" />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-sm">Outils Techniques</div>
              <div className="text-[10px] text-muted-foreground">Tranche, gabarits, BISAC</div>
            </div>
            <span className="sm:hidden text-xs font-medium">Technique</span>
          </TabsTrigger>

          <TabsTrigger
            value="backcover"
            className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-sm">Quatrième de couv.</div>
              <div className="text-[10px] text-muted-foreground">Texte du dos</div>
            </div>
            <span className="sm:hidden text-xs font-medium">4ᵉ de couv.</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="ai" className="mt-0 animate-fade-in">
            <EbookAICoverStudio
              ebookTitle={ebookTitle}
              authorName={authorName}
              onCoverGenerated={onCoverGenerated}
            />
          </TabsContent>

          <TabsContent value="technical" className="mt-0 animate-fade-in">
            <KdpCoverStudio />
          </TabsContent>

          <TabsContent value="backcover" className="mt-0 animate-fade-in">
            <EbookBackCoverGenerator
              ebookTitle={ebookTitle}
              authorName={authorName}
              chapters={chapters}
              isGenerating={isGenerating}
              onGenerate={
                onGenerateBackCover
                  ? async (tone, audience, highlights) =>
                      await onGenerateBackCover(tone, audience, highlights)
                  : async () => ''
              }
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UnifiedCoverStudio;
