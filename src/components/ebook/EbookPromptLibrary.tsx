import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Library, Search, Copy, Star, BookOpen, Swords, Heart, Brain, 
  ChefHat, Plane, Briefcase, Baby, Sparkles, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface PromptTemplate {
  id: string;
  name: string;
  genre: string;
  icon: React.ElementType;
  color: string;
  description: string;
  writingStyle: string;
  tone: string;
  narrativeFormat: string;
  samplePrompt: string;
  tips: string[];
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'romance',
    name: 'Romance',
    genre: 'fiction',
    icon: Heart,
    color: 'text-pink-500',
    description: 'Histoires d\'amour captivantes avec tension émotionnelle',
    writingStyle: 'narratif',
    tone: 'émotionnel',
    narrativeFormat: 'troisième personne',
    samplePrompt: 'Écris un chapitre romantique avec des dialogues naturels, une montée de tension émotionnelle et des descriptions sensorielles. Utilise des métaphores liées aux sentiments.',
    tips: ['Dialogues vivants', 'Tension lente', 'Descriptions sensorielles', 'Points de vue alternés']
  },
  {
    id: 'thriller',
    name: 'Thriller / Policier',
    genre: 'fiction',
    icon: Swords,
    color: 'text-red-500',
    description: 'Suspense haletant avec rebondissements',
    writingStyle: 'narratif',
    tone: 'sombre',
    narrativeFormat: 'première personne',
    samplePrompt: 'Écris un chapitre de thriller avec un rythme soutenu, des cliffhangers, des indices disséminés et une atmosphère de danger permanent. Phrases courtes dans les scènes d\'action.',
    tips: ['Cliffhangers à chaque fin', 'Fausses pistes', 'Phrases courtes = tension', 'Révélations dosées']
  },
  {
    id: 'dev-perso',
    name: 'Développement Personnel',
    genre: 'non-fiction',
    icon: Brain,
    color: 'text-violet-500',
    description: 'Guides pratiques avec exercices et cas concrets',
    writingStyle: 'didactique',
    tone: 'motivant',
    narrativeFormat: 'deuxième personne',
    samplePrompt: 'Écris un chapitre de développement personnel avec une anecdote d\'ouverture, des principes clairs, des exercices pratiques et un résumé actionnable. Tutoyer le lecteur.',
    tips: ['Anecdotes personnelles', 'Exercices pratiques', 'Résumés actionnables', 'Ton direct et motivant']
  },
  {
    id: 'cuisine',
    name: 'Livre de Cuisine',
    genre: 'non-fiction',
    icon: ChefHat,
    color: 'text-orange-500',
    description: 'Recettes détaillées avec storytelling culinaire',
    writingStyle: 'descriptif',
    tone: 'chaleureux',
    narrativeFormat: 'deuxième personne',
    samplePrompt: 'Écris un chapitre de livre de cuisine avec une introduction culturelle, des recettes détaillées (ingrédients + étapes), des astuces de chef et des variantes.',
    tips: ['Histoire du plat', 'Temps de préparation', 'Astuces de chef', 'Variantes créatives']
  },
  {
    id: 'voyage',
    name: 'Guide de Voyage',
    genre: 'non-fiction',
    icon: Plane,
    color: 'text-sky-500',
    description: 'Guides immersifs avec conseils pratiques',
    writingStyle: 'descriptif',
    tone: 'enthousiaste',
    narrativeFormat: 'deuxième personne',
    samplePrompt: 'Écris un chapitre de guide de voyage immersif avec des descriptions sensorielles des lieux, des conseils pratiques, des budgets et des bons plans locaux.',
    tips: ['Descriptions immersives', 'Budget et logistique', 'Bons plans locaux', 'Carte mentale du lieu']
  },
  {
    id: 'business',
    name: 'Business / Entrepreneuriat',
    genre: 'non-fiction',
    icon: Briefcase,
    color: 'text-emerald-500',
    description: 'Stratégies business avec études de cas',
    writingStyle: 'analytique',
    tone: 'professionnel',
    narrativeFormat: 'troisième personne',
    samplePrompt: 'Écris un chapitre business avec une étude de cas réelle, des données chiffrées, un framework actionnable et des points clés à retenir.',
    tips: ['Études de cas', 'Données chiffrées', 'Frameworks visuels', 'ROI mesurable']
  },
  {
    id: 'enfants',
    name: 'Livre pour Enfants',
    genre: 'fiction',
    icon: Baby,
    color: 'text-yellow-500',
    description: 'Histoires magiques avec moral et imagination',
    writingStyle: 'narratif',
    tone: 'ludique',
    narrativeFormat: 'troisième personne',
    samplePrompt: 'Écris un chapitre pour enfants avec un vocabulaire adapté, des dialogues amusants, de la magie, une leçon de vie subtile et des moments d\'émerveillement.',
    tips: ['Vocabulaire adapté à l\'âge', 'Répétitions musicales', 'Morale subtile', 'Illustrations suggérées']
  },
  {
    id: 'fantasy',
    name: 'Fantasy / SF',
    genre: 'fiction',
    icon: Sparkles,
    color: 'text-indigo-500',
    description: 'Univers imaginaires riches et épiques',
    writingStyle: 'narratif',
    tone: 'épique',
    narrativeFormat: 'troisième personne',
    samplePrompt: 'Écris un chapitre de fantasy avec un worldbuilding riche, un système de magie cohérent, des personnages complexes et une intrigue épique.',
    tips: ['Worldbuilding cohérent', 'Système de magie', 'Conflits moraux', 'Descriptions épiques']
  },
];

