import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EbookKdpTools } from '@/components/ebook/EbookKdpTools';
import {
import { BackButton } from "@/components/v3/BackButton";
  Search, Target, BarChart3, Image as ImageIcon, FileText, Sparkles, Award, ExternalLink,
} from 'lucide-react';

/**
 * V3 Recherche — Hub central de la recherche KDP.
 * Regroupe : Fiche livre → Description, Mots-clés backend, Catégories, Bio auteur, Contenu A+,
 * + accès direct aux outils profonds (Espion ASIN, Longue traîne, Niches, Couverture, KDP Pilot).
 */
export default function V3RecherchePage() {
  const [ebookTitle, setEbookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [bookSummary, setBookSummary] = useState('');

  const shortcuts = [
    { to: '/kdp-keywords', label: 'Recherche mots-clés', icon: Search, desc: 'Volumes, tendances, difficulté' },
    { to: '/kdp-keywords?tab=spy', label: 'Espion Amazon (ASIN)', icon: Target, desc: 'Décortiquer un best-seller' },
    { to: '/kdp-keywords?tab=longtail', label: 'Longue traîne', icon: BarChart3, desc: 'Requêtes de niche' },
    { to: '/kdp-keywords?tab=backend7', label: '7 mots-clés backend', icon: Search, desc: 'Cases KDP cachées' },
    { to: '/niches', label: 'Niches rentables', icon: BarChart3, desc: 'Marchés à faible concurrence' },
    { to: '/niches-600', label: '600 niches', icon: BarChart3, desc: 'Base complète EbookStudio' },
    { to: '/audit-pilot', label: 'KDP Pilot — Audit', icon: Award, desc: 'Diagnostic complet fiche produit' },
    { to: '/couverture-kdp', label: 'Couverture KDP', icon: ImageIcon, desc: 'Studio couverture pro' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" /> Recherche KDP
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Studio de Recherche KDP</h1>
        <p className="text-slate-600 max-w-3xl">
          Tout ce qu'il faut pour préparer une fiche Amazon KDP qui convertit : description optimisée,
          7 mots-clés backend performants, 3 catégories stratégiques, bio auteur, contenu A+, mots-clés,
          niches, espion ASIN et couverture pro.
        </p>
      </header>

      {/* Raccourcis outils profonds */}
      <section>
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Outils de recherche</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group border rounded-xl p-4 bg-white hover:border-emerald-400 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-slate-900 text-sm">{s.label}</span>
              </div>
              <p className="text-xs text-slate-500">{s.desc}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 opacity-0 group-hover:opacity-100 transition">
                Ouvrir <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Fiche livre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Fiche livre (contexte des générateurs)
          </CardTitle>
          <CardDescription>
            Renseigne ces champs une seule fois — ils alimentent la description, les mots-clés,
            les catégories, la bio et le contenu A+ ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Titre du livre</Label>
            <Input value={ebookTitle} onChange={(e) => setEbookTitle(e.target.value)} placeholder="Ex : Les petites victoires de Jules" />
          </div>
          <div>
            <Label>Nom d'auteur</Label>
            <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Ex : Georges Martin" />
          </div>
          <div className="md:col-span-2">
            <Label>Public cible</Label>
            <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Ex : parents d'enfants 3-7 ans" />
          </div>
          <div className="md:col-span-2">
            <Label>Résumé / synopsis (facultatif mais recommandé)</Label>
            <Textarea rows={4} value={bookSummary} onChange={(e) => setBookSummary(e.target.value)} placeholder="Résume l'histoire en 3-5 phrases." />
          </div>
        </CardContent>
      </Card>

      {/* Sous-onglets Générateurs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="desc">Description KDP</TabsTrigger>
          <TabsTrigger value="kw">7 mots-clés</TabsTrigger>
          <TabsTrigger value="cat">3 Catégories</TabsTrigger>
          <TabsTrigger value="bio">Bio auteur</TabsTrigger>
          <TabsTrigger value="aplus">Contenu A+</TabsTrigger>
        </TabsList>

        {!ebookTitle && (
          <div className="p-4 border rounded-lg bg-amber-50 border-amber-200 text-sm text-amber-900">
            Renseigne au minimum le <strong>titre</strong> ci-dessus pour activer les générateurs IA.
          </div>
        )}

        <TabsContent value="all">
          <EbookKdpTools
            ebookTitle={ebookTitle}
            authorName={authorName}
            chapters={[]}
            apiKey=""
            targetAudience={targetAudience}
            bookSummary={bookSummary}
          />
        </TabsContent>
        <TabsContent value="desc">
          <EbookKdpTools ebookTitle={ebookTitle} authorName={authorName} chapters={[]} apiKey="" targetAudience={targetAudience} bookSummary={bookSummary} />
        </TabsContent>
        <TabsContent value="kw">
          <EbookKdpTools ebookTitle={ebookTitle} authorName={authorName} chapters={[]} apiKey="" targetAudience={targetAudience} bookSummary={bookSummary} />
        </TabsContent>
        <TabsContent value="cat">
          <EbookKdpTools ebookTitle={ebookTitle} authorName={authorName} chapters={[]} apiKey="" targetAudience={targetAudience} bookSummary={bookSummary} />
        </TabsContent>
        <TabsContent value="bio">
          <EbookKdpTools ebookTitle={ebookTitle} authorName={authorName} chapters={[]} apiKey="" targetAudience={targetAudience} bookSummary={bookSummary} />
        </TabsContent>
        <TabsContent value="aplus">
          <EbookKdpTools ebookTitle={ebookTitle} authorName={authorName} chapters={[]} apiKey="" targetAudience={targetAudience} bookSummary={bookSummary} />
        </TabsContent>
      </Tabs>

      <div className="text-xs text-slate-500 pt-4 border-t">
        Astuce : combine ce hub avec <Link to="/audit-pilot" className="text-emerald-700 underline">KDP Pilot</Link> pour
        un diagnostic complet avant publication, et <Link to="/couverture-kdp" className="text-emerald-700 underline">Couverture KDP</Link> pour
        finaliser le visuel.
      </div>
    </div>
  );
}
