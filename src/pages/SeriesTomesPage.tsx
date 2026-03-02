import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, BookCopy, ArrowRight, Library, Loader2, FileText, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

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

interface SeriesData {
  id: string;
  title: string;
  genre: string | null;
  total_tomes: number;
  tomes: SeriesTome[];
  created_at: string;
  updated_at: string;
}

interface LinkedProject {
  id: string;
  title: string;
  project_type: string;
  tome_number: number | null;
  updated_at: string;
}

const SeriesTomesPage: React.FC = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [linkedProjects, setLinkedProjects] = useState<LinkedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [creatingTome, setCreatingTome] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [seriesRes, projectsRes] = await Promise.all([
        supabase
          .from('series_bibles')
          .select('id, title, genre, total_tomes, tomes, created_at, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('ebook_projects')
          .select('id, title, project_type, tome_number, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
      ]);

      if (seriesRes.data) {
        const parsed: SeriesData[] = seriesRes.data.map((s: any) => ({
          ...s,
          tomes: Array.isArray(s.tomes) ? s.tomes.map((t: any) => ({
            id: t.id || `tome-${t.number}`,
            number: t.number || 1,
            title: t.title || '',
            synopsis: t.synopsis || '',
            status: t.status || 'planned',
            wordCount: t.wordCount || 0,
            mainPlotPoints: Array.isArray(t.mainPlotPoints) ? t.mainPlotPoints : [],
            cliffhanger: t.cliffhanger || '',
            previousTomeConnection: t.previousTomeConnection || ''
          })) : []
        }));
        setSeries(parsed);
        if (parsed.length > 0) {
          setExpandedSeries([parsed[0].id]);
        }
      }

      if (projectsRes.data) {
        setLinkedProjects(projectsRes.data as LinkedProject[]);
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const findLinkedProject = (seriesTitle: string, tomeTitle: string, tomeNumber: number) => {
    return linkedProjects.find(p =>
      p.title?.toLowerCase().includes(tomeTitle.toLowerCase()) ||
      (p.tome_number === tomeNumber && p.title?.toLowerCase().includes(seriesTitle.toLowerCase()))
    );
  };

  const createEbookFromTome = async (seriesData: SeriesData, tome: SeriesTome) => {
    const key = `${seriesData.id}-${tome.number}`;
    setCreatingTome(key);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Check if project already exists
      const existing = findLinkedProject(seriesData.title, tome.title, tome.number);
      if (existing) {
        toast.info(`Le projet "${existing.title}" existe déjà`);
        navigate('/ebook-planner');
        return;
      }

      const chapters = Array.from({ length: 8 }, (_, i) => ({
        id: `ch-${Date.now()}-${i}`,
        title: `Chapitre ${i + 1}`,
        content: '',
        subChapters: []
      }));

      const { data, error } = await supabase
        .from('ebook_projects')
        .insert({
          user_id: user.id,
          title: tome.title || `${seriesData.title} - Tome ${tome.number}`,
          author_name: '',
          project_type: 'ebook',
          tome_number: tome.number,
          book_summary: tome.synopsis,
          preface: tome.synopsis ? `Introduction du tome ${tome.number}.\n\n${tome.synopsis}` : '',
          chapters: chapters as any,
          number_of_chapters: 8
        })
        .select('id')
        .single();

      if (error) throw error;

      toast.success(`Projet "${tome.title}" créé avec succès !`, {
        description: 'Redirigé vers le planificateur...'
      });

      await loadData();
      navigate('/ebook-planner');
    } catch (err: any) {
      toast.error('Erreur lors de la création', { description: err.message });
    } finally {
      setCreatingTome(null);
    }
  };

  const toggleSeries = (id: string) => {
    setExpandedSeries(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredSeries = selectedSeries === 'all'
    ? series
    : series.filter(s => s.id === selectedSeries);

  const totalTomes = series.reduce((sum, s) => sum + s.tomes.length, 0);
  const completedTomes = series.reduce((sum, s) => sum + s.tomes.filter(t => t.status === 'complete').length, 0);
  const linkedCount = series.reduce((sum, s) =>
    sum + s.tomes.filter(t => findLinkedProject(s.title, t.title, t.number)).length, 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            Mes Tomes de Séries
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez et créez des projets ebook pour chaque tome de vos séries
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/ebook-planner')}
          className="gap-2"
        >
          <BookCopy className="h-4 w-4" />
          Bible de Série
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{series.length}</p>
            <p className="text-xs text-muted-foreground">Séries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalTomes}</p>
            <p className="text-xs text-muted-foreground">Tomes planifiés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completedTomes}</p>
            <p className="text-xs text-muted-foreground">Terminés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{linkedCount}</p>
            <p className="text-xs text-muted-foreground">Projets créés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      {series.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filtrer :</span>
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les séries</SelectItem>
              {series.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.title} ({s.tomes.length} tomes)</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Series list */}
      {series.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookCopy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune série créée</h3>
            <p className="text-muted-foreground mb-4">
              Créez une Bible de Série dans le planificateur pour commencer à gérer vos tomes.
            </p>
            <Button onClick={() => navigate('/ebook-planner')}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une série
            </Button>
          </CardContent>
        </Card>
      ) : (
        filteredSeries.map(s => (
          <Card key={s.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSeries(s.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {s.title}
                    <Badge variant="outline" className="ml-2">{s.genre}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {s.tomes.length} tome{s.tomes.length > 1 ? 's' : ''} planifié{s.tomes.length > 1 ? 's' : ''}
                  </CardDescription>
                </div>
                {expandedSeries.includes(s.id) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>

            {expandedSeries.includes(s.id) && (
              <CardContent className="space-y-3 pt-0">
                {s.tomes
                  .sort((a, b) => a.number - b.number)
                  .map(tome => {
                    const linked = findLinkedProject(s.title, tome.title, tome.number);
                    const isCreating = creatingTome === `${s.id}-${tome.number}`;

                    return (
                      <div
                        key={tome.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                      >
                        {/* Tome number badge */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {tome.number}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground truncate">{tome.title || `Tome ${tome.number}`}</h4>
                            <Badge variant={
                              tome.status === 'complete' ? 'default' :
                              tome.status === 'writing' ? 'secondary' : 'outline'
                            } className="shrink-0 text-xs">
                              {tome.status === 'complete' ? '✅ Terminé' :
                               tome.status === 'writing' ? '✍️ En cours' : '📋 Planifié'}
                            </Badge>
                            {linked && (
                              <Badge variant="secondary" className="shrink-0 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <FileText className="h-3 w-3 mr-1" />
                                Projet créé
                              </Badge>
                            )}
                          </div>
                          {tome.synopsis && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{tome.synopsis}</p>
                          )}
                          {tome.mainPlotPoints.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tome.mainPlotPoints.slice(0, 3).map((point, i) => (
                                <Badge key={i} variant="outline" className="text-xs font-normal">
                                  {point.length > 40 ? point.substring(0, 40) + '...' : point}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {tome.wordCount > 0 && (
                            <div className="mt-2">
                              <Progress value={(tome.wordCount / 50000) * 100} className="h-1.5" />
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {tome.wordCount.toLocaleString()} / 50 000 mots
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0">
                          {linked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate('/ebook-planner')}
                              className="gap-1"
                            >
                              <ArrowRight className="h-4 w-4" />
                              Ouvrir
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => createEbookFromTome(s, tome)}
                              disabled={isCreating}
                              className="gap-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                            >
                              {isCreating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                              Créer projet
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default SeriesTomesPage;
