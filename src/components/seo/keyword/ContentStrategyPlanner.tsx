
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Target, Users, TrendingUp, Download, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface ContentStrategyPlannerProps {
  keywords: KeywordSuggestion[];
}

interface ContentPiece {
  id: string;
  title: string;
  type: 'article' | 'guide' | 'faq' | 'comparison' | 'review' | 'tutorial';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed' | 'published';
  targetKeywords: string[];
  wordCount: number;
  estimatedTraffic: number;
  difficulty: number;
  timeToRank: number;
  publishDate: string;
  author: string;
  description: string;
  internalLinks: string[];
  externalResources: string[];
}

interface ContentCalendar {
  month: string;
  pieces: ContentPiece[];
  totalTraffic: number;
  totalPieces: number;
}

interface ContentStrategy {
  contentPieces: ContentPiece[];
  calendar: ContentCalendar[];
  totalEstimatedTraffic: number;
  averageDifficulty: number;
  contentMix: {
    articles: number;
    guides: number;
    faqs: number;
    comparisons: number;
    reviews: number;
    tutorials: number;
  };
}

const ContentStrategyPlanner: React.FC<ContentStrategyPlannerProps> = ({ keywords }) => {
  const [strategy, setStrategy] = useState<ContentStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ContentPiece>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const generateContentStrategy = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const contentTypes: ContentPiece['type'][] = ['article', 'guide', 'faq', 'comparison', 'review', 'tutorial'];
      const priorities: ContentPiece['priority'][] = ['high', 'medium', 'low'];
      const statuses: ContentPiece['status'][] = ['planned', 'in-progress', 'completed'];

      // Génération de pièces de contenu basées sur les mots-clés
      const contentPieces: ContentPiece[] = keywords.slice(0, 12).map((keyword, index) => {
        const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const baseTraffic = keyword.volume || 1000;
        const difficultyFactor = (100 - (keyword.difficulty || 50)) / 100;
        const estimatedTraffic = Math.round(baseTraffic * difficultyFactor * 0.3);

        return {
          id: `content-${index}`,
          title: `${type === 'guide' ? 'Guide complet' : 
                   type === 'article' ? 'Article' : 
                   type === 'faq' ? 'FAQ' :
                   type === 'comparison' ? 'Comparatif' :
                   type === 'review' ? 'Test et avis' : 'Tutoriel'} : ${keyword.keyword}`,
          type,
          priority,
          status,
          targetKeywords: [keyword.keyword, `${keyword.keyword} 2024`, `meilleur ${keyword.keyword}`],
          wordCount: type === 'guide' ? 3000 : type === 'article' ? 1500 : 800,
          estimatedTraffic,
          difficulty: keyword.difficulty || 50,
          timeToRank: Math.floor(Math.random() * 6) + 2,
          publishDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          author: ['Sophie Martin', 'Thomas Dubois', 'Marie Leroy', 'Pierre Bernard'][Math.floor(Math.random() * 4)],
          description: `Contenu optimisé pour "${keyword.keyword}" avec un focus sur l'intention ${keyword.intent || 'informational'}`,
          internalLinks: [`/article-${Math.floor(Math.random() * 10)}`, `/guide-${Math.floor(Math.random() * 10)}`],
          externalResources: ['https://example.com/resource1', 'https://example.com/resource2']
        };
      });

      // Génération du calendrier
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
      const calendar: ContentCalendar[] = months.map(month => {
        const monthPieces = contentPieces.filter(() => Math.random() > 0.5);
        return {
          month,
          pieces: monthPieces,
          totalTraffic: monthPieces.reduce((sum, piece) => sum + piece.estimatedTraffic, 0),
          totalPieces: monthPieces.length
        };
      });

      // Calcul du mix de contenu
      const contentMix = {
        articles: contentPieces.filter(p => p.type === 'article').length,
        guides: contentPieces.filter(p => p.type === 'guide').length,
        faqs: contentPieces.filter(p => p.type === 'faq').length,
        comparisons: contentPieces.filter(p => p.type === 'comparison').length,
        reviews: contentPieces.filter(p => p.type === 'review').length,
        tutorials: contentPieces.filter(p => p.type === 'tutorial').length
      };

      const newStrategy: ContentStrategy = {
        contentPieces,
        calendar,
        totalEstimatedTraffic: contentPieces.reduce((sum, piece) => sum + piece.estimatedTraffic, 0),
        averageDifficulty: contentPieces.reduce((sum, piece) => sum + piece.difficulty, 0) / contentPieces.length,
        contentMix
      };

      setStrategy(newStrategy);
      setIsGenerating(false);
      toast.success(`Stratégie de contenu générée avec ${contentPieces.length} pièces`);
    }, 3000);
  };

  const addContentPiece = () => {
    if (!strategy || !newContent.title) return;

    const newPiece: ContentPiece = {
      id: `content-${strategy.contentPieces.length}`,
      title: newContent.title,
      type: newContent.type || 'article',
      priority: newContent.priority || 'medium',
      status: 'planned',
      targetKeywords: newContent.targetKeywords || [],
      wordCount: newContent.wordCount || 1500,
      estimatedTraffic: newContent.estimatedTraffic || 500,
      difficulty: newContent.difficulty || 50,
      timeToRank: newContent.timeToRank || 4,
      publishDate: newContent.publishDate || new Date().toISOString().split('T')[0],
      author: newContent.author || 'Non assigné',
      description: newContent.description || '',
      internalLinks: [],
      externalResources: []
    };

    setStrategy({
      ...strategy,
      contentPieces: [...strategy.contentPieces, newPiece]
    });

    setNewContent({});
    setShowAddForm(false);
    toast.success('Nouvelle pièce de contenu ajoutée');
  };

  const exportStrategy = () => {
    if (!strategy) return;
    
    const exportData = {
      'Stratégie de contenu': strategy,
      'Date d\'export': new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'strategie-contenu.json';
    link.click();
    
    toast.success('Stratégie de contenu exportée');
  };

  const getTypeColor = (type: ContentPiece['type']) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      guide: 'bg-green-100 text-green-800',
      faq: 'bg-yellow-100 text-yellow-800',
      comparison: 'bg-purple-100 text-purple-800',
      review: 'bg-orange-100 text-orange-800',
      tutorial: 'bg-pink-100 text-pink-800'
    };
    return colors[type];
  };

  const getPriorityColor = (priority: ContentPiece['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ContentPiece['status']) => {
    switch (status) {
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Planificateur de stratégie de contenu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={generateContentStrategy}
            disabled={isGenerating || keywords.length === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <>Génération en cours...</>
            ) : (
              <>
                <Target className="h-4 w-4" />
                Générer la stratégie
              </>
            )}
          </Button>
          
          {strategy && (
            <>
              <Button variant="outline" onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter contenu
              </Button>
              <Button variant="outline" onClick={exportStrategy} className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </>
          )}
        </div>

        {showAddForm && (
          <Card className="p-4">
            <h4 className="font-medium mb-4">Ajouter une nouvelle pièce de contenu</h4>
            <div className="grid gap-4">
              <Input
                placeholder="Titre du contenu"
                value={newContent.title || ''}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newContent.type || 'article'}
                  onChange={(e) => setNewContent({...newContent, type: e.target.value as ContentPiece['type']})}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="article">Article</option>
                  <option value="guide">Guide</option>
                  <option value="faq">FAQ</option>
                  <option value="comparison">Comparaison</option>
                  <option value="review">Test & Avis</option>
                  <option value="tutorial">Tutoriel</option>
                </select>
                <select
                  value={newContent.priority || 'medium'}
                  onChange={(e) => setNewContent({...newContent, priority: e.target.value as ContentPiece['priority']})}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="high">Haute priorité</option>
                  <option value="medium">Priorité moyenne</option>
                  <option value="low">Basse priorité</option>
                </select>
              </div>
              <Textarea
                placeholder="Description du contenu"
                value={newContent.description || ''}
                onChange={(e) => setNewContent({...newContent, description: e.target.value})}
              />
              <div className="flex gap-2">
                <Button onClick={addContentPiece} size="sm">
                  Ajouter
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        )}

        {strategy && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700">Pièces totales</h4>
                  <p className="text-2xl font-bold text-blue-900">{strategy.contentPieces.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-700">Trafic estimé</h4>
                  <p className="text-2xl font-bold text-green-900">
                    {strategy.totalEstimatedTraffic.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-700">Difficulté moy.</h4>
                  <p className="text-2xl font-bold text-orange-900">
                    {strategy.averageDifficulty.toFixed(0)}/100
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-700">Mix de contenu</h4>
                  <p className="text-lg font-bold text-purple-900">
                    {Object.keys(strategy.contentMix).length} types
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Répartition par type</h4>
                  <div className="space-y-2">
                    {Object.entries(strategy.contentMix).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize">{type}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Top contenus par trafic</h4>
                  <div className="space-y-2">
                    {strategy.contentPieces
                      .sort((a, b) => b.estimatedTraffic - a.estimatedTraffic)
                      .slice(0, 5)
                      .map((piece, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="truncate flex-1">{piece.title}</span>
                          <Badge variant="outline">{piece.estimatedTraffic}</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-3">
              {strategy.contentPieces.map((piece) => (
                <div key={piece.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium flex-1">{piece.title}</h4>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(piece.type)}>{piece.type}</Badge>
                      <Badge className={getPriorityColor(piece.priority)}>{piece.priority}</Badge>
                      <Badge className={getStatusColor(piece.status)}>{piece.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Mots:</span>
                      <div className="font-medium">{piece.wordCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Trafic estimé:</span>
                      <div className="font-medium">{piece.estimatedTraffic}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulté:</span>
                      <div className="font-medium">{piece.difficulty}/100</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Temps rang:</span>
                      <div className="font-medium">{piece.timeToRank} mois</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Auteur:</span>
                      <div className="font-medium">{piece.author}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {piece.description}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm">
                      Démarrer
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="grid gap-4">
                {strategy.calendar.map((month, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{month.month} 2024</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">{month.totalPieces} contenus</Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {month.totalTraffic.toLocaleString()} visiteurs
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      {month.pieces.map((piece, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                          <span>{piece.title}</span>
                          <div className="flex gap-1">
                            <Badge className={getTypeColor(piece.type)} variant="outline">
                              {piece.type}
                            </Badge>
                            <Badge className={getPriorityColor(piece.priority)} variant="outline">
                              {piece.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Recommandations stratégiques</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Privilégier les guides pour les mots-clés à fort volume</li>
                  <li>• Créer des FAQ pour les questions longue traîne</li>
                  <li>• Développer des comparaisons pour l'intent commercial</li>
                  <li>• Optimiser le calendrier selon la saisonnalité</li>
                  <li>• Mesurer les performances et ajuster la stratégie</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentStrategyPlanner;
