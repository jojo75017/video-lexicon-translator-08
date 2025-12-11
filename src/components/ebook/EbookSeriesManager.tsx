import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Plus, Trash2, Save, Wand2, Loader2, 
  Library, Users, MapPin, Scroll, Crown, Sparkles, Copy,
  AlertTriangle, CheckCircle, Link2, ArrowRight, Heart, Swords,
  FolderOpen, FileText, Image, Download, RefreshCw, Import, GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CharacterRelation {
  characterId: string;
  type: 'ally' | 'enemy' | 'family' | 'romantic' | 'mentor' | 'rival';
  description: string;
}

interface CharacterArcPerTome {
  tome: number;
  status: string;
  development: string;
  keyMoments: string[];
}

interface SeriesCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  arc: string;
  appearances: number[];
  relations: CharacterRelation[];
  arcPerTome: CharacterArcPerTome[];
  physicalDescription?: string;
  personality?: string;
  motivations?: string;
  secrets?: string;
}

interface SeriesLocation {
  id: string;
  name: string;
  description: string;
  significance: string;
  appearancesByTome: number[];
}

interface SeriesTimeline {
  id: string;
  event: string;
  tome: number;
  chapter?: string;
  date?: string;
  charactersInvolved?: string[];
}

interface PlotThread {
  id: string;
  name: string;
  description: string;
  introducedTome: number;
  resolvedTome?: number;
  status: 'open' | 'resolved' | 'ongoing';
}

interface SeriesTome {
  id: string;
  number: number;
  title: string;
  synopsis: string;
  status: 'planned' | 'writing' | 'complete';
  wordCount: number;
  mainPlotPoints: string[];
  cliffhanger?: string;
  previousTomeConnection?: string;
}

interface CoherenceIssue {
  type: 'character' | 'plot' | 'timeline' | 'location';
  severity: 'warning' | 'error';
  message: string;
  tomeNumber?: number;
  // Pour les issues de timeline qu'on peut corriger
  eventIds?: [string, string]; // [eventId1, eventId2] à inverser
}

interface SeriesBible {
  seriesTitle: string;
  authorName: string;
  genres: string[];
  ageCategory: 'children' | 'young-adult' | 'adult' | 'all-ages';
  totalTomes: number;
  synopsis: string;
  themes: string[];
  characters: SeriesCharacter[];
  locations: SeriesLocation[];
  timeline: SeriesTimeline[];
  tomes: SeriesTome[];
  writingRules: string;
  plotThreads: PlotThread[];
}

interface SavedSeriesBible {
  id: string;
  title: string;
  genre: string | null;
  total_tomes: number;
  created_at: string;
  updated_at: string;
}

interface EbookSeriesManagerProps {
  currentTomeNumber?: number;
  ebookTitle?: string;
  onApplyToCurrentBook?: (data: { tomeNumber: number; seriesTitle: string }) => void;
  onImportTome?: (data: {
    title: string;
    authorName: string;
    tomeNumber: number;
    seriesTitle: string;
    synopsis: string;
    chapters: Array<{
      id: string;
      title: string;
      content: string;
      subChapters: Array<{ id: string; title: string; content: string }>;
    }>;
    preface: string;
    conclusion: string;
    targetWordsPerChapter: number;
  }) => void;
}