interface EbookPromptLibraryProps {
  onApplyTemplate: (template: {
    writingStyle: string;
    tone: string;
    narrativeFormat: string;
    genre: string;
  }) => void;
  currentGenre?: string;
}

export const EbookPromptLibrary: React.FC<EbookPromptLibraryProps> = ({
  onApplyTemplate,
  currentGenre,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'fiction' | 'non-fiction'>('all');

  const filtered = PROMPT_TEMPLATES.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                       t.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.genre === filter;
    return matchSearch && matchFilter;
  });

  const handleApply = (template: PromptTemplate) => {
    onApplyTemplate({
      writingStyle: template.writingStyle,
      tone: template.tone,
      narrativeFormat: template.narrativeFormat,
      genre: template.id,
    });
    toast.success(`Template "${template.name}" appliqué !`);
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copié !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Library className="h-6 w-6 text-primary" />
            </div>
            Bibliothèque de Prompts
            <Badge className="bg-primary/10 text-primary border-primary/30">{PROMPT_TEMPLATES.length} templates</Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Prompts pré-configurés par genre pour guider l'IA vers un style d'écriture professionnel et cohérent.
          </p>
        </CardHeader>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'fiction', 'non-fiction'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tous' : f === 'fiction' ? '📖 Fiction' : '📚 Non-fiction'}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(template => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          const isActive = currentGenre === template.id;
          return (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''} ${isActive ? 'border-green-500/50 bg-green-500/5' : ''}`}
              onClick={() => setSelectedTemplate(isSelected ? null : template.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-muted/50 ${template.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{template.name}</h3>
                      {isActive && <Badge className="bg-green-500/10 text-green-500 text-xs">Actif</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="outline" className="text-xs">Style: {template.writingStyle}</Badge>
                      <Badge variant="outline" className="text-xs">Ton: {template.tone}</Badge>
                      <Badge variant="outline" className="text-xs">{template.narrativeFormat}</Badge>
                    </div>

                    {isSelected && (
                      <div className="space-y-3 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-xs font-semibold mb-1 text-muted-foreground uppercase">Prompt exemple</p>
                          <div className="bg-muted/50 rounded-lg p-3 text-sm relative group">
                            <p>{template.samplePrompt}</p>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => { e.stopPropagation(); copyPrompt(template.samplePrompt); }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1 text-muted-foreground uppercase">Conseils clés</p>
                          <div className="flex flex-wrap gap-1.5">
                            {template.tips.map(tip => (
                              <Badge key={tip} variant="secondary" className="text-xs">{tip}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); handleApply(template); }}
                          className="w-full"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Appliquer ce template
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EbookPromptLibrary;
