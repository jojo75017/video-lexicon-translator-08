/**
 * Generates a self-contained HTML string for an audiobook product sheet.
 * Ready to paste into an Elementor HTML widget or any WordPress page.
 */

import { getRandomReviews } from './reviewPool';

interface AudiobookData {
  title: string;
  author_name?: string | null;
  voice_name?: string | null;
  description?: string | null;
  cover_url?: string | null;
  price?: number | null;
  paypal_link?: string | null;
  stripe_link?: string | null;
  excerpt_url?: string | null;
  audio_url?: string | null;
  duration_seconds?: number | null;
  play_count?: number;
  created_at?: string;
  slug?: string | null;
}

const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function generateAudiobookHtml(book: AudiobookData): string {
  const title = escHtml(book.title || 'Livre Audio');
  const author = escHtml(book.author_name || 'Auteur inconnu');
  const voice = escHtml(book.voice_name || 'Voix IA');
  const desc = escHtml(book.description || `Plongez dans « ${book.title || 'ce livre audio'} », une expérience audio captivante ${book.author_name ? `signée ${book.author_name}` : ''} et produite avec la technologie de narration vocale IA de dernière génération${book.voice_name ? `, interprétée par la voix ${book.voice_name}` : ''}. Ce livre audio a été conçu pour offrir une immersion totale : chaque chapitre a été soigneusement structuré, chaque phrase optimisée pour l'écoute. Qualité studio, format MP3 haute définition, compatible avec tous vos appareils.`);
  const cover = book.cover_url || '';
  const price = book.price ? book.price.toFixed(2) : null;
  const oldPrice = book.price ? (book.price * 1.5).toFixed(2) : null;
  const excerptUrl = book.excerpt_url || '';
  const paypalLink = book.paypal_link || '';
  const stripeLink = book.stripe_link || '';
  const playCount = book.play_count || 0;

  const formatDuration = (s: number | null | undefined) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m} min`;
  };

  const duration = formatDuration(book.duration_seconds);
  const date = book.created_at
    ? new Date(book.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  const buyButtons = [];
  if (stripeLink) {
    buyButtons.push(`<a href="${escHtml(stripeLink)}" target="_blank" rel="noopener" class="ab-btn ab-btn-primary">🛒 Acheter — ${price} €</a>`);
  } else if (price) {
    buyButtons.push(`<span class="ab-btn ab-btn-primary" style="cursor:default;">🛒 ${price} €</span>`);
  }
  if (paypalLink) {
    buyButtons.push(`<a href="${escHtml(paypalLink)}" target="_blank" rel="noopener" class="ab-btn ab-btn-paypal">💳 Payer via PayPal</a>`);
  }

  return `<!-- Fiche Audiobook — Généré par EbookStudio Pro -->
