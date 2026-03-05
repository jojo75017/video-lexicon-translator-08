import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle2, Circle, AlertTriangle, BookOpen, Image, FileText, 
  Type, Ruler, Shield, Zap, Copy, Info, XCircle, ArrowRight,
  Sparkles, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  rule: string;
  category: 'format' | 'content' | 'images' | 'metadata' | 'quality';
  severity: 'critical' | 'important' | 'recommended';
  amazonRef?: string;
}

const KDP_CHECKLIST: ChecklistItem[] = [
  // FORMAT
  {
    id: 'trim-size',
    label: 'Format de trim (taille du livre)',
    description: 'Choisissez un format standard KDP pour éviter le rejet.',
    rule: 'Formats acceptés : 5"x8", 5.25"x8", 5.5"x8.5", 6"x9", 6.14"x9.21", 7"x10", 8"x10", 8.5"x11". Le plus populaire : 6"x9".',
    category: 'format',
    severity: 'critical',
    amazonRef: 'https://kdp.amazon.com/help/topic/G201834180'
  },
  {
    id: 'margins',
    label: 'Marges intérieures correctes',
    description: 'Les marges varient selon le nombre de pages (gouttière plus large pour les livres épais).',
    rule: '≤150 pages : gouttière 0.375". 151-400 pages : 0.75". 401-600 pages : 0.875". >600 pages : 1". Marges ext. minimum : 0.25".',
    category: 'format',
    severity: 'critical'
  },
  {
    id: 'bleed',
    label: 'Fond perdu (bleed)',
    description: 'Si des images touchent le bord de la page, activez le fond perdu.',
    rule: 'Avec fond perdu : ajoutez 0.125" (3.2mm) de chaque côté. Sans fond perdu : les images doivent rester à >0.25" du bord.',
    category: 'format',
    severity: 'important'
  },
  {
    id: 'page-count',
    label: 'Nombre de pages',
    description: 'Amazon impose un minimum et maximum de pages.',
    rule: 'Broché : 24-828 pages. Relié : 75-550 pages. Le nombre de pages DOIT être pair (ajoutez une page blanche si nécessaire).',
    category: 'format',
    severity: 'critical'
  },
  {
    id: 'file-format',
    label: 'Format de fichier',
    description: 'Amazon accepte uniquement certains formats.',
    rule: 'Intérieur broché/relié : PDF uniquement. Ebook Kindle : EPUB, KPF ou DOCX. Couverture : PDF ou JPEG/TIFF.',
    category: 'format',
    severity: 'critical'
  },
  // IMAGES
  {
    id: 'dpi-interior',
    label: 'Résolution des images intérieures',
    description: 'Les images basse résolution seront floues à l\'impression.',
    rule: 'Minimum 300 DPI pour les images intérieures. Idéal : 300-600 DPI. Les images web (72 DPI) seront REJETÉES.',
    category: 'images',
    severity: 'critical'
  },
  {
    id: 'dpi-cover',
    label: 'Résolution de la couverture',
    description: 'La couverture doit être en haute résolution.',
    rule: 'Minimum 300 DPI. Dimensions idéales pour un 6"x9" : 3744 x 2475 pixels (couverture complète avec dos).',
    category: 'images',
    severity: 'critical'
  },
  {
    id: 'color-space',
    label: 'Espace colorimétrique',
    description: 'Utilisez le bon profil de couleurs selon l\'impression.',
    rule: 'Impression couleur : CMJN (CMYK). Impression N&B : Niveaux de gris. Ebook : RVB (sRGB). Ne PAS mélanger les profils.',
    category: 'images',
    severity: 'important'
  },
  {
    id: 'cover-spine',
    label: 'Dos de couverture (spine)',
    description: 'La largeur du dos dépend du nombre de pages et du type de papier.',
    rule: 'Papier blanc : largeur = nb_pages × 0.002252". Papier crème : largeur = nb_pages × 0.0025". Le texte sur le dos est interdit en dessous de 79 pages.',
    category: 'images',
    severity: 'important'
  },
  // CONTENU
  {
    id: 'title-match',
    label: 'Titre identique partout',
    description: 'Le titre sur la couverture, dans le fichier et dans KDP doivent correspondre.',
    rule: 'Le titre EXACT doit apparaître : sur la couverture, sur la page de titre intérieure, et dans le formulaire KDP. Toute incohérence = rejet.',
    category: 'content',
    severity: 'critical'
  },
  {
    id: 'isbn',
    label: 'ISBN (optionnel)',
    description: 'Amazon fournit un ISBN gratuit ou vous pouvez utiliser le vôtre.',
    rule: 'ISBN gratuit Amazon : non transférable. ISBN personnel : doit être unique par format (broché ≠ relié ≠ ebook). Ne réutilisez JAMAIS un ISBN.',
    category: 'content',
    severity: 'recommended'
  },
  {
    id: 'copyright-page',
    label: 'Page de copyright',
    description: 'Obligatoire pour une publication professionnelle.',
    rule: 'Inclure : © [Année] [Auteur]. "Tous droits réservés." + mention ISBN si applicable. Placer après la page de titre.',
    category: 'content',
    severity: 'important'
  },
  {
    id: 'toc',
    label: 'Table des matières',
    description: 'Recommandée pour les livres >50 pages, obligatoire pour ebooks.',
    rule: 'Ebook Kindle : table des matières avec liens cliquables obligatoire. Broché : table avec numéros de pages exacts.',
    category: 'content',
    severity: 'important'
  },
  {
    id: 'no-urls',
    label: 'Pas de liens/URL dans le broché',
    description: 'Amazon interdit les URLs promotionnelles dans les brochés.',
    rule: 'INTERDIT dans brochés : URLs vers des sites, QR codes promotionnels, liens affiliés. Exception : bibliographie/sources académiques.',
    category: 'content',
    severity: 'critical'
  },
  {
    id: 'no-placeholder',
    label: 'Aucun contenu placeholder',
    description: 'Tout texte "Lorem ipsum" ou pages vides sera rejeté.',
    rule: 'Vérifiez : pas de "Lorem ipsum", pas de "[insérer texte ici]", pas d\'images placeholder, pas de pages blanches non intentionnelles.',
    category: 'content',
    severity: 'critical'
  },
  // MÉTADONNÉES
  {
    id: 'description-length',
    label: 'Description KDP (4000 chars max)',
    description: 'La description est votre principal outil de conversion.',
    rule: 'Max 4000 caractères. HTML autorisé : <b>, <i>, <br>, <h2>. INTERDIT : <a>, <img>, <p>, <ul>, <li>, liens, prix, promotions.',
    category: 'metadata',
    severity: 'critical'
  },
  {
    id: 'keywords-7',
    label: '7 mots-clés backend',
    description: 'Les 7 champs de mots-clés du tableau de bord KDP.',
    rule: 'Max 50 caractères/champ. INTERDIT : "kindle", "ebook", "livre", "gratuit", "best-seller", marques déposées, ASIN, ISBN. Ne PAS répéter le titre.',
    category: 'metadata',
    severity: 'critical'
  },
  {
    id: 'categories',
    label: 'Catégories Amazon (2 max)',
    description: 'Vous pouvez choisir jusqu\'à 2 catégories.',
    rule: 'Choisissez les catégories les plus spécifiques possibles. Astuce : contactez le support Amazon pour ajouter jusqu\'à 10 catégories après publication.',
    category: 'metadata',
    severity: 'important'
  },
  {
    id: 'subtitle',
    label: 'Sous-titre optimisé SEO',
    description: 'Le sous-titre booste votre référencement Amazon.',
    rule: 'Max 200 caractères. Incluez vos mots-clés principaux. INTERDIT : "best-seller", mentions de prix, superlatifs non vérifiables.',
    category: 'metadata',
    severity: 'recommended'
  },
  // QUALITÉ
  {
    id: 'spelling',
    label: 'Orthographe et grammaire',
    description: 'Amazon peut retirer un livre avec trop de fautes.',
    rule: 'Passez votre texte dans un correcteur (Antidote, LanguageTool). Taux d\'erreur acceptable : <1 faute / 1000 mots.',
    category: 'quality',
    severity: 'important'
  },
  {
    id: 'ai-disclosure',
    label: 'Divulgation contenu IA',
    description: 'Depuis 2024, Amazon demande de déclarer l\'usage de l\'IA.',
    rule: 'Si le contenu ou les images sont générés par IA, cochez "AI-Generated" dans le formulaire KDP. Non-divulgation = risque de suppression du compte.',
    category: 'quality',
    severity: 'critical'
  },
  {
    id: 'originality',
    label: 'Contenu original',
    description: 'Le plagiat entraîne la suppression immédiate.',
    rule: 'Le contenu doit être original. Amazon utilise des outils anti-plagiat. Les livres "domaine public" recyclés sans valeur ajoutée sont refusés.',
    category: 'quality',
    severity: 'critical'
  },
  {
    id: 'low-content-rules',
    label: 'Règles low-content',
    description: 'Les livres à faible contenu (coloriages, agendas) ont des règles spécifiques.',
    rule: 'Les livres low-content doivent avoir un contenu unique (pas de pages identiques en boucle). Max 1 livre identique publié. Varier les designs.',
    category: 'quality',
    severity: 'important'
  }
];

