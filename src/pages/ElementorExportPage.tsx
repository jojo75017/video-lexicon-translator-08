import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Check, Download, Code, Headphones, ArrowLeft, Eye, Upload, Save, Image, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateAudiobookHtml } from '@/utils/generateAudiobookHtml';

const ElementorExportPage = () => {
  const navigate = useNavigate();
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authMissing, setAuthMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editPrice, setEditPrice] = useState('');
  const [editPaypal, setEditPaypal] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) { setAuthMissing(true); setAudiobooks([]); return; }
        const { data, error } = await supabase.from('audiobooks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (error) throw error;
        setAuthMissing(false); setAudiobooks(data || []);
      } catch (error: any) { console.error('Elementor fetch error:', error); toast.error('Impossible de charger vos audiobooks'); } finally { setLoading(false); }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      setEditPrice(selectedBook.price != null ? String(selectedBook.price) : '');
      setEditPaypal(selectedBook.paypal_link || '');
      setEditCoverUrl(selectedBook.cover_url || '');
    }
  }, [selectedBook?.id]);

  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h${m}min` : `${m}min`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBook) return;
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { toast.error('Vous devez être connecté'); return; }
      const ext = file.name.split('.').pop();
      const path = `${session.user.id}/covers/${selectedBook.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('audiobooks').upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('audiobooks').getPublicUrl(path);
      const { error: updateError } = await supabase.from('audiobooks').update({ cover_url: publicUrl }).eq('id', selectedBook.id);
      if (updateError) throw updateError;
      setEditCoverUrl(publicUrl);
      const updated = { ...selectedBook, cover_url: publicUrl };
      setSelectedBook(updated);
      setAudiobooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.success('Image de couverture uploadée ✅');
    } catch (err: any) { console.error('Upload error:', err); toast.error('Erreur upload: ' + err.message); } finally { setUploading(false); }
  };

  const handleSaveMetadata = async () => {
    if (!selectedBook) return;
    setSaving(true);
    try {
      const parsedPrice = editPrice.trim() ? Number.parseFloat(editPrice) : null;
      if (editPrice.trim() && Number.isNaN(parsedPrice)) { toast.error('Prix invalide'); setSaving(false); return; }
      const { error } = await supabase.from('audiobooks').update({ price: parsedPrice, paypal_link: editPaypal.trim() || null, cover_url: editCoverUrl.trim() || null }).eq('id', selectedBook.id);
      if (error) throw error;
      const updated = { ...selectedBook, price: parsedPrice, paypal_link: editPaypal.trim() || null, cover_url: editCoverUrl.trim() || null };
      setSelectedBook(updated);
      setAudiobooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.success('Fiche mise à jour ✅');
    } catch (err: any) { toast.error('Erreur: ' + err.message); } finally { setSaving(false); }
  };

  const generateElementorHtml = (book: any) => {
    return generateAudiobookHtml({ title: book.title, author_name: book.author_name, voice_name: book.voice_name, description: book.description, cover_url: book.cover_url, price: book.price, paypal_link: book.paypal_link, stripe_link: book.stripe_link, excerpt_url: book.excerpt_url, audio_url: book.audio_url, duration_seconds: book.duration_seconds, play_count: book.play_count, created_at: book.created_at, slug: book.slug });
  };

  const slugifyTitle = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

  const ensureBookPublicForExport = async (book: any) => {
    if (book.slug && book.is_public) return book;
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) { toast.error('Vous devez être connecté pour publier la fiche.'); return null; }
    const fallbackSlugBase = slugifyTitle(book.title || 'audiobook') || 'audiobook';
    const fallbackSlug = `${fallbackSlugBase}-${book.id.slice(0, 8)}`;
    const { data, error } = await supabase.from('audiobooks').update({ is_public: true, slug: book.slug || fallbackSlug }).eq('id', book.id).eq('user_id', userId).select('*').single();
    if (error) { console.error('Elementor publish error:', error); toast.error('Impossible de publier ce livre pour la fiche Elementor.'); return null; }
    setAudiobooks((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    setSelectedBook(data);
    toast.success('Livre publié pour la fiche Elementor ✅');
    return data;
  };

  const handleCopy = async () => {
    if (!selectedBook) return;
    const exportableBook = await ensureBookPublicForExport(selectedBook);
    if (!exportableBook) return;
    navigator.clipboard.writeText(generateElementorHtml(exportableBook));
    setCopied(true);
    toast.success('HTML copié ! Collez-le dans un widget HTML Elementor.');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = async () => {
    if (!selectedBook) return;
    const exportableBook = await ensureBookPublicForExport(selectedBook);
    if (!exportableBook) return;
    const html = generateElementorHtml(exportableBook);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${exportableBook.slug || 'audiobook'}-elementor.html`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Fichier HTML téléchargé !');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-lg">Export Elementor</h1>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/30">HTML</Badge>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            Sélectionnez un audiobook, configurez l'image / prix / PayPal, puis copiez le code HTML dans un widget <strong className="text-foreground">HTML personnalisé</strong> d'Elementor.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Vos audiobooks</h2>
            {loading ? (
              <div className="text-muted-foreground text-sm animate-pulse">Chargement...</div>
            ) : authMissing ? (
              <Card className="bg-card border-border p-4">
                <p className="text-muted-foreground text-sm">Vous devez être connecté à votre compte pour voir les audiobooks sauvegardés.</p>
              </Card>
            ) : audiobooks.length === 0 ? (
              <Card className="bg-card border-border p-4">
                <p className="text-muted-foreground text-sm">Aucun audiobook trouvé. Allez dans le Générateur Audio et cliquez sur "Exporter en MP3" ou "Fusionner" pour sauvegarder un livre dans votre bibliothèque.</p>
              </Card>
            ) : audiobooks.map((book) => (
              <Card 
                key={book.id}
                className={`bg-card border cursor-pointer transition-all hover:border-primary/30 ${
                  selectedBook?.id === book.id ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
                }`}
                onClick={() => setSelectedBook(book)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author_name || 'Sans auteur'}</p>
                    {book.price ? (
                      <p className="text-xs text-primary font-medium">{Number(book.price).toFixed(2)} €</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pas de prix</p>
                    )}
                  </div>
                  {selectedBook?.id === book.id && (
                    <Check className="w-4 h-4 text-primary ml-auto flex-shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {selectedBook ? (
              <>
                <Card className="bg-card border-primary/20 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-primary flex items-center gap-2">
                      ⚙️ Configurer la fiche produit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5" /> Image de couverture
                      </label>
                      <div className="flex gap-2 items-center">
                        {editCoverUrl && (
                          <img src={editCoverUrl} alt="Cover" className="w-14 h-14 rounded-lg object-cover border border-border" />
                        )}
                        <div className="flex-1 flex gap-2">
                          <Input placeholder="URL de l'image ou uploadez →" value={editCoverUrl} onChange={e => setEditCoverUrl(e.target.value)} className="text-sm" />
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            {uploading ? 'Upload...' : 'Uploader'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" /> Prix (€)
                        </label>
                        <Input type="number" min="0" step="0.01" placeholder="9.99" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
                          💳 Lien PayPal
                        </label>
                        <Input placeholder="https://paypal.me/..." value={editPaypal} onChange={e => setEditPaypal(e.target.value)} className="text-sm" />
                      </div>
                    </div>

                    <Button onClick={handleSaveMetadata} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl gap-2 w-full">
                      <Save className="w-4 h-4" />
                      {saving ? 'Enregistrement...' : 'Enregistrer la fiche'}
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-3 flex-wrap">
                  <Button onClick={handleCopy} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl gap-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copié !' : 'Copier le HTML'}
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="rounded-xl gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger .html
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      const exportableBook = await ensureBookPublicForExport(selectedBook);
                      if (!exportableBook?.slug) return;
                      window.open(`/audiobook/${exportableBook.slug}`, '_blank');
                    }}
                    className="rounded-xl gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir la page publique
                  </Button>
                </div>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-foreground flex items-center gap-2">
                      📋 Comment utiliser dans Elementor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="text-foreground font-medium">1.</span> Configurez l'image, le prix et le lien PayPal ci-dessus</p>
                    <p><span className="text-foreground font-medium">2.</span> Copiez le code HTML ci-dessous</p>
                    <p><span className="text-foreground font-medium">3.</span> Dans Elementor, ajoutez un widget <strong className="text-primary">HTML</strong></p>
                    <p><span className="text-foreground font-medium">4.</span> Collez le code dans le champ HTML du widget</p>
                    <p><span className="text-foreground font-medium">5.</span> Publiez votre page — c'est prêt !</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">Code HTML</CardTitle>
                    <Badge className="bg-muted text-muted-foreground border-border text-xs">{generateElementorHtml(selectedBook).length} caractères</Badge>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted border border-border rounded-lg p-4 overflow-auto max-h-[400px] text-xs text-muted-foreground font-mono leading-relaxed">
                      {generateElementorHtml(selectedBook)}
                    </pre>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Aperçu du rendu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: generateElementorHtml(selectedBook) }} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-card border-border border-dashed flex items-center justify-center min-h-[300px]">
                <div className="text-center p-8">
                  <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez un audiobook</h3>
                  <p className="text-muted-foreground text-sm">Choisissez un livre audio à gauche pour configurer et générer le code HTML Elementor</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementorExportPage;
