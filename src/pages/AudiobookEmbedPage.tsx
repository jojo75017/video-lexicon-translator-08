import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getRandomReviews } from '@/utils/reviewPool';

const AudiobookEmbedPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<any>(null);
  const [faqOpen, setFaqOpen] = useState<number>(0);

  useEffect(() => {
    if (slug) {
      supabase.from('audiobooks').select('*').eq('slug', slug).eq('is_public', true).single()
        .then(({ data }) => setBook(data));
    }
  }, [slug]);

  const reviews = useMemo(() => getRandomReviews(book?.slug || book?.title || 'default', 3), [book]);

  const formatDuration = (s: number | null) => {
    if (!s) return 'Durée inconnue';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m} min`;
  };

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (!book) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1319', color: '#fff', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
        <span style={{ fontSize: '2rem' }}>🎧</span>
        <span style={{ marginLeft: 12, opacity: 0.5 }}>Chargement…</span>
      </div>
    );
  }

  const title = book.title || 'Livre Audio';
  const author = book.author_name || 'Auteur inconnu';
  const voice = book.voice_name || 'Voix IA';
  const desc = book.description || '';
  const cover = book.cover_url || '';
  const price = book.price ? book.price.toFixed(2) : null;
  const oldPrice = book.price ? (book.price * 1.5).toFixed(2) : null;
  const excerptUrl = book.excerpt_url || '';
  const paypalLink = book.paypal_link || '';
  const stripeLink = book.stripe_link || '';
  const playCount = book.play_count || 0;
  const duration = formatDuration(book.duration_seconds);
  const date = formatDate(book.created_at);

  const faqs = [
    { q: 'Dans quel format est le livre audio ?', a: 'Le livre audio est au format MP3 haute définition, compatible avec tous les appareils : smartphone, tablette, ordinateur, enceinte connectée.' },
    { q: 'Comment accéder à mon achat ?', a: 'Après le paiement, vous recevrez un lien de téléchargement par email. Vous pourrez écouter votre livre audio immédiatement sur n\'importe quel appareil.' },
    { q: 'La voix est-elle naturelle ?', a: 'Oui ! Nous utilisons une technologie de synthèse vocale de dernière génération qui produit une narration fluide, expressive et très naturelle.' },
    { q: 'Puis-je être remboursé ?', a: 'Absolument. Vous bénéficiez d\'une garantie satisfait ou remboursé de 30 jours. Contactez-nous simplement par email.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f1319', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
      <div style={{ maxWidth: 960, margin: '0 auto', color: '#fff', background: 'linear-gradient(180deg,#3a4a5c 0%,#1e2a38 40%,#0f1319 100%)', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>

        {/* HERO */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, padding: '40px 32px 32px', position: 'relative' }}>
          {cover && <div style={{ position: 'absolute', inset: 0, background: `url(${cover}) center/cover`, filter: 'blur(80px)', opacity: 0.12, zIndex: 0 }} />}
          
          <div style={{ flexShrink: 0, alignSelf: 'center', position: 'relative', zIndex: 1 }}>
            {cover ? (
              <img src={cover} alt={title} style={{ width: 260, height: 260, borderRadius: 16, objectFit: 'cover', boxShadow: '0 25px 50px -12px rgba(0,0,0,.5)', border: '1px solid rgba(255,255,255,.1)' }} />
            ) : (
              <div style={{ width: 260, height: 260, borderRadius: 16, background: '#2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎧</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 280, position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</h1>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.95rem', marginBottom: 2 }}>De <span style={{ color: '#f6ad55', fontWeight: 600 }}>{author}</span></p>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.95rem', marginBottom: 2 }}>Lu par <span style={{ color: '#f6ad55', fontWeight: 600 }}>{voice}</span></p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0' }}>
              <span style={{ color: '#f6ad55', fontSize: '1rem', letterSpacing: 2 }}>★★★★★</span>
              <span style={{ color: 'rgba(246,173,85,.7)', fontSize: '.85rem' }}>{playCount} écoutes</span>
            </div>

            {excerptUrl && (
              <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '20px 24px', margin: '20px 0' }}>
                <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>🎧 Écouter un extrait</div>
                <audio controls preload="none" controlsList="nodownload" style={{ width: '100%', borderRadius: 8 }}>
                  <source src={excerptUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}

            {price ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '16px 0' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{price} €</span>
                {oldPrice && <span style={{ color: 'rgba(255,255,255,.35)', textDecoration: 'line-through', fontSize: '.95rem' }}>{oldPrice} €</span>}
                <span style={{ background: 'rgba(16,185,129,.15)', color: '#34d399', border: '1px solid rgba(16,185,129,.25)', fontSize: '.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>-33%</span>
              </div>
            ) : (
              <div style={{ margin: '16px 0' }}><span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>Gratuit</span></div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '12px 0' }}>
              {stripeLink && (
                <a href={stripeLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 28px', borderRadius: 999, fontWeight: 700, fontSize: '.95rem', textDecoration: 'none', background: 'linear-gradient(135deg,#f6ad55,#ed8936)', color: '#fff', boxShadow: '0 8px 24px rgba(246,173,85,.25)', border: 'none', cursor: 'pointer' }}>
                  🛒 Acheter — {price} €
                </a>
              )}
              {!stripeLink && price && (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 28px', borderRadius: 999, fontWeight: 700, fontSize: '.95rem', background: 'linear-gradient(135deg,#f6ad55,#ed8936)', color: '#fff' }}>
                  🛒 {price} €
                </span>
              )}
              {paypalLink && (
                <a href={paypalLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 28px', borderRadius: 999, fontWeight: 700, fontSize: '.95rem', textDecoration: 'none', background: 'rgba(59,130,246,.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,.25)', cursor: 'pointer' }}>
                  💳 Payer via PayPal
                </a>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT + SIDEBAR */}
        <div style={{ padding: 32, display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 16 }}>À propos de ce livre audio</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.7, fontSize: '.95rem' }}>{desc || 'Aucune description disponible.'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              <span style={{ border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)', fontSize: '.8rem', padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,.04)' }}>📖 Livre Audio</span>
              <span style={{ border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)', fontSize: '.8rem', padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,.04)' }}>🎙️ Audio IA Premium</span>
              {voice && <span style={{ border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.6)', fontSize: '.8rem', padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,.04)' }}>🗣️ {voice}</span>}
            </div>
          </div>
          <div style={{ width: 280, flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 12, marginBottom: 16 }}>📋 Détails du produit</h3>
              {[
                price && ['Prix', `${price} €`],
                ['Auteur', author],
                ['Narrateur', voice],
                ['Durée', duration],
                date && ['Publication', date],
                ['Format', 'MP3 · HD'],
                ['Écoutes', String(playCount)],
                ['Éditeur', 'EbookStudio'],
              ].filter(Boolean).map((row: any, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '.85rem' }}>
                  <span style={{ color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', fontSize: '.7rem', letterSpacing: '.06em' }}>{row[0]}</span>
                  <span style={{ color: 'rgba(255,255,255,.75)', fontWeight: 500, textAlign: 'right' }}>{row[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div style={{ padding: '0 32px 32px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 20 }}>⭐ Avis des auditeurs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#f6ad55,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.9rem', color: '#fff', flexShrink: 0 }}>{r.initial}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{r.name}</div>
                    <div style={{ color: 'rgba(255,255,255,.35)', fontSize: '.75rem' }}>A écouté ce titre</div>
                  </div>
                </div>
                <div style={{ color: '#f6ad55', fontSize: '.85rem', letterSpacing: 1, marginBottom: 8 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', lineHeight: 1.6 }}>{r.text}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,.1)', color: '#34d399', fontSize: '.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginTop: 8 }}>🎧 Avis spontané</div>
              </div>
            ))}
          </div>
        </div>

        {/* GUARANTEE */}
        <div style={{ margin: '0 32px 32px', background: 'linear-gradient(135deg,rgba(16,185,129,.08),rgba(16,185,129,.02))', border: '1px solid rgba(16,185,129,.2)', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: '3rem', flexShrink: 0 }}>🛡️</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', marginBottom: 6 }}>Garantie Satisfait ou Remboursé — 30 jours</h3>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.9rem', lineHeight: 1.6 }}>Vous n'êtes pas satisfait ? Nous vous remboursons intégralement, sans conditions et sans questions. Votre satisfaction est notre priorité absolue.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ padding: '0 32px 32px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 20 }}>❓ Questions fréquentes</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
              <div
                onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                style={{ padding: '16px 20px', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,.03)' }}
              >
                {f.q}
                <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,.3)' }}>{faqOpen === i ? '−' : '+'}</span>
              </div>
              {faqOpen === i && (
                <div style={{ padding: '0 20px 16px', color: 'rgba(255,255,255,.55)', fontSize: '.85rem', lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', padding: 20, borderTop: '1px solid rgba(255,255,255,.05)', fontSize: '.7rem', color: 'rgba(255,255,255,.15)' }}>
          Propulsé par EbookStudio Pro • Audio IA Premium
        </div>
      </div>
    </div>
  );
};

export default AudiobookEmbedPage;
