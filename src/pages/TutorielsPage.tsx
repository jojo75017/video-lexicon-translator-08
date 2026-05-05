import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, Search } from 'lucide-react';
import { TutorialCard } from '@/components/tutoriels/TutorialCard';
import {
  TUTORIELS,
  CATEGORIES,
  validateTutorielDestination,
  type TutorielCategory,
} from '@/data/tutoriels';

const TutorielsPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TutorielCategory | 'all'>('all');

  const validationErrors = useMemo(() => {
    return TUTORIELS.reduce<Record<string, string>>((acc, tutoriel) => {
      const error = validateTutorielDestination(tutoriel);
      if (error) acc[tutoriel.id] = error;
      return acc;
    }, {});
  }, []);

  const invalidTutoriels = useMemo(
    () => TUTORIELS.filter((tutoriel) => validationErrors[tutoriel.id]),
    [validationErrors]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TUTORIELS.filter((t) => {
      const matchCat = activeTab === 'all' || t.category === activeTab;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.steps.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ebook-planner')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour au dashboard
          </Button>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                Tutoriels — Actions principales
              </h1>
              <p className="text-muted-foreground mt-1">
                Les actions essentielles pour réussir votre ebook avec EbookStudio, pas à pas.
              </p>
            </div>
          </div>
        </div>

        {/* Recherche */}
        {invalidTutoriels.length > 0 && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-semibold">Certains boutons de tutoriels ne pointent pas vers un espace abonné valide.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {invalidTutoriels.map((tutoriel) => (
                <li key={tutoriel.id}>
                  {tutoriel.title} — {validationErrors[tutoriel.id]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recherche */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un tutoriel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TutorielCategory | 'all')}>
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="all">Tous ({TUTORIELS.length})</TabsTrigger>
            {CATEGORIES.map((cat) => {
              const count = TUTORIELS.filter((t) => t.category === cat.id).length;
              return (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.label} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun tutoriel trouvé pour cette recherche.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((t) => (
                  <TutorialCard key={t.id} tutoriel={t} validationError={validationErrors[t.id]} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TutorielsPage;
