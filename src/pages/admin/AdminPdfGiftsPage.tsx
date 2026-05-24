import React, { useState } from 'react';
import { FileText, Download, Copy, ExternalLink, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

interface PdfGift {
  id: string;
  title: string;
  description: string;
  path: string; // public path, served from root
  category: 'lead-magnet' | 'guide' | 'formation';
  sizeKb?: number;
}

// Centralisé : ajouter ici tous les PDF disponibles dans /public
const PDF_GIFTS: PdfGift[] = [
  {
    id: 'manuel-ebookstudio',
    title: '📘 Manuel Officiel Ebookstudio',
    description: 'Le guide principal du générateur : 15 agents IA, brief, génération chapitres, couverture KDP, export. À envoyer en priorité à tout nouvel abonné.',
    path: '/lead-magnets/guide-generateur-ebookstudio-principal.pdf',
    category: 'guide',
  },
  {
    id: 'guide-ebook-audio',
    title: '🎧 Ebook Audio — Mode d\'emploi',
    description: 'Workflow complet pour transformer un ebook en livre audio pro (voix neuronale, fusion FFmpeg, page de vente publique, livraison auto).',
    path: '/lead-magnets/guide-ebook-audio-fonctionnement.pdf',
    category: 'guide',
  },
  {
    id: 'lead-50-niches-2026',
    title: '💎 50 Niches Rentables KDP 2026',
    description: 'Lead magnet vedette : 50 niches Amazon KDP analysées (6 catégories), format, mots-clés, exemples de titres qui vendent.',
    path: '/lead-magnets/50-niches-rentables-kdp-2026.pdf',
    category: 'lead-magnet',
  },
  {
    id: 'lead-5-niches-2026',
    title: '🎯 5 Niches Rentables KDP 2026 (version courte)',
    description: 'Version condensée — 5 niches détaillées (BSR, concurrence, mots-clés). Idéal pour séquence email rapide.',
    path: '/lead-magnets/5-niches-rentables-2026.pdf',
    category: 'lead-magnet',
  },
  {
    id: 'guide-cle-gemini',
    title: '🔑 Guide — Obtenir sa clé API Gemini',
    description: 'Tutoriel pas-à-pas pour créer une clé Gemini gratuite (Google AI Studio) et la coller dans Ebookstudio Pro V2.',
    path: '/Guide_Cle_Gemini_API.pdf',
    category: 'guide',
  },
];

const CATEGORY_LABELS: Record<PdfGift['category'], { label: string; color: string }> = {
  'lead-magnet': { label: 'Lead Magnet', color: 'bg-[#FF9E2D]/15 text-[#FF9E2D] border-[#FF9E2D]/30' },
  'guide':       { label: 'Guide',       color: 'bg-[#008296]/15 text-[#008296] border-[#008296]/30' },
  'formation':   { label: 'Formation',   color: 'bg-purple-500/15 text-purple-600 border-purple-500/30' },
};

const AdminPdfGiftsPage: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = async (gift: PdfGift) => {
    const url = `${origin}${gift.path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(gift.id);
      toast.success('Lien copié dans le presse-papier');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Impossible de copier le lien');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#008296]/10 p-2.5">
            <Gift className="h-6 w-6 text-[#008296]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cadeaux PDF</h1>
            <p className="text-sm text-muted-foreground">
              Tous les PDF disponibles pour être offerts à vos prospects / abonnés.
              Téléchargez-les ou copiez le lien public pour les partager.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PDF_GIFTS.map((gift) => {
            const cat = CATEGORY_LABELS[gift.category];
            const publicUrl = `${origin}${gift.path}`;
            return (
              <Card key={gift.id} className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2.5 shrink-0">
                    <FileText className="h-5 w-5 text-[#008296]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground">{gift.title}</h3>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{gift.description}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs font-mono text-muted-foreground break-all">
                  {publicUrl}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="bg-[#008296] hover:bg-[#FF9E2D] text-white">
                    <a href={gift.path} download>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href={gift.path} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ouvrir
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCopy(gift)}>
                    {copiedId === gift.id ? (
                      <><Check className="mr-2 h-4 w-4 text-green-600" />Copié</>
                    ) : (
                      <><Copy className="mr-2 h-4 w-4" />Copier le lien</>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-5 border-dashed bg-muted/30">
          <h3 className="font-semibold mb-2">➕ Ajouter un nouveau PDF</h3>
          <p className="text-sm text-muted-foreground">
            Placez le fichier dans <code className="text-xs bg-muted px-1.5 py-0.5 rounded">public/</code> (ou <code className="text-xs bg-muted px-1.5 py-0.5 rounded">public/lead-magnets/</code>),
            puis ajoutez-le dans la liste <code className="text-xs bg-muted px-1.5 py-0.5 rounded">PDF_GIFTS</code> du fichier <code className="text-xs bg-muted px-1.5 py-0.5 rounded">AdminPdfGiftsPage.tsx</code>.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminPdfGiftsPage;
