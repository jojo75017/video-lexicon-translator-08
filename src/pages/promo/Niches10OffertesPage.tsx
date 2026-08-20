import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, ArrowRight, PenLine, ShieldCheck, Gift } from 'lucide-react';
import { toast } from 'sonner';
import SeoHead from '@/components/funnel/SeoHead';
import Niches10Offer from '@/components/marketing/Niches10Offer';
import { getNiches10Pack, readNiches10Email, remainingNichesCount } from '@/lib/niches10Pack';
import { writeBookBrief } from '@/lib/v3/bookBrief';
import { trackCaptureEvent } from '@/lib/captureTracking';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';
const PAPER = '#fbfaf6';
const SERIF = "'Instrument Serif', Georgia, serif";

/**
 * Page cadeau « 10 niches offertes ».
 * Le pack est affiché immédiatement après la saisie de l'email (aucune attente d'email),
 * chaque niche peut lancer un projet de livre, et la page se termine sur l'offre complète.
 */
const Niches10OffertesPage: React.FC = () => {
  const navigate = useNavigate();
  const pack = useMemo(() => getNiches10Pack(), []);
  const remaining = useMemo(() => remainingNichesCount(), []);
  const [unlocked, setUnlocked] = useState<boolean>(() => Boolean(readNiches10Email()));
  const [downloading, setDownloading] = useState(false);

  const handleWriteThis = (niche: (typeof pack)[number]) => {
    writeBookBrief({
      savedAt: new Date().toISOString(),
      title: niche.niche,
      category: niche.categoryLabel,
      description: `Livre destiné à la niche Amazon KDP « ${niche.niche} » (mot-clé principal : ${niche.motCleAmazon}). Objectif : se positionner sur un BSR autour de ${niche.bsrCible.toLocaleString('fr-FR')} avec une concurrence ${niche.concurrence.toLowerCase()}.`,
    });
    toast.success('Niche envoyée dans votre projet de livre.');
    navigate('/v3/create');
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(6, 78, 59);
      doc.rect(0, 0, pageWidth, 110, 'F');
      doc.setTextColor(240, 215, 140);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('10 niches Amazon KDP offertes', 40, 55);
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('EbookStudio — niches extraites de notre base de 600 niches réelles', 40, 80);

      let y = 150;
      doc.setTextColor(26, 26, 26);
      pack.forEach((n, i) => {
        if (y > 720) {
          doc.addPage();
          y = 60;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(`${i + 1}. ${n.niche}`, 40, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        doc.text(`Catégorie : ${n.categoryLabel}`, 40, y + 16);
        doc.text(`Mot-clé Amazon : ${n.motCleAmazon}`, 40, y + 30);
        doc.text(
          `BSR cible : ${n.bsrCible.toLocaleString('fr-FR')}  ·  Concurrence : ${n.concurrence}  ·  Potentiel : ${n.potentiel}/5  ·  Prix constaté : ${n.exemplePrix.toFixed(2)} €`,
          40,
          y + 44,
        );
        doc.setTextColor(26, 26, 26);
        y += 72;
      });

      if (y > 700) {
        doc.addPage();
        y = 60;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(6, 78, 59);
      doc.text(`Les ${remaining} autres niches sont dans l'offre complète : ebookstudio.fr/commander`, 40, y + 20);

      doc.save('10-niches-kdp-ebookstudio.pdf');
      trackCaptureEvent('cadeau', 'click', { leadMagnet: '10-niches-offertes' });
    } catch {
      toast.error("Le PDF n'a pas pu être créé. Réessayez dans un instant.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: PAPER }}>
      <SeoHead
        title="10 niches Amazon KDP offertes | EbookStudio"
        description="Recevez immédiatement 10 niches Amazon KDP où la demande existe déjà : mot-clé exact, BSR cible, concurrence et prix constaté. Gratuit, sans carte bancaire."
        canonical="https://ebookstudio.fr/10-niches-offertes"
      />

      <header className="px-4 pt-10 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
            style={{ background: `${GOLD}22`, color: EMERALD }}
          >
            <Gift className="w-3.5 h-3.5" /> Pack offert
          </p>
          <h1
            className="mt-3 text-3xl sm:text-4xl font-bold leading-tight"
            style={{ color: EMERALD, fontFamily: SERIF }}
          >
            Arrêtez d'écrire des livres que personne ne cherche.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Voici 10 niches Amazon KDP où la demande existe déjà, extraites de notre base de{' '}
            {remaining + pack.length} niches réelles : le mot-clé exact, le BSR à viser, le niveau de
            concurrence et le prix constaté.
          </p>
        </div>
      </header>

      {!unlocked && (
        <div className="px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <Niches10Offer
              surface="cadeau"
              hook="default"
              variant="compact"
              onDone={() => setUnlocked(true)}
            />
          </div>
        </div>
      )}

      <main className="px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div
            className={`grid gap-4 sm:grid-cols-2 ${unlocked ? '' : 'pointer-events-none select-none blur-sm opacity-60'}`}
            aria-hidden={!unlocked}
          >
            {pack.map((n, i) => (
              <article
                key={n.id}
                className="rounded-2xl border bg-background p-5 shadow-sm"
                style={{ borderColor: `${GOLD}55` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {n.emoji} {n.categoryLabel}
                    </p>
                    <h2 className="mt-1 text-lg font-bold leading-snug" style={{ color: EMERALD }}>
                      {i + 1}. {n.niche}
                    </h2>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: `${GOLD}22`, color: EMERALD }}
                  >
                    {n.potentiel}/5
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <dt className="text-muted-foreground">Mot-clé Amazon</dt>
                  <dd className="font-semibold text-foreground text-right">{n.motCleAmazon}</dd>
                  <dt className="text-muted-foreground">BSR cible</dt>
                  <dd className="font-semibold text-foreground text-right">
                    {n.bsrCible.toLocaleString('fr-FR')}
                  </dd>
                  <dt className="text-muted-foreground">Concurrence</dt>
                  <dd className="font-semibold text-foreground text-right">{n.concurrence}</dd>
                  <dt className="text-muted-foreground">Prix constaté</dt>
                  <dd className="font-semibold text-foreground text-right">
                    {n.exemplePrix.toFixed(2)} €
                  </dd>
                </dl>

                <Button
                  onClick={() => handleWriteThis(n)}
                  disabled={!unlocked}
                  className="mt-4 w-full h-11 font-bold text-white"
                  style={{ background: EMERALD }}
                >
                  <PenLine className="w-4 h-4 mr-2" /> Écrire ce livre
                </Button>
              </article>
            ))}
          </div>

          {unlocked && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={handleDownloadPdf}
                disabled={downloading}
                variant="outline"
                className="h-12 font-bold"
                style={{ borderColor: EMERALD, color: EMERALD }}
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'Création du PDF…' : 'Télécharger en PDF'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Cette page reste accessible à vie depuis ce navigateur.
              </p>
            </div>
          )}
        </div>
      </main>

      <section className="px-4 pb-16">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: EMERALD }}
        >
          <h2 className="text-2xl font-bold" style={{ color: GOLD, fontFamily: SERIF }}>
            Ces 10 niches, c'est l'échantillon.
          </h2>
          <p className="mt-3 text-sm text-white/85">
            L'offre complète contient les <strong>{remaining} autres niches</strong>, plus l'outil qui
            écrit, habille et publie le livre. Accès à vie 47 € jusqu'au 31/08/2026.
          </p>
          <Link to="/commander" onClick={() => trackCaptureEvent('cadeau', 'checkout_click', { leadMagnet: '10-niches-offertes' })}>
            <Button className="mt-5 h-12 px-7 font-bold" style={{ background: GOLD, color: '#1a1a1a' }}>
              Voir l'offre complète <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-white/70">
            <ShieldCheck className="w-3.5 h-3.5" /> Garantie 30 jours · paiement en 1×, 2× ou 3× ·
            PayPal accepté
          </p>
        </div>
      </section>
    </div>
  );
};

export default Niches10OffertesPage;