<style>
.ab-root{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:960px;margin:0 auto;color:#fff;background:linear-gradient(180deg,#3a4a5c 0%,#1e2a38 40%,#0f1319 100%);border-radius:20px;overflow:hidden;position:relative}
.ab-root *{box-sizing:border-box;margin:0;padding:0}
.ab-hero{display:flex;flex-wrap:wrap;gap:32px;padding:40px 32px 32px;position:relative}
.ab-hero::before{content:'';position:absolute;inset:0;background:url('${cover}') center/cover;filter:blur(80px);opacity:.12;z-index:0}
.ab-hero>*{position:relative;z-index:1}
.ab-cover-wrap{flex-shrink:0;align-self:center}
.ab-cover{width:260px;height:260px;border-radius:16px;object-fit:cover;box-shadow:0 25px 50px -12px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)}
.ab-info{flex:1;min-width:280px}
.ab-title{font-size:2rem;font-weight:800;line-height:1.15;margin-bottom:8px;letter-spacing:-.02em}
.ab-meta-line{color:rgba(255,255,255,.6);font-size:.95rem;margin-bottom:2px}
.ab-meta-line span{color:#f6ad55;font-weight:600}
.ab-stars{display:flex;align-items:center;gap:8px;margin:16px 0}
.ab-stars-icons{color:#f6ad55;font-size:1rem;letter-spacing:2px}
.ab-stars-count{color:rgba(246,173,85,.7);font-size:.85rem}
.ab-player{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px 24px;margin:20px 0}
.ab-player-label{font-size:.9rem;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.ab-player audio{width:100%;border-radius:8px;outline:none}
.ab-price-row{display:flex;align-items:baseline;gap:12px;margin:16px 0}
.ab-price{font-size:2.2rem;font-weight:800}
.ab-old-price{color:rgba(255,255,255,.35);text-decoration:line-through;font-size:.95rem}
.ab-discount{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25);font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:20px}
.ab-buttons{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0}
.ab-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 28px;border-radius:999px;font-weight:700;font-size:.95rem;text-decoration:none;transition:all .2s;border:none;cursor:pointer}
.ab-btn-primary{background:linear-gradient(135deg,#f6ad55,#ed8936);color:#fff;box-shadow:0 8px 24px rgba(246,173,85,.25)}
.ab-btn-primary:hover{transform:translateY(-1px);box-shadow:0 12px 32px rgba(246,173,85,.35)}
.ab-btn-paypal{background:rgba(59,130,246,.12);color:#93c5fd;border:1px solid rgba(59,130,246,.25)}
.ab-btn-paypal:hover{background:rgba(59,130,246,.2)}
.ab-content{padding:32px;display:flex;flex-wrap:wrap;gap:32px}
.ab-desc{flex:1;min-width:280px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px 28px}
.ab-desc h2{font-size:1.35rem;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.ab-desc-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,rgba(246,173,85,.15),rgba(237,137,54,.15));border:1px solid rgba(246,173,85,.2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
.ab-desc p{color:rgba(255,255,255,.6);line-height:1.8;font-size:.95rem;border-left:2px solid rgba(246,173,85,.3);padding-left:16px}
.ab-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)}
.ab-tag{border:1px solid rgba(246,173,85,.15);color:rgba(246,173,85,.6);font-size:.8rem;padding:6px 16px;border-radius:999px;background:rgba(246,173,85,.04);font-weight:500}
.ab-sidebar{width:280px;flex-shrink:0}
.ab-details{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px}
.ab-details h3{font-size:1rem;font-weight:600;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:12px;margin-bottom:16px}
.ab-detail-row{display:flex;justify-content:space-between;padding:6px 0;font-size:.85rem}
.ab-detail-label{color:rgba(255,255,255,.4);text-transform:uppercase;font-size:.7rem;letter-spacing:.06em}
.ab-detail-value{color:rgba(255,255,255,.75);font-weight:500;text-align:right}
/* Reviews */
.ab-reviews{padding:0 32px 32px}
.ab-reviews h2{font-size:1.35rem;font-weight:700;margin-bottom:20px}
.ab-reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.ab-review{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px}
.ab-review-header{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.ab-review-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f6ad55,#ed8936);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem;color:#fff;flex-shrink:0}
.ab-review-name{font-weight:600;font-size:.9rem}
.ab-review-date{color:rgba(255,255,255,.35);font-size:.75rem}
.ab-review-stars{color:#f6ad55;font-size:.85rem;letter-spacing:1px;margin-bottom:8px}
.ab-review-text{color:rgba(255,255,255,.6);font-size:.85rem;line-height:1.6}
.ab-review-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,.1);color:#34d399;font-size:.7rem;font-weight:600;padding:2px 8px;border-radius:20px;margin-top:8px}
/* Guarantee */
.ab-guarantee{margin:0 32px 32px;background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(16,185,129,.02));border:1px solid rgba(16,185,129,.2);border-radius:16px;padding:28px 32px;display:flex;align-items:center;gap:24px}
.ab-guarantee-icon{font-size:3rem;flex-shrink:0}
.ab-guarantee-text h3{font-size:1.1rem;font-weight:700;color:#34d399;margin-bottom:6px}
.ab-guarantee-text p{color:rgba(255,255,255,.6);font-size:.9rem;line-height:1.6}
/* FAQ */
.ab-faq{padding:0 32px 32px}
.ab-faq h2{font-size:1.35rem;font-weight:700;margin-bottom:20px}
.ab-faq-item{border:1px solid rgba(255,255,255,.08);border-radius:12px;margin-bottom:8px;overflow:hidden}
.ab-faq-q{padding:16px 20px;font-weight:600;font-size:.9rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.03);transition:background .2s}
.ab-faq-q:hover{background:rgba(255,255,255,.06)}
.ab-faq-q::after{content:'+';font-size:1.2rem;color:rgba(255,255,255,.3);transition:transform .2s}
.ab-faq-item.open .ab-faq-q::after{content:'−'}
.ab-faq-a{padding:0 20px;max-height:0;overflow:hidden;transition:all .3s ease;color:rgba(255,255,255,.55);font-size:.85rem;line-height:1.7}
.ab-faq-item.open .ab-faq-a{padding:0 20px 16px;max-height:200px}
/* Similar */
.ab-similar{padding:0 32px 32px}
.ab-similar h2{font-size:1.35rem;font-weight:700;margin-bottom:20px}
.ab-similar-grid{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px}
.ab-similar-card{flex-shrink:0;width:160px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;transition:transform .2s}
.ab-similar-card:hover{transform:translateY(-4px)}
.ab-similar-cover{width:160px;height:160px;object-fit:cover;background:#2d3748}
.ab-similar-info{padding:12px}
.ab-similar-title{font-size:.8rem;font-weight:600;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ab-similar-price{font-size:.75rem;color:#f6ad55;font-weight:700}
.ab-footer{text-align:center;padding:20px;border-top:1px solid rgba(255,255,255,.05);font-size:.7rem;color:rgba(255,255,255,.15)}
@media(max-width:700px){
.ab-hero{flex-direction:column;align-items:center;text-align:center;padding:24px 16px}
.ab-cover{width:200px;height:200px}
.ab-info{min-width:0}
.ab-title{font-size:1.5rem}
.ab-content{flex-direction:column;padding:20px 16px}
.ab-sidebar{width:100%}
.ab-buttons{justify-content:center}
.ab-guarantee{flex-direction:column;text-align:center;margin:0 16px 24px;padding:24px 20px}
.ab-reviews{padding:0 16px 24px}
.ab-faq{padding:0 16px 24px}
.ab-similar{padding:0 16px 24px}
}
</style>

<div class="ab-root">
  <div class="ab-hero">
    <div class="ab-cover-wrap">
      ${cover ? `<img src="${escHtml(cover)}" alt="${title}" class="ab-cover" />` : '<div class="ab-cover" style="background:#2d3748;display:flex;align-items:center;justify-content:center;font-size:3rem;">🎧</div>'}
    </div>
    <div class="ab-info">
      <h1 class="ab-title">${title}</h1>
      <p class="ab-meta-line">De <span>${author}</span></p>
      <p class="ab-meta-line">Lu par <span>${voice}</span></p>
      <div class="ab-stars">
        <span class="ab-stars-icons">★★★★★</span>
        <span class="ab-stars-count">${playCount} écoutes</span>
      </div>

      ${excerptUrl ? `
      <div class="ab-player">
        <div class="ab-player-label">🎧 Écouter un extrait</div>
        <audio controls preload="none" controlsList="nodownload">
          <source src="${escHtml(excerptUrl)}" type="audio/mpeg">
        </audio>
      </div>` : ''}

      ${price ? `
      <div class="ab-price-row">
        <span class="ab-price">${price} €</span>
        ${oldPrice ? `<span class="ab-old-price">${oldPrice} €</span>` : ''}
        <span class="ab-discount">-33%</span>
      </div>` : '<div class="ab-price-row"><span class="ab-price" style="color:#34d399;">Gratuit</span></div>'}

      ${buyButtons.length > 0 ? `<div class="ab-buttons">${buyButtons.join('\n        ')}</div>` : ''}
    </div>
  </div>

  <div class="ab-content">
    <div class="ab-desc">
      <h2><div class="ab-desc-icon">📖</div> À propos de ce livre audio</h2>
      <p>${desc}</p>
      <div class="ab-tags">
        <span class="ab-tag">📖 Livre Audio</span>
        <span class="ab-tag">🎙️ Audio IA Premium</span>
        ${voice ? `<span class="ab-tag">🗣️ ${voice}</span>` : ''}
        <span class="ab-tag">✅ Téléchargement immédiat</span>
      </div>
    </div>
    <div class="ab-sidebar">
      <div class="ab-details">
        <h3>📋 Détails du produit</h3>
        ${price ? `<div class="ab-detail-row"><span class="ab-detail-label">Prix</span><span class="ab-detail-value">${price} €</span></div>` : ''}
        <div class="ab-detail-row"><span class="ab-detail-label">Auteur</span><span class="ab-detail-value">${author}</span></div>
        <div class="ab-detail-row"><span class="ab-detail-label">Narrateur</span><span class="ab-detail-value">${voice}</span></div>
        <div class="ab-detail-row"><span class="ab-detail-label">Durée</span><span class="ab-detail-value">${duration}</span></div>
        ${date ? `<div class="ab-detail-row"><span class="ab-detail-label">Publication</span><span class="ab-detail-value">${date}</span></div>` : ''}
        <div class="ab-detail-row"><span class="ab-detail-label">Format</span><span class="ab-detail-value">MP3 · HD</span></div>
        <div class="ab-detail-row"><span class="ab-detail-label">Écoutes</span><span class="ab-detail-value">${playCount}</span></div>
        <div class="ab-detail-row"><span class="ab-detail-label">Éditeur</span><span class="ab-detail-value">EbookStudio</span></div>
      </div>
    </div>
  </div>

  <!-- Avis clients -->
  <div class="ab-reviews">
    <h2>⭐ Avis des auditeurs</h2>
    <div class="ab-reviews-grid">
      ${getRandomReviews(book.slug || book.title || 'default').map(r => `
      <div class="ab-review">
        <div class="ab-review-header">
          <div class="ab-review-avatar">${r.initial}</div>
          <div><div class="ab-review-name">${escHtml(r.name)}</div><div class="ab-review-date">A écouté ce titre</div></div>
        </div>
        <div class="ab-review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <div class="ab-review-text">${escHtml(r.text)}</div>
        <div class="ab-review-badge">🎧 Avis spontané</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Garantie -->
  <div class="ab-guarantee">
    <div class="ab-guarantee-icon">🛡️</div>
    <div class="ab-guarantee-text">
      <h3>Garantie Satisfait ou Remboursé — 30 jours</h3>
      <p>Vous n'êtes pas satisfait ? Nous vous remboursons intégralement, sans conditions et sans questions. Votre satisfaction est notre priorité absolue.</p>
    </div>
  </div>

  <!-- FAQ -->
  <div class="ab-faq">
    <h2>❓ Questions fréquentes</h2>
    <div class="ab-faq-item open">
      <div class="ab-faq-q" onclick="this.parentElement.classList.toggle('open')">Dans quel format est le livre audio ?</div>
      <div class="ab-faq-a">Le livre audio est au format MP3 haute définition, compatible avec tous les appareils : smartphone, tablette, ordinateur, enceinte connectée.</div>
    </div>
    <div class="ab-faq-item">
      <div class="ab-faq-q" onclick="this.parentElement.classList.toggle('open')">Comment accéder à mon achat ?</div>
      <div class="ab-faq-a">Après le paiement, vous recevrez un lien de téléchargement par email. Vous pourrez écouter votre livre audio immédiatement sur n'importe quel appareil.</div>
    </div>
    <div class="ab-faq-item">
      <div class="ab-faq-q" onclick="this.parentElement.classList.toggle('open')">La voix est-elle naturelle ?</div>
      <div class="ab-faq-a">Oui ! Nous utilisons une technologie de synthèse vocale de dernière génération qui produit une narration fluide, expressive et très naturelle.</div>
    </div>
    <div class="ab-faq-item">
      <div class="ab-faq-q" onclick="this.parentElement.classList.toggle('open')">Puis-je être remboursé ?</div>
      <div class="ab-faq-a">Absolument. Vous bénéficiez d'une garantie satisfait ou remboursé de 30 jours. Contactez-nous simplement par email.</div>
    </div>
  </div>


  <div class="ab-footer">Propulsé par EbookStudio Pro • Audio IA Premium</div>
</div>

<script>
// FAQ accordion
document.querySelectorAll('.ab-faq-q').forEach(function(q){
  q.addEventListener('click',function(){this.parentElement.classList.toggle('open')});
});
</script>
<!-- Fin Fiche Audiobook -->`;
}

export function downloadAudiobookHtml(book: AudiobookData) {
  const html = generateAudiobookHtml(book);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fiche-${(book.slug || book.title || 'audiobook').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
