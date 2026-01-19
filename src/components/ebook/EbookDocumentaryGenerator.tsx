import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, BookOpen, Download, RefreshCw, Sparkles, FileText, 
  Wand2, FileDown, Globe, History, Microscope, Camera, TreePine, 
  Building, Landmark, Users, Award, ChevronDown, CheckCircle2,
  Eye, Edit, Plus, Trash2, GripVertical, Lightbulb, Target, BookMarked
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import jsPDF from 'jspdf';

interface DocumentaryChapter {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  facts: string[];
  sources: string[];
  images: { url: string; caption: string }[];
}

interface DocumentaryBook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  introduction: string;
  chapters: DocumentaryChapter[];
  conclusion: string;
  bibliography: string[];
  glossary: { term: string; definition: string }[];
}

interface DocumentaryGeneratorProps {
  ebookTitle?: string;
}

const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/🌍|🔬|📸|🌿|🏛️|👥|🎯|📚|🔍|✨|📖|🎬|🌐|🏆/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const DOCUMENTARY_CATEGORIES = [
  { value: 'nature', label: '🌿 Nature & Environnement', icon: TreePine, description: 'Faune, flore, écosystèmes, climat' },
  { value: 'history', label: '🏛️ Histoire', icon: Landmark, description: 'Périodes historiques, civilisations, événements' },
  { value: 'science', label: '🔬 Sciences', icon: Microscope, description: 'Découvertes, technologies, innovations' },
  { value: 'geography', label: '🌍 Géographie', icon: Globe, description: 'Pays, cultures, voyages' },
  { value: 'biography', label: '👥 Biographies', icon: Users, description: 'Personnalités, parcours inspirants' },
  { value: 'society', label: '🏢 Société', icon: Building, description: 'Économie, politique, actualités' },
  { value: 'culture', label: '🎭 Culture & Arts', icon: Award, description: 'Art, musique, cinéma, littérature' },
  { value: 'technology', label: '💻 Technologie', icon: Camera, description: 'Numérique, IA, innovations' },
];

const DOCUMENTARY_FORMATS = [
  { value: 'educational', label: 'Éducatif', description: 'Pédagogique avec exercices et quiz' },
  { value: 'narrative', label: 'Narratif', description: 'Style journalistique immersif' },
  { value: 'visual', label: 'Illustré', description: 'Riche en images et infographies' },
  { value: 'reference', label: 'Référence', description: 'Encyclopédique et exhaustif' },
  { value: 'children', label: 'Jeunesse', description: 'Adapté aux 8-14 ans' },
];

const RESEARCH_DEPTH = [
  { value: 'overview', label: 'Vue d\'ensemble', chapters: 5, pages: 30 },
  { value: 'standard', label: 'Standard', chapters: 8, pages: 60 },
  { value: 'detailed', label: 'Approfondi', chapters: 12, pages: 100 },
  { value: 'expert', label: 'Expert', chapters: 15, pages: 150 },
];

