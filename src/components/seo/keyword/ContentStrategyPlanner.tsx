
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Calendar, FileText, Target, Clock, Users } from 'lucide-react';

interface ContentStrategyPlannerProps {
  keywords: KeywordSuggestion[];
}

interface ContentIdea {
  title: string;
  keywords: string[];
  intent: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  estimatedTraffic: number;
  difficulty: number;
  contentType: string;
  publishWeek: number;
}

const ContentStrategyPlanner: React.FC<ContentStrategyPlannerProps> = ({ keywords }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const contentPlan = useMemo(() => {
    if (keywords.length === 0) return [];

    // Générer un plan de contenu basé sur les mots-clés
    const ideas: ContentIdea[] = [];
    
    // Grouper les mots-clés par intention et créer des idées de contenu
    const intentGroups = keywords.reduce((acc, kw) => {
      const intent = kw.intent || 'informational';
      if (!acc[intent]) acc[intent] = [];
      acc[intent].push(kw);
      return acc;
    }, {} as Record<string, KeywordSuggestion[]>);

    let weekCounter = 1;

    Object.entries(intentGroups).forEach(([intent, kwList]) => {
      // Créer des articles basés sur les groupes de mots-clés
      for (let i = 0; i < kwList.length; i += 3) {
        const keywordGroup = kwList.slice(i, i + 3);
        const mainKeyword = keywordGroup[0];
        
        const contentTypes = {
          'informational': ['Guide complet', 'Tutoriel', 'Article de blog', 'FAQ'],
          'commercial': ['Comparatif', 'Avis', 'Test produit', 'Guide d\'achat'],
          'transactional': ['Landing page', 'Fiche produit', 'Page de vente'],
          'navigational': ['Page catégorie', 'Page marque', 'Page entreprise']
        };

        const typeOptions = contentTypes[intent as keyof typeof contentTypes] || contentTypes.informational;
        const contentType = typeOptions[Math.floor(Math.random() * typeOptions.length)];

        const titles = {
          'informational': [
            `Guide complet : ${mainKeyword.keyword}`,
            `Comment maîtriser ${mainKeyword.keyword} en 2024`,
            `Tout savoir sur ${mainKeyword.keyword}`,
            `${mainKeyword.keyword} : Guide du débutant`
          ],
          'commercial': [
            `Comparatif : ${mainKeyword.keyword}`,
            `Meilleur ${mainKeyword.keyword} : Notre sélection`,
            `${mainKeyword.keyword} : Avis et tests`,
            `Quel ${mainKeyword.keyword} choisir ?`
          ],
          'transactional': [
            `Acheter ${mainKeyword.keyword}`,
            `${mainKeyword.keyword} - Offre spéciale`,
            `${mainKeyword.keyword} au meilleur prix`
          ],
          'navigational': [
            `${mainKeyword.keyword} - Accueil`,
            `Découvrir ${mainKeyword.keyword}`,
            `${mainKeyword.keyword} - Notre gamme`
          ]
        };

        const titleOptions = titles[intent as keyof typeof titles] || titles.informational;
        const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];

        const totalVolume = keywordGroup.reduce((sum, kw) => sum + (kw.volume || 0), 0);
        const avgDifficulty = keywordGroup.reduce((sum, kw) => sum + (kw.difficulty || 0), 0) / keywordGroup.length;
        
        let priority: 'Haute' | 'Moyenne' | 'Basse';
        if (totalVolume > 2000 && avgDifficulty < 40) priority = 'Haute';
        else if (totalVolume > 500 && avgDifficulty < 60) priority = 'Moyenne';
        else priority = 'Basse';

        ideas.push({
          title,
          keywords: keywordGroup.map(kw => kw.keyword),
          intent,
          priority,
          estimatedTraffic: Math.round(totalVolume * 0.1), // 10% du volume de recherche
          difficulty: Math.round(avgDifficulty),
          contentType,
          publishWeek: weekCounter
        });

        weekCounter = (weekCounter % 12) + 1; // Cycle sur 12 semaines
      }
    });

    return ideas.sort((a, b) => {
      const priorityOrder = { 'Haute': 3, 'Moyenne': 2, 'Basse': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [keywords]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-orange-100 text-orange-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'commercial': return <Target className="h-4 w-4" />;
      case 'transactional': return <Users className="h-4 w-4" />;
      case 'navigational': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (keywords.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucun plan de contenu disponible</p>
      </Card>
    );
  }

  const monthlyStats = {
    totalArticles: contentPlan.length,
    highPriority: contentPlan.filter(c => c.priority === 'Haute').length,
    estimatedTraffic: contentPlan.reduce((sum, c) => sum + c.estimatedTraffic, 0)
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Planificateur de stratégie de contenu</h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendrier
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Liste
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{monthlyStats.totalArticles}</div>
            <div className="text-sm text-blue-700">Articles planifiés</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{monthlyStats.highPriority}</div>
            <div className="text-sm text-red-700">Priorité haute</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{monthlyStats.estimatedTraffic.toLocaleString()}</div>
            <div className="text-sm text-green-700">Trafic estimé/mois</div>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, week) => {
              const weekContent = contentPlan.filter(c => c.publishWeek === week + 1);
              return (
                <Card key={week} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">Semaine {week + 1}</h4>
                  </div>
                  
                  {weekContent.length > 0 ? (
                    <div className="space-y-2">
                      {weekContent.map((content, idx) => (
                        <div key={idx} className="p-2 border rounded text-sm">
                          <div className="font-medium truncate">{content.title}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {getIntentIcon(content.intent)}
                            <Badge className={getPriorityColor(content.priority)} variant="outline">
                              {content.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Aucun contenu planifié</div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-3">
            {contentPlan.map((content, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getIntentIcon(content.intent)}
                      <h4 className="font-medium">{content.title}</h4>
                      <Badge className={getPriorityColor(content.priority)} variant="outline">
                        {content.priority}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-medium">Mots-clés: </span>
                        {content.keywords.slice(0, 3).join(', ')}
                        {content.keywords.length > 3 && ` (+${content.keywords.length - 3})`}
                      </div>
                      <div>
                        <span className="font-medium">Type: </span>
                        {content.contentType}
                      </div>
                      <div className="flex gap-4">
                        <span>Trafic estimé: <strong>{content.estimatedTraffic.toLocaleString()}</strong></span>
                        <span>Difficulté: <strong>{content.difficulty}</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Semaine {content.publishWeek}</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Planifier
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContentStrategyPlanner;
