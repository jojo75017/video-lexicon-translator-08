import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Fish, Droplets, Thermometer, Sparkles, Image as ImageIcon, Download, BookOpen,
  Loader2, RefreshCw, FileText, Settings, Heart, AlertTriangle, Star, Copy, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

interface FishSheet {
  id: number;
  scientificName: string;
  commonName: string;
  origin: string;
  adultSize: string;
  lifespan: string;
  behavior: string;
  swimmingLevel: string;
  temperature: string;
  ph: string;
  gh: string;
  kh: string;
  minVolume: string;
  sensitivity: string;
  aquariumType: string;
  setup: string;
  lighting: string;
  filtration: string;
  compatible: string[];
  avoid: string[];
  stockingRule: string;
  dietType: string;
  mealFrequency: string;
  menu: string[];
  dietWarning: string;
  substrate: string;
  plants: string[];
  hideouts: string;
  reproductionType: string;
  reproductionConditions: string;
  commonDiseases: string[];
  stressSigns: string;
  prevention: string;
  difficulty: string;
  difficultyStars: number;
  tips: string[];
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

interface EbookAquariumGeneratorProps {
  ebookTitle?: string;
}

const FISH_CATEGORIES = [
  { id: 'tropical', label: '🐠 Eau douce tropicale', description: 'Néons, guppys, scalaires, discus...' },
  { id: 'coldwater', label: '❄️ Eau froide', description: 'Poissons rouges, koïs...' },
  { id: 'marine', label: '🌊 Eau de mer', description: 'Clowns, chirurgiens...' },
  { id: 'mixed', label: '🎯 Mix complet', description: 'Toutes catégories' },
];

const EbookAquariumGenerator: React.FC<EbookAquariumGeneratorProps> = ({ ebookTitle = '' }) => {
  const [bookTitle, setBookTitle] = useState(ebookTitle || 'Guide Complet des Poissons d\'Aquarium');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('tropical');
  const [numberOfSheets, setNumberOfSheets] = useState('40');
  const [customInstructions, setCustomInstructions] = useState('');
  
  const [sheets, setSheets] = useState<FishSheet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const generateSheets = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre pour votre livre');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Génération des fiches poissons...');
    setSheets([]);

