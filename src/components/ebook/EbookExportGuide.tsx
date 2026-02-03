import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Type, 
  Ruler, 
  FileText, 
  BookOpen, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  Copy,
  Lightbulb,
  Baby,
  User,
  Glasses,
  Layout,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const EbookExportGuide: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState('typography');

  // Fonction pour copier un paramètre
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  // Formats KDP Amazon
  const kdpFormats = [
    { name: '5" x 8"', cm: '12.7 x 20.32 cm', use: 'Romans, essais', popular: true },
    { name: '5.5" x 8.5"', cm: '13.97 x 21.59 cm', use: 'Non-fiction, guides', popular: true },
    { name: '6" x 9"', cm: '15.24 x 22.86 cm', use: 'Manuels, livres illustrés', popular: true },
    { name: '8.5" x 11"', cm: '21.59 x 27.94 cm', use: 'Cahiers, workbooks', popular: false },
    { name: '7" x 10"', cm: '17.78 x 25.4 cm', use: 'Livres techniques', popular: false },
    { name: '8" x 10"', cm: '20.32 x 25.4 cm', use: 'Livres de cuisine, photos', popular: false },
  ];

  // Formats poche français
  const pocheFormats = [
    { name: '11 x 17.5 cm', inches: '4.33" x 6.89"', use: 'Format poche classique', popular: true },
    { name: '11 x 18 cm', inches: '4.33" x 7.09"', use: 'Poche littérature', popular: true },
    { name: '12 x 19 cm', inches: '4.72" x 7.48"', use: 'Collection Folio', popular: true },
    { name: '13 x 20 cm', inches: '5.12" x 7.87"', use: 'Grand poche', popular: false },
    { name: '14 x 21 cm', inches: '5.51" x 8.27"', use: 'Format A5 approché', popular: false },
  ];

  // Paramètres typographiques par public
  const typographySettings = {
    adults: {
      label: 'Adultes',
      icon: User,
      fontSize: '11-12pt',
      lineHeight: '1.4-1.5',
      margins: '2-2.5 cm',
      fontFamily: 'Times New Roman, Garamond, Georgia',
      chapterSpacing: 'Saut de page + 3-5 lignes vides',
      tips: [
        'Utilisez des polices à empattements (serif) pour le corps du texte',
        'Évitez les polices trop décoratives pour la lecture longue',
        'Gardez une marge intérieure légèrement plus grande (reliure)',
      ],
    },
    children: {
      label: 'Enfants (6-12 ans)',
      icon: Baby,
      fontSize: '14-18pt',
      lineHeight: '1.6-1.8',
      margins: '2.5-3 cm',
      fontFamily: 'Comic Sans MS, Century Gothic, Verdana',
      chapterSpacing: 'Saut de page + illustration',
      tips: [
        'Privilégiez les polices sans empattements (sans-serif)',
        'Plus d\'espace entre les lignes facilite la lecture',
        'Intégrez des illustrations tous les 2-3 pages',
      ],
    },
    seniors: {
      label: 'Seniors / Malvoyants',
      icon: Glasses,
      fontSize: '14-16pt',
      lineHeight: '1.6-1.8',
      margins: '2.5-3 cm',
      fontFamily: 'Georgia, Verdana, Arial',
      chapterSpacing: 'Saut de page + 5 lignes vides',
      tips: [
        'Évitez l\'italique prolongé',
        'Contraste élevé (noir sur blanc pur)',
        'Format A5 ou plus grand recommandé',
      ],
    },
  };

  // Structure document KDP
  const documentStructure = [
    { section: 'Page de garde', page: 'Impaire (droite)', required: true, description: 'Titre + Auteur + Éditeur' },
    { section: 'Page de titre', page: 'Impaire', required: true, description: 'Titre seul, centré' },
    { section: 'Copyright', page: 'Paire (verso titre)', required: true, description: 'ISBN, droits, date' },
    { section: 'Dédicace', page: 'Impaire', required: false, description: 'Optionnelle, en italique' },
    { section: 'Table des matières', page: 'Impaire', required: true, description: 'Avec numéros de page' },
    { section: 'Préface / Avant-propos', page: 'Impaire', required: false, description: 'Numérotation romaine' },
    { section: 'Chapitres', page: 'Toujours impaire', required: true, description: 'Chaque chapitre commence page droite' },
    { section: 'Conclusion', page: 'Suite logique', required: false, description: 'Après dernier chapitre' },
    { section: 'Remerciements', page: 'Impaire', required: false, description: 'Après conclusion' },
    { section: 'À propos de l\'auteur', page: 'Dernière ou avant-dernière', required: true, description: 'Bio + photo optionnelle' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Download className="w-6 h-6 text-primary" />
            Guide des Paramètres d'Export
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              NOUVEAU 2026
            </Badge>
          </h2>
          <p className="text-muted-foreground mt-1">
            Tous les paramètres pour créer des ebooks professionnels Word et PDF
          </p>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeGuide} onValueChange={setActiveGuide} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
          <TabsTrigger 
            value="typography" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Typographie</span>
          </TabsTrigger>
          <TabsTrigger 
            value="formats" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Ruler className="w-4 h-4" />
            <span className="hidden sm:inline">Formats & Dimensions</span>
          </TabsTrigger>
          <TabsTrigger 
            value="structure" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Structure Document</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Typographie */}
        <TabsContent value="typography" className="mt-6 space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                Paramètres Typographiques par Public
              </CardTitle>
              <CardDescription>
                Adaptez la police et la taille selon vos lecteurs cibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(typographySettings).map(([key, setting]) => {
                  const Icon = setting.icon;
                  return (
                    <Card key={key} className="bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          {setting.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-background rounded-md">
                            <span className="text-sm text-muted-foreground">Taille police</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="font-mono font-bold text-primary"
                              onClick={() => copyToClipboard(setting.fontSize, 'Taille')}
                            >
                              {setting.fontSize}
                              <Copy className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-2 bg-background rounded-md">
                            <span className="text-sm text-muted-foreground">Interligne</span>
                            <span className="font-mono font-semibold">{setting.lineHeight}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-2 bg-background rounded-md">
                            <span className="text-sm text-muted-foreground">Marges</span>
                            <span className="font-mono font-semibold">{setting.margins}</span>
                          </div>
                          
                          <div className="p-2 bg-background rounded-md">
                            <span className="text-sm text-muted-foreground block mb-1">Polices recommandées</span>
                            <span className="text-xs font-mono">{setting.fontFamily}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <ul className="text-xs space-y-1 text-muted-foreground">
                              {setting.tips.map((tip, i) => (
                                <li key={i}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Paramètres avancés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Paramètres Word/DOCX Avancés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="titles">
                  <AccordionTrigger>Hiérarchie des Titres</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
                        <div>
                          <span className="font-semibold block">Titre livre (H1)</span>
                          <span className="text-muted-foreground">24-32pt, centré, gras</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Titre chapitre (H2)</span>
                          <span className="text-muted-foreground">18-24pt, gras</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Sous-titre (H3)</span>
                          <span className="text-muted-foreground">14-16pt, semi-gras</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Les tailles sont automatiquement proportionnelles à la taille de base choisie
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="paragraphs">
                  <AccordionTrigger>Mise en Forme des Paragraphes</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span><strong>Alinéa :</strong> 0.5 à 1 cm pour la première ligne</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span><strong>Justification :</strong> Texte justifié (aligné des deux côtés)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span><strong>Espacement :</strong> 6pt avant et après chaque paragraphe</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span><strong>Veuves/Orphelines :</strong> Éviter les lignes isolées (min 2 lignes)</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="special">
                  <AccordionTrigger>Éléments Spéciaux</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <span className="font-semibold block mb-2">Citations</span>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Retrait gauche/droite : 1 cm</li>
                          <li>• Italique recommandé</li>
                          <li>• Taille : 1pt de moins que le corps</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <span className="font-semibold block mb-2">Notes de bas de page</span>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Taille : 8-9pt</li>
                          <li>• Numérotation continue ou par chapitre</li>
                          <li>• Séparateur de 5 cm</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Formats */}
        <TabsContent value="formats" className="mt-6 space-y-6">
          {/* Formats KDP */}
          <Card className="border-2 border-orange-200 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                Formats KDP Amazon
                <Badge className="bg-orange-500 text-white">Impression à la demande</Badge>
              </CardTitle>
              <CardDescription>
                Dimensions officielles pour Amazon Kindle Direct Publishing
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {kdpFormats.map((format, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                      format.popular 
                        ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/20' 
                        : 'border-muted bg-card'
                    }`}
                    onClick={() => copyToClipboard(format.cm, format.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{format.name}</span>
                      {format.popular && (
                        <Badge variant="secondary" className="text-xs">Populaire</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{format.cm}</div>
                    <div className="text-xs text-primary">{format.use}</div>
                    <Button variant="ghost" size="sm" className="mt-2 w-full text-xs">
                      <Copy className="w-3 h-3 mr-1" /> Copier
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formats Poche Français */}
          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Formats Poche Français
                <Badge className="bg-blue-500 text-white">Édition traditionnelle</Badge>
              </CardTitle>
              <CardDescription>
                Dimensions standards pour les collections de poche en France
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pocheFormats.map((format, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                      format.popular 
                        ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/20' 
                        : 'border-muted bg-card'
                    }`}
                    onClick={() => copyToClipboard(format.name, format.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{format.name}</span>
                      {format.popular && (
                        <Badge variant="secondary" className="text-xs">Courant</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{format.inches}</div>
                    <div className="text-xs text-primary">{format.use}</div>
                    <Button variant="ghost" size="sm" className="mt-2 w-full text-xs">
                      <Copy className="w-3 h-3 mr-1" /> Copier
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marges par format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" />
                Marges Recommandées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Format</th>
                      <th className="text-center p-3">Haut</th>
                      <th className="text-center p-3">Bas</th>
                      <th className="text-center p-3">Intérieur*</th>
                      <th className="text-center p-3">Extérieur</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">5" x 8" (Roman)</td>
                      <td className="p-3 text-center">1.5 cm</td>
                      <td className="p-3 text-center">2 cm</td>
                      <td className="p-3 text-center">2 cm</td>
                      <td className="p-3 text-center">1.5 cm</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">6" x 9" (Guide)</td>
                      <td className="p-3 text-center">2 cm</td>
                      <td className="p-3 text-center">2.5 cm</td>
                      <td className="p-3 text-center">2.5 cm</td>
                      <td className="p-3 text-center">2 cm</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">Poche 12 x 19 cm</td>
                      <td className="p-3 text-center">1.5 cm</td>
                      <td className="p-3 text-center">1.8 cm</td>
                      <td className="p-3 text-center">1.8 cm</td>
                      <td className="p-3 text-center">1.3 cm</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">
                  * La marge intérieure (côté reliure) doit être plus grande pour permettre la lecture confortable
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Structure */}
        <TabsContent value="structure" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                Structure d'un Livre Professionnel (KDP)
              </CardTitle>
              <CardDescription>
                L'ordre et le placement des sections pour un livre conforme aux standards d'édition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documentStructure.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      item.required 
                        ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900' 
                        : 'bg-muted/50 border border-muted'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.section}</span>
                        {item.required ? (
                          <Badge className="bg-green-500 text-white text-xs">Obligatoire</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Optionnel</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-sm text-right">
                      <Badge variant="secondary">{item.page}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conseils pagination */}
          <Card className="border-2 border-violet-200 dark:border-violet-900">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-violet-600" />
                Conseils de Pagination
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    À faire
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Numérotation romaine (i, ii, iii) pour les pages liminaires</li>
                    <li>• Numérotation arabe (1, 2, 3) à partir du premier chapitre</li>
                    <li>• En-têtes avec titre du livre (pages paires) et chapitre (pages impaires)</li>
                    <li>• Page blanche avant chaque nouveau chapitre si nécessaire</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    À éviter
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Numéro de page sur la page de titre et copyright</li>
                    <li>• Chapitre commençant sur une page paire (gauche)</li>
                    <li>• En-tête/pied de page sur les pages de début de chapitre</li>
                    <li>• Moins de 100 pages pour KDP (coût d'impression élevé)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export checklist */}
          <Card className="border-2 border-emerald-200 dark:border-emerald-900">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Checklist Avant Export
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Vérifier l\'orthographe et la grammaire',
                  'Contrôler la numérotation des pages',
                  'Vérifier que chaque chapitre commence page impaire',
                  'Contrôler les veuves et orphelines',
                  'Vérifier la table des matières',
                  'Contrôler les marges (zone de sécurité KDP)',
                  'Vérifier la résolution des images (300 DPI min)',
                  'Contrôler la taille du fichier (< 650 Mo pour KDP)',
                  'Vérifier les polices intégrées (embed fonts)',
                  'Relire la page de copyright et ISBN',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-background rounded-md">
                    <div className="w-5 h-5 rounded border-2 border-emerald-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookExportGuide;