const REJECTION_REASONS = [
  { reason: 'Images basse résolution (<300 DPI)', frequency: 'Très fréquent', fix: 'Convertissez toutes les images en 300+ DPI. Utilisez un outil comme GIMP ou Photoshop.' },
  { reason: 'Titre couverture ≠ titre KDP', frequency: 'Fréquent', fix: 'Copiez-collez le titre exact de votre couverture dans le formulaire KDP.' },
  { reason: 'Fond perdu manquant', frequency: 'Fréquent', fix: 'Si une image touche le bord, ajoutez 3.2mm de fond perdu de chaque côté.' },
  { reason: 'Marges trop petites', frequency: 'Courant', fix: 'Utilisez le calculateur de marges Amazon. Gouttière minimum : 0.375" (9.5mm).' },
  { reason: 'Description avec HTML interdit', frequency: 'Courant', fix: 'Retirez tout HTML sauf <b>, <i>, <br>, <h2>. Pas de <p>, <ul>, <li>, <a>.' },
  { reason: 'Mots-clés interdits dans backend', frequency: 'Courant', fix: 'Retirez "kindle", "ebook", "livre", "gratuit", "best-seller" des 7 champs.' },
  { reason: 'Contenu placeholder oublié', frequency: 'Occasionnel', fix: 'Recherchez "lorem", "insérer", "TODO" dans votre manuscrit.' },
  { reason: 'Non-divulgation IA', frequency: 'Nouveau (2024+)', fix: 'Cochez la case "AI-Generated" si vous avez utilisé l\'IA pour le texte ou les images.' },
  { reason: 'Pages blanches non intentionnelles', frequency: 'Occasionnel', fix: 'Le nombre de pages doit être pair. Ajoutez des pages "Notes" ou "aussi par l\'auteur".' },
  { reason: 'ISBN réutilisé', frequency: 'Rare mais grave', fix: 'Chaque format (broché, relié, ebook) nécessite un ISBN UNIQUE. Ne réutilisez jamais.' },
];

