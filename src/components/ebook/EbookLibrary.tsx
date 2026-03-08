import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  BookOpen, Headphones, Search, Download, Trash2, FolderOpen,
  Calendar, FileText, Music, RefreshCw, Eye, Clock, Filter
} from 'lucide-react';

interface LibraryProject {
  id: string;
  title: string;
  author_name: string | null;
  project_type: string | null;
  created_at: string;
  updated_at: string;
  chapters: any[] | null;
  preface: string | null;
  conclusion: string | null;
  kdp_keywords: string | null;
  kdp_categories: string | null;
}

interface LibraryAudiobook {
  id: string;
  title: string;
  author_name: string | null;
  audio_url: string | null;
  cover_url: string | null;
  status: string;
  created_at: string;
  duration_seconds: number | null;
  voice_name: string | null;
  is_public: boolean;
  play_count: number;
}

interface EbookLibraryProps {
  onLoadProject?: (project: any) => void;
}

export const EbookLibrary: React.FC<EbookLibraryProps> = ({ onLoadProject }) => {
  const [projects, setProjects] = useState<LibraryProject[]>([]);
  const [audiobooks, setAudiobooks] = useState<LibraryAudiobook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [activeTab, setActiveTab] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; type: 'ebook' | 'audio' } | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        toast.error('⚠️ Vous devez être connecté pour accéder à votre bibliothèque');
        return;
      }
      setIsAuthenticated(true);
      console.log('📚 [Library] Chargement pour user:', user.id);

      const [ebooksRes, audioRes] = await Promise.all([
        supabase.from('ebook_projects').select('id, title, author_name, project_type, created_at, updated_at, chapters, preface, conclusion, kdp_keywords, kdp_categories')
          .eq('user_id', user.id).order('updated_at', { ascending: false }).limit(100),
        supabase.from('audiobooks').select('*')
          .eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
      ]);

      console.log('📚 [Library] Résultats:', { ebooks: ebooksRes.data?.length, audio: audioRes.data?.length, ebookError: ebooksRes.error, audioError: audioRes.error });
      
      if (ebooksRes.error) { console.error('❌ Ebook fetch error:', ebooksRes.error); toast.error('Erreur chargement ebooks: ' + ebooksRes.error.message); }
      if (audioRes.error) { console.error('❌ Audio fetch error:', audioRes.error); toast.error('Erreur chargement audio: ' + audioRes.error.message); }

      if (ebooksRes.data) setProjects(ebooksRes.data as any);
      if (audioRes.data) setAudiobooks(audioRes.data);
    } catch (e) {
      console.error('Library fetch error:', e);
      toast.error('Erreur de chargement de la bibliothèque');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const getWordCount = (p: LibraryProject) => {
    let words = 0;
    const count = (t: string | null) => t ? t.split(/\s+/).filter(w => w).length : 0;
    words += count(p.preface) + count(p.conclusion);
    if (Array.isArray(p.chapters)) {
      p.chapters.forEach((ch: any) => {
        words += count(ch.content);
        if (Array.isArray(ch.subChapters || ch.subchapters)) {
          (ch.subChapters || ch.subchapters).forEach((s: any) => { words += count(s.content); });
        }
      });
    }
    return words;
  };

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || (p.author_name || '').toLowerCase().includes(q) || (p.kdp_keywords || '').toLowerCase().includes(q));
    }
    return list.sort((a, b) => sortBy === 'title' ? a.title.localeCompare(b.title) : new Date(b[sortBy as keyof LibraryProject] as string).getTime() - new Date(a[sortBy as keyof LibraryProject] as string).getTime());
  }, [projects, searchQuery, sortBy]);

  const filteredAudiobooks = useMemo(() => {
    if (!searchQuery) return audiobooks;
    const q = searchQuery.toLowerCase();
    return audiobooks.filter(a => a.title.toLowerCase().includes(q) || (a.author_name || '').toLowerCase().includes(q));
  }, [audiobooks, searchQuery]);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    const table = deleteDialog.type === 'ebook' ? 'ebook_projects' : 'audiobooks';
    const { error } = await supabase.from(table).delete().eq('id', deleteDialog.id);
    if (error) { toast.error('Erreur de suppression'); } else { toast.success('Supprimé'); fetchAll(); }
    setDeleteDialog(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDuration = (s: number | null) => s ? `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}` : '--:--';

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <FolderOpen className="h-12 w-12 text-muted-foreground opacity-50" />
        <p className="text-lg font-medium">Connexion requise</p>
        <p className="text-sm text-muted-foreground">Connectez-vous pour retrouver vos ebooks et livres audio sauvegardés.</p>
        <Button onClick={fetchAll}><RefreshCw className="h-4 w-4 mr-2" /> Réessayer</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Chargement de la bibliothèque...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-primary" />
            📚 Ma Bibliothèque
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} ebook(s) • {audiobooks.length} livre(s) audio
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">📅 Dernière modif</SelectItem>
              <SelectItem value="created_at">🕐 Date création</SelectItem>
              <SelectItem value="title">🔤 Titre A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAll}><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">📚 Tout ({projects.length + audiobooks.length})</TabsTrigger>
          <TabsTrigger value="ebooks">📖 Ebooks ({projects.length})</TabsTrigger>
          <TabsTrigger value="audio">🎧 Audio ({audiobooks.length})</TabsTrigger>
        </TabsList>

        {/* Ebooks */}
        <TabsContent value="all" className="space-y-4">
          {filteredProjects.length === 0 && filteredAudiobooks.length === 0 && (
            <Card className="border-dashed"><CardContent className="py-10 text-center text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Bibliothèque vide</p>
              <p className="text-sm">Créez votre premier ebook pour le retrouver ici.</p>
            </CardContent></Card>
          )}
          {filteredProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><BookOpen className="h-5 w-5" /> Ebooks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProjects.map(p => (
                  <ProjectCard key={p.id} project={p} wordCount={getWordCount(p)} onLoad={() => onLoadProject?.(p)} onDelete={() => setDeleteDialog({ open: true, id: p.id, type: 'ebook' })} formatDate={formatDate} />
                ))}
              </div>
            </div>
          )}
          {filteredAudiobooks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Headphones className="h-5 w-5" /> Livres Audio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAudiobooks.map(a => (
                  <AudioCard key={a.id} audiobook={a} onDelete={() => setDeleteDialog({ open: true, id: a.id, type: 'audio' })} formatDate={formatDate} formatDuration={formatDuration} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ebooks">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map(p => (
              <ProjectCard key={p.id} project={p} wordCount={getWordCount(p)} onLoad={() => onLoadProject?.(p)} onDelete={() => setDeleteDialog({ open: true, id: p.id, type: 'ebook' })} formatDate={formatDate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAudiobooks.map(a => (
              <AudioCard key={a.id} audiobook={a} onDelete={() => setDeleteDialog({ open: true, id: a.id, type: 'audio' })} formatDate={formatDate} formatDuration={formatDuration} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete dialog */}
      <Dialog open={!!deleteDialog?.open} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent><DialogHeader><DialogTitle>Supprimer ?</DialogTitle><DialogDescription>Cette action est irréversible.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-1" /> Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-components
const ProjectCard: React.FC<{
  project: LibraryProject; wordCount: number; onLoad: () => void; onDelete: () => void; formatDate: (d: string) => string;
}> = ({ project, wordCount, onLoad, onDelete, formatDate }) => {
  const chapterCount = Array.isArray(project.chapters) ? project.chapters.length : 0;
  const typeLabel = project.project_type === 'atlas' ? '🗺️ Atlas' : project.project_type === 'coloring' ? '🎨 Coloriage' : project.project_type === 'comic' ? '💬 BD' : '📚 Ebook';

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base line-clamp-2">{project.title || 'Sans titre'}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">{typeLabel}</Badge>
        </div>
        {project.author_name && <p className="text-sm text-muted-foreground">par {project.author_name}</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{chapterCount} ch.</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{wordCount.toLocaleString()} mots</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(project.updated_at)}</span>
        </div>
        {project.kdp_keywords && (
          <div className="flex flex-wrap gap-1">
            {project.kdp_keywords.split(',').slice(0, 3).map((k, i) => (
              <Badge key={i} variant="outline" className="text-xs">{k.trim()}</Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={onLoad}><Eye className="h-3 w-3 mr-1" /> Ouvrir</Button>
          <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AudioCard: React.FC<{
  audiobook: LibraryAudiobook; onDelete: () => void; formatDate: (d: string) => string; formatDuration: (s: number | null) => string;
}> = ({ audiobook, onDelete, formatDate, formatDuration }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-base line-clamp-2">{audiobook.title}</CardTitle>
        <Badge variant={audiobook.status === 'published' ? 'default' : 'secondary'} className="text-xs">
          {audiobook.status === 'published' ? '✅ Publié' : '📝 Brouillon'}
        </Badge>
      </div>
      {audiobook.author_name && <p className="text-sm text-muted-foreground">par {audiobook.author_name}</p>}
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(audiobook.duration_seconds)}</span>
        <span className="flex items-center gap-1"><Music className="h-3 w-3" />{audiobook.voice_name || 'Voix par défaut'}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(audiobook.created_at)}</span>
        <span className="flex items-center gap-1">▶ {audiobook.play_count} écoutes</span>
      </div>
      <div className="flex gap-2">
        {audiobook.audio_url && (
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <a href={audiobook.audio_url} download><Download className="h-3 w-3 mr-1" /> Télécharger</a>
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </CardContent>
  </Card>
);

export default EbookLibrary;