export const EbookSeriesManager: React.FC<EbookSeriesManagerProps> = ({
  currentTomeNumber,
  ebookTitle,
  onApplyToCurrentBook,
  onImportTome
}) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState<string | null>(null);
  const [tomeCoverUrls, setTomeCoverUrls] = useState<Record<string, string>>({});
  const [coverStyle, setCoverStyle] = useState<string>('cinematic');
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null);
  const [savedSeries, setSavedSeries] = useState<SavedSeriesBible[]>([]);
  const [showSavedSeries, setShowSavedSeries] = useState(false);
  const [seriesBible, setSeriesBible] = useState<SeriesBible>({
    seriesTitle: '',
    authorName: '',
    genres: [],
    ageCategory: 'adult',
    totalTomes: 3,
    synopsis: '',
    themes: [],
    characters: [],
    locations: [],
    timeline: [],
    tomes: [],
    writingRules: '',
    plotThreads: []
  });
  const [newGenre, setNewGenre] = useState('');
  const [targetWordsPerChapter, setTargetWordsPerChapter] = useState<number>(2500);

  const [newTheme, setNewTheme] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Load saved series on mount
  useEffect(() => {
    loadSavedSeriesList();
  }, []);

  const loadSavedSeriesList = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('series_bibles')
        .select('id, title, genre, total_tomes, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSavedSeries(data || []);
    } catch (error) {
      console.error('Erreur chargement séries:', error);
    }
  };

  const saveSeriesBible = async () => {
    if (!seriesBible.seriesTitle) {
      toast.error('Entrez un titre de série');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Connectez-vous pour sauvegarder');
        return;
      }

      const seriesData = {
        user_id: user.id,
        title: seriesBible.seriesTitle,
        genre: seriesBible.genres.join(', ') || null,
        total_tomes: seriesBible.totalTomes,
        main_themes: JSON.parse(JSON.stringify(seriesBible.themes)),
        characters: JSON.parse(JSON.stringify(seriesBible.characters)),
        locations: JSON.parse(JSON.stringify(seriesBible.locations)),
        timeline: JSON.parse(JSON.stringify(seriesBible.timeline)),
        plot_threads: JSON.parse(JSON.stringify(seriesBible.plotThreads)),
        tomes: JSON.parse(JSON.stringify(seriesBible.tomes)),
        world_rules: seriesBible.writingRules,
        narrative_style: seriesBible.synopsis
      };

      if (currentSeriesId) {
        const { error } = await supabase
          .from('series_bibles')
          .update(seriesData)
          .eq('id', currentSeriesId);

        if (error) throw error;
        toast.success('Série mise à jour !');
      } else {
        const { data, error } = await supabase
          .from('series_bibles')
          .insert(seriesData)
          .select('id')
          .single();

        if (error) throw error;
        setCurrentSeriesId(data.id);
        toast.success('Série sauvegardée !');
      }

      loadSavedSeriesList();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const loadSeriesBible = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('series_bibles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Parse genre - support both old string format and new array format
      let genres: string[] = [];
      if (data.genre) {
        if (Array.isArray(data.genre)) {
          genres = data.genre;
        } else if (typeof data.genre === 'string') {
          genres = data.genre.split(',').map((g: string) => g.trim()).filter(Boolean);
        }
      }
      
      setSeriesBible({
        seriesTitle: data.title,
        authorName: (data as any).author_name || '',
        genres,
        ageCategory: (data as any).age_category || 'adult',
        totalTomes: data.total_tomes || 3,
        synopsis: data.narrative_style || '',
        themes: (data.main_themes as unknown as string[]) || [],
        characters: (data.characters as unknown as SeriesCharacter[]) || [],
        locations: (data.locations as unknown as SeriesLocation[]) || [],
        timeline: (data.timeline as unknown as SeriesTimeline[]) || [],
        tomes: (data.tomes as unknown as SeriesTome[]) || [],
        writingRules: data.world_rules || '',
        plotThreads: (data.plot_threads as unknown as PlotThread[]) || []
      });
      setCurrentSeriesId(id);
      setShowSavedSeries(false);
      toast.success('Série chargée !');
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSeriesBible = async (id: string) => {
    if (!confirm('Supprimer cette série ?')) return;

    try {
      const { error } = await supabase
        .from('series_bibles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (currentSeriesId === id) {
        setCurrentSeriesId(null);
        setSeriesBible({
          seriesTitle: '',
          authorName: '',
          genres: [],
          ageCategory: 'adult',
          totalTomes: 3,
          synopsis: '',
          themes: [],
          characters: [],
          locations: [],
          timeline: [],
          tomes: [],
          writingRules: '',
          plotThreads: []
        });
      }

      loadSavedSeriesList();
      toast.success('Série supprimée !');
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const newSeriesBible = () => {
    setCurrentSeriesId(null);
    setSeriesBible({
      seriesTitle: '',
      authorName: '',
      genres: [],
      ageCategory: 'adult',
      totalTomes: 3,
      synopsis: '',
      themes: [],
      characters: [],
      locations: [],
      timeline: [],
      tomes: [],
      writingRules: '',
      plotThreads: []
    });
    setShowSavedSeries(false);
  };

  // Vérification automatique de cohérence
  const coherenceIssues = useMemo((): CoherenceIssue[] => {
    const issues: CoherenceIssue[] = [];

    // Vérifier les personnages sans apparitions définies
    seriesBible.characters.forEach(char => {
      if (char.appearances.length === 0) {
        issues.push({
          type: 'character',
          severity: 'warning',
          message: `${char.name} n'apparaît dans aucun tome`
        });
      }
      
      // Vérifier la cohérence des arcs par tome
      if (char.arcPerTome && char.arcPerTome.length > 0) {
        const missingTomes = char.appearances.filter(
          tome => !char.arcPerTome.some(arc => arc.tome === tome)
        );
        if (missingTomes.length > 0) {
          issues.push({
            type: 'character',
            severity: 'warning',
            message: `${char.name}: arc non défini pour tome(s) ${missingTomes.join(', ')}`
          });
        }
      }
    });

    // Vérifier les fils narratifs non résolus
    seriesBible.plotThreads?.forEach(thread => {
      if (thread.status === 'open' && thread.introducedTome < seriesBible.totalTomes) {
        issues.push({
          type: 'plot',
          severity: 'warning',
          message: `Fil narratif "${thread.name}" introduit au tome ${thread.introducedTome} non résolu`
        });
      }
    });

    // Vérifier les connexions entre tomes
    seriesBible.tomes.forEach((tome, index) => {
      if (index > 0 && !tome.previousTomeConnection) {
        issues.push({
          type: 'plot',
          severity: 'warning',
          message: `Tome ${tome.number}: pas de lien explicite avec le tome précédent`,
          tomeNumber: tome.number
        });
      }
    });

    // Vérifier la timeline pour les incohérences
    const sortedTimeline = [...seriesBible.timeline].sort((a, b) => a.tome - b.tome);
    for (let i = 1; i < sortedTimeline.length; i++) {
      if (sortedTimeline[i].date && sortedTimeline[i-1].date) {
        // Vérification basique des dates
        if (sortedTimeline[i].date! < sortedTimeline[i-1].date!) {
          issues.push({
            type: 'timeline',
            severity: 'error',
            message: `Incohérence temporelle: "${sortedTimeline[i].event}" avant "${sortedTimeline[i-1].event}"`,
            eventIds: [sortedTimeline[i-1].id, sortedTimeline[i].id]
          });
        }
      }
    }

    return issues;
  }, [seriesBible]);

  // Fonction pour corriger automatiquement les incohérences de timeline
  const fixTimelineIssue = (eventIds: [string, string]) => {
    const [eventId1, eventId2] = eventIds;
    const event1 = seriesBible.timeline.find(e => e.id === eventId1);
    const event2 = seriesBible.timeline.find(e => e.id === eventId2);
    
    if (event1 && event2) {
      // Échanger les dates des deux événements
      const updatedTimeline = seriesBible.timeline.map(event => {
        if (event.id === eventId1) {
          return { ...event, date: event2.date };
        }
        if (event.id === eventId2) {
          return { ...event, date: event1.date };
        }
        return event;
      });
      
      setSeriesBible(prev => ({ ...prev, timeline: updatedTimeline }));
      toast.success('Timeline corrigée ! Les dates ont été inversées.');
    }
  };

  const getRelationIcon = (type: CharacterRelation['type']) => {
    switch (type) {
      case 'ally': return <Users className="h-3 w-3" />;
      case 'enemy': return <Swords className="h-3 w-3" />;
      case 'romantic': return <Heart className="h-3 w-3" />;
      case 'family': return <Link2 className="h-3 w-3" />;
      case 'mentor': return <Crown className="h-3 w-3" />;
      case 'rival': return <Swords className="h-3 w-3" />;
      default: return <Link2 className="h-3 w-3" />;
    }
  };

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
          prompt: `Crée une bible COMPLÈTE et COHÉRENTE pour une série de ${seriesBible.totalTomes} tomes intitulée "${seriesBible.seriesTitle}".
          Genre: ${seriesBible.genres.length > 0 ? seriesBible.genres.join(', ') : 'à déterminer selon le titre'}
          Public cible: ${seriesBible.ageCategory === 'children' ? 'Enfants' : seriesBible.ageCategory === 'young-adult' ? 'Jeunes adultes' : seriesBible.ageCategory === 'all-ages' ? 'Tous publics' : 'Adultes'}
          
          IMPORTANT: Assure une cohérence parfaite entre les tomes avec:
          - Des arcs narratifs progressifs pour chaque personnage
          - Des liens clairs entre chaque tome
          - Des fils narratifs qui se développent sur plusieurs tomes
          - Des cliffhangers et résolutions cohérents
          
          Génère en JSON:
          {
            "synopsis": "Synopsis général de la série (200 mots) avec l'arc global",
            "themes": ["thème1", "thème2", "thème3"],
            "characters": [
              {
                "name": "",
                "role": "protagonist/antagonist/supporting",
                "description": "description physique et psychologique",
                "physicalDescription": "apparence détaillée",
                "personality": "traits de caractère",
                "motivations": "ce qui le pousse à agir",
                "secrets": "secrets du personnage révélés progressivement",
                "arc": "évolution globale sur la série",
                "appearances": [1,2,3],
                "relations": [{"characterId": "", "type": "ally/enemy/family/romantic/mentor/rival", "description": "nature de la relation"}],
                "arcPerTome": [{"tome": 1, "status": "état du personnage", "development": "évolution dans ce tome", "keyMoments": ["moment clé 1"]}]
              }
            ],
            "locations": [
              {"name": "", "description": "", "significance": "importance pour l'intrigue", "appearancesByTome": [1,2]}
            ],
            "timeline": [
              {"event": "", "tome": 1, "chapter": "optionnel", "date": "optionnel", "charactersInvolved": ["nom1", "nom2"]}
            ],
            "tomes": [
              {
                "number": 1,
                "title": "",
                "synopsis": "résumé du tome (150 mots)",
                "status": "planned",
                "wordCount": 0,
                "mainPlotPoints": ["point 1", "point 2", "point 3"],
                "cliffhanger": "fin du tome et accroche",
                "previousTomeConnection": "lien avec le tome précédent (null pour tome 1)"
              }
            ],
            "plotThreads": [
              {"name": "nom du fil narratif", "description": "description", "introducedTome": 1, "resolvedTome": 3, "status": "open/resolved/ongoing"}
            ],
            "writingRules": "Règles de cohérence narrative détaillées: style, ton, vocabulaire récurrent, éléments à maintenir"
          }
          
          Crée 4-6 personnages principaux avec relations entre eux, 4-5 lieux importants, 8-12 événements majeurs dans la timeline, 3-5 fils narratifs, et un plan détaillé pour chaque tome avec connexions explicites.`
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
          id: `char-${Date.now()}-${i}`,
          relations: c.relations || [],
          arcPerTome: c.arcPerTome || [],
          physicalDescription: c.physicalDescription || '',
          personality: c.personality || '',
          motivations: c.motivations || '',
          secrets: c.secrets || ''
        })),
        locations: (parsedData.locations || []).map((l: any, i: number) => ({
          ...l,
          id: `loc-${Date.now()}-${i}`,
          appearancesByTome: l.appearancesByTome || []
        })),
        timeline: (parsedData.timeline || []).map((t: any, i: number) => ({
          ...t,
          id: `time-${Date.now()}-${i}`,
          charactersInvolved: t.charactersInvolved || []
        })),
        tomes: (parsedData.tomes || []).map((t: any, i: number) => ({
          ...t,
          id: `tome-${Date.now()}-${i}`,
          mainPlotPoints: t.mainPlotPoints || [],
          cliffhanger: t.cliffhanger || '',
          previousTomeConnection: t.previousTomeConnection || ''
        })),
        plotThreads: (parsedData.plotThreads || []).map((p: any, i: number) => ({
          ...p,
          id: `plot-${Date.now()}-${i}`
        })),
        writingRules: parsedData.writingRules || ''
      }));

      toast.success('Bible de série générée avec cohérence inter-tomes !');
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

  const generateTomeCover = async (tomeNumber: number, tomeTitle?: string) => {
    if (!seriesBible.seriesTitle) {
      toast.error('Entrez un titre de série');
      return;
    }

    const coverKey = tomeNumber === 0 ? 'series' : `tome-${tomeNumber}`;
    setIsGeneratingCover(coverKey);

    try {
      const { data, error } = await supabase.functions.invoke('generate-series-cover', {
        body: {
          seriesTitle: seriesBible.seriesTitle,
          tomeNumber: tomeNumber === 0 ? null : tomeNumber,
          tomeTitle: tomeTitle || (tomeNumber === 0 ? null : `Tome ${tomeNumber}`),
          genre: seriesBible.genres.length > 0 ? seriesBible.genres.join(', ') : 'fiction',
          ageCategory: seriesBible.ageCategory,
          synopsis: seriesBible.synopsis?.substring(0, 300),
          style: coverStyle,
          authorName: seriesBible.authorName
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setTomeCoverUrls(prev => ({ ...prev, [coverKey]: data.imageUrl }));
        toast.success(`Couverture ${tomeNumber === 0 ? 'de la série' : `du Tome ${tomeNumber}`} générée !`);
      } else {
        throw new Error('Aucune image reçue');
      }
    } catch (error: any) {
      console.error('Erreur génération couverture:', error);
      if (error.message?.includes('429') || error.message?.includes('limite')) {
        toast.error('Limite de requêtes atteinte. Réessayez dans quelques instants.');
      } else if (error.message?.includes('402') || error.message?.includes('crédits')) {
        toast.error('Crédits épuisés. Veuillez ajouter des crédits.');
      } else {
        toast.error('Erreur lors de la génération de la couverture');
      }
    } finally {
      setIsGeneratingCover(null);
    }
  };

  const [isGeneratingAllCovers, setIsGeneratingAllCovers] = useState(false);
  const [coverGenerationProgress, setCoverGenerationProgress] = useState(0);

  const generateAllCovers = async () => {
    if (!seriesBible.seriesTitle || seriesBible.tomes.length === 0) {
      toast.error('Créez d\'abord une série avec des tomes');
      return;
    }

    setIsGeneratingAllCovers(true);
    setCoverGenerationProgress(0);
    
    const totalCovers = seriesBible.tomes.length + 1; // +1 pour la couverture de série
    let generatedCount = 0;

    try {
      // Générer la couverture de série d'abord
      toast.info('Génération de la couverture de série...');
      await generateSingleCover(0, undefined);
      generatedCount++;
      setCoverGenerationProgress((generatedCount / totalCovers) * 100);

      // Générer les couvertures des tomes avec un délai pour éviter le rate limit
      for (const tome of seriesBible.tomes) {
        toast.info(`Génération de la couverture du Tome ${tome.number}...`);
        await generateSingleCover(tome.number, tome.title);
        generatedCount++;
        setCoverGenerationProgress((generatedCount / totalCovers) * 100);
        
        // Petit délai entre chaque génération pour éviter le rate limit
        if (generatedCount < totalCovers) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      toast.success(`${totalCovers} couvertures générées avec succès !`);
    } catch (error: any) {
      console.error('Erreur génération couvertures:', error);
      toast.error(`Erreur après ${generatedCount} couvertures. ${error.message || ''}`);
    } finally {
      setIsGeneratingAllCovers(false);
      setCoverGenerationProgress(0);
    }
  };

  const generateSingleCover = async (tomeNumber: number, tomeTitle?: string) => {
    const coverKey = tomeNumber === 0 ? 'series' : `tome-${tomeNumber}`;

    const { data, error } = await supabase.functions.invoke('generate-series-cover', {
      body: {
        seriesTitle: seriesBible.seriesTitle,
        tomeNumber: tomeNumber === 0 ? null : tomeNumber,
        tomeTitle: tomeTitle || (tomeNumber === 0 ? null : `Tome ${tomeNumber}`),
        genre: seriesBible.genres.length > 0 ? seriesBible.genres.join(', ') : 'fiction',
        ageCategory: seriesBible.ageCategory,
        synopsis: seriesBible.synopsis?.substring(0, 300),
        style: coverStyle,
        authorName: seriesBible.authorName
      }
    });

    if (error) throw error;

    if (data?.imageUrl) {
      setTomeCoverUrls(prev => ({ ...prev, [coverKey]: data.imageUrl }));
    } else {
      throw new Error('Aucune image reçue');
    }
  };

  const downloadCover = (coverKey: string) => {
    const coverUrl = tomeCoverUrls[coverKey];
    if (!coverUrl) return;

    const link = document.createElement('a');
    link.href = coverUrl;
    link.download = `${seriesBible.seriesTitle.replace(/[^a-z0-9]/gi, '_')}_${coverKey}_cover.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Couverture téléchargée !');
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
      appearances: [1],
      relations: [],
      arcPerTome: []
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
    const previousTome = seriesBible.tomes[seriesBible.tomes.length - 1];
    const newTome: SeriesTome = {
      id: `tome-${Date.now()}`,
      number: nextNumber,
      title: `Tome ${nextNumber}`,
      synopsis: '',
      status: 'planned',
      wordCount: 0,
      mainPlotPoints: [],
      cliffhanger: '',
      previousTomeConnection: previousTome ? `Suite de "${previousTome.title}"` : undefined
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

  const [isImportingTome, setIsImportingTome] = useState<number | null>(null);

  const importTomeToPlanner = async (tome: SeriesTome) => {
    if (!onImportTome) {
      toast.error('Fonction d\'import non disponible');
      return;
    }

    setIsImportingTome(tome.number);

    try {
      // Générer les chapitres détaillés pour ce tome via l'IA
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'tome-chapters',
          prompt: `Génère la structure complète des chapitres pour le livre suivant:

TITRE: "${tome.title}" (Tome ${tome.number} de la série "${seriesBible.seriesTitle}")
AUTEUR: ${seriesBible.authorName || 'Non défini'}
SYNOPSIS: ${tome.synopsis}

CONTEXTE DE LA SÉRIE:
- Genre: ${seriesBible.genres.join(', ') || 'Fiction'}
- Public: ${seriesBible.ageCategory === 'children' ? 'Enfants' : seriesBible.ageCategory === 'young-adult' ? 'Jeunes adultes' : seriesBible.ageCategory === 'all-ages' ? 'Tous publics' : 'Adultes'}
- Thèmes: ${seriesBible.themes.join(', ')}

POINTS CLÉS DU TOME:
${tome.mainPlotPoints?.map((p, i) => `${i + 1}. ${p}`).join('\n') || 'Non définis'}

${tome.cliffhanger ? `CLIFFHANGER: ${tome.cliffhanger}` : ''}

IMPORTANT: Génère EXACTEMENT 8 chapitres pour un livre de ${Math.round(targetWordsPerChapter * 8 / 250)} pages (~${targetWordsPerChapter.toLocaleString()} mots par chapitre).

Génère en JSON:
{
  "preface": "Une préface engageante de 100-150 mots",
  "chapters": [
    {
      "title": "Titre du chapitre",
      "subChapters": ["Sous-chapitre 1", "Sous-chapitre 2"],
      "targetWords": ${targetWordsPerChapter}
    }
  ],
  "conclusion": "Une conclusion de 100-150 mots"
}

RÈGLES STRICTES:
- Génère EXACTEMENT 8 chapitres (pas plus, pas moins)
- Chaque chapitre doit avoir 2-3 sous-chapitres maximum
- Chaque chapitre doit viser ${targetWordsPerChapter.toLocaleString()} mots
- Progression narrative cohérente`
        }
      });

      if (error) throw error;

      let parsedData;
      try {
        const cleanContent = data.content.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim();
        parsedData = JSON.parse(cleanContent);
      } catch {
        throw new Error('Erreur de parsing des chapitres');
      }

      // Formater les chapitres
      const formattedChapters = (parsedData.chapters || []).map((ch: any, index: number) => ({
        id: `chapter-${Date.now()}-${index}`,
        title: ch.title,
        content: '',
        subChapters: (ch.subChapters || []).map((sub: string, subIndex: number) => ({
          id: `subchapter-${Date.now()}-${index}-${subIndex}`,
          title: sub,
          content: ''
        }))
      }));

      // Appeler le callback pour importer dans le planificateur
      onImportTome({
        title: tome.title,
        authorName: seriesBible.authorName,
        tomeNumber: tome.number,
        seriesTitle: seriesBible.seriesTitle,
        synopsis: tome.synopsis,
        chapters: formattedChapters,
        preface: parsedData.preface || '',
        conclusion: parsedData.conclusion || '',
        targetWordsPerChapter
      });

      toast.success(`Tome ${tome.number} importé ! (8 chapitres × ${targetWordsPerChapter.toLocaleString()} mots = ~${Math.round(targetWordsPerChapter * 8 / 250)} pages)`);
    } catch (error) {
      console.error('Erreur import tome:', error);
      toast.error('Erreur lors de l\'import du tome');
    } finally {
      setIsImportingTome(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Saved Series Panel */}
      {showSavedSeries && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Mes Séries Sauvegardées
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedSeries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Aucune série sauvegardée</p>
            ) : (
              <div className="space-y-2">
                {savedSeries.map((series) => (
                  <div key={series.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{series.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {series.genre || 'Genre non défini'} • {series.total_tomes} tomes • 
                        Modifié le {new Date(series.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => loadSeriesBible(series.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteSeriesBible(series.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowSavedSeries(false)} className="flex-1">
                Fermer
              </Button>
              <Button onClick={newSeriesBible} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle série
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            Gestionnaire de Série Multi-Tomes
            {currentSeriesId && <Badge variant="secondary" className="ml-2">Sauvegardé</Badge>}
          </CardTitle>
          <CardDescription>
            Créez et gérez une série cohérente avec une bible complète
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action buttons for saved series */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => setShowSavedSeries(true)}
              className="flex-1"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Mes séries ({savedSeries.length})
            </Button>
            <Button 
              variant="outline" 
              onClick={saveSeriesBible}
              disabled={isSaving || !seriesBible.seriesTitle}
              className="flex-1"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {currentSeriesId ? 'Mettre à jour' : 'Sauvegarder'}
            </Button>
            {currentSeriesId && (
              <Button variant="outline" onClick={newSeriesBible}>
                <FileText className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Titre de la série</Label>
              <Input
                value={seriesBible.seriesTitle}
                onChange={(e) => setSeriesBible(prev => ({ ...prev, seriesTitle: e.target.value }))}
                placeholder="Ex: Les Chroniques de..."
              />
            </div>
            <div>
              <Label>Nom de l'auteur</Label>
              <Input
                value={seriesBible.authorName}
                onChange={(e) => setSeriesBible(prev => ({ ...prev, authorName: e.target.value }))}
                placeholder="Ex: Marie Dupont"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Genres (cliquez pour ajouter)</Label>
              <div className="flex flex-wrap gap-1 mb-2 min-h-[32px]">
                {seriesBible.genres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setSeriesBible(prev => ({ ...prev, genres: prev.genres.filter((_, i) => i !== index) }))}
                  >
                    {genre} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select 
                  value="" 
                  onValueChange={(value) => {
                    if (value && !seriesBible.genres.includes(value)) {
                      setSeriesBible(prev => ({ ...prev, genres: [...prev.genres, value] }));
                    }
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Ajouter un genre..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Science-Fiction">Science-Fiction</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Thriller">Thriller</SelectItem>
                    <SelectItem value="Policier">Policier</SelectItem>
                    <SelectItem value="Horreur">Horreur</SelectItem>
                    <SelectItem value="Aventure">Aventure</SelectItem>
                    <SelectItem value="Historique">Historique</SelectItem>
                    <SelectItem value="Contemporain">Contemporain</SelectItem>
                    <SelectItem value="Dystopie">Dystopie</SelectItem>
                    <SelectItem value="Urban Fantasy">Urban Fantasy</SelectItem>
                    <SelectItem value="Paranormal">Paranormal</SelectItem>
                    <SelectItem value="Comédie">Comédie</SelectItem>
                    <SelectItem value="Drame">Drame</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Public cible</Label>
              <Select 
                value={seriesBible.ageCategory} 
                onValueChange={(value: 'children' | 'young-adult' | 'adult' | 'all-ages') => 
                  setSeriesBible(prev => ({ ...prev, ageCategory: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="children">Enfants (6-12 ans)</SelectItem>
                  <SelectItem value="young-adult">Jeunes adultes (12-18 ans)</SelectItem>
                  <SelectItem value="adult">Adultes (18+)</SelectItem>
                  <SelectItem value="all-ages">Tous publics</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Formation toujours visible */}
      <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-emerald-500" />
            Formation - Créer une Série à Succès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate('/formation-series')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Formation Texte
            </Button>
            <Button 
              onClick={() => navigate('/formation-series-audio')}
              variant="outline"
              className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
            >
              <Crown className="h-4 w-4 mr-2" />
              Formation Audio
            </Button>
          </div>
        </CardContent>
      </Card>

      {seriesBible.synopsis && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="characters">Personnages</TabsTrigger>
            <TabsTrigger value="world">Univers</TabsTrigger>
            <TabsTrigger value="tomes">Tomes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="coherence" className="relative">
              Cohérence
              {coherenceIssues.length > 0 && (
                <Badge 
                  variant={coherenceIssues.some(i => i.severity === 'error') ? 'destructive' : 'secondary'}
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {coherenceIssues.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="formation" className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <GraduationCap className="h-4 w-4 mr-1" />
              Formation
            </TabsTrigger>
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
                <CardDescription>
                  Gérez les personnages et leurs relations pour maintenir la cohérence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {seriesBible.characters.map((char) => (
                  <Card key={char.id} className="p-4 border-l-4 border-l-primary">
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
                        <Label>Description physique</Label>
                        <Textarea
                          value={char.physicalDescription || ''}
                          onChange={(e) => updateCharacter(char.id, { physicalDescription: e.target.value })}
                          placeholder="Apparence, traits distinctifs..."
                          className="min-h-[50px]"
                        />
                      </div>
                      <div>
                        <Label>Personnalité</Label>
                        <Textarea
                          value={char.personality || ''}
                          onChange={(e) => updateCharacter(char.id, { personality: e.target.value })}
                          placeholder="Traits de caractère..."
                          className="min-h-[50px]"
                        />
                      </div>
                      <div>
                        <Label>Motivations</Label>
                        <Textarea
                          value={char.motivations || ''}
                          onChange={(e) => updateCharacter(char.id, { motivations: e.target.value })}
                          placeholder="Ce qui le pousse à agir..."
                          className="min-h-[50px]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Arc narratif global</Label>
                        <Textarea
                          value={char.arc}
                          onChange={(e) => updateCharacter(char.id, { arc: e.target.value })}
                          placeholder="Évolution du personnage sur l'ensemble de la série..."
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Secrets (révélés progressivement)</Label>
                        <Textarea
                          value={char.secrets || ''}
                          onChange={(e) => updateCharacter(char.id, { secrets: e.target.value })}
                          placeholder="Secrets du personnage et quand ils sont révélés..."
                          className="min-h-[50px]"
                        />
                      </div>
                      
                      {/* Apparitions par tome */}
                      <div className="md:col-span-2">
                        <Label className="mb-2 block">Apparitions dans les tomes</Label>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: seriesBible.totalTomes }, (_, i) => i + 1).map(tomeNum => (
                            <Badge
                              key={tomeNum}
                              variant={char.appearances.includes(tomeNum) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => {
                                const newAppearances = char.appearances.includes(tomeNum)
                                  ? char.appearances.filter(t => t !== tomeNum)
                                  : [...char.appearances, tomeNum].sort((a, b) => a - b);
                                updateCharacter(char.id, { appearances: newAppearances });
                              }}
                            >
                              Tome {tomeNum}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Relations avec autres personnages */}
                      {char.relations && char.relations.length > 0 && (
                        <div className="md:col-span-2">
                          <Label className="mb-2 block">Relations</Label>
                          <div className="flex flex-wrap gap-2">
                            {char.relations.map((rel, idx) => {
                              const relatedChar = seriesBible.characters.find(c => c.id === rel.characterId || c.name === rel.characterId);
                              return (
                                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                  {getRelationIcon(rel.type)}
                                  {relatedChar?.name || rel.characterId}: {rel.description}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Arc par tome */}
                      {char.arcPerTome && char.arcPerTome.length > 0 && (
                        <div className="md:col-span-2 bg-muted/50 p-3 rounded-lg">
                          <Label className="mb-2 block flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Évolution par tome
                          </Label>
                          <div className="space-y-2">
                            {char.arcPerTome.map((arc, idx) => (
                              <div key={idx} className="text-sm border-l-2 border-primary/50 pl-3">
                                <span className="font-semibold">Tome {arc.tome}:</span>{' '}
                                <span className="text-muted-foreground">{arc.status}</span>
                                <p className="text-xs mt-1">{arc.development}</p>
                                {arc.keyMoments && arc.keyMoments.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {arc.keyMoments.map((moment, mIdx) => (
                                      <Badge key={mIdx} variant="outline" className="text-xs">
                                        {moment}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
            {/* Générateur de couverture de série */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  Couvertures IA
                </CardTitle>
                <CardDescription>
                  Générez des couvertures professionnelles pour votre série
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Style de couverture</Label>
                    <Select value={coverStyle} onValueChange={setCoverStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cinematic">🎬 Cinématique</SelectItem>
                        <SelectItem value="minimalist">⚪ Minimaliste</SelectItem>
                        <SelectItem value="illustrated">🎨 Illustré</SelectItem>
                        <SelectItem value="photorealistic">📷 Photoréaliste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => generateTomeCover(0)}
                    disabled={isGeneratingCover !== null || isGeneratingAllCovers || !seriesBible.seriesTitle}
                    variant="outline"
                  >
                    {isGeneratingCover === 'series' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4 mr-2" />
                        Série
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={generateAllCovers}
                    disabled={isGeneratingCover !== null || isGeneratingAllCovers || !seriesBible.seriesTitle || seriesBible.tomes.length === 0}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {isGeneratingAllCovers ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {Math.round(coverGenerationProgress)}%
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Toutes les couvertures
                      </>
                    )}
                  </Button>
                </div>

                {/* Barre de progression pour génération en masse */}
                {isGeneratingAllCovers && (
                  <div className="space-y-2">
                    <Progress value={coverGenerationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Génération en cours... {Math.round(coverGenerationProgress)}% ({Math.round((coverGenerationProgress / 100) * (seriesBible.tomes.length + 1))}/{seriesBible.tomes.length + 1} couvertures)
                    </p>
                  </div>
                )}

                {/* Affichage couverture de série */}
                {tomeCoverUrls['series'] && (
                  <div className="flex gap-4 items-start">
                    <div className="w-32 rounded-lg overflow-hidden shadow-lg border">
                      <img 
                        src={tomeCoverUrls['series']} 
                        alt="Couverture de série"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Couverture de la série</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => downloadCover('series')}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => generateTomeCover(0)}
                          disabled={isGeneratingCover !== null}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Tomes de la série
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm whitespace-nowrap">Mots/chapitre:</Label>
                    <Select 
                      value={targetWordsPerChapter.toString()} 
                      onValueChange={(v) => setTargetWordsPerChapter(parseInt(v))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1500">1 500 (~6p)</SelectItem>
                        <SelectItem value="2000">2 000 (~8p)</SelectItem>
                        <SelectItem value="2500">2 500 (~10p)</SelectItem>
                        <SelectItem value="3000">3 000 (~12p)</SelectItem>
                        <SelectItem value="3500">3 500 (~14p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  8 chapitres × {targetWordsPerChapter.toLocaleString()} mots = ~{(targetWordsPerChapter * 8 / 250).toFixed(0)} pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {seriesBible.tomes.map((tome) => (
                  <Card key={tome.id} className="p-4 border-l-4 border-l-primary">
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
                      <div className="flex gap-2">
                        {onImportTome && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white"
                            onClick={() => importTomeToPlanner(tome)}
                            disabled={isImportingTome !== null || isGenerating}
                            title="Importer dans le planificateur"
                          >
                            {isImportingTome === tome.number ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Import className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateTomeCover(tome.number, tome.title)}
                          disabled={isGeneratingCover !== null}
                          title="Générer couverture"
                        >
                          {isGeneratingCover === `tome-${tome.number}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Image className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateNextTome(tome.number)}
                          disabled={isGenerating}
                          title="Générer plan"
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Wand2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Couverture générée pour ce tome */}
                    {tomeCoverUrls[`tome-${tome.number}`] && (
                      <div className="mb-3 flex gap-3 items-start p-3 bg-muted/50 rounded-lg">
                        <div className="w-20 rounded overflow-hidden shadow border">
                          <img 
                            src={tomeCoverUrls[`tome-${tome.number}`]} 
                            alt={`Couverture Tome ${tome.number}`}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-medium">Couverture générée</p>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => downloadCover(`tome-${tome.number}`)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Télécharger
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7"
                              onClick={() => generateTomeCover(tome.number, tome.title)}
                              disabled={isGeneratingCover !== null}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Lien avec tome précédent */}
                    {tome.number > 1 && (
                      <div className="mb-3 p-2 bg-muted/50 rounded-lg text-sm">
                        <Label className="text-xs flex items-center gap-1 mb-1">
                          <Link2 className="h-3 w-3" />
                          Lien avec le tome précédent
                        </Label>
                        <Input
                          value={tome.previousTomeConnection || ''}
                          onChange={(e) => updateTome(tome.id, { previousTomeConnection: e.target.value })}
                          placeholder="Comment ce tome s'enchaîne avec le précédent..."
                          className="text-sm"
                        />
                      </div>
                    )}
                    
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
                      
                      {/* Points clés de l'intrigue */}
                      <div>
                        <Label className="text-xs mb-1 block">Points clés de l'intrigue</Label>
                        <div className="flex flex-wrap gap-1">
                          {tome.mainPlotPoints?.map((point, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Cliffhanger */}
                      {tome.cliffhanger && (
                        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <Label className="text-xs flex items-center gap-1 text-destructive">
                            <Sparkles className="h-3 w-3" />
                            Cliffhanger
                          </Label>
                          <p className="text-sm mt-1">{tome.cliffhanger}</p>
                        </div>
                      )}
                      
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

          {/* Onglet Cohérence */}
          <TabsContent value="coherence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {coherenceIssues.length === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  Vérification de cohérence
                </CardTitle>
                <CardDescription>
                  Analyse automatique de la cohérence entre les tomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {coherenceIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-green-600">Aucun problème détecté</p>
                    <p className="text-sm text-muted-foreground">
                      Votre série semble cohérente. Continuez à enrichir la bible !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coherenceIssues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          issue.severity === 'error' 
                            ? 'bg-destructive/10 border-l-destructive' 
                            : 'bg-yellow-500/10 border-l-yellow-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            {issue.severity === 'error' ? (
                              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            )}
                            <div>
                              <Badge variant="outline" className="text-xs mb-1">
                                {issue.type === 'character' && 'Personnage'}
                                {issue.type === 'plot' && 'Intrigue'}
                                {issue.type === 'timeline' && 'Timeline'}
                                {issue.type === 'location' && 'Lieu'}
                              </Badge>
                              <p className="text-sm">{issue.message}</p>
                            </div>
                          </div>
                          {issue.type === 'timeline' && issue.eventIds && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fixTimelineIssue(issue.eventIds!)}
                              className="shrink-0 text-xs"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Corriger
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Statistiques de cohérence */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{seriesBible.characters.length}</p>
                    <p className="text-xs text-muted-foreground">Personnages</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{seriesBible.locations.length}</p>
                    <p className="text-xs text-muted-foreground">Lieux</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{seriesBible.timeline.length}</p>
                    <p className="text-xs text-muted-foreground">Événements</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{seriesBible.plotThreads?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Fils narratifs</p>
                  </Card>
                </div>

                {/* Fils narratifs */}
                {seriesBible.plotThreads && seriesBible.plotThreads.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Fils narratifs</Label>
                    <div className="space-y-2">
                      {seriesBible.plotThreads.map((thread) => (
                        <div key={thread.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div>
                            <span className="font-medium">{thread.name}</span>
                            <p className="text-xs text-muted-foreground">{thread.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Tome {thread.introducedTome}</Badge>
                            <ArrowRight className="h-3 w-3" />
                            {thread.resolvedTome ? (
                              <Badge variant="default">Tome {thread.resolvedTome}</Badge>
                            ) : (
                              <Badge variant="secondary">{thread.status === 'ongoing' ? 'En cours' : 'Ouvert'}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

          <TabsContent value="formation" className="space-y-4">
            <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-500" />
                  Formation Complète - Créer une Série à Succès
                </CardTitle>
                <CardDescription>
                  Apprenez toutes les techniques pour créer et gérer une série de livres cohérente et captivante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/formation')}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Formation Texte</h4>
                        <p className="text-sm text-muted-foreground">Guide complet avec exemples et exercices pratiques</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/formation-audio')}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Formation Audio</h4>
                        <p className="text-sm text-muted-foreground">Écoutez les leçons en audio pour apprendre en déplacement</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Ce que vous allez apprendre :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      '📚 Structurer une série multi-tomes cohérente',
                      '👥 Créer des personnages mémorables avec des arcs narratifs',
                      '🗺️ Construire un univers riche et immersif',
                      '📈 Gérer la progression et les cliffhangers',
                      '✅ Maintenir la cohérence sur plusieurs livres',
                      '💡 Techniques des auteurs à succès',
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/formation')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                  size="lg"
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Accéder à la Formation Complète
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
