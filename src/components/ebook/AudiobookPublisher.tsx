import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Globe, Link2, Code, Copy, Check, Trash2, Headphones, ExternalLink, Eye, Loader2, ShoppingBag, Download, FileCode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { downloadAudiobookHtml } from '@/utils/generateAudiobookHtml';

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
  const [excerptFile, setExcerptFile] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [paypalLink, setPaypalLink] = useState('');
  const [stripeLink, setStripeLink] = useState('');

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
      let excerptUrl = '';
      
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

      // Upload excerpt file
      if (excerptFile) {
        const excerptPath = `${user.id}/${Date.now()}-extrait-${excerptFile.name}`;
        const { error: excerptError } = await supabase.storage
          .from('audiobooks')
          .upload(excerptPath, excerptFile);
        if (excerptError) throw excerptError;
        const { data: excerptData } = supabase.storage.from('audiobooks').getPublicUrl(excerptPath);
        excerptUrl = excerptData.publicUrl;
      }

      const slug = generateSlug(title);

      const { error } = await supabase.from('audiobooks').insert({
        user_id: user.id,
        title: title.trim(),
        author_name: author.trim() || null,
        description: description.trim() || null,
        voice_name: voiceName.trim() || null,
        audio_url: audioUrl || null,
        excerpt_url: excerptUrl || null,
        cover_url: coverUrl || null,
        is_public: isPublic,
        price: price ? parseFloat(price) : null,
        paypal_link: paypalLink.trim() || null,
        stripe_link: stripeLink.trim() || null,
        slug,
        status: audioUrl ? 'published' : 'draft'
      } as any);

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

  const exportWooCommerce = (book?: any) => {
    const books = book ? [book] : audiobooks;
    if (books.length === 0) { toast.error('Aucun audiobook à exporter'); return; }

    const escCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    
    const headers = [
      'Type','SKU','Name','Published','Is featured?','Short description','Description',
      'Regular price','Sale price','Categories','Tags','Images','Download 1 name',
      'Download 1 URL','Meta: _excerpt_audio_url','Meta: _voice_name','Meta: _duration_seconds',
      'Meta: _play_count','Meta: _embed_code','Meta: _public_page_url'
    ];

    const rows = books.map((b: any) => {
      const publicUrl = getPublicUrl(b.slug || '');
      const embedCode = getEmbedCode(b.slug || '');
      const excerptUrl = b.excerpt_url || '';
      const audioPlayerHtml = excerptUrl 
        ? `<h3>🎧 Écouter l'extrait</h3>[audio src="${excerptUrl}"]` 
        : (b.audio_url ? `<h3>🎧 Écouter un extrait</h3>[audio src="${b.audio_url}"]` : '');
      const fullDesc = (b.description || '') + '\n\n' + audioPlayerHtml;
      const shortDesc = (b.description || '').slice(0, 200) + (audioPlayerHtml ? `\n\n${audioPlayerHtml}` : '');

      return [
        'simple',                                    // Type
        `audiobook-${b.slug || b.id}`,               // SKU
        b.title,                                      // Name
        b.is_public ? '1' : '0',                     // Published
        '0',                                          // Is featured
        shortDesc,                                    // Short description
        fullDesc,                                     // Description
        b.price || '',                                // Regular price
        '',                                           // Sale price
        'Livres Audio, Audio IA',                     // Categories
        `${b.voice_name || 'Audio IA'},Livre Audio,EbookStudio`, // Tags
        b.cover_url || '',                            // Images
        b.audio_url ? 'MP3 Complet' : '',            // Download 1 name
        b.audio_url || '',                            // Download 1 URL
        excerptUrl,                                   // Meta: excerpt
        b.voice_name || '',                           // Meta: voice
        b.duration_seconds || '',                     // Meta: duration
        b.play_count || 0,                            // Meta: plays
        embedCode,                                    // Meta: embed
        publicUrl                                     // Meta: public url
      ].map(v => escCsv(String(v)));
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `woocommerce-audiobooks-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${books.length} audiobook(s) exporté(s) pour WooCommerce !`);
  };

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
                  <Label>Fichier audio complet (MP3)</Label>
                  <Input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                  {audioBlob && !audioFile && (
                    <p className="text-xs text-green-600 mt-1">✓ Audio généré détecté, sera utilisé automatiquement</p>
                  )}
                </div>
                <div>
                  <Label>Extrait audio (MP3) — aperçu sur la fiche produit</Label>
                  <Input type="file" accept="audio/*" onChange={(e) => setExcerptFile(e.target.files?.[0] || null)} />
                  <p className="text-xs text-muted-foreground mt-1">Court extrait (30s à 2min) pour donner envie d'écouter</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Prix (€)</Label>
                    <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 9.99" />
                    <p className="text-xs text-muted-foreground mt-1">Laisser vide = gratuit</p>
                  </div>
                  <div>
                    <Label>Lien PayPal</Label>
                    <Input value={paypalLink} onChange={(e) => setPaypalLink(e.target.value)} placeholder="https://paypal.me/..." />
                  </div>
                </div>
                <div>
                  <Label>Lien Stripe (page de paiement)</Label>
                  <Input value={stripeLink} onChange={(e) => setStripeLink(e.target.value)} placeholder="https://buy.stripe.com/..." />
                  <p className="text-xs text-muted-foreground mt-1">Créez un lien de paiement sur stripe.com → Liens de paiement</p>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Headphones className="h-5 w-5 text-purple-500" />
                Mes livres audio en ligne ({audiobooks.length})
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => exportWooCommerce()}>
                <ShoppingBag className="h-3.5 w-3.5" />
                Exporter WooCommerce
              </Button>
            </div>
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
                      variant="outline" size="sm" className="gap-1.5 text-xs h-7"
                      onClick={() => exportWooCommerce(book)}
                    >
                      <ShoppingBag className="h-3 w-3" />
                      WooCommerce
                    </Button>
                    <Button
                      variant="outline" size="sm" className="gap-1.5 text-xs h-7"
                      onClick={() => { downloadAudiobookHtml(book); toast.success('HTML Elementor téléchargé !'); }}
                    >
                      <FileCode className="h-3 w-3" />
                      HTML Elementor
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