const KDP_FORMATS = [
  { size: '5" × 8"', cm: '12.7 × 20.3 cm', usage: 'Roman, fiction', popular: false },
  { size: '5.25" × 8"', cm: '13.3 × 20.3 cm', usage: 'Roman compact', popular: false },
  { size: '5.5" × 8.5"', cm: '14 × 21.6 cm', usage: 'Non-fiction, guides', popular: true },
  { size: '6" × 9"', cm: '15.2 × 22.9 cm', usage: 'Standard polyvalent', popular: true },
  { size: '6.14" × 9.21"', cm: '15.6 × 23.4 cm', usage: 'Royal (UK)', popular: false },
  { size: '7" × 10"', cm: '17.8 × 25.4 cm', usage: 'Manuels, cahiers d\'exercices', popular: true },
  { size: '8" × 10"', cm: '20.3 × 25.4 cm', usage: 'Coloriages, livres d\'images', popular: true },
  { size: '8.5" × 11"', cm: '21.6 × 27.9 cm', usage: 'Cahiers, workbooks', popular: false },
];

const CHAR_LIMITS = [
  { field: 'Titre', limit: '200 caractères', note: 'Pas de sous-titre ici — utilisez le champ dédié' },
  { field: 'Sous-titre', limit: '200 caractères', note: 'Optimisez pour le SEO avec des mots-clés' },
  { field: 'Description', limit: '4 000 caractères', note: 'HTML limité : <b>, <i>, <br>, <h2>' },
  { field: 'Nom d\'auteur', limit: '100 caractères', note: 'Doit correspondre à la couverture' },
  { field: 'Contributeur', limit: '100 caractères', note: 'Illustrateur, éditeur, etc.' },
  { field: 'Mot-clé backend (×7)', limit: '50 caractères / champ', note: 'Pas de "kindle", "ebook", "livre", "gratuit"' },
  { field: 'Nom d\'éditeur', limit: '100 caractères', note: 'Optionnel mais recommandé' },
];

const categoryLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  format: { label: 'Format & Dimensions', icon: <Ruler className="w-4 h-4" />, color: 'text-blue-600' },
  content: { label: 'Contenu & Structure', icon: <FileText className="w-4 h-4" />, color: 'text-emerald-600' },
  images: { label: 'Images & Couverture', icon: <Image className="w-4 h-4" />, color: 'text-purple-600' },
  metadata: { label: 'Métadonnées SEO', icon: <Type className="w-4 h-4" />, color: 'text-orange-600' },
  quality: { label: 'Qualité & Conformité', icon: <Shield className="w-4 h-4" />, color: 'text-red-600' },
};

const severityConfig = {
  critical: { label: 'Critique', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="w-4 h-4" /> },
  important: { label: 'Important', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <AlertTriangle className="w-4 h-4" /> },
  recommended: { label: 'Recommandé', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Info className="w-4 h-4" /> },
};

const KdpGuideChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('kdp-checklist-progress');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('kdp-checklist-progress', JSON.stringify([...checkedItems]));
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((checkedItems.size / KDP_CHECKLIST.length) * 100);
  const criticalItems = KDP_CHECKLIST.filter(i => i.severity === 'critical');
  const criticalDone = criticalItems.filter(i => checkedItems.has(i.id)).length;

  const copyRule = (rule: string) => {
    navigator.clipboard.writeText(rule);
    toast.success('Règle copiée !');
  };

  const resetChecklist = () => {
    setCheckedItems(new Set());
    toast.success('Checklist réinitialisée');
  };

  const renderChecklistByCategory = (category: string) => {
    const items = KDP_CHECKLIST.filter(i => i.category === category);
    return (
      <div className="space-y-2">
        {items.map((item) => {
          const checked = checkedItems.has(item.id);
          const sev = severityConfig[item.severity];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-3 transition-all cursor-pointer ${
                checked 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' 
                  : 'bg-background border-border hover:border-primary/30'
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {checked 
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                    : <Circle className="w-5 h-5 text-muted-foreground/40" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`font-medium text-sm ${checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.label}
                    </span>
                    <Badge className={`text-[10px] ${sev.color}`}>
                      {sev.icon}
                      <span className="ml-1">{sev.label}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-start gap-2 bg-muted/50 rounded-md p-2">
                    <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs font-mono leading-relaxed">{item.rule}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 shrink-0"
                      onClick={(e) => { e.stopPropagation(); copyRule(item.rule); }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Guide KDP — Règles Amazon Officielles
                <Badge className="bg-red-500 text-white border-0 text-[10px]">2024-2026</Badge>
              </CardTitle>
              <CardDescription>
                Checklist interactive basée sur les vraies exigences Amazon KDP
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{checkedItems.size}/{KDP_CHECKLIST.length} vérifications</span>
              <span className={`font-bold ${progress === 100 ? 'text-emerald-600' : progress > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  Critiques : {criticalDone}/{criticalItems.length}
                </span>
                <span className={`font-semibold ${criticalDone === criticalItems.length ? 'text-emerald-600' : 'text-red-600'}`}>
                  {criticalDone === criticalItems.length ? '✅ Prêt pour publication' : '⚠️ Points critiques restants'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetChecklist} className="text-xs">
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist" className="text-xs">✅ Checklist</TabsTrigger>
          <TabsTrigger value="formats" className="text-xs">📐 Formats</TabsTrigger>
          <TabsTrigger value="limits" className="text-xs">📏 Limites</TabsTrigger>
          <TabsTrigger value="rejections" className="text-xs">🚫 Erreurs</TabsTrigger>
        </TabsList>

        {/* CHECKLIST TAB */}
        <TabsContent value="checklist" className="space-y-4">
          <Accordion type="multiple" defaultValue={['format', 'images', 'content', 'metadata', 'quality']} className="space-y-2">
            {Object.entries(categoryLabels).map(([key, cat]) => {
              const items = KDP_CHECKLIST.filter(i => i.category === key);
              const done = items.filter(i => checkedItems.has(i.id)).length;
              return (
                <AccordionItem key={key} value={key} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3">
                      <span className={cat.color}>{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.label}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {done}/{items.length}
                      </Badge>
                      {done === items.length && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {renderChecklistByCategory(key)}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>

        {/* FORMATS TAB */}
        <TabsContent value="formats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-500" />
                Formats de trim acceptés par Amazon KDP
              </CardTitle>
              <CardDescription>
                Choisissez le format adapté à votre type de livre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {KDP_FORMATS.map((fmt, i) => (
                  <div 
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      fmt.popular 
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40' 
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-bold bg-muted px-2 py-1 rounded">{fmt.size}</code>
                      <span className="text-sm text-muted-foreground">({fmt.cm})</span>
                      {fmt.popular && <Badge className="bg-amber-500 text-white border-0 text-[10px]">Populaire</Badge>}
                    </div>
                    <span className="text-sm text-muted-foreground">{fmt.usage}</span>
                  </div>
                ))}
              </div>

              {/* DPI Guide */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Image className="w-4 h-4 text-purple-500" />
                  Résolutions requises (DPI)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Images intérieures', dpi: '300 DPI min', note: 'Obligatoire pour impression', color: 'border-red-200 dark:border-red-800/40' },
                    { label: 'Couverture', dpi: '300 DPI min', note: 'Idéal : 600 DPI', color: 'border-purple-200 dark:border-purple-800/40' },
                    { label: 'Ebook Kindle', dpi: '72-300 DPI', note: 'Optimisez la taille du fichier', color: 'border-blue-200 dark:border-blue-800/40' },
                  ].map((item, i) => (
                    <Card key={i} className={`${item.color}`}>
                      <CardContent className="p-3 text-center">
                        <p className="font-bold text-lg">{item.dpi}</p>
                        <p className="text-xs font-medium">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{item.note}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Spine Calculator */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  Calcul de la largeur du dos
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-background rounded border">
                    <p className="font-medium">Papier blanc</p>
                    <p className="font-mono text-muted-foreground">pages × 0.002252"</p>
                    <p className="text-[10px] text-muted-foreground">Ex: 200 pages = 0.45" (11.4mm)</p>
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <p className="font-medium">Papier crème</p>
                    <p className="font-mono text-muted-foreground">pages × 0.0025"</p>
                    <p className="text-[10px] text-muted-foreground">Ex: 200 pages = 0.50" (12.7mm)</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  ⚠️ Le texte sur le dos est interdit en dessous de 79 pages (le dos est trop fin).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LIMITS TAB */}
        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="w-5 h-5 text-orange-500" />
                Limites de caractères Amazon KDP
              </CardTitle>
              <CardDescription>
                Respectez ces limites pour éviter le rejet de votre publication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {CHAR_LIMITS.map((cl, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{cl.field}</p>
                      <p className="text-[10px] text-muted-foreground">{cl.note}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs shrink-0 ml-3">
                      {cl.limit}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* HTML Rules */}
              <div className="mt-6 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/40">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  HTML autorisé dans la description Amazon
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 mb-1">✅ Autorisé</p>
                    <div className="space-y-1">
                      {['<b>gras</b>', '<i>italique</i>', '<br> saut de ligne', '<h2>titre</h2>'].map((tag, i) => (
                        <code key={i} className="block text-[11px] bg-emerald-100/50 dark:bg-emerald-900/20 px-2 py-1 rounded font-mono">{tag}</code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-600 mb-1">❌ Interdit</p>
                    <div className="space-y-1">
                      {['<a href="...">', '<img src="...">', '<p>, <ul>, <li>', '<div>, <span>'].map((tag, i) => (
                        <code key={i} className="block text-[11px] bg-red-100/50 dark:bg-red-900/20 px-2 py-1 rounded font-mono">{tag}</code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Backend Keywords Rules */}
              <div className="mt-4 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/40">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Shield className="w-4 h-4" />
                  Mots interdits dans les 7 keywords backend
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['kindle', 'ebook', 'e-book', 'livre', 'book', 'gratuit', 'free', 'best-seller', 'bestseller', 'prix', 'promotion', 'discount'].map((word, i) => (
                    <Badge key={i} variant="outline" className="text-red-600 border-red-300 dark:border-red-700 text-[11px]">
                      ❌ {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REJECTIONS TAB */}
        <TabsContent value="rejections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Top 10 des erreurs de rejet Amazon KDP
              </CardTitle>
              <CardDescription>
                Évitez ces erreurs fréquentes pour ne pas retarder votre publication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {REJECTION_REASONS.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-lg border bg-background hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{item.reason}</p>
                          <Badge variant="outline" className="text-[10px]">{item.frequency}</Badge>
                        </div>
                        <div className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded p-2 mt-2">
                          <Sparkles className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">{item.fix}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KdpGuideChecklist;
