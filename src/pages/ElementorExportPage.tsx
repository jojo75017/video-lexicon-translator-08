import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Check, Download, Code, Headphones, ArrowLeft, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ElementorExportPage = () => {
  const navigate = useNavigate();
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('audiobooks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setAudiobooks(data || []);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h${m}min` : `${m}min`;
  };

  const generateElementorHtml = (book: any) => {
    const origin = window.location.origin;
    const publicUrl = `${origin}/audiobook/${book.slug}`;
    const embedUrl = `${origin}/audiobook-embed/${book.slug}`;
    const price = book.price ? `${Number(book.price).toFixed(2)} €` : 'Gratuit';
    const desc = (book.description || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const descShort = desc.slice(0, 300) + (desc.length > 300 ? '...' : '');

    return `<!-- ========================================
     FICHE PRODUIT AUDIOBOOK - ELEMENTOR
     Copiez ce code dans un widget HTML Elementor
     ======================================== -->

<style>
.eb-audiobook-card {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #fff;
  border-radius: 20px;
  overflow: hidden;
  max-width: 900px;
  margin: 30px auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.eb-audiobook-hero {
  position: relative;
  padding: 40px;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.eb-audiobook-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(249, 115, 22, 0.05) 100%);
  pointer-events: none;
}
.eb-cover-wrap {
  width: 220px;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}
.eb-cover-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.eb-cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d97706, #ea580c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.5);
}
.eb-info {
  flex: 1;
  min-width: 250px;
  position: relative;
  z-index: 1;
}
.eb-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 5px 14px;
  border-radius: 50px;
  margin-bottom: 12px;
}
.eb-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 8px 0;
  color: #fff;
}
.eb-author {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}
.eb-author span {
  color: #f59e0b;
  font-weight: 500;
}
.eb-stars {
  color: #f59e0b;
  font-size: 16px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.eb-stars .count {
  color: rgba(245, 158, 11, 0.7);
  font-size: 13px;
}
.eb-price {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  margin: 16px 0;
}
.eb-price .old {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: line-through;
  margin-left: 10px;
  font-weight: 400;
}
.eb-price .free-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 14px;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 50px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.eb-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 36px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);
}
.eb-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(245, 158, 11, 0.35);
  color: #fff;
}

/* Player embed */
.eb-player-section {
  padding: 0 40px 32px;
}
.eb-player-section h3 {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.eb-player-iframe {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Description & Meta */
.eb-body {
  padding: 0 40px 32px;
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.eb-desc {
  flex: 1;
  min-width: 250px;
}
.eb-desc h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}
.eb-desc p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  font-size: 14px;
}
.eb-meta-card {
  width: 240px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
}
.eb-meta-card h4 {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.eb-meta-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}
.eb-meta-row .label {
  color: rgba(255, 255, 255, 0.35);
}
.eb-meta-row .value {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Footer */
.eb-footer {
  text-align: center;
  padding: 16px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .eb-audiobook-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 28px 20px;
  }
  .eb-cover-wrap { width: 180px; height: 180px; }
  .eb-title { font-size: 22px; }
  .eb-stars { justify-content: center; }
  .eb-body { flex-direction: column; padding: 0 20px 24px; }
  .eb-meta-card { width: 100%; }
  .eb-player-section { padding: 0 20px 24px; }
}
</style>

<div class="eb-audiobook-card">
  <!-- HERO -->
  <div class="eb-audiobook-hero">
    <div class="eb-cover-wrap">
      ${book.cover_url 
        ? `<img src="${book.cover_url}" alt="${book.title}" />`
        : `<div class="eb-cover-placeholder">🎧</div>`
      }
    </div>
    <div class="eb-info">
      <div class="eb-badge">📖 Livre Audio</div>
      <h2 class="eb-title">${book.title}</h2>
      ${book.author_name ? `<p class="eb-author">De <span>${book.author_name}</span></p>` : ''}
      ${book.voice_name ? `<p class="eb-author">Lu par <span>${book.voice_name}</span></p>` : ''}
      <div class="eb-stars">
        <span style="font-weight:700;font-size:18px;color:#fff">4.7</span>
        ★★★★☆
        <span class="count">${book.play_count || 0} écoutes</span>
      </div>
      <div class="eb-price">
        ${book.price && book.price > 0 
          ? `${price}<span class="old">${(Number(book.price) * 1.5).toFixed(2)} €</span>` 
          : `<span class="free-badge">✓ GRATUIT</span>`
        }
      </div>
      <a href="${publicUrl}" class="eb-cta" target="_blank" rel="noopener">
        🎧 Écouter maintenant
      </a>
    </div>
  </div>

  <!-- PLAYER EMBED -->
  ${book.slug ? `
  <div class="eb-player-section">
    <h3>🎵 Extrait audio</h3>
    <div class="eb-player-iframe">
      <iframe src="${embedUrl}" width="100%" height="140" frameborder="0" allow="autoplay" style="border-radius:12px;display:block"></iframe>
    </div>
  </div>
  ` : ''}

  <!-- DESCRIPTION & META -->
  <div class="eb-body">
    <div class="eb-desc">
      <h3>À propos</h3>
      <p>${descShort || 'Découvrez ce livre audio créé avec EbookStudio Pro.'}</p>
    </div>
    <div class="eb-meta-card">
      <h4>Détails</h4>
      ${book.author_name ? `<div class="eb-meta-row"><span class="label">Auteur</span><span class="value">${book.author_name}</span></div>` : ''}
      ${book.voice_name ? `<div class="eb-meta-row"><span class="label">Narrateur</span><span class="value">${book.voice_name}</span></div>` : ''}
      <div class="eb-meta-row"><span class="label">Durée</span><span class="value">${formatDuration(book.duration_seconds)}</span></div>
      <div class="eb-meta-row"><span class="label">Format</span><span class="value">MP3 HD</span></div>
      <div class="eb-meta-row"><span class="label">Langue</span><span class="value">Français</span></div>
      <div class="eb-meta-row"><span class="label">Qualité</span><span class="value">192 kbps</span></div>
      <div class="eb-meta-row"><span class="label">Écoutes</span><span class="value">${book.play_count || 0}</span></div>
    </div>
  </div>

  <div class="eb-footer">Propulsé par EbookStudio Pro • Audio IA Premium</div>
</div>`;
  };

  const handleCopy = () => {
    if (!selectedBook) return;
    navigator.clipboard.writeText(generateElementorHtml(selectedBook));
    setCopied(true);
    toast.success('HTML copié ! Collez-le dans un widget HTML Elementor.');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    if (!selectedBook) return;
    const html = generateElementorHtml(selectedBook);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedBook.slug || 'audiobook'}-elementor.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Fichier HTML téléchargé !');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            <h1 className="font-bold text-lg">Export Elementor</h1>
          </div>
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">HTML</Badge>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-slate-400 text-sm">
            Sélectionnez un audiobook puis copiez le code HTML dans un widget <strong className="text-white">HTML personnalisé</strong> d'Elementor.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Book list */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Vos audiobooks</h2>
            {loading ? (
              <div className="text-slate-500 text-sm animate-pulse">Chargement...</div>
            ) : audiobooks.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800 p-4">
                <p className="text-slate-500 text-sm">Aucun audiobook trouvé. Créez-en un d'abord.</p>
              </Card>
            ) : audiobooks.map((book) => (
              <Card 
                key={book.id}
                className={`bg-slate-900/50 border cursor-pointer transition-all hover:border-amber-500/30 ${
                  selectedBook?.id === book.id ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-800'
                }`}
                onClick={() => setSelectedBook(book)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{book.title}</p>
                    <p className="text-xs text-slate-500">{book.author_name || 'Sans auteur'}</p>
                  </div>
                  {selectedBook?.id === book.id && (
                    <Check className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Preview + Code */}
          <div className="lg:col-span-2 space-y-4">
            {selectedBook ? (
              <>
                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button onClick={handleCopy} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl gap-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copié !' : 'Copier le HTML'}
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger .html
                  </Button>
                  {selectedBook.slug && (
                    <Button variant="ghost" onClick={() => window.open(`/audiobook/${selectedBook.slug}`, '_blank')} className="text-slate-400 hover:text-white rounded-xl gap-2">
                      <Eye className="w-4 h-4" />
                      Voir la fiche
                    </Button>
                  )}
                </div>

                {/* Instructions */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      📋 Comment utiliser dans Elementor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-400">
                    <p><span className="text-white font-medium">1.</span> Copiez le code HTML ci-dessous</p>
                    <p><span className="text-white font-medium">2.</span> Dans Elementor, ajoutez un widget <strong className="text-amber-400">HTML</strong></p>
                    <p><span className="text-white font-medium">3.</span> Collez le code dans le champ HTML du widget</p>
                    <p><span className="text-white font-medium">4.</span> Publiez votre page — c'est prêt !</p>
                  </CardContent>
                </Card>

                {/* Code Preview */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-slate-400">Code HTML</CardTitle>
                    <Badge className="bg-slate-800 text-slate-500 border-slate-700 text-xs">{generateElementorHtml(selectedBook).length} caractères</Badge>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-auto max-h-[400px] text-xs text-slate-400 font-mono leading-relaxed">
                      {generateElementorHtml(selectedBook)}
                    </pre>
                  </CardContent>
                </Card>

                {/* Live Preview */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Aperçu du rendu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="rounded-xl overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: generateElementorHtml(selectedBook) }} 
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-900/50 border-slate-800 border-dashed flex items-center justify-center min-h-[300px]">
                <div className="text-center p-8">
                  <Code className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Sélectionnez un audiobook</h3>
                  <p className="text-slate-500 text-sm">Choisissez un livre audio à gauche pour générer le code HTML Elementor</p>
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