const EbookDocumentaryGenerator: React.FC<DocumentaryGeneratorProps> = ({ ebookTitle: initialTitle }) => {
  // Configuration - forcer utilisation Lovable AI
  const { apiKey: userApiKey, isValid: isUserKeyValid, isValidating } = useOpenAIConfig();
  // DÉSACTIVER temporairement l'usage de la clé OpenAI utilisateur (quota épuisé)
  const useOpenAI = false; // Force l'usage de Lovable AI
  
  console.log('[Documentary] Utilisation de Lovable AI (clé OpenAI utilisateur désactivée)');

  // État du formulaire
  const [title, setTitle] = useState(initialTitle || '');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [format, setFormat] = useState('narrative');
  const [depth, setDepth] = useState('standard');
  const [targetAudience, setTargetAudience] = useState('adultes');
  const [additionalContext, setAdditionalContext] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  // État de génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // État du livre
  const [book, setBook] = useState<DocumentaryBook | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [editingChapter, setEditingChapter] = useState<string | null>(null);

  const GENERATION_STEPS = [
    'Recherche et planification...',
    'Structuration des chapitres...',
    'Rédaction de l\'introduction...',
    'Génération du contenu...',
    'Compilation des sources...',
    'Finalisation...',
  ];

  const addKeyword = () => {
    if (newKeyword.trim() && keywords.length < 10) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const generateDocumentary = async () => {
    if (!title.trim()) {
      toast.error('Titre requis', { description: 'Veuillez entrer un titre pour votre documentaire' });
      return;
    }

    if (!category) {
      toast.error('Catégorie requise', { description: 'Veuillez sélectionner une catégorie' });
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationProgress(0);

    try {
      const depthConfig = RESEARCH_DEPTH.find(d => d.value === depth) || RESEARCH_DEPTH[1];
      const categoryInfo = DOCUMENTARY_CATEGORIES.find(c => c.value === category);
      const formatInfo = DOCUMENTARY_FORMATS.find(f => f.value === format);

      // Étape 1: Planification
      setGenerationStep(0);
      setGenerationProgress(10);
      await new Promise(r => setTimeout(r, 500));

      // Étape 2: Structure
      setGenerationStep(1);
      setGenerationProgress(20);

      const structurePrompt = `Tu es un auteur documentaire professionnel. Génère la structure complète d'un livre documentaire.

SUJET: ${title}
${subtitle ? `SOUS-TITRE: ${subtitle}` : ''}
CATÉGORIE: ${categoryInfo?.label || category}
FORMAT: ${formatInfo?.label || format} - ${formatInfo?.description || ''}
PROFONDEUR: ${depthConfig.chapters} chapitres, environ ${depthConfig.pages} pages
AUDIENCE: ${targetAudience}
${keywords.length > 0 ? `MOTS-CLÉS: ${keywords.join(', ')}` : ''}
${additionalContext ? `CONTEXTE ADDITIONNEL: ${additionalContext}` : ''}

Génère une structure JSON avec:
{
  "title": "Titre optimisé",
  "subtitle": "Sous-titre accrocheur",
  "introduction": "Introduction complète de 300-500 mots",
  "chapters": [
    {
      "title": "Titre du chapitre",
      "subtitle": "Sous-titre explicatif",
      "content": "Contenu détaillé de 800-1500 mots avec paragraphes, faits marquants, anecdotes",
      "facts": ["Fait intéressant 1", "Fait intéressant 2", "Fait intéressant 3"],
      "sources": ["Source 1", "Source 2"]
    }
  ],
  "conclusion": "Conclusion de 200-300 mots",
  "bibliography": ["Référence 1", "Référence 2"],
  "glossary": [{"term": "Terme", "definition": "Définition"}]
}

IMPORTANT: Génère exactement ${depthConfig.chapters} chapitres complets avec du contenu substantiel.
Le contenu doit être factuel, bien documenté et adapté à l'audience ${targetAudience}.`;

      const { data: structureData, error: structureError } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: structurePrompt,
          type: 'documentary-structure',
          useOpenAI,
          openaiApiKey: useOpenAI ? userApiKey : undefined,
          maxTokens: 8000,
        },
      });

      if (structureError) throw structureError;

      setGenerationStep(2);
      setGenerationProgress(40);

      let bookData: DocumentaryBook;
      
      try {
        const content = structureData?.content || structureData?.result || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          bookData = {
            id: `doc-${Date.now()}`,
            title: parsed.title || title,
            subtitle: parsed.subtitle || subtitle,
            author: author || 'Auteur',
            introduction: parsed.introduction || '',
            chapters: (parsed.chapters || []).map((ch: any, idx: number) => ({
              id: `chapter-${idx}`,
              title: ch.title || `Chapitre ${idx + 1}`,
              subtitle: ch.subtitle || '',
              content: ch.content || '',
              facts: ch.facts || [],
              sources: ch.sources || [],
              images: [],
            })),
            conclusion: parsed.conclusion || '',
            bibliography: parsed.bibliography || [],
            glossary: parsed.glossary || [],
          };
        } else {
          throw new Error('Format JSON invalide');
        }
      } catch (parseError) {
        console.error('Erreur parsing:', parseError);
        // Fallback: générer une structure de base
        bookData = generateFallbackStructure(title, subtitle, author, depthConfig.chapters);
      }

      // Étape 3-5: Enrichir les chapitres si nécessaire
      setGenerationStep(3);
      setGenerationProgress(60);

      // Enrichir chaque chapitre si le contenu est trop court
      for (let i = 0; i < bookData.chapters.length; i++) {
        const chapter = bookData.chapters[i];
        if (chapter.content.length < 500) {
          setGenerationProgress(60 + Math.floor((i / bookData.chapters.length) * 30));
          
          const enrichPrompt = `Écris le contenu complet du chapitre "${chapter.title}" pour un livre documentaire sur "${title}".
          
Le chapitre doit inclure:
- 800-1200 mots de contenu détaillé
- Des paragraphes bien structurés
- Des faits et anecdotes intéressants
- Un style ${format === 'educational' ? 'pédagogique et clair' : format === 'narrative' ? 'narratif et immersif' : 'informatif et précis'}

Audience: ${targetAudience}`;

          try {
            const { data: chapterData } = await supabase.functions.invoke('generate-content', {
              body: {
                prompt: enrichPrompt,
                type: 'documentary-chapter',
                useOpenAI,
                openaiApiKey: useOpenAI ? userApiKey : undefined,
                maxTokens: 2000,
              },
            });

            if (chapterData?.content) {
              bookData.chapters[i].content = chapterData.content;
            }
          } catch (e) {
            console.error(`Erreur enrichissement chapitre ${i}:`, e);
          }
        }
      }

      setGenerationStep(4);
      setGenerationProgress(90);

      setGenerationStep(5);
      setGenerationProgress(100);

      setBook(bookData);
      setActiveTab('preview');
      toast.success('Documentaire généré!', { description: `${bookData.chapters.length} chapitres créés` });

    } catch (error: any) {
      console.error('Erreur génération:', error);
      const details =
        error?.context?.error_description ||
        error?.context?.error ||
        error?.message ||
        'Veuillez réessayer';
      toast.error('Erreur de génération', { description: String(details) });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackStructure = (title: string, subtitle: string, author: string, numChapters: number): DocumentaryBook => {
    const chapters: DocumentaryChapter[] = [];
    for (let i = 0; i < numChapters; i++) {
      chapters.push({
        id: `chapter-${i}`,
        title: `Chapitre ${i + 1}`,
        subtitle: `Section ${i + 1} du documentaire`,
        content: `Contenu du chapitre ${i + 1} à enrichir...`,
        facts: [],
        sources: [],
        images: [],
      });
    }

    return {
      id: `doc-${Date.now()}`,
      title,
      subtitle,
      author: author || 'Auteur',
      introduction: `Introduction du documentaire "${title}"...`,
      chapters,
      conclusion: 'Conclusion à rédiger...',
      bibliography: [],
      glossary: [],
    };
  };

  const updateChapter = (chapterId: string, updates: Partial<DocumentaryChapter>) => {
    if (!book) return;
    setBook({
      ...book,
      chapters: book.chapters.map(ch => 
        ch.id === chapterId ? { ...ch, ...updates } : ch
      ),
    });
  };

  const addChapter = () => {
    if (!book) return;
    const newChapter: DocumentaryChapter = {
      id: `chapter-${Date.now()}`,
      title: `Nouveau chapitre`,
      subtitle: '',
      content: '',
      facts: [],
      sources: [],
      images: [],
    };
    setBook({
      ...book,
      chapters: [...book.chapters, newChapter],
    });
    setEditingChapter(newChapter.id);
  };

  const removeChapter = (chapterId: string) => {
    if (!book) return;
    setBook({
      ...book,
      chapters: book.chapters.filter(ch => ch.id !== chapterId),
    });
  };

  const regenerateChapter = async (chapterId: string) => {
    if (!book) return;
    const chapter = book.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    setIsGenerating(true);
    try {
      const prompt = `Réécris et enrichis ce chapitre de documentaire:

Titre du livre: ${book.title}
Titre du chapitre: ${chapter.title}
Sous-titre: ${chapter.subtitle}

Génère un contenu de 1000-1500 mots, informatif et engageant.
Inclus des faits marquants et des anecdotes.`;

      const { data } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt,
          type: 'documentary-chapter-regen',
          useOpenAI,
          openaiApiKey: useOpenAI ? userApiKey : undefined,
          maxTokens: 2500,
        },
      });

      if (data?.content) {
        updateChapter(chapterId, { content: data.content });
        toast.success('Chapitre régénéré!');
      }
    } catch (error) {
      toast.error('Erreur de régénération');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    if (!book) return;

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Page de titre
      pdf.setFillColor(45, 55, 72);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.text(cleanTextForPDF(book.title), pageWidth / 2, pageHeight / 3, { align: 'center' });
      
      if (book.subtitle) {
        pdf.setFontSize(18);
        pdf.text(cleanTextForPDF(book.subtitle), pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });
      }

      pdf.setFontSize(14);
      pdf.text(`par ${cleanTextForPDF(book.author)}`, pageWidth / 2, pageHeight / 2, { align: 'center' });

      pdf.setFontSize(10);
      pdf.text('DOCUMENTAIRE', pageWidth / 2, pageHeight - 30, { align: 'center' });

      // Table des matières
      pdf.addPage();
      pdf.setTextColor(0, 0, 0);
      yPos = margin;
      pdf.setFontSize(24);
      pdf.text('Table des matieres', margin, yPos);
      yPos += 15;

      pdf.setFontSize(12);
      book.chapters.forEach((chapter, idx) => {
        if (yPos > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(`${idx + 1}. ${cleanTextForPDF(chapter.title)}`, margin, yPos);
        yPos += 8;
      });

      // Introduction
      pdf.addPage();
      yPos = margin;
      pdf.setFontSize(20);
      pdf.text('Introduction', margin, yPos);
      yPos += 12;
      pdf.setFontSize(11);
      const introLines = pdf.splitTextToSize(cleanTextForPDF(book.introduction), contentWidth);
      for (const line of introLines) {
        if (yPos > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(line, margin, yPos);
        yPos += 6;
      }

      // Chapitres
      for (const chapter of book.chapters) {
        pdf.addPage();
        yPos = margin;

        pdf.setFontSize(20);
        pdf.setTextColor(45, 55, 72);
        pdf.text(cleanTextForPDF(chapter.title), margin, yPos);
        yPos += 10;

        if (chapter.subtitle) {
          pdf.setFontSize(14);
          pdf.setTextColor(100, 100, 100);
          pdf.text(cleanTextForPDF(chapter.subtitle), margin, yPos);
          yPos += 10;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const contentLines = pdf.splitTextToSize(cleanTextForPDF(chapter.content), contentWidth);
        for (const line of contentLines) {
          if (yPos > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.text(line, margin, yPos);
          yPos += 6;
        }

        // Faits marquants
        if (chapter.facts.length > 0) {
          yPos += 10;
          if (yPos > pageHeight - margin - 30) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.setFontSize(12);
          pdf.setTextColor(45, 55, 72);
          pdf.text('A retenir :', margin, yPos);
          yPos += 8;
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          for (const fact of chapter.facts) {
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
            pdf.text(`- ${cleanTextForPDF(fact)}`, margin + 5, yPos);
            yPos += 6;
          }
        }
      }

      // Conclusion
      pdf.addPage();
      yPos = margin;
      pdf.setFontSize(20);
      pdf.setTextColor(45, 55, 72);
      pdf.text('Conclusion', margin, yPos);
      yPos += 12;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const conclusionLines = pdf.splitTextToSize(cleanTextForPDF(book.conclusion), contentWidth);
      for (const line of conclusionLines) {
        if (yPos > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(line, margin, yPos);
        yPos += 6;
      }

      // Bibliographie
      if (book.bibliography.length > 0) {
        pdf.addPage();
        yPos = margin;
        pdf.setFontSize(20);
        pdf.setTextColor(45, 55, 72);
        pdf.text('Bibliographie', margin, yPos);
        yPos += 12;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        for (const ref of book.bibliography) {
          if (yPos > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.text(`- ${cleanTextForPDF(ref)}`, margin, yPos);
          yPos += 6;
        }
      }

      // Glossaire
      if (book.glossary.length > 0) {
        pdf.addPage();
        yPos = margin;
        pdf.setFontSize(20);
        pdf.setTextColor(45, 55, 72);
        pdf.text('Glossaire', margin, yPos);
        yPos += 12;
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        for (const entry of book.glossary) {
          if (yPos > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.setFont('helvetica', 'bold');
          pdf.text(cleanTextForPDF(entry.term), margin, yPos);
          pdf.setFont('helvetica', 'normal');
          const defLines = pdf.splitTextToSize(cleanTextForPDF(entry.definition), contentWidth - 30);
          for (let i = 0; i < defLines.length; i++) {
            pdf.text(defLines[i], margin + 30, yPos);
            yPos += 5;
          }
          yPos += 3;
        }
      }

      const fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_documentaire.pdf`;
      pdf.save(fileName);
      toast.success('PDF exporté!', { description: fileName });

    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  const wordCount = book ? 
    book.introduction.split(/\s+/).length + 
    book.chapters.reduce((acc, ch) => acc + ch.content.split(/\s+/).length, 0) + 
    book.conclusion.split(/\s+/).length : 0;

  const estimatedPages = Math.ceil(wordCount / 250);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BookMarked className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">Générateur de Documentaires</h1>
              <p className="text-blue-200">
                Créez des livres documentaires professionnels avec recherche et sources intégrées
              </p>
            </div>
            {book && (
              <div className="flex gap-2">
                <Badge className="bg-white/20 text-white">
                  {book.chapters.length} chapitres
                </Badge>
                <Badge className="bg-white/20 text-white">
                  ~{estimatedPages} pages
                </Badge>
                <Badge className="bg-white/20 text-white">
                  {wordCount.toLocaleString()} mots
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de création ou Éditeur */}
      {!book ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-500" />
              Nouveau Documentaire
            </CardTitle>
            <CardDescription>
              Configurez votre livre documentaire et laissez l'IA créer le contenu
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Titre et sous-titre */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du documentaire *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Les Mystères de l'Océan Profond"
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Sous-titre (optionnel)</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex: Une exploration des abysses"
                />
              </div>
            </div>

            {/* Auteur */}
            <div className="space-y-2">
              <Label htmlFor="author">Nom de l'auteur</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Votre nom"
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DOCUMENTARY_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        category === cat.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">{cat.label.replace(/^\p{Emoji}\s*/u, '')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format et profondeur */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENTARY_FORMATS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        <div>
                          <div className="font-medium">{f.label}</div>
                          <div className="text-xs text-muted-foreground">{f.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Profondeur de recherche</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESEARCH_DEPTH.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        <div>
                          <div className="font-medium">{d.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.chapters} chapitres • ~{d.pages} pages
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Audience cible */}
            <div className="space-y-2">
              <Label>Audience cible</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enfants">Enfants (8-12 ans)</SelectItem>
                  <SelectItem value="adolescents">Adolescents (13-17 ans)</SelectItem>
                  <SelectItem value="adultes">Adultes</SelectItem>
                  <SelectItem value="experts">Experts / Spécialistes</SelectItem>
                  <SelectItem value="tout-public">Tout public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options avancées */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Options avancées
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {/* Mots-clés */}
                <div className="space-y-2">
                  <Label>Mots-clés (pour orienter la recherche)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Ajouter un mot-clé"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((kw, idx) => (
                        <Badge key={idx} variant="secondary" className="pr-1">
                          {kw}
                          <button onClick={() => removeKeyword(idx)} className="ml-1 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contexte additionnel */}
                <div className="space-y-2">
                  <Label>Contexte ou instructions supplémentaires</Label>
                  <Textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Ajoutez des précisions sur l'angle souhaité, les aspects à couvrir..."
                    rows={3}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bouton de génération */}
            <Button
              onClick={generateDocumentary}
              disabled={isGenerating || !title.trim() || !category}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {GENERATION_STEPS[generationStep]}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Générer le Documentaire
                </>
              )}
            </Button>

            {/* Progress bar */}
            {isGenerating && (
              <div className="space-y-2">
                <Progress value={generationProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Étape {generationStep + 1}/{GENERATION_STEPS.length}: {GENERATION_STEPS[generationStep]}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Éditeur et aperçu */
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Édition
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Onglet Édition */}
          <TabsContent value="editor" className="space-y-4">
            {/* Introduction */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={book.introduction}
                  onChange={(e) => setBook({ ...book, introduction: e.target.value })}
                  rows={6}
                  className="font-serif"
                />
              </CardContent>
            </Card>

            {/* Chapitres */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Chapitres ({book.chapters.length})</h3>
                <Button onClick={addChapter} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </div>

              {book.chapters.map((chapter, idx) => (
                <Card key={chapter.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <Badge variant="outline">{idx + 1}</Badge>
                      {editingChapter === chapter.id ? (
                        <Input
                          value={chapter.title}
                          onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                          className="flex-1"
                          autoFocus
                          onBlur={() => setEditingChapter(null)}
                        />
                      ) : (
                        <span 
                          className="flex-1 font-medium cursor-pointer hover:text-blue-500"
                          onClick={() => setEditingChapter(chapter.id)}
                        >
                          {chapter.title}
                        </span>
                      )}
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => regenerateChapter(chapter.id)}
                          disabled={isGenerating}
                        >
                          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeChapter(chapter.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Sous-titre</Label>
                      <Input
                        value={chapter.subtitle}
                        onChange={(e) => updateChapter(chapter.id, { subtitle: e.target.value })}
                        placeholder="Sous-titre du chapitre"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Contenu</Label>
                      <Textarea
                        value={chapter.content}
                        onChange={(e) => updateChapter(chapter.id, { content: e.target.value })}
                        rows={8}
                        className="font-serif text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{chapter.content.split(/\s+/).filter(Boolean).length} mots</span>
                      <span>{chapter.facts.length} faits</span>
                      <span>{chapter.sources.length} sources</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Conclusion */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conclusion</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={book.conclusion}
                  onChange={(e) => setBook({ ...book, conclusion: e.target.value })}
                  rows={4}
                  className="font-serif"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Aperçu */}
          <TabsContent value="preview">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-12 text-center">
                <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                {book.subtitle && (
                  <p className="text-xl text-blue-200 mb-4">{book.subtitle}</p>
                )}
                <p className="text-lg">par {book.author}</p>
                <Badge className="mt-4 bg-white/20">DOCUMENTAIRE</Badge>
              </div>
              
              <CardContent className="p-8 max-w-3xl mx-auto prose dark:prose-invert">
                <h2>Table des matières</h2>
                <ol>
                  {book.chapters.map((ch, idx) => (
                    <li key={ch.id}>
                      <strong>{ch.title}</strong>
                      {ch.subtitle && <span className="text-muted-foreground"> - {ch.subtitle}</span>}
                    </li>
                  ))}
                </ol>

                <hr className="my-8" />

                <h2>Introduction</h2>
                <p className="whitespace-pre-wrap">{book.introduction}</p>

                {book.chapters.map((chapter, idx) => (
                  <div key={chapter.id} className="mt-8">
                    <h2>{idx + 1}. {chapter.title}</h2>
                    {chapter.subtitle && (
                      <p className="text-lg text-muted-foreground italic">{chapter.subtitle}</p>
                    )}
                    <div className="whitespace-pre-wrap">{chapter.content}</div>
                    
                    {chapter.facts.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-4">
                        <h4 className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Target className="w-4 h-4" />
                          À retenir
                        </h4>
                        <ul>
                          {chapter.facts.map((fact, i) => (
                            <li key={i}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                <hr className="my-8" />

                <h2>Conclusion</h2>
                <p className="whitespace-pre-wrap">{book.conclusion}</p>

                {book.bibliography.length > 0 && (
                  <>
                    <hr className="my-8" />
                    <h2>Bibliographie</h2>
                    <ul>
                      {book.bibliography.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ul>
                  </>
                )}

                {book.glossary.length > 0 && (
                  <>
                    <hr className="my-8" />
                    <h2>Glossaire</h2>
                    <dl>
                      {book.glossary.map((entry, i) => (
                        <div key={i}>
                          <dt className="font-bold">{entry.term}</dt>
                          <dd className="ml-4 mb-2">{entry.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Export */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Export du documentaire
                </CardTitle>
                <CardDescription>
                  Téléchargez votre livre documentaire au format PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-3xl font-bold text-blue-500">{book.chapters.length}</div>
                    <div className="text-sm text-muted-foreground">Chapitres</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-3xl font-bold text-emerald-500">{wordCount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Mots</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-3xl font-bold text-amber-500">~{estimatedPages}</div>
                    <div className="text-sm text-muted-foreground">Pages estimées</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={exportToPDF} className="w-full h-12" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger en PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setBook(null)}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Créer un nouveau documentaire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EbookDocumentaryGenerator;
