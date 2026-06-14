import { useState } from 'react';
import { Link } from 'react-router-dom';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BookOpen, Download, Eye, FileText, Sparkles, CheckCircle2, ArrowRight,
} from 'lucide-react';
import guidePdf from '@/assets/guide-comprendre-ebook.pdf';

const TEAL = '#008296';
const ORANGE = '#FF9E2D';

const POINTS = [
  "Ce qu'est un ebook et pourquoi c'est accessible à tous",
  "Pourquoi publier un livre en 2026 (revenu, crédibilité)",
  "Comment l'IA génère votre livre de A à Z",
  "De l'idée à Amazon : les 5 étapes concrètes",
  "Combien un ebook peut réellement rapporter",
  "Les réponses aux questions les plus fréquentes",
];

const GuideEbookPage = () => {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <FunnelLayout>
      <SeoHead
        title="Comprendre l'ebook — Guide PDF gratuit | EbookStudio Pro"
        description="Guide gratuit pour comprendre l'ebook : ce que c'est, comment l'IA le génère, comment le publier sur Amazon KDP et combien ça peut rapporter."
        canonical="/guide-ebook"
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#008296]/10 to-transparent">
        <div className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-block bg-[#FF9E2D]/15 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
              📘 Guide offert
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#232F3E] leading-tight">
              Comprendre l'ebook <span className="text-[#008296]">en 5 minutes</span>
            </h1>
            <p className="text-lg text-[#232F3E]/75">
              Vous êtes curieux mais vous ne savez pas par où commencer ? Ce guide
              clair et sans jargon explique tout : ce qu'est un ebook, comment l'IA
              le génère pour vous, et comment le publier sur Amazon.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowPdf(true)}
                style={{ background: TEAL, color: 'white' }}
                className="font-semibold"
              >
                <Eye className="w-4 h-4 mr-1.5" /> Lire le guide
              </Button>
              <a href={guidePdf} download="Comprendre-ebook-EbookStudio.pdf">
                <Button variant="outline" className="border-[#008296] text-[#008296]">
                  <Download className="w-4 h-4 mr-1.5" /> Télécharger le PDF
                </Button>
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-2xl shadow-2xl bg-[#008296] text-white max-w-[280px] w-full aspect-[3/4] p-8 flex flex-col justify-between">
              <BookOpen className="w-12 h-12 opacity-90" />
              <div>
                <p className="text-xs font-semibold tracking-widest opacity-80">EBOOKSTUDIO PRO</p>
                <p className="text-2xl font-bold mt-2 leading-tight">Comprendre l'ebook</p>
                <p className="text-sm opacity-80 mt-1">Le guide simple pour publier avec l'IA</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#FF9E2D]" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 space-y-5">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[#232F3E]">
            <Sparkles className="w-6 h-6 text-[#008296]" /> Ce que vous allez découvrir
          </h2>
          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[#232F3E]/80">
                <CheckCircle2 className="w-5 h-5 text-[#008296] shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-[#232F3E] rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Prêt à créer votre premier livre ?</h2>
          <p className="text-white/70">
            Une fois le guide lu, lancez-vous : l'IA s'occupe du gros du travail,
            vous gardez le contrôle.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/">
              <Button style={{ background: ORANGE, color: '#232F3E' }} className="font-semibold">
                Découvrir EbookStudio Pro <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <a href={guidePdf} download="Comprendre-ebook-EbookStudio.pdf">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <FileText className="w-4 h-4 mr-1.5" /> Garder le guide
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Dialog open={showPdf} onOpenChange={setShowPdf}>
        <DialogContent className="max-w-4xl h-[88vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Comprendre l'ebook — le guide</DialogTitle>
          </DialogHeader>
          <iframe src={guidePdf} title="Guide ebook" className="flex-1 w-full rounded-md border" />
          <a href={guidePdf} download="Comprendre-ebook-EbookStudio.pdf" className="text-sm text-[#008296] underline">
            Télécharger le PDF
          </a>
        </DialogContent>
      </Dialog>
    </FunnelLayout>
  );
};

export default GuideEbookPage;
