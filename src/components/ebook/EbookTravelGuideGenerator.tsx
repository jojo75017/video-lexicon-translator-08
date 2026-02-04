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
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, Plane, Camera, Sparkles, Image as ImageIcon, Download, BookOpen,
  Loader2, RefreshCw, FileText, Globe, Mountain, Building, Palmtree,
  Compass, Sun, Moon, Sunrise, TreePine
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import ExportSection from './ExportSection';

interface TravelPage {
  id: string;
  pageNumber: number;
  location1: {
    name: string;
    description: string;
    imageUrl?: string;
    isGeneratingImage?: boolean;
  };
  location2: {
    name: string;
    description: string;
    imageUrl?: string;
    isGeneratingImage?: boolean;
  };
}

interface EbookTravelGuideGeneratorProps {
  ebookTitle?: string;
}

const travelStyles = [
  { value: 'aventure', label: '🏔️ Aventure & Nature', icon: Mountain },
  { value: 'culture', label: '🏛️ Culture & Histoire', icon: Building },
  { value: 'plage', label: '🏝️ Plages & Détente', icon: Palmtree },
  { value: 'ville', label: '🌆 Villes & Urbain', icon: Building },
  { value: 'road-trip', label: '🚗 Road Trip', icon: Compass },
  { value: 'luxe', label: '✨ Voyage de Luxe', icon: Sun },
  { value: 'backpacker', label: '🎒 Backpacking', icon: TreePine },
  { value: 'famille', label: '👨‍👩‍👧‍👦 Voyage en Famille', icon: Sun },
];

const photoStyles = [
  { value: 'realistic', label: '📷 Photo Réaliste' },
  { value: 'cinematic', label: '🎬 Cinématique' },
  { value: 'golden-hour', label: '🌅 Heure Dorée' },
  { value: 'aerial', label: '🚁 Vue Aérienne' },
  { value: 'postcard', label: '📮 Carte Postale' },
];

const exampleDestinations = [
  { title: "Merveilles de l'Italie", destination: "Italie", style: "culture" },
  { title: "Îles Paradisiaques de Thaïlande", destination: "Thaïlande", style: "plage" },
  { title: "Road Trip sur la Route 66", destination: "États-Unis", style: "road-trip" },
  { title: "Safari au Kenya", destination: "Kenya", style: "aventure" },
  { title: "Découverte du Japon", destination: "Japon", style: "culture" },
  { title: "Plages de Bali", destination: "Indonésie", style: "plage" },
];

// Liste complète des pays du monde par continent
const worldCountries = {
  '🌍 Europe': [
    'Allemagne', 'Autriche', 'Belgique', 'Bulgarie', 'Chypre', 'Croatie', 'Danemark', 
    'Espagne', 'Estonie', 'Finlande', 'France', 'Grèce', 'Hongrie', 'Irlande', 
    'Islande', 'Italie', 'Lettonie', 'Lituanie', 'Luxembourg', 'Malte', 'Monaco',
    'Monténégro', 'Norvège', 'Pays-Bas', 'Pologne', 'Portugal', 'République Tchèque',
    'Roumanie', 'Royaume-Uni', 'Serbie', 'Slovaquie', 'Slovénie', 'Suède', 'Suisse', 'Ukraine'
  ],
  '🌎 Amérique du Nord': [
    'Canada', 'États-Unis', 'Mexique', 'Costa Rica', 'Cuba', 'Guatemala', 'Haïti',
    'Honduras', 'Jamaïque', 'Nicaragua', 'Panama', 'République Dominicaine', 'Salvador'
  ],
  '🌎 Amérique du Sud': [
    'Argentine', 'Bolivie', 'Brésil', 'Chili', 'Colombie', 'Équateur', 'Guyana',
    'Paraguay', 'Pérou', 'Suriname', 'Uruguay', 'Venezuela'
  ],
  '🌏 Asie': [
    'Arabie Saoudite', 'Bangladesh', 'Cambodge', 'Chine', 'Corée du Sud', 'Émirats Arabes Unis',
    'Inde', 'Indonésie', 'Israël', 'Japon', 'Jordanie', 'Kazakhstan', 'Laos', 'Liban',
    'Malaisie', 'Maldives', 'Mongolie', 'Myanmar', 'Népal', 'Oman', 'Ouzbékistan',
    'Pakistan', 'Philippines', 'Qatar', 'Singapour', 'Sri Lanka', 'Taïwan', 'Thaïlande',
    'Turquie', 'Vietnam'
  ],
  '🌍 Afrique': [
    'Afrique du Sud', 'Algérie', 'Bénin', 'Botswana', 'Cameroun', 'Cap-Vert', 'Côte d\'Ivoire',
    'Égypte', 'Éthiopie', 'Ghana', 'Kenya', 'Madagascar', 'Mali', 'Maroc', 'Maurice',
    'Mozambique', 'Namibie', 'Nigeria', 'Ouganda', 'Rwanda', 'Sénégal', 'Seychelles',
    'Tanzanie', 'Tunisie', 'Zambie', 'Zimbabwe'
  ],
  '🌏 Océanie': [
    'Australie', 'Fidji', 'Nouvelle-Calédonie', 'Nouvelle-Zélande', 'Papouasie-Nouvelle-Guinée',
    'Polynésie Française', 'Samoa', 'Tonga', 'Vanuatu'
  ]
};

