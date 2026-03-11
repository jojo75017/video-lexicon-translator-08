import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Check, Download, Code, Headphones, ArrowLeft, Eye, Upload, Save, Image, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // Edit fields
  const [editPrice, setEditPrice] = useState('');
  const [editPaypal, setEditPaypal] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          setAuthMissing(true);
          setAudiobooks([]);
          return;
        }

        const { data, error } = await supabase
          .from('audiobooks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setAuthMissing(false);
        setAudiobooks(data || []);
      } catch (error: any) {
        console.error('Elementor fetch error:', error);
        toast.error('Impossible de charger vos audiobooks');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Sync edit fields when a book is selected
  useEffect(() => {
    if (selectedBook) {
      setEditPrice(selectedBook.price != null ? String(selectedBook.price) : '');
      setEditPaypal(selectedBook.paypal_link || '');
      setEditCoverUrl(selectedBook.cover_url || '');
    }
  }, [selectedBook?.id]);

  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h${m}min` : `${m}min`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBook) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Vous devez être connecté');
        return;
      }

      const ext = file.name.split('.').pop();
      const path = `${session.user.id}/covers/${selectedBook.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('audiobooks')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audiobooks')
        .getPublicUrl(path);

      // Update DB
      const { error: updateError } = await supabase
        .from('audiobooks')
        .update({ cover_url: publicUrl })
        .eq('id', selectedBook.id);

      if (updateError) throw updateError;

      setEditCoverUrl(publicUrl);
      const updated = { ...selectedBook, cover_url: publicUrl };
      setSelectedBook(updated);
      setAudiobooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.success('Image de couverture uploadée ✅');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Erreur upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!selectedBook) return;
    setSaving(true);

    try {
      const parsedPrice = editPrice.trim() ? Number.parseFloat(editPrice) : null;
      if (editPrice.trim() && Number.isNaN(parsedPrice)) {
        toast.error('Prix invalide');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('audiobooks')
        .update({
          price: parsedPrice,
          paypal_link: editPaypal.trim() || null,
          cover_url: editCoverUrl.trim() || null,
        })
        .eq('id', selectedBook.id);

      if (error) throw error;

      const updated = {
        ...selectedBook,
        price: parsedPrice,
        paypal_link: editPaypal.trim() || null,
        cover_url: editCoverUrl.trim() || null,
      };
      setSelectedBook(updated);
      setAudiobooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      toast.success('Fiche mise à jour ✅');
    } catch (err: any) {
      toast.error('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const generateElementorHtml = (book: any) => {
    const origin = window.location.origin;
    const safeSlug = book.slug || '';
    const hasSlug = Boolean(safeSlug);
    const publicUrl = hasSlug ? `${origin}/audiobook/${safeSlug}` : '#';
    const embedUrl = hasSlug ? `${origin}/audiobook-embed/${safeSlug}` : '';
    const price = book.price ? `${Number(book.price).toFixed(2)} €` : 'Gratuit';
    // Use excerpt_url or fall back to full audio
    const playerSrc = book.excerpt_url || book.audio_url || '';
    // Format PayPal link properly
    const rawPaypal = book.paypal_link || '';
    const paypalHref = rawPaypal.startsWith('http') ? rawPaypal : rawPaypal.includes('@') ? `https://www.paypal.com/paypalme/${rawPaypal}` : rawPaypal ? `https://www.paypal.me/${rawPaypal}` : '';
    const desc = (book.description || `Plongez dans « ${book.title || 'ce livre audio'} », une expérience audio captivante ${book.author_name ? `signée ${book.author_name}` : ''} et produite avec la technologie de narration vocale IA de dernière génération${book.voice_name ? `, interprétée par la voix ${book.voice_name}` : ''}. Ce livre audio a été conçu pour offrir une immersion totale : chaque chapitre a été soigneusement structuré, chaque phrase optimisée pour l'écoute. Qualité studio, format MP3 haute définition, compatible avec tous vos appareils.`).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const descShort = desc.slice(0, 400) + (desc.length > 400 ? '...' : '');

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
      ${book.paypal_link
        ? `<a href="${book.paypal_link}" class="eb-cta" target="_blank" rel="noopener">
            💳 Acheter maintenant — ${price}
          </a>`
        : hasSlug
          ? `<a href="${publicUrl}" class="eb-cta" target="_blank" rel="noopener">
              🎧 Écouter maintenant
            </a>`
          : `<span class="eb-cta" style="opacity:.6;cursor:not-allowed">🎧 Lien indisponible</span>`
      }
    </div>
  </div>

  <!-- PLAYER EMBED -->
  ${book.excerpt_url ? `
  <div class="eb-player-section">
    <h3>🎧 Écouter un extrait</h3>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">
      <audio controls preload="none" controlsList="nodownload" style="width:100%;border-radius:8px;outline:none;">
        <source src="${book.excerpt_url}" type="audio/mpeg">
      </audio>
    </div>
  </div>
  ` : ''}

  <!-- DESCRIPTION & META -->
  <div class="eb-body">
    <div class="eb-desc">
      <h3 style="display:flex;align-items:center;gap:10px;">
        <span style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(249,115,22,0.15));border:1px solid rgba(245,158,11,0.2);display:inline-flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">📖</span>
        À propos de ce livre audio
      </h3>
      <p style="border-left:2px solid rgba(245,158,11,0.3);padding-left:14px;">${descShort}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
        <span style="border:1px solid rgba(245,158,11,0.15);color:rgba(245,158,11,0.6);font-size:12px;padding:5px 14px;border-radius:999px;background:rgba(245,158,11,0.04);">📖 Livre Audio</span>
        <span style="border:1px solid rgba(168,85,247,0.15);color:rgba(168,85,247,0.6);font-size:12px;padding:5px 14px;border-radius:999px;background:rgba(168,85,247,0.04);">🎙️ Audio IA Premium</span>
        ${book.voice_name ? `<span style="border:1px solid rgba(6,182,212,0.15);color:rgba(6,182,212,0.6);font-size:12px;padding:5px 14px;border-radius:999px;background:rgba(6,182,212,0.04);">🗣️ ${book.voice_name}</span>` : ''}
        <span style="border:1px solid rgba(16,185,129,0.15);color:rgba(16,185,129,0.6);font-size:12px;padding:5px 14px;border-radius:999px;background:rgba(16,185,129,0.04);">✅ Téléchargement immédiat</span>
      </div>
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

  <!-- GARANTIE -->
  <div style="margin:0 40px 32px;background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.02));border:1px solid rgba(16,185,129,0.2);border-radius:16px;padding:24px 28px;display:flex;align-items:center;gap:20px;">
    <div style="font-size:2.5rem;flex-shrink:0;">🛡️</div>
    <div>
      <h4 style="font-size:15px;font-weight:700;color:#34d399;margin:0 0 4px;">Garantie Satisfait ou Remboursé — 30 jours</h4>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0;">Vous n'êtes pas satisfait ? Remboursement intégral, sans conditions.</p>
    </div>
  </div>

  <!-- FAQ -->
  <div style="padding:0 40px 32px;">
    <h3 style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">❓ Questions fréquentes</h3>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:8px;padding:14px 18px;">
      <div style="font-weight:600;font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:8px;">Dans quel format est le livre audio ?</div>
      <div style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">Format MP3 haute définition, compatible tous appareils : smartphone, tablette, ordinateur, enceinte connectée.</div>
    </div>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:8px;padding:14px 18px;">
      <div style="font-weight:600;font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:8px;">Comment accéder à mon achat ?</div>
      <div style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">Après paiement, vous recevrez un lien de téléchargement par email pour écouter immédiatement.</div>
    </div>
    <div style="border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:8px;padding:14px 18px;">
      <div style="font-weight:600;font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:8px;">Puis-je être remboursé ?</div>
      <div style="color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">Garantie satisfait ou remboursé de 30 jours. Contactez-nous par email.</div>
    </div>
  </div>

  <div class="eb-footer">Propulsé par EbookStudio Pro • Audio IA Premium</div>
</div>`;
  };

  const slugifyTitle = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const ensureBookPublicForExport = async (book: any) => {
    if (book.slug && book.is_public) return book;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      toast.error('Vous devez être connecté pour publier la fiche.');
      return null;
    }

    const fallbackSlugBase = slugifyTitle(book.title || 'audiobook') || 'audiobook';
    const fallbackSlug = `${fallbackSlugBase}-${book.id.slice(0, 8)}`;

    const { data, error } = await supabase
      .from('audiobooks')
      .update({
        is_public: true,
        slug: book.slug || fallbackSlug,
      })
      .eq('id', book.id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Elementor publish error:', error);
      toast.error('Impossible de publier ce livre pour la fiche Elementor.');
      return null;
    }

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
    a.href = url;
    a.download = `${exportableBook.slug || 'audiobook'}-elementor.html`;
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
            Sélectionnez un audiobook, configurez l'image / prix / PayPal, puis copiez le code HTML dans un widget <strong className="text-white">HTML personnalisé</strong> d'Elementor.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Book list */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Vos audiobooks</h2>
            {loading ? (
              <div className="text-slate-500 text-sm animate-pulse">Chargement...</div>
            ) : authMissing ? (
              <Card className="bg-slate-900/50 border-slate-800 p-4">
                <p className="text-slate-400 text-sm">Vous devez être connecté à votre compte pour voir les audiobooks sauvegardés.</p>
              </Card>
            ) : audiobooks.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800 p-4">
                <p className="text-slate-500 text-sm">Aucun audiobook trouvé. Allez dans le Générateur Audio et cliquez sur "Exporter en MP3" ou "Fusionner" pour sauvegarder un livre dans votre bibliothèque.</p>
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
                    {book.price ? (
                      <p className="text-xs text-amber-400 font-medium">{Number(book.price).toFixed(2)} €</p>
                    ) : (
                      <p className="text-xs text-slate-600">Pas de prix</p>
                    )}
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
                {/* ====== EDIT PANEL: Image, Prix, PayPal ====== */}
                <Card className="bg-slate-900/50 border-amber-500/20 border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
                      ⚙️ Configurer la fiche produit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image upload */}
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5" /> Image de couverture
                      </label>
                      <div className="flex gap-2 items-center">
                        {editCoverUrl && (
                          <img src={editCoverUrl} alt="Cover" className="w-14 h-14 rounded-lg object-cover border border-slate-700" />
                        )}
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="URL de l'image ou uploadez →"
                            value={editCoverUrl}
                            onChange={e => setEditCoverUrl(e.target.value)}
                            className="bg-slate-800/50 border-slate-700 text-white text-sm"
                          />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap"
                          >
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            {uploading ? 'Upload...' : 'Uploader'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Price + PayPal */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" /> Prix (€)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="9.99"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                          💳 Lien PayPal
                        </label>
                        <Input
                          placeholder="https://paypal.me/..."
                          value={editPaypal}
                          onChange={e => setEditPaypal(e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-white text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveMetadata}
                      disabled={saving}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl gap-2 w-full"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Enregistrement...' : 'Enregistrer la fiche'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Button onClick={handleCopy} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl gap-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copié !' : 'Copier le HTML'}
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl gap-2">
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
                    className="text-slate-400 hover:text-white rounded-xl gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir la page publique
                  </Button>
                </div>

                {/* Instructions */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      📋 Comment utiliser dans Elementor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-400">
                    <p><span className="text-white font-medium">1.</span> Configurez l'image, le prix et le lien PayPal ci-dessus</p>
                    <p><span className="text-white font-medium">2.</span> Copiez le code HTML ci-dessous</p>
                    <p><span className="text-white font-medium">3.</span> Dans Elementor, ajoutez un widget <strong className="text-amber-400">HTML</strong></p>
                    <p><span className="text-white font-medium">4.</span> Collez le code dans le champ HTML du widget</p>
                    <p><span className="text-white font-medium">5.</span> Publiez votre page — c'est prêt !</p>
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
                  <p className="text-slate-500 text-sm">Choisissez un livre audio à gauche pour configurer et générer le code HTML Elementor</p>
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
