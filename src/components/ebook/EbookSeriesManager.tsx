import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Plus, Trash2, Save, Wand2, Loader2, 
  Library, Users, MapPin, Scroll, Crown, Sparkles, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SeriesCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  arc: string;
  appearances: number[];
}

interface SeriesLocation {
  id: string;
  name: string;
  description: string;
  significance: string;
}

interface SeriesTimeline {
  id: string;
  event: string;
  tome: number;
  chapter?: string;
  date?: string;
}

interface SeriesTome {
  id: string;
  number: number;
  title: string;
  synopsis: string;
  status: 'planned' | 'writing' | 'complete';
  wordCount: number;
}

interface SeriesBible {
  seriesTitle: string;
  genre: string;
  totalTomes: number;
  synopsis: string;
  themes: string[];
  characters: SeriesCharacter[];
  locations: SeriesLocation[];
  timeline: SeriesTimeline[];
  tomes: SeriesTome[];
  writingRules: string;
}

interface EbookSeriesManagerProps {
  currentTomeNumber?: number;
  ebookTitle?: string;
  onApplyToCurrentBook?: (data: { tomeNumber: number; seriesTitle: string }) => void;
}

export const EbookSeriesManager: React.FC<EbookSeriesManagerProps> = ({
  currentTomeNumber,
  ebookTitle,
  onApplyToCurrentBook
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [seriesBible, setSeriesBible] = useState<SeriesBible>({
    seriesTitle: '',
    genre: '',
    totalTomes: 3,
    synopsis: '',
    themes: [],
    characters: [],
    locations: [],
    timeline: [],
    tomes: [],
    writingRules: ''
  });

  const [newTheme, setNewTheme] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const generateSeriesBible = async () => {
    if (!seriesBible.seriesTitle) {
      toast.error('Entrez un titre de série');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'series-bible',
          prompt: `Crée une bible complète pour une série de ${seriesBible.totalTomes} tomes intitulée "${seriesBible.seriesTitle}".
          Genre: ${seriesBible.genre || 'à déterminer selon le titre'}
          
          Génère en JSON:
          {
            "synopsis": "Synopsis général de la série (200 mots)",
            "themes": ["thème1", "thème2", "thème3"],
            "characters": [
              {"name": "", "role": "protagonist/antagonist/supporting", "description": "", "arc": "évolution du personnage", "appearances": [1,2,3]}
            ],
            "locations": [
              {"name": "", "description": "", "significance": "importance pour l'intrigue"}
            ],
            "timeline": [
              {"event": "", "tome": 1, "chapter": "optionnel", "date": "optionnel"}
            ],
            "tomes": [
              {"number": 1, "title": "", "synopsis": "résumé du tome (100 mots)", "status": "planned", "wordCount": 0}
            ],
            "writingRules": "Règles de cohérence narrative pour la série"
          }
          
          Crée 3-5 personnages principaux, 3-4 lieux importants, 5-8 événements majeurs dans la timeline, et un plan pour chaque tome.`
        }
      });

      if (error) throw error;

      let parsedData;
      try {
        const cleanContent = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(cleanContent);
      } catch {
        throw new Error('Erreur de parsing');
      }

      setSeriesBible(prev => ({
        ...prev,
        synopsis: parsedData.synopsis || '',
        themes: parsedData.themes || [],
        characters: (parsedData.characters || []).map((c: any, i: number) => ({
          ...c,
          id: `char-${Date.now()}-${i}`
        })),
        locations: (parsedData.locations || []).map((l: any, i: number) => ({
          ...l,
          id: `loc-${Date.now()}-${i}`
        })),
        timeline: (parsedData.timeline || []).map((t: any, i: number) => ({
          ...t,
          id: `time-${Date.now()}-${i}`
        })),
        tomes: (parsedData.tomes || []).map((t: any, i: number) => ({
          ...t,
          id: `tome-${Date.now()}-${i}`
        })),
        writingRules: parsedData.writingRules || ''
      }));

      toast.success('Bible de série générée !');
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateNextTome = async (tomeNumber: number) => {
    const previousTomes = seriesBible.tomes.filter(t => t.number < tomeNumber);
    
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'next-tome',
          prompt: `Génère le plan détaillé du Tome ${tomeNumber} de la série "${seriesBible.seriesTitle}".
          
          Contexte de la série:
          - Synopsis: ${seriesBible.synopsis}
          - Personnages: ${seriesBible.characters.map(c => `${c.name} (${c.role}): ${c.arc}`).join('\n')}
          - Tomes précédents: ${previousTomes.map(t => `Tome ${t.number}: ${t.synopsis}`).join('\n')}
          - Règles de cohérence: ${seriesBible.writingRules}
          
          Génère en JSON:
          {
            "title": "Titre du tome",
            "synopsis": "Synopsis détaillé (200 mots)",
            "chapters": [{"title": "", "summary": "résumé en 50 mots"}],
            "characterDevelopments": [{"character": "nom", "development": "évolution dans ce tome"}],
            "newElements": "Nouveaux personnages, lieux ou éléments introduits",
            "cliffhanger": "Fin du tome et accroche pour le suivant"
          }`
        }
      });

      if (error) throw error;

      let parsedData;
      try {
        const cleanContent = data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(cleanContent);
      } catch {
        throw new Error('Erreur de parsing');
      }

      setSeriesBible(prev => ({
        ...prev,
        tomes: prev.tomes.map(t => 
          t.number === tomeNumber 
            ? { ...t, title: parsedData.title, synopsis: parsedData.synopsis }
            : t
        )
      }));

      toast.success(`Plan du Tome ${tomeNumber} généré !`);
      
      // Afficher les détails
      const details = `
📖 ${parsedData.title}

${parsedData.synopsis}

📚 Chapitres:
${parsedData.chapters?.map((c: any, i: number) => `${i + 1}. ${c.title}`).join('\n') || 'Non disponible'}

🎭 Évolutions des personnages:
${parsedData.characterDevelopments?.map((d: any) => `- ${d.character}: ${d.development}`).join('\n') || 'Non disponible'}

✨ Nouveaux éléments: ${parsedData.newElements || 'Aucun'}

🔥 Cliffhanger: ${parsedData.cliffhanger || 'Non défini'}
      `;
      
      navigator.clipboard.writeText(details);
      toast.info('Détails copiés dans le presse-papier');
      
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const addTheme = () => {
    if (newTheme.trim()) {
      setSeriesBible(prev => ({
        ...prev,
        themes: [...prev.themes, newTheme.trim()]
      }));
      setNewTheme('');
    }
  };

  const removeTheme = (index: number) => {
    setSeriesBible(prev => ({
      ...prev,
      themes: prev.themes.filter((_, i) => i !== index)
    }));
  };

  const addCharacter = () => {
    const newChar: SeriesCharacter = {
      id: `char-${Date.now()}`,
      name: '',
      role: 'supporting',
      description: '',
      arc: '',
      appearances: [1]
    };
    setSeriesBible(prev => ({
      ...prev,
      characters: [...prev.characters, newChar]
    }));
  };

  const updateCharacter = (id: string, updates: Partial<SeriesCharacter>) => {
    setSeriesBible(prev => ({
      ...prev,
      characters: prev.characters.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const removeCharacter = (id: string) => {
    setSeriesBible(prev => ({
      ...prev,
      characters: prev.characters.filter(c => c.id !== id)
    }));
  };

  const addTome = () => {
    const nextNumber = seriesBible.tomes.length + 1;
    const newTome: SeriesTome = {
      id: `tome-${Date.now()}`,
      number: nextNumber,
      title: `Tome ${nextNumber}`,
      synopsis: '',
      status: 'planned',
      wordCount: 0
    };
    setSeriesBible(prev => ({
      ...prev,
      tomes: [...prev.tomes, newTome],
      totalTomes: nextNumber
    }));
  };

  const updateTome = (id: string, updates: Partial<SeriesTome>) => {
    setSeriesBible(prev => ({
      ...prev,
      tomes: prev.tomes.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const exportBible = () => {
    const bibleText = `
═══════════════════════════════════════════════════════════════
                    BIBLE DE SÉRIE
                 ${seriesBible.seriesTitle}
═══════════════════════════════════════════════════════════════

📖 SYNOPSIS GÉNÉRAL
${seriesBible.synopsis}

🎯 THÈMES PRINCIPAUX
${seriesBible.themes.map(t => `• ${t}`).join('\n')}

═══════════════════════════════════════════════════════════════
                    PERSONNAGES
═══════════════════════════════════════════════════════════════
${seriesBible.characters.map(c => `
👤 ${c.name} (${c.role})
   Description: ${c.description}
   Arc narratif: ${c.arc}
   Apparitions: Tomes ${c.appearances.join(', ')}
`).join('\n')}

═══════════════════════════════════════════════════════════════
                    LIEUX
═══════════════════════════════════════════════════════════════
${seriesBible.locations.map(l => `
📍 ${l.name}
   ${l.description}
   Importance: ${l.significance}
`).join('\n')}

═══════════════════════════════════════════════════════════════
                    TIMELINE
═══════════════════════════════════════════════════════════════
${seriesBible.timeline.map(t => `
⏰ Tome ${t.tome}${t.chapter ? ` - ${t.chapter}` : ''}${t.date ? ` (${t.date})` : ''}
   ${t.event}
`).join('\n')}

═══════════════════════════════════════════════════════════════
                    TOMES PLANIFIÉS
═══════════════════════════════════════════════════════════════
${seriesBible.tomes.map(t => `
📚 TOME ${t.number}: ${t.title}
   Statut: ${t.status === 'complete' ? '✅ Terminé' : t.status === 'writing' ? '✍️ En cours' : '📋 Planifié'}
   ${t.synopsis}
`).join('\n')}

═══════════════════════════════════════════════════════════════
                    RÈGLES DE COHÉRENCE
═══════════════════════════════════════════════════════════════
${seriesBible.writingRules}
    `;

    navigator.clipboard.writeText(bibleText);
    toast.success('Bible de série copiée !');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            Gestionnaire de Série Multi-Tomes
          </CardTitle>
          <CardDescription>
            Créez et gérez une série cohérente avec une bible complète
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Titre de la série</Label>
              <Input
                value={seriesBible.seriesTitle}
                onChange={(e) => setSeriesBible(prev => ({ ...prev, seriesTitle: e.target.value }))}
                placeholder="Ex: Les Chroniques de..."
              />
            </div>
            <div>
              <Label>Genre</Label>
              <Input
                value={seriesBible.genre}
                onChange={(e) => setSeriesBible(prev => ({ ...prev, genre: e.target.value }))}
                placeholder="Ex: Fantasy, Science-Fiction..."
              />
            </div>
            <div>
              <Label>Nombre de tomes</Label>
              <Input
                type="number"
                min={2}
                max={20}
                value={seriesBible.totalTomes}
                onChange={(e) => setSeriesBible(prev => ({ ...prev, totalTomes: parseInt(e.target.value) || 3 }))}
              />
            </div>
          </div>

          <Button
            onClick={generateSeriesBible}
            disabled={isGenerating || !seriesBible.seriesTitle}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Générer la Bible de Série
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {seriesBible.synopsis && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="characters">Personnages</TabsTrigger>
            <TabsTrigger value="world">Univers</TabsTrigger>
            <TabsTrigger value="tomes">Tomes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="h-5 w-5" />
                  Synopsis de la série
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={seriesBible.synopsis}
                  onChange={(e) => setSeriesBible(prev => ({ ...prev, synopsis: e.target.value }))}
                  className="min-h-[150px]"
                />
                
                <div>
                  <Label className="mb-2 block">Thèmes principaux</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {seriesBible.themes.map((theme, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTheme(index)}
                      >
                        {theme} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTheme}
                      onChange={(e) => setNewTheme(e.target.value)}
                      placeholder="Ajouter un thème..."
                      onKeyPress={(e) => e.key === 'Enter' && addTheme()}
                    />
                    <Button onClick={addTheme} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Règles de cohérence</Label>
                  <Textarea
                    value={seriesBible.writingRules}
                    onChange={(e) => setSeriesBible(prev => ({ ...prev, writingRules: e.target.value }))}
                    placeholder="Règles d'écriture à respecter pour maintenir la cohérence..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button onClick={exportBible} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Exporter la Bible complète
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personnages récurrents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seriesBible.characters.map((char) => (
                  <Card key={char.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={char.name}
                          onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Rôle</Label>
                        <Input
                          value={char.role}
                          onChange={(e) => updateCharacter(char.id, { role: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={char.description}
                          onChange={(e) => updateCharacter(char.id, { description: e.target.value })}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Arc narratif</Label>
                        <Textarea
                          value={char.arc}
                          onChange={(e) => updateCharacter(char.id, { arc: e.target.value })}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCharacter(char.id)}
                      className="mt-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button onClick={addCharacter} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un personnage
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="world" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Lieux importants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seriesBible.locations.map((loc) => (
                  <Card key={loc.id} className="p-4">
                    <div className="space-y-3">
                      <Input
                        value={loc.name}
                        onChange={(e) => setSeriesBible(prev => ({
                          ...prev,
                          locations: prev.locations.map(l => 
                            l.id === loc.id ? { ...l, name: e.target.value } : l
                          )
                        }))}
                        placeholder="Nom du lieu"
                        className="font-semibold"
                      />
                      <Textarea
                        value={loc.description}
                        onChange={(e) => setSeriesBible(prev => ({
                          ...prev,
                          locations: prev.locations.map(l => 
                            l.id === loc.id ? { ...l, description: e.target.value } : l
                          )
                        }))}
                        placeholder="Description"
                        className="min-h-[60px]"
                      />
                      <Input
                        value={loc.significance}
                        onChange={(e) => setSeriesBible(prev => ({
                          ...prev,
                          locations: prev.locations.map(l => 
                            l.id === loc.id ? { ...l, significance: e.target.value } : l
                          )
                        }))}
                        placeholder="Importance pour l'intrigue"
                      />
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tomes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Tomes de la série
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seriesBible.tomes.map((tome) => (
                  <Card key={tome.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          tome.status === 'complete' ? 'default' : 
                          tome.status === 'writing' ? 'secondary' : 'outline'
                        }>
                          {tome.status === 'complete' ? '✅ Terminé' : 
                           tome.status === 'writing' ? '✍️ En cours' : '📋 Planifié'}
                        </Badge>
                        <span className="font-bold">Tome {tome.number}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateNextTome(tome.number)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        value={tome.title}
                        onChange={(e) => updateTome(tome.id, { title: e.target.value })}
                        placeholder="Titre du tome"
                        className="font-semibold"
                      />
                      <Textarea
                        value={tome.synopsis}
                        onChange={(e) => updateTome(tome.id, { synopsis: e.target.value })}
                        placeholder="Synopsis du tome..."
                        className="min-h-[80px]"
                      />
                      <Progress value={(tome.wordCount / 50000) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {tome.wordCount.toLocaleString()} / 50,000 mots
                      </p>
                    </div>
                  </Card>
                ))}
                <Button onClick={addTome} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un tome
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="h-5 w-5" />
                  Timeline des événements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-primary/30 pl-6 space-y-6">
                  {seriesBible.timeline.map((event, index) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[29px] w-4 h-4 bg-primary rounded-full" />
                      <Card className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>Tome {event.tome}</Badge>
                          {event.chapter && <Badge variant="outline">{event.chapter}</Badge>}
                          {event.date && <span className="text-xs text-muted-foreground">{event.date}</span>}
                        </div>
                        <p className="text-sm">{event.event}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
