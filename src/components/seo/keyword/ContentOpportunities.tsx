import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb, Target, Users } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface ContentOpportunitiesProps {
  keywords: KeywordSuggestion[];
}

interface ContentIdea {
  title: string;
  type: 'article' | 'guide' | 'comparaison' | 'faq' | 'video';
  keywords: string[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  estimatedTraffic: number;
  priority: 'haute' | 'moyenne' | 'basse';
  description: string;
}

const ContentOpportunities: React.FC<ContentOpportunitiesProps> = ({ keywords }) => {
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'article' | 'guide' | 'comparaison'>('all');

  const generateContentIdeas = () => {
    const ideas: ContentIdea[] = keywords.slice(0, 6).map((keyword, index) => {
      const types: ContentIdea['type'][] = ['article', 'guide', 'comparaison', 'faq', 'video'];
      const difficulties: ContentIdea['difficulty'][] = ['facile', 'moyen', 'difficile'];
      const priorities: ContentIdea['priority'][] = ['haute', 'moyenne', 'basse'];
      
      const type = types[index % types.length];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      let title = '';
      let description = '';
      
      switch (type) {
        case 'article':
          title = `Tout savoir sur ${keyword.keyword}`;
          description = `Article complet explorant tous les aspects de ${keyword.keyword}`;
          break;
        case 'guide':
          title = `Guide complet : Comment utiliser ${keyword.keyword}`;
          description = `Guide étape par étape pour maîtriser ${keyword.keyword}`;
          break;
        case 'comparaison':
          title = `${keyword.keyword} : Comparaison des meilleures options`;
          description = `Analyse comparative des solutions disponibles pour ${keyword.keyword}`;
          break;
        case 'faq':
          title = `FAQ : Questions fréquentes sur ${keyword.keyword}`;
          description = `Réponses aux questions les plus posées sur ${keyword.keyword}`;
          break;
        case 'video':
          title = `Tutoriel vidéo : ${keyword.keyword} expliqué`;
          description = `Contenu vidéo pédagogique sur ${keyword.keyword}`;
          break;
      }
      
      return {
        title,
        type,
        keywords: [keyword.keyword, `${keyword.keyword} guide`, `meilleur ${keyword.keyword}`],
        difficulty,
        estimatedTraffic: Math.floor((keyword.volume || 1000) * 0.3),
        priority,
        description
      };
    });
    
    setContentIdeas(ideas);
  };

  const getTypeIcon = (type: ContentIdea['type']) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'guide': return <Lightbulb className="h-4 w-4" />;
      case 'comparaison': return <Target className="h-4 w-4" />;
      case 'faq': return <Users className="h-4 w-4" />;
      case 'video': return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: ContentIdea['difficulty']) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: ContentIdea['priority']) => {
    switch (priority) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIdeas = selectedType === 'all' 
    ? contentIdeas 
    : contentIdeas.filter(idea => idea.type === selectedType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Opportunités de contenu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'Tout' },
            { key: 'article', label: 'Articles' },
            { key: 'guide', label: 'Guides' },
            { key: 'comparaison', label: 'Comparaisons' }
          ].map((type) => (
            <Button
              key={type.key}
              variant={selectedType === type.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.key as any)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        <Button 
          onClick={generateContentIdeas}
          className="w-full gap-2"
          disabled={keywords.length === 0}
        >
          <Lightbulb className="h-4 w-4" />
          Générer des idées de contenu
        </Button>

        {filteredIdeas.length > 0 && (
          <div className="space-y-4">
            {filteredIdeas.map((idea, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(idea.type)}
                    <h4 className="font-medium">{idea.title}</h4>
                  </div>
                  <Badge className={getPriorityColor(idea.priority)}>
                    {idea.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{idea.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {idea.keywords.map((kw, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Difficulté :</span>
                    <Badge className={getDifficultyColor(idea.difficulty)} size="sm">
                      {idea.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Trafic estimé :</span>
                    <span className="font-medium ml-1">{idea.estimatedTraffic.toLocaleString()}/mois</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type :</span>
                    <span className="font-medium ml-1 capitalize">{idea.type}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    Voir détails
                  </Button>
                  <Button size="sm">
                    Créer le contenu
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentOpportunities;
