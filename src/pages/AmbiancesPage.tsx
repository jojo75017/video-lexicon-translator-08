import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  WRITING_AMBIANCES,
  AmbianceCategory,
  ensureAmbianceFont,
  getAmbianceById,
  getStoredAmbianceId,
  setStoredAmbianceId,
} from '@/data/writingAmbiances';
import { AmbianceCard } from '@/components/ambiance/AmbianceCard';
import { AmbiancePreview } from '@/components/ambiance/AmbiancePreview';

const CATEGORIES: { id: AmbianceCategory | 'toutes'; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'claire', label: 'Claires' },
  { id: 'sombre', label: 'Sombres' },
  { id: 'vibrante', label: 'Vibrantes' },
  { id: 'classique', label: 'Classiques' },
];

const AmbiancesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(() => getStoredAmbianceId());
  const [activeCategory, setActiveCategory] = useState<AmbianceCategory | 'toutes'>('toutes');

  const selected = useMemo(
    () => getAmbianceById(selectedId) || WRITING_AMBIANCES[0],
    [selectedId]
  );

  // Précharger la police de l'ambiance sélectionnée
  useEffect(() => {
    ensureAmbianceFont(selected);
  }, [selected]);

  const filtered = useMemo(() => {
    if (activeCategory === 'toutes') return WRITING_AMBIANCES;
    return WRITING_AMBIANCES.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const amb = getAmbianceById(id);
    if (amb) ensureAmbianceFont(amb);
  };

  const handleApply = () => {
    setStoredAmbianceId(selectedId);
    toast.success(`Ambiance « ${selected.name} » appliquée à votre éditeur`, {
      description: 'Elle sera active dès votre prochaine session d\'écriture.',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#232F3E]">
      {/* En-tête */}
      <div className="bg-gradient-to-br from-[#0f1419] via-[#1a2530] to-[#0f1419] text-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ebook-planner')}
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au planner
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-[#FF9E2D] font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> Nouveau · 17 ambiances incluses
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                Choisissez votre ambiance d'écriture
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Adaptez la couleur, la typographie et l'atmosphère de votre éditeur au genre de votre livre.
                Un confort visuel sur-mesure pour vos longues sessions d'écriture.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-xs text-white/60">Ambiance sélectionnée</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white">{selected.name}</span>
                <Button
                  onClick={handleApply}
                  className="bg-[#FF9E2D] hover:bg-[#FF9E2D]/90 text-[#0a3a44] font-semibold shadow-lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 space-y-10">
        {/* Onglets catégories */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as AmbianceCategory | 'toutes')}>
          <TabsList className="bg-white border shadow-sm">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="px-5">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {filtered.map((amb) => (
                  <AmbianceCard
                    key={amb.id}
                    ambiance={amb}
                    selected={amb.id === selectedId}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Aperçu grandeur réelle */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Aperçu en situation</h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Voici à quoi ressemblera votre éditeur avec l'ambiance « {selected.name} » — {selected.recommendedFor}.
              </p>
            </div>
          </div>
          <AmbiancePreview ambiance={selected} />
        </section>

        {/* Note rassurante */}
        <div className="rounded-xl bg-white border p-5 text-sm text-[#6B7280] leading-relaxed">
          <strong className="text-[#232F3E]">À noter :</strong> l'ambiance change uniquement l'apparence
          de votre éditeur pendant l'écriture. Vos exports PDF et EPUB restent 100 % conformes aux
          standards Amazon KDP (typographie professionnelle, marges, pagination).
        </div>
      </div>
    </div>
  );
};

export default AmbiancesPage;