const EbookTravelGuideGenerator: React.FC<EbookTravelGuideGeneratorProps> = ({ ebookTitle = '' }) => {
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [destination, setDestination] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [travelStyle, setTravelStyle] = useState('aventure');
  const [photoStyle, setPhotoStyle] = useState('realistic');
  const [numberOfPages, setNumberOfPages] = useState(20);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [pages, setPages] = useState<TravelPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activeTab, setActiveTab] = useState('cover');
  
  // Cover state
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const applyExample = (example: { title: string; destination: string; style: string }) => {
    setBookTitle(example.title);
    setDestination(example.destination);
    setTravelStyle(example.style);
  };

  const getPhotoStylePrompt = (style: string): string => {
    const styles: Record<string, string> = {
      'realistic': 'professional travel photography, high resolution, natural lighting, vibrant colors, National Geographic style',
      'cinematic': 'cinematic photography, wide angle, dramatic lighting, movie poster quality, epic landscape',
      'golden-hour': 'golden hour photography, warm sunset/sunrise lighting, magical atmosphere, soft shadows, dreamy',
      'aerial': 'aerial drone photography, bird eye view, stunning perspective, landscape photography',
      'postcard': 'classic postcard style, saturated colors, iconic view, tourist photography, picturesque',
    };
    return styles[style] || styles['realistic'];
  };

  const generateTravelGuide = async () => {
    if (!bookTitle.trim() || !destination.trim()) {
      toast.error('Veuillez entrer un titre et une destination');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setPages([]);
    
    try {
      // Total locations needed: 2 per page × numberOfPages
      const totalLocations = numberOfPages * 2;
      
      setCurrentStep('Génération du plan de voyage...');
      setProgress(10);

      // Generate locations list
      const { data: planData, error: planError } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'travel-guide',
          prompt: `Tu es un expert en voyages. Génère une liste de ${totalLocations} lieux incontournables pour un guide de voyage sur "${destination}".

Titre du guide: "${bookTitle}"
Style de voyage: ${travelStyles.find(s => s.value === travelStyle)?.label || travelStyle}
${specialInstructions ? `Instructions spéciales: ${specialInstructions}` : ''}

Pour CHAQUE lieu, fournis:
1. Le nom du lieu (monument, plage, quartier, site naturel, etc.)
2. Une description captivante de 2-3 phrases qui donne envie de visiter

Varie les types de lieux: sites touristiques majeurs, trésors cachés, restaurants, quartiers, plages, montagnes, musées, marchés, etc.

Retourne au format JSON:
{
  "locations": [
    {
      "name": "Nom du lieu",
      "description": "Description captivante du lieu..."
    }
  ]
}`
        }
      });

      if (planError) throw planError;

      let locations: { name: string; description: string }[] = [];
      try {
        const content = planData?.content || planData?.result || '';
        const jsonMatch = content.match(/\{[\s\S]*"locations"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          locations = parsed.locations || [];
        }
      } catch (parseError) {
        console.error('Erreur parsing locations:', parseError);
        throw new Error('Erreur lors de la génération du plan');
      }

      if (locations.length < totalLocations) {
        // Pad with generic locations if needed
        while (locations.length < totalLocations) {
          locations.push({
            name: `Lieu ${locations.length + 1} de ${destination}`,
            description: `Un endroit magnifique à découvrir lors de votre voyage.`
          });
        }
      }

      setProgress(30);
      setCurrentStep('Organisation des pages...');

      // Create pages with 2 locations each
      const generatedPages: TravelPage[] = [];
      for (let i = 0; i < numberOfPages; i++) {
        const loc1Index = i * 2;
        const loc2Index = i * 2 + 1;
        generatedPages.push({
          id: `page-${Date.now()}-${i}`,
          pageNumber: i + 1,
          location1: {
            name: locations[loc1Index]?.name || `Lieu ${loc1Index + 1}`,
            description: locations[loc1Index]?.description || 'Description à venir...',
          },
          location2: {
            name: locations[loc2Index]?.name || `Lieu ${loc2Index + 1}`,
            description: locations[loc2Index]?.description || 'Description à venir...',
          }
        });
      }

      setPages(generatedPages);
      setProgress(40);
      
      // Generate images for all locations (2 per page)
      const totalImages = numberOfPages * 2;
      setCurrentStep(`Génération des ${totalImages} photos...`);
      
      for (let pageIndex = 0; pageIndex < generatedPages.length; pageIndex++) {
        const page = generatedPages[pageIndex];
        
        // Generate image for location 1
        const img1Index = pageIndex * 2;
        setCurrentStep(`Photo ${img1Index + 1}/${totalImages}: ${page.location1.name}...`);
        await generateLocationImage(page.id, 'location1', page.location1.name, destination);
        setProgress(40 + ((img1Index + 1) / totalImages) * 55);
        
        // Generate image for location 2
        const img2Index = pageIndex * 2 + 1;
        setCurrentStep(`Photo ${img2Index + 1}/${totalImages}: ${page.location2.name}...`);
        await generateLocationImage(page.id, 'location2', page.location2.name, destination);
        setProgress(40 + ((img2Index + 1) / totalImages) * 55);
      }

      setProgress(100);
      setCurrentStep('Guide de voyage généré !');
      toast.success(`Guide de voyage créé avec ${numberOfPages} pages et ${totalImages} photos !`);
      
    } catch (error) {
      console.error('Erreur génération guide:', error);
      toast.error('Erreur lors de la génération du guide');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLocationImage = async (
    pageId: string, 
    locationKey: 'location1' | 'location2', 
    locationName: string,
    destinationName: string
  ) => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          [locationKey]: { ...p[locationKey], isGeneratingImage: true }
        };
      }
      return p;
    }));

    try {
      const photoPrompt = getPhotoStylePrompt(photoStyle);
      
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: locationName,
          authorName: '',
          genre: 'travel',
          style: 'modern',
          customPrompt: `${photoPrompt}. 
Beautiful travel photograph of "${locationName}" in ${destinationName}.
Stunning landscape or architectural shot, professional quality.
NO TEXT, NO WORDS, NO TITLE, NO LETTERS, NO WATERMARK on the image.
Pure photography only, high resolution, magazine quality.`,
          showAuthorName: false,
          showTitle: false,
        }
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.coverUrl;
      if (imageUrl) {
        setPages(prev => prev.map(p => {
          if (p.id === pageId) {
            return {
              ...p,
              [locationKey]: { ...p[locationKey], imageUrl, isGeneratingImage: false }
            };
          }
          return p;
        }));
      } else {
        throw new Error('Aucune image retournée');
      }
    } catch (error) {
      console.error('Erreur génération image:', error);
      setPages(prev => prev.map(p => {
        if (p.id === pageId) {
          return {
            ...p,
            [locationKey]: { ...p[locationKey], isGeneratingImage: false }
          };
        }
        return p;
      }));
    }
  };

  const regenerateImage = async (pageId: string, locationKey: 'location1' | 'location2') => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    const location = page[locationKey];
    toast.info(`Regénération de l'image pour ${location.name}...`);
    await generateLocationImage(pageId, locationKey, location.name, destination);
  };

  // Export PDF with embedded images
  const exportToPDF = async () => {
    if (pages.length === 0) {
      toast.error('Aucune page à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Génération du PDF en cours...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // ===== COVER PAGE =====
      pdf.setFillColor(30, 58, 95); // Deep blue
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Decorative elements
      pdf.setFillColor(255, 193, 7); // Gold accent
      pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      const titleLines = pdf.splitTextToSize(bookTitle || 'Guide de Voyage', contentWidth);
      pdf.text(titleLines, pageWidth / 2, 80, { align: 'center' });

      pdf.setFontSize(18);
      pdf.setTextColor(255, 193, 7);
      pdf.text(destination, pageWidth / 2, 110, { align: 'center' });

      if (authorName) {
        pdf.setFontSize(14);
        pdf.setTextColor(200, 200, 200);
        pdf.text(`par ${authorName}`, pageWidth / 2, 130, { align: 'center' });
      }

      pdf.setFontSize(12);
      pdf.setTextColor(30, 30, 30);
      pdf.text(`${pages.length} pages • ${pages.length * 2} destinations`, pageWidth / 2, pageHeight - 15, { align: 'center' });

      // ===== TABLE OF CONTENTS =====
      pdf.addPage();
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(30, 58, 95);
      pdf.text('📍 Sommaire', margin, 28);

      let yPos = 55;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      
      pages.forEach((page, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = margin + 10;
        }
        pdf.text(`Page ${page.pageNumber}:`, margin, yPos);
        pdf.setFont('helvetica', 'bold');
        const loc1Text = pdf.splitTextToSize(page.location1.name, contentWidth / 2 - 10);
        pdf.text(loc1Text[0], margin + 25, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text('&', margin + 25 + pdf.getTextWidth(loc1Text[0]) + 3, yPos);
        pdf.setFont('helvetica', 'bold');
        const loc2Text = pdf.splitTextToSize(page.location2.name, contentWidth / 2 - 10);
        pdf.text(loc2Text[0], margin + 35 + pdf.getTextWidth(loc1Text[0]), yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 10;
      });

      // ===== CONTENT PAGES =====
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        pdf.addPage();

        // Page header
        pdf.setFillColor(30, 58, 95);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Page ${page.pageNumber} • ${destination}`, pageWidth / 2, 13, { align: 'center' });

        const halfWidth = (contentWidth - 10) / 2;
        const imageHeight = 55;
        const textStartY = 30;

        // Location 1 (left side)
        const leftX = margin;
        let leftY = textStartY;

        // Image 1
        if (page.location1.imageUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = page.location1.imageUrl!;
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            
            pdf.addImage(imgData, 'JPEG', leftX, leftY, halfWidth, imageHeight);
            leftY += imageHeight + 5;
          } catch (e) {
            console.log('Image 1 non chargée');
            leftY += 5;
          }
        }

        // Title 1
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(30, 58, 95);
        const title1Lines = pdf.splitTextToSize(page.location1.name, halfWidth);
        pdf.text(title1Lines, leftX, leftY);
        leftY += title1Lines.length * 5 + 3;

        // Description 1
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        const desc1Lines = pdf.splitTextToSize(page.location1.description, halfWidth);
        pdf.text(desc1Lines.slice(0, 8), leftX, leftY);

        // Location 2 (right side)
        const rightX = margin + halfWidth + 10;
        let rightY = textStartY;

        // Image 2
        if (page.location2.imageUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = page.location2.imageUrl!;
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            
            pdf.addImage(imgData, 'JPEG', rightX, rightY, halfWidth, imageHeight);
            rightY += imageHeight + 5;
          } catch (e) {
            console.log('Image 2 non chargée');
            rightY += 5;
          }
        }

        // Title 2
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(30, 58, 95);
        const title2Lines = pdf.splitTextToSize(page.location2.name, halfWidth);
        pdf.text(title2Lines, rightX, rightY);
        rightY += title2Lines.length * 5 + 3;

        // Description 2
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        const desc2Lines = pdf.splitTextToSize(page.location2.description, halfWidth);
        pdf.text(desc2Lines.slice(0, 8), rightX, rightY);

        // Page footer
        pdf.setFillColor(255, 193, 7);
        pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(30, 58, 95);
        pdf.text(bookTitle, pageWidth / 2, pageHeight - 4, { align: 'center' });
      }

      // Save PDF
      const fileName = `${bookTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Guide_Voyage.pdf`;
      const blob = pdf.output('blob');
      saveAs(blob, fileName);
      toast.success('PDF téléchargé avec succès !');

    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Generate book cover
  const generateCover = async () => {
    if (!bookTitle.trim() || !destination.trim()) {
      toast.error('Veuillez entrer un titre et une destination');
      return;
    }

    setIsGeneratingCover(true);
    toast.info('Génération de la couverture...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: bookTitle,
          authorName: authorName || 'Guide de Voyage',
          genre: 'travel',
          style: 'modern',
          customPrompt: `Stunning travel book cover for "${bookTitle}" featuring ${destination}.
Epic landscape photography, professional travel magazine quality.
Beautiful scenic view representing the destination.
The title "${bookTitle}" should be prominently displayed with elegant typography.
${authorName ? `Author name "${authorName}" at the bottom.` : ''}
Style: Modern travel guide, vibrant colors, cinematic quality.
Format: Book cover 6x9 inches, portrait orientation.`,
          showAuthorName: !!authorName,
          showTitle: true,
          colorScheme: 'vibrant',
        }
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.coverUrl;
      if (imageUrl) {
        setCoverImageUrl(imageUrl);
        toast.success('Couverture générée !');
      } else {
        throw new Error('Aucune image retournée');
      }
    } catch (error) {
      console.error('Erreur génération couverture:', error);
      toast.error('Erreur lors de la génération de la couverture');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Download cover image
  const downloadCover = async () => {
    if (!coverImageUrl) return;
    
    try {
      // For base64 images
      if (coverImageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = coverImageUrl;
        link.download = `${bookTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Couverture.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Couverture téléchargée !');
        return;
      }
      
      // For URL images
      const response = await fetch(coverImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Couverture.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Couverture téléchargée !');
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const imagesGenerated = pages.reduce((acc, p) => {
    return acc + (p.location1.imageUrl ? 1 : 0) + (p.location2.imageUrl ? 1 : 0);
  }, 0);
  const totalImages = pages.length * 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Générateur de Guide de Voyage
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  IA Photo
                </Badge>
              </CardTitle>
              <CardDescription>
                Créez un guide de voyage illustré avec 2 photos réalistes par page
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Examples */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Exemples de guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {exampleDestinations.map((example, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => applyExample(example)}
                className="hover:bg-primary/10 hover:border-primary/50"
              >
                {example.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* World Countries Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Choisir un pays 🌍
          </CardTitle>
          <CardDescription>
            Cliquez sur un pays pour le sélectionner comme destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="🌍 Europe" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {Object.keys(worldCountries).map((continent) => (
                <TabsTrigger key={continent} value={continent} className="text-xs px-2 py-1">
                  {continent}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(worldCountries).map(([continent, countries]) => (
              <TabsContent key={continent} value={continent} className="mt-4">
                <div className="flex flex-wrap gap-1.5">
                  {countries.map((country) => (
                    <Button
                      key={country}
                      variant={destination === country ? "default" : "outline"}
                      size="sm"
                      className={`text-xs h-7 ${destination === country ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
                      onClick={() => {
                        setDestination(country);
                        if (!bookTitle) {
                          setBookTitle(`Découverte de ${country}`);
                        }
                        toast.success(`${country} sélectionné !`);
                      }}
                    >
                      {country}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Configuration du Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookTitle">Titre du guide *</Label>
              <Input
                id="bookTitle"
                placeholder="ex: Merveilles de l'Italie"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination * <span className="text-xs text-muted-foreground">(ou choisissez ci-dessus)</span></Label>
              <Input
                id="destination"
                placeholder="ex: Italie, Paris, Japon..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Nom de l'auteur</Label>
              <Input
                id="authorName"
                placeholder="Votre nom"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Style de voyage</Label>
              <Select value={travelStyle} onValueChange={setTravelStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {travelStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Style photo</Label>
              <Select value={photoStyle} onValueChange={setPhotoStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {photoStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Page count slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Nombre de pages: {numberOfPages}</Label>
              <Badge variant="secondary">{numberOfPages * 2} photos</Badge>
            </div>
            <Slider
              value={[numberOfPages]}
              onValueChange={(v) => setNumberOfPages(v[0])}
              min={5}
              max={30}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Chaque page contient 2 destinations avec photos. Estimation: ~{numberOfPages * 2 + 10} crédits utilisateur.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Instructions spéciales (optionnel)</Label>
            <Textarea
              placeholder="ex: Mettre l'accent sur la gastronomie, inclure des plages secrètes..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            onClick={generateTravelGuide}
            disabled={isGenerating || !bookTitle.trim() || !destination.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {currentStep}
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Générer le Guide ({numberOfPages} pages, {numberOfPages * 2} photos)
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-center text-muted-foreground">{currentStep}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {pages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Aperçu du Guide
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{pages.length} pages</Badge>
                <Badge variant="secondary">{imagesGenerated}/{totalImages} photos</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="cover" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Couverture
                </TabsTrigger>
                <TabsTrigger value="pages" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Pages ({pages.length})
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Galerie ({imagesGenerated})
                </TabsTrigger>
              </TabsList>

              {/* Cover Tab */}
              <TabsContent value="cover">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cover Generation */}
                    <Card className="border-2 border-dashed border-primary/30">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Générer la Couverture
                        </CardTitle>
                        <CardDescription>
                          Créez une couverture professionnelle pour votre guide
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          onClick={generateCover}
                          disabled={isGeneratingCover || !bookTitle.trim() || !destination.trim()}
                          className="w-full bg-gradient-to-r from-primary to-primary/80"
                        >
                          {isGeneratingCover ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Génération en cours...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Générer la Couverture
                            </>
                          )}
                        </Button>
                        
                        {coverImageUrl && (
                          <Button
                            onClick={generateCover}
                            variant="outline"
                            className="w-full"
                            disabled={isGeneratingCover}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regénérer
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Cover Preview / Mockup */}
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Aperçu Mockup
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {coverImageUrl ? (
                          <div className="space-y-4">
                            {/* 3D Book Mockup Effect - Transparent Background */}
                            <div className="relative flex justify-center items-center py-10">
                              <div 
                                className="relative transform transition-all duration-500 hover:scale-105 hover:rotate-y-5"
                                style={{
                                  perspective: '1200px',
                                }}
                              >
                                {/* Shadow under the book */}
                                <div 
                                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-6 bg-black/20 blur-xl rounded-full"
                                  style={{
                                    transform: 'translateX(-50%) rotateX(80deg)',
                                  }}
                                />
                                
                                <div 
                                  className="relative"
                                  style={{
                                    transform: 'rotateY(-20deg) rotateX(5deg)',
                                    transformStyle: 'preserve-3d',
                                  }}
                                >
                                  {/* Book spine - dark like reference */}
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 w-5 rounded-l-sm"
                                    style={{
                                      background: 'linear-gradient(to right, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
                                      transform: 'rotateY(-90deg) translateZ(2px)',
                                      transformOrigin: 'left center',
                                      boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)',
                                    }}
                                  />
                                  
                                  {/* Cover image container */}
                                  <div className="relative">
                                    <img
                                      src={coverImageUrl}
                                      alt="Couverture du guide"
                                      className="w-52 h-[300px] object-cover rounded-r-md"
                                      style={{
                                        boxShadow: '10px 10px 30px rgba(0,0,0,0.4), -2px 0 10px rgba(0,0,0,0.2)',
                                      }}
                                    />
                                    
                                    {/* Pages effect on the right - multiple layers */}
                                    <div className="absolute right-0 top-1 bottom-1 w-2 flex flex-col">
                                      {[...Array(8)].map((_, i) => (
                                        <div 
                                          key={i}
                                          className="flex-1"
                                          style={{
                                            background: i % 2 === 0 ? '#f5f5f0' : '#e8e8e3',
                                            boxShadow: 'inset 1px 0 1px rgba(0,0,0,0.05)',
                                          }}
                                        />
                                      ))}
                                    </div>
                                    
                                    {/* Glossy overlay effect */}
                                    <div 
                                      className="absolute inset-0 pointer-events-none rounded-r-md"
                                      style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Download Button */}
                            <Button
                              onClick={downloadCover}
                              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger la Couverture (PNG)
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <BookOpen className="w-16 h-16 mb-4 opacity-30" />
                            <p className="text-center">
                              Générez votre couverture pour voir le mockup
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pages" className="space-y-6">
                {pages.map((page) => (
                  <Card key={page.id} className="border-2 border-dashed">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500">Page {page.pageNumber}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location 1 */}
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                            {page.location1.isGeneratingImage ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              </div>
                            ) : page.location1.imageUrl ? (
                              <img
                                src={page.location1.imageUrl}
                                alt={page.location1.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <Camera className="w-12 h-12" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {page.location1.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {page.location1.description}
                            </p>
                          </div>
                          {page.location1.imageUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => regenerateImage(page.id, 'location1')}
                              disabled={page.location1.isGeneratingImage}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Regénérer
                            </Button>
                          )}
                        </div>

                        {/* Location 2 */}
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                            {page.location2.isGeneratingImage ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              </div>
                            ) : page.location2.imageUrl ? (
                              <img
                                src={page.location2.imageUrl}
                                alt={page.location2.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <Camera className="w-12 h-12" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-cyan-700 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {page.location2.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {page.location2.description}
                            </p>
                          </div>
                          {page.location2.imageUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => regenerateImage(page.id, 'location2')}
                              disabled={page.location2.isGeneratingImage}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Regénérer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="gallery">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pages.flatMap(page => [
                    page.location1.imageUrl && (
                      <div key={`${page.id}-1`} className="space-y-2">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={page.location1.imageUrl}
                            alt={page.location1.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-center truncate">{page.location1.name}</p>
                      </div>
                    ),
                    page.location2.imageUrl && (
                      <div key={`${page.id}-2`} className="space-y-2">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={page.location2.imageUrl}
                            alt={page.location2.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-center truncate">{page.location2.name}</p>
                      </div>
                    )
                  ]).filter(Boolean)}
                </div>
              </TabsContent>
            </Tabs>

            {/* Export Section */}
            <div className="mt-6">
              <ExportSection
                onExportPDF={exportToPDF}
                onExportWord={() => toast.info('Export Word bientôt disponible')}
                isExporting={isExporting}
                disabled={pages.length === 0 || imagesGenerated === 0}
                pdfLabel="Télécharger PDF"
                showSave={false}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookTravelGuideGenerator;
