import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Globe, Link2, Code, Copy, Check, Trash2, Headphones, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AudiobookPublisherProps {
  ebookTitle?: string;
  authorName?: string;
  audioBlob?: Blob | null;
  coverUrl?: string;
}

export const AudiobookPublisher: React.FC<AudiobookPublisherProps> = ({
  ebookTitle = '',
  authorName = '',
  audioBlob,
  coverUrl
}) => {
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(ebookTitle);
  const [author, setAuthor] = useState(authorName);
  const [description, setDescription] = useState('');
  const [voiceName, setVoiceName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAudiobooks();
  }, []);

  useEffect(() => {
    setTitle(ebookTitle);
    setAuthor(authorName);
  }, [ebookTitle, authorName]);

  const fetchAudiobooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('audiobooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setAudiobooks(data);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60) + '-' + Math.random().toString(36).substring(2, 8);
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setUploading(true);
    try {
      let audioUrl = '';
      
      // Upload audio file
      const fileToUpload = audioFile || (audioBlob ? new File([audioBlob], 'audiobook.mp3', { type: 'audio/mpeg' }) : null);
      
      if (fileToUpload) {
        const filePath = `${user.id}/${Date.now()}-${fileToUpload.name}`;
        const { error: uploadError } = await supabase.storage
          .from('audiobooks')
          .upload(filePath, fileToUpload);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('audiobooks').getPublicUrl(filePath);
        audioUrl = urlData.publicUrl;
      }

      const slug = generateSlug(title);

      const { error } = await supabase.from('audiobooks').insert({
        user_id: user.id,
        title: title.trim(),
        author_name: author.trim() || null,
        description: description.trim() || null,
        voice_name: voiceName.trim() || null,
        audio_url: audioUrl || null,
        cover_url: coverUrl || null,
        is_public: isPublic,
        slug,
        status: audioUrl ? 'published' : 'draft'
      });

      if (error) throw error;
      
      toast.success('Livre audio publié avec succès !');
      setShowPublish(false);
      setAudioFile(null);
      setDescription('');
      setVoiceName('');
      fetchAudiobooks();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const togglePublic = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('audiobooks').update({ is_public: !currentStatus }).eq('id', id);
    if (!error) {
      toast.success(!currentStatus ? 'Livre audio rendu public' : 'Livre audio rendu privé');
      fetchAudiobooks();
    }
  };

  const deleteAudiobook = async (id: string) => {
    const { error } = await supabase.from('audiobooks').delete().eq('id', id);
    if (!error) {
      toast.success('Livre audio supprimé');
      fetchAudiobooks();
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copié !');
    setTimeout(() => setCopied(null), 2000);
  };

  const getPublicUrl = (slug: string) => `${window.location.origin}/audiobook/${slug}`;
  const getEmbedCode = (slug: string) => `<iframe src="${window.location.origin}/audiobook-embed/${slug}" width="100%" height="180" frameborder="0" allow="autoplay" style="border-radius: 12px;"></iframe>`;

  return (
    <div className="space-y-4">
      {/* Publish button */}
      <Card className="border-2 border-dashed border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-violet-500/5">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Publier un livre audio en ligne</p>
              <p className="text-xs text-muted-foreground">Hébergement gratuit avec page publique et lecteur intégrable</p>
            </div>
          </div>
          <Dialog open={showPublish} onOpenChange={setShowPublish}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                <Upload className="h-4 w-4" />
                Publier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-purple-500" />
                  Publier un livre audio
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Titre *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du livre audio" />
                </div>
                <div>
                  <Label>Auteur</Label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nom de l'auteur" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description courte..." rows={3} />
                </div>
                <div>
                  <Label>Voix utilisée</Label>
                  <Input value={voiceName} onChange={(e) => setVoiceName(e.target.value)} placeholder="Ex: Sarah, Roger..." />
                </div>
                <div>
                  <Label>Fichier audio (MP3)</Label>
                  <Input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                  {audioBlob && !audioFile && (
                    <p className="text-xs text-green-600 mt-1">✓ Audio généré détecté, sera utilisé automatiquement</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="is-public" checked={isPublic} onCheckedChange={(v) => setIsPublic(!!v)} />
                  <Label htmlFor="is-public">Page publique (visible par tous)</Label>
                </div>
                <Button onClick={handlePublish} disabled={uploading} className="w-full gap-2 bg-gradient-to-r from-purple-500 to-violet-600">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Publication en cours...' : 'Publier le livre audio'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* List of published audiobooks */}
      {audiobooks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Headphones className="h-5 w-5 text-purple-500" />
              Mes livres audio en ligne ({audiobooks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audiobooks.map((book) => (
              <div key={book.id} className="p-3 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm truncate">{book.title}</p>
                      <Badge variant={book.is_public ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                        {book.is_public ? '🌐 Public' : '🔒 Privé'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {book.play_count || 0} écoutes
                      </Badge>
                    </div>
                    {book.author_name && <p className="text-xs text-muted-foreground">{book.author_name}</p>}
                  </div>
                </div>

                {book.is_public && book.slug && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline" size="sm" className="gap-1.5 text-xs h-7"
                      onClick={() => window.open(getPublicUrl(book.slug), '_blank')}
                    >
                      <Eye className="h-3 w-3" />
                      Voir la page
                    </Button>
                    <Button
                      variant="outline" size="sm" className="gap-1.5 text-xs h-7"
                      onClick={() => copyToClipboard(getPublicUrl(book.slug), `link-${book.id}`)}
                    >
                      {copied === `link-${book.id}` ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
                      Copier le lien
                    </Button>
                    <Button
                      variant="outline" size="sm" className="gap-1.5 text-xs h-7"
                      onClick={() => copyToClipboard(getEmbedCode(book.slug), `embed-${book.id}`)}
                    >
                      {copied === `embed-${book.id}` ? <Check className="h-3 w-3" /> : <Code className="h-3 w-3" />}
                      Code embed
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="gap-1.5 text-xs h-7"
                      onClick={() => togglePublic(book.id, book.is_public)}
                    >
                      {book.is_public ? '🔒 Rendre privé' : '🌐 Rendre public'}
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="gap-1.5 text-xs h-7 text-destructive hover:text-destructive"
                      onClick={() => deleteAudiobook(book.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudiobookPublisher;
