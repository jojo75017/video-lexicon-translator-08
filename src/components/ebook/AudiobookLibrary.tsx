import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Headphones, Search, Download, Trash2, Play,
  Calendar, Music, RefreshCw, Clock, Volume2, Globe, Lock
} from 'lucide-react';

interface LibraryAudiobook {
  id: string;
  title: string;
  author_name: string | null;
  audio_url: string | null;
  cover_url: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  duration_seconds: number | null;
  voice_name: string | null;
  is_public: boolean;
  play_count: number;
  slug: string | null;
}

export const AudiobookLibrary: React.FC = () => {
  const [audiobooks, setAudiobooks] = useState<LibraryAudiobook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string } | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioRef] = useState(() => new Audio());

  const fetchAudiobooks = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Connectez-vous pour voir vos livres audio');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('audiobooks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Audiobook fetch error:', error);
        toast.error('Erreur de chargement: ' + error.message);
      }

      if (data) setAudiobooks(data);
    } catch (e) {
      console.error('Audiobook library error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAudiobooks(); }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => { audioRef.pause(); audioRef.src = ''; };
  }, []);

  const filtered = useMemo(() => {
    let list = audiobooks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.author_name || '').toLowerCase().includes(q) ||
        (a.voice_name || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) =>
      sortBy === 'title'
        ? a.title.localeCompare(b.title)
        : new Date(b[sortBy as keyof LibraryAudiobook] as string).getTime() - new Date(a[sortBy as keyof LibraryAudiobook] as string).getTime()
    );
  }, [audiobooks, searchQuery, sortBy]);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    const { error } = await supabase.from('audiobooks').delete().eq('id', deleteDialog.id);
    if (error) toast.error('Erreur de suppression');
    else { toast.success('Livre audio supprimé'); fetchAudiobooks(); }
    setDeleteDialog(null);
  };

  const togglePlay = (audiobook: LibraryAudiobook) => {
    if (!audiobook.audio_url) return;
    if (playingId === audiobook.id) {
      audioRef.pause();
      setPlayingId(null);
    } else {
      audioRef.src = audiobook.audio_url;
      audioRef.play();
      setPlayingId(audiobook.id);
      audioRef.onended = () => setPlayingId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDuration = (s: number | null) => {
    if (!s) return '--:--';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}h${m.toString().padStart(2, '0')}m`
      : `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Chargement des livres audio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            🎧 Mes Livres Audio
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {audiobooks.length} livre(s) audio sauvegardé(s)
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un livre audio..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-64" />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">🕐 Date création</SelectItem>
              <SelectItem value="updated_at">📅 Dernière modif</SelectItem>
              <SelectItem value="title">🔤 Titre A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAudiobooks}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Headphones className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">Aucun livre audio</p>
            <p className="text-sm mt-2">
              {searchQuery
                ? 'Aucun résultat pour cette recherche.'
                : 'Créez votre premier livre audio via l\'onglet 🎙️ Livre Audio ou ⚡ Audio Express.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(audiobook => (
          <Card key={audiobook.id} className="hover:shadow-lg transition-shadow group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base line-clamp-2 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-primary shrink-0" />
                  {audiobook.title}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {audiobook.is_public ? (
                    <Badge variant="default" className="text-xs"><Globe className="h-3 w-3 mr-1" /> Public</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs"><Lock className="h-3 w-3 mr-1" /> Privé</Badge>
                  )}
                </div>
              </div>
              {audiobook.author_name && (
                <p className="text-sm text-muted-foreground">par {audiobook.author_name}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {audiobook.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{audiobook.description}</p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{formatDuration(audiobook.duration_seconds)}
                </span>
                <span className="flex items-center gap-1">
                  <Music className="h-3 w-3" />{audiobook.voice_name || 'Voix par défaut'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />{formatDate(audiobook.created_at)}
                </span>
                <span className="flex items-center gap-1">▶ {audiobook.play_count} écoutes</span>
              </div>

              {/* Status */}
              <Badge variant={audiobook.status === 'published' ? 'default' : 'outline'} className="text-xs">
                {audiobook.status === 'published' ? '✅ Publié' : audiobook.status === 'processing' ? '⏳ En cours' : '📝 Brouillon'}
              </Badge>

              {/* Actions */}
              <div className="flex gap-2">
                {audiobook.audio_url && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => togglePlay(audiobook)} className="flex-1">
                      {playingId === audiobook.id ? (
                        <><Volume2 className="h-3 w-3 mr-1 animate-pulse" /> Pause</>
                      ) : (
                        <><Play className="h-3 w-3 mr-1" /> Écouter</>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={audiobook.audio_url} download={`${audiobook.title}.mp3`}>
                        <Download className="h-3 w-3" />
                      </a>
                    </Button>
                  </>
                )}
                <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, id: audiobook.id })}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteDialog?.open} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce livre audio ?</DialogTitle>
            <DialogDescription>Cette action est irréversible. Le fichier MP3 sera également supprimé.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AudiobookLibrary;