    try {
      setProgress(10);
      
      const { data, error } = await supabase.functions.invoke('generate-aquarium-sheets', {
        body: {
          numberOfSheets: parseInt(numberOfSheets),
          category,
          customInstructions
        }
      });

      if (error) throw error;

      if (data?.fishList && Array.isArray(data.fishList)) {
        const fishSheets: FishSheet[] = data.fishList.map((fish: any, index: number) => ({
          ...fish,
          id: index + 1,
          compatible: Array.isArray(fish.compatible) ? fish.compatible : [fish.compatible || 'Non spécifié'],
          avoid: Array.isArray(fish.avoid) ? fish.avoid : [fish.avoid || 'Aucun'],
          menu: Array.isArray(fish.menu) ? fish.menu : [fish.menu || 'Granulés'],
          plants: Array.isArray(fish.plants) ? fish.plants : [fish.plants || 'Plantes variées'],
          commonDiseases: Array.isArray(fish.commonDiseases) ? fish.commonDiseases : [fish.commonDiseases || 'Ichtyophthirius'],
          tips: Array.isArray(fish.tips) ? fish.tips : [fish.tips || 'Acclimatation lente'],
          difficultyStars: fish.difficultyStars || 2,
        }));

        setSheets(fishSheets);
        setProgress(40);
        toast.success(`${fishSheets.length} fiches poissons générées !`);
        setActiveTab('sheets');
        
        // Générer les images en arrière-plan
        generateSheetImages(fishSheets);
      }
    } catch (err) {
      console.error('Erreur génération:', err);
      toast.error('Erreur lors de la génération des fiches');
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  const generateSheetImages = async (sheetsToProcess: FishSheet[]) => {
    setIsGeneratingImages(true);
    
    for (let i = 0; i < sheetsToProcess.length; i++) {
      const sheet = sheetsToProcess[i];
      setCurrentStep(`Image ${i + 1}/${sheetsToProcess.length}: ${sheet.commonName}...`);
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-aquarium-image', {
          body: {
            fishName: sheet.commonName,
            scientificName: sheet.scientificName,
            origin: sheet.origin
          }
        });

        if (error) {
          console.error(`Erreur image ${sheet.commonName}:`, error);
          if (error.message?.includes('429') || error.message?.includes('402')) {
            toast.error('Limite atteinte - images suivantes ignorées');
            break;
          }
        } else if (data?.imageUrl) {
          setSheets(prev => prev.map(s => 
            s.id === sheet.id ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false } : s
          ));
          toast.success(`Image: ${sheet.commonName}`);
        }
      } catch (err) {
        console.error(`Erreur image ${sheet.commonName}:`, err);
      }
      
      setProgress(40 + ((i + 1) / sheetsToProcess.length) * 55);
    }
    
    setIsGeneratingImages(false);
    setCurrentStep('');
  };

  const regenerateImage = async (sheetId: number) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (!sheet) return;
    
    setSheets(prev => prev.map(s => 
      s.id === sheetId ? { ...s, isGeneratingImage: true } : s
    ));
    
    toast.info(`Regénération de l'image pour ${sheet.commonName}...`);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-aquarium-image', {
        body: {
          fishName: sheet.commonName,
          scientificName: sheet.scientificName,
          origin: sheet.origin
        }
      });

      if (!error && data?.imageUrl) {
        setSheets(prev => prev.map(s => 
          s.id === sheetId ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false } : s
        ));
        toast.success('Image regénérée !');
      } else {
        throw new Error(error?.message || 'Échec génération');
      }
    } catch (err) {
      setSheets(prev => prev.map(s => 
        s.id === sheetId ? { ...s, isGeneratingImage: false } : s
      ));
      toast.error('Erreur lors de la regénération');
    }
  };

  const generateCover = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez d\'abord entrer un titre');
      return;
    }

    setIsGeneratingCover(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: bookTitle,
          authorName: authorName,
          genre: 'non-fiction',
          style: 'modern',
          customPrompt: `Couverture de livre sur l'aquariophilie. Superbe aquarium tropical avec poissons colorés (néons, discus, scalaires). Plantes aquatiques luxuriantes, éclairage ambiant. Style National Geographic, professionnel.`,
          showTitle: true,
          showAuthorName: !!authorName,
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setCoverImageUrl(data.imageUrl);
        toast.success('Couverture générée !');
      }
    } catch (err) {
      console.error('Erreur couverture:', err);
      toast.error('Erreur lors de la génération de la couverture');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const copySheet = async (sheet: FishSheet) => {
    const content = `
🐟 ${sheet.scientificName} (${sheet.commonName})

🗺️ Origine: ${sheet.origin}
📏 Taille adulte: ${sheet.adultSize} | ⏳ Vie: ${sheet.lifespan}
👥 Comportement: ${sheet.behavior} | Niveau nage: ${sheet.swimmingLevel}

💧 PARAMÈTRES EAU
┌──────────────┬────────┬────────┬────────┬─────────────┐
│ Température  │ pH     │ GH     │ KH     │ Volume mini │
├──────────────┼────────┼────────┼────────┼─────────────┤
│ ${sheet.temperature.padEnd(12)} │ ${sheet.ph.padEnd(6)} │ ${sheet.gh.padEnd(6)} │ ${sheet.kh.padEnd(6)} │ ${sheet.minVolume.padEnd(11)} │
└──────────────┴────────┴────────┴────────┴─────────────┘
Sensibilité: ${sheet.sensitivity}

🏠 AQUARIUM RECOMMANDÉ
- Type: ${sheet.aquariumType}
- Aménagement: ${sheet.setup}
- Éclairage: ${sheet.lighting} | Filtration: ${sheet.filtration}

🐠 COHABITATION
✅ Compatible: ${sheet.compatible.join(', ')}
❌ Éviter: ${sheet.avoid.join(', ')}
Espacement: ${sheet.stockingRule}

🍽️ ALIMENTATION
Type: ${sheet.dietType}
Repas: ${sheet.mealFrequency}
Menu: ${sheet.menu.join(', ')}
⚠️ ${sheet.dietWarning}

🌱 DÉCOR & PLANTES
- Substrat: ${sheet.substrate}
- Plantes: ${sheet.plants.join(', ')}
- Cachettes: ${sheet.hideouts}

👶 REPRODUCTION
Type: ${sheet.reproductionType}
Conditions: ${sheet.reproductionConditions}

🩺 SANTÉ & VIGILANCE
Maladies fréquentes: ${sheet.commonDiseases.join(', ')}
Signes stress: ${sheet.stressSigns}
Prévention: ${sheet.prevention}

🎯 NIVEAU: ${sheet.difficulty} ${'⭐'.repeat(sheet.difficultyStars)}
💡 Astuces:
${sheet.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

---
Source: Guide Aquariophilie 2026 | ${authorName || 'Expert Aquariophile'}
`;
    
    await navigator.clipboard.writeText(content);
    setCopiedIndex(sheet.id);
    toast.success('Fiche copiée !');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportToPDF = async () => {
    if (sheets.length === 0) {
      toast.error('Aucune fiche à exporter');
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // Page de titre
      pdf.setFillColor(0, 100, 150);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.text(bookTitle, pageWidth / 2, 100, { align: 'center' });
      
      if (authorName) {
        pdf.setFontSize(16);
        pdf.text(`par ${authorName}`, pageWidth / 2, 130, { align: 'center' });
      }
      
      pdf.setFontSize(14);
      pdf.text(`${sheets.length} fiches détaillées`, pageWidth / 2, 160, { align: 'center' });

      // Fiches
      for (let i = 0; i < sheets.length; i++) {
        const sheet = sheets[i];
        pdf.addPage();
        
        let y = margin;
        
        // En-tête
        pdf.setFillColor(0, 150, 200);
        pdf.rect(0, 0, pageWidth, 35, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.text(`${sheet.scientificName}`, margin, 15);
        pdf.setFontSize(12);
        pdf.text(`(${sheet.commonName})`, margin, 25);
        
        y = 45;
        pdf.setTextColor(0, 0, 0);
        
        // Infos de base
        pdf.setFontSize(10);
        pdf.text(`Origine: ${sheet.origin}`, margin, y);
        pdf.text(`Taille: ${sheet.adultSize} | Vie: ${sheet.lifespan}`, margin, y + 6);
        pdf.text(`Comportement: ${sheet.behavior} | Nage: ${sheet.swimmingLevel}`, margin, y + 12);
        
        y += 22;
        
        // Tableau paramètres
        pdf.setFillColor(230, 240, 250);
        pdf.rect(margin, y, pageWidth - 2 * margin, 20, 'F');
        pdf.setFontSize(9);
        pdf.text(`T°: ${sheet.temperature} | pH: ${sheet.ph} | GH: ${sheet.gh} | KH: ${sheet.kh} | Vol: ${sheet.minVolume}`, margin + 5, y + 8);
        pdf.text(`Sensibilité: ${sheet.sensitivity}`, margin + 5, y + 15);
        
        y += 28;
        
        // Aquarium
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AQUARIUM', margin, y);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        y += 6;
        pdf.text(`Type: ${sheet.aquariumType}`, margin, y);
        y += 5;
        pdf.text(`Setup: ${sheet.setup}`, margin, y, { maxWidth: pageWidth - 2 * margin });
        y += 10;
        
        // Cohabitation
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('COHABITATION', margin, y);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        y += 6;
        pdf.text(`Compatible: ${sheet.compatible.slice(0, 5).join(', ')}`, margin, y);
        y += 5;
        pdf.text(`Eviter: ${sheet.avoid.slice(0, 3).join(', ')}`, margin, y);
        y += 10;
        
        // Alimentation
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ALIMENTATION', margin, y);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        y += 6;
        pdf.text(`${sheet.dietType} - ${sheet.mealFrequency}`, margin, y);
        y += 5;
        pdf.text(`Menu: ${sheet.menu.slice(0, 4).join(', ')}`, margin, y);
        y += 10;
        
        // Santé
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SANTE', margin, y);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        y += 6;
        pdf.text(`Maladies: ${sheet.commonDiseases.slice(0, 3).join(', ')}`, margin, y);
        y += 5;
        pdf.text(`Prevention: ${sheet.prevention}`, margin, y, { maxWidth: pageWidth - 2 * margin });
        y += 10;
        
        // Niveau
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`NIVEAU: ${sheet.difficulty} ${'*'.repeat(sheet.difficultyStars)}`, margin, y);
        
        // Numéro de page
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${i + 2}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
      }

      pdf.save(`${bookTitle.replace(/[^a-zA-Z0-9]/g, '_')}_aquariophilie.pdf`);
      toast.success('PDF exporté avec succès !');
    } catch (err) {
      console.error('Erreur export:', err);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const getDifficultyColor = (stars: number) => {
    if (stars === 1) return 'bg-green-100 text-green-800';
    if (stars === 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-800">
            <Fish className="h-6 w-6" />
            Générateur Fiches Aquariophilie
          </CardTitle>
          <CardDescription>
            Créez un guide complet avec {numberOfSheets} fiches techniques de poissons d'aquarium
          </CardDescription>
        </CardHeader>
      </Card>

      {(isGenerating || isGeneratingImages) && (
        <Card className="border-cyan-300">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                <span className="text-sm font-medium">{currentStep || 'Génération en cours...'}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {isGeneratingImages ? 'Les images sont générées en arrière-plan...' : 'Veuillez patienter...'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Config
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-1">
            <Fish className="h-4 w-4" />
            Fiches ({sheets.length})
          </TabsTrigger>
          <TabsTrigger value="cover" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Couverture
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du livre</Label>
                  <Input
                    id="title"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Guide Complet des Poissons d'Aquarium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Auteur</Label>
                  <Input
                    id="author"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie de poissons</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FISH_CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nombre de fiches</Label>
                  <Select value={numberOfSheets} onValueChange={setNumberOfSheets}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20 fiches (~60 pages)</SelectItem>
                      <SelectItem value="40">40 fiches (~120 pages)</SelectItem>
                      <SelectItem value="60">60 fiches (~180 pages)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instructions personnalisées (optionnel)</Label>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Privilégier les poissons pour débutants, inclure des espèces rares..."
                  rows={3}
                />
              </div>

              <Button
                onClick={generateSheets}
                disabled={isGenerating || !bookTitle.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Générer {numberOfSheets} fiches poissons
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-4">
          {sheets.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Fish className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune fiche générée. Configurez et lancez la génération.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sheets.map((sheet) => (
                <Card key={sheet.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Fish className="h-5 w-5" />
                          {sheet.scientificName}
                        </CardTitle>
                        <CardDescription className="text-cyan-100">
                          {sheet.commonName}
                        </CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(sheet.difficultyStars)}>
                        {sheet.difficulty} {'⭐'.repeat(sheet.difficultyStars)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Image */}
                      <div className="lg:col-span-1">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                          {sheet.isGeneratingImage ? (
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                          ) : sheet.imageUrl ? (
                            <img src={sheet.imageUrl} alt={sheet.commonName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-4">
                              <Fish className="h-12 w-12 mx-auto text-cyan-400 mb-2" />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => regenerateImage(sheet.id)}
                              >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                Générer image
                              </Button>
                            </div>
                          )}
                        </div>
                        {sheet.imageUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full mt-2"
                            onClick={() => regenerateImage(sheet.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regénérer
                          </Button>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="lg:col-span-2 space-y-3">
                        {/* Origine & Taille */}
                        <div className="flex flex-wrap gap-2 text-sm">
                          <Badge variant="outline">🗺️ {sheet.origin}</Badge>
                          <Badge variant="outline">📏 {sheet.adultSize}</Badge>
                          <Badge variant="outline">⏳ {sheet.lifespan}</Badge>
                          <Badge variant="outline">👥 {sheet.behavior}</Badge>
                        </div>

                        {/* Tableau paramètres eau */}
                        <div className="rounded-lg border overflow-hidden">
                          <Table>
                            <TableHeader className="bg-cyan-50">
                              <TableRow>
                                <TableHead className="text-xs">
                                  <Thermometer className="h-3 w-3 inline mr-1" />
                                  Temp.
                                </TableHead>
                                <TableHead className="text-xs">pH</TableHead>
                                <TableHead className="text-xs">GH</TableHead>
                                <TableHead className="text-xs">KH</TableHead>
                                <TableHead className="text-xs">
                                  <Droplets className="h-3 w-3 inline mr-1" />
                                  Volume
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-xs font-medium">{sheet.temperature}</TableCell>
                                <TableCell className="text-xs">{sheet.ph}</TableCell>
                                <TableCell className="text-xs">{sheet.gh}</TableCell>
                                <TableCell className="text-xs">{sheet.kh}</TableCell>
                                <TableCell className="text-xs font-medium">{sheet.minVolume}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Cohabitation */}
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-green-600 font-medium">✅</span>
                          {sheet.compatible.slice(0, 4).map((c, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {c}
                            </Badge>
                          ))}
                          <span className="text-xs text-red-600 font-medium ml-2">❌</span>
                          {sheet.avoid.slice(0, 2).map((a, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-red-100 text-red-700">
                              {a}
                            </Badge>
                          ))}
                        </div>

                        {/* Alimentation */}
                        <div className="text-sm">
                          <span className="font-medium">🍽️ {sheet.dietType}</span>
                          <span className="text-muted-foreground ml-2">({sheet.mealFrequency})</span>
                        </div>

                        {/* Tips */}
                        <div className="text-xs text-muted-foreground">
                          💡 {sheet.tips[0]}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copySheet(sheet)}
                          >
                            {copiedIndex === sheet.id ? (
                              <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 mr-1" />
                            )}
                            Copier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cover" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                {coverImageUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={coverImageUrl} 
                      alt="Couverture" 
                      className="max-h-96 mx-auto rounded-lg shadow-lg"
                    />
                    <div className="flex justify-center gap-2">
                      <Button onClick={generateCover} disabled={isGeneratingCover}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regénérer
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={coverImageUrl} download="couverture-aquariophilie.png">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <BookOpen className="h-16 w-16 mx-auto text-cyan-300 mb-4" />
                    <Button 
                      onClick={generateCover} 
                      disabled={isGeneratingCover || !bookTitle}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      {isGeneratingCover ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Générer la couverture
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-4">
                <div className="p-6 bg-cyan-50 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-cyan-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Export PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {sheets.length} fiches prêtes à exporter au format PDF
                  </p>
                  <Button
                    onClick={exportToPDF}
                    disabled={isExporting || sheets.length === 0}
                    className="bg-cyan-600 hover:bg-cyan-700"
                    size="lg"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Export en cours...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Exporter en PDF
                      </>
                    )}
                  </Button>
                </div>

                {sheets.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">{sheets.length}</div>
                      <div className="text-sm text-muted-foreground">Fiches</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">
                        {sheets.filter(s => s.imageUrl).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Images</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">
                        ~{sheets.length * 3}
                      </div>
                      <div className="text-sm text-muted-foreground">Pages</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookAquariumGenerator;
