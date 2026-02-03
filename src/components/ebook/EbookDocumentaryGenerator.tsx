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
  Eye, Edit, Plus, Trash2, GripVertical, Lightbulb, Target, BookMarked,
  FileType, Save
} from 'lucide-react';
import ExportSection from './ExportSection';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { useProjectSave } from '@/hooks/useProjectSave';
import jsPDF from 'jspdf';
import { KdpQuickTools } from './KdpQuickTools';
import SpecializedAmazonPreview from './SpecializedAmazonPreview';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

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
  // Configuration - utiliser la clé API utilisateur si disponible
  const { apiKey: userApiKey, isValid: isUserKeyValid, isValidating } = useOpenAIConfig();
  const useOpenAI = !!userApiKey && userApiKey.startsWith('sk-');
  const { saveSpecializedProject } = useProjectSave();
  
  console.log('[Documentary] API Key config:', { hasKey: !!userApiKey, useOpenAI, isValid: isUserKeyValid });

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
  const [isSavingProject, setIsSavingProject] = useState(false);
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

      // Sauvegarde automatique du projet
      try {
        await saveSpecializedProject({
          title: bookData.title,
          author_name: bookData.author,
          project_type: 'documentary',
          target_audience: targetAudience,
          preface: bookData.introduction,
          conclusion: bookData.conclusion,
          chapters: bookData.chapters.map(ch => ({
            title: ch.title,
            content: ch.content,
            facts: ch.facts,
            sources: ch.sources,
          })),
          number_of_chapters: bookData.chapters.length,
          book_summary: bookData.subtitle,
        });
        toast.success('Projet sauvegardé', { description: 'Retrouvez-le dans "Mes Projets"' });
      } catch (saveError) {
        console.error('Erreur sauvegarde auto:', saveError);
      }

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
      const margin = 25;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;
      const lineHeight = 7; // Interligne 1.5
      const paragraphSpacing = 10; // Espace entre paragraphes

      // Helper pour écrire des paragraphes avec espacement
      const writeParagraphs = (text: string, fontSize: number = 11) => {
        const cleanText = cleanTextForPDF(text);
        const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim());
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(30, 30, 30);
        
        for (const para of paragraphs) {
          const lines = pdf.splitTextToSize(para.trim(), contentWidth);
          
          for (const line of lines) {
            if (yPos > pageHeight - margin - 10) {
              pdf.addPage();
              yPos = margin;
            }
            pdf.text(line, margin, yPos);
            yPos += lineHeight;
          }
          yPos += paragraphSpacing - lineHeight; // Espace après paragraphe
        }
      };

      // Helper pour les titres de section
      const writeSectionTitle = (title: string, level: 1 | 2 = 1) => {
        if (yPos > pageHeight - margin - 40) {
          pdf.addPage();
          yPos = margin;
        }
        
        yPos += level === 1 ? 15 : 10;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72);
        pdf.setFontSize(level === 1 ? 22 : 16);
        pdf.text(cleanTextForPDF(title), margin, yPos);
        
        // Ligne décorative sous le titre
        if (level === 1) {
          yPos += 4;
          pdf.setDrawColor(66, 153, 225);
          pdf.setLineWidth(0.8);
          pdf.line(margin, yPos, margin + 40, yPos);
        }
        
        yPos += level === 1 ? 12 : 8;
      };

      // === PAGE DE TITRE ===
      // Fond dégradé simulé
      pdf.setFillColor(45, 55, 72);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Décoration
      pdf.setFillColor(66, 153, 225);
      pdf.rect(0, pageHeight * 0.4, pageWidth, 2, 'F');
      
      // Titre principal
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(36);
      const titleLines = pdf.splitTextToSize(cleanTextForPDF(book.title), contentWidth);
      let titleY = pageHeight / 3;
      for (const line of titleLines) {
        pdf.text(line, pageWidth / 2, titleY, { align: 'center' });
        titleY += 14;
      }
      
      // Sous-titre
      if (book.subtitle) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(18);
        pdf.setTextColor(200, 200, 200);
        pdf.text(cleanTextForPDF(book.subtitle), pageWidth / 2, titleY + 10, { align: 'center' });
      }

      // Auteur
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`par ${cleanTextForPDF(book.author)}`, pageWidth / 2, pageHeight * 0.55, { align: 'center' });

      // Badge documentaire
      pdf.setFillColor(66, 153, 225);
      pdf.roundedRect(pageWidth / 2 - 25, pageHeight - 45, 50, 12, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DOCUMENTAIRE', pageWidth / 2, pageHeight - 37, { align: 'center' });

      // === TABLE DES MATIÈRES ===
      pdf.addPage();
      pdf.setTextColor(0, 0, 0);
      yPos = margin;
      
      writeSectionTitle('Table des matières');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      
      book.chapters.forEach((chapter, idx) => {
        if (yPos > pageHeight - margin - 10) {
          pdf.addPage();
          yPos = margin;
        }
        
        // Numéro de chapitre en couleur
        pdf.setTextColor(66, 153, 225);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${idx + 1}.`, margin, yPos);
        
        // Titre du chapitre
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'normal');
        pdf.text(cleanTextForPDF(chapter.title), margin + 12, yPos);
        
        // Ligne pointillée
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineDashPattern([1, 1], 0);
        const titleWidth = pdf.getTextWidth(cleanTextForPDF(chapter.title));
        pdf.line(margin + 14 + titleWidth, yPos, pageWidth - margin - 10, yPos);
        pdf.setLineDashPattern([], 0);
        
        yPos += 10;
      });

      // === INTRODUCTION ===
      pdf.addPage();
      yPos = margin;
      writeSectionTitle('Introduction');
      writeParagraphs(book.introduction);

      // === CHAPITRES ===
      for (const [idx, chapter] of book.chapters.entries()) {
        pdf.addPage();
        yPos = margin;

        // Numéro de chapitre
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(66, 153, 225);
        pdf.text(`CHAPITRE ${idx + 1}`, margin, yPos);
        yPos += 8;

        // Titre du chapitre
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.setTextColor(45, 55, 72);
        const chapterTitleLines = pdf.splitTextToSize(cleanTextForPDF(chapter.title), contentWidth);
        for (const line of chapterTitleLines) {
          pdf.text(line, margin, yPos);
          yPos += 9;
        }

        // Sous-titre
        if (chapter.subtitle) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(13);
          pdf.setTextColor(100, 100, 100);
          pdf.text(cleanTextForPDF(chapter.subtitle), margin, yPos + 2);
          yPos += 10;
        }

        // Ligne décorative
        yPos += 3;
        pdf.setDrawColor(66, 153, 225);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos, margin + 30, yPos);
        yPos += 12;

        // Contenu du chapitre
        writeParagraphs(chapter.content);

        // Encadré "À retenir"
        if (chapter.facts.length > 0) {
          yPos += 8;
          
          if (yPos > pageHeight - margin - 50) {
            pdf.addPage();
            yPos = margin;
          }
          
          // Fond de l'encadré
          const boxHeight = 15 + chapter.facts.length * 8;
          pdf.setFillColor(240, 249, 255);
          pdf.roundedRect(margin, yPos - 3, contentWidth, Math.min(boxHeight, 60), 3, 3, 'F');
          
          // Bordure gauche colorée
          pdf.setFillColor(66, 153, 225);
          pdf.rect(margin, yPos - 3, 3, Math.min(boxHeight, 60), 'F');
          
          // Titre de l'encadré
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(43, 108, 176);
          pdf.text('À retenir', margin + 8, yPos + 4);
          yPos += 12;
          
          // Points
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(50, 50, 50);
          
          for (const fact of chapter.facts) {
            if (yPos > pageHeight - margin - 10) {
              pdf.addPage();
              yPos = margin;
            }
            pdf.setTextColor(66, 153, 225);
            pdf.text('•', margin + 8, yPos);
            pdf.setTextColor(50, 50, 50);
            const factLines = pdf.splitTextToSize(cleanTextForPDF(fact), contentWidth - 20);
            pdf.text(factLines[0], margin + 14, yPos);
            yPos += 7;
          }
          yPos += 8;
        }

        // Sources
        if (chapter.sources && chapter.sources.length > 0) {
          yPos += 5;
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(120, 120, 120);
          pdf.text('Sources:', margin, yPos);
          yPos += 5;
          
          for (const source of chapter.sources) {
            if (yPos > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }
            const sourceLines = pdf.splitTextToSize(`- ${cleanTextForPDF(source)}`, contentWidth - 10);
            pdf.text(sourceLines[0], margin + 5, yPos);
            yPos += 5;
          }
        }
      }

      // === CONCLUSION ===
      pdf.addPage();
      yPos = margin;
      writeSectionTitle('Conclusion');
      writeParagraphs(book.conclusion);

      // === BIBLIOGRAPHIE ===
      if (book.bibliography.length > 0) {
        pdf.addPage();
        yPos = margin;
        writeSectionTitle('Bibliographie');
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(50, 50, 50);
        
        book.bibliography.forEach((ref, idx) => {
          if (yPos > pageHeight - margin - 10) {
            pdf.addPage();
            yPos = margin;
          }
          
          pdf.setTextColor(66, 153, 225);
          pdf.text(`[${idx + 1}]`, margin, yPos);
          pdf.setTextColor(50, 50, 50);
          
          const refLines = pdf.splitTextToSize(cleanTextForPDF(ref), contentWidth - 15);
          pdf.text(refLines[0], margin + 12, yPos);
          yPos += 8;
        });
      }

      // === GLOSSAIRE ===
      if (book.glossary.length > 0) {
        pdf.addPage();
        yPos = margin;
        writeSectionTitle('Glossaire');
        
        for (const entry of book.glossary) {
          if (yPos > pageHeight - margin - 20) {
            pdf.addPage();
            yPos = margin;
          }
          
          // Terme en gras
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(45, 55, 72);
          pdf.text(cleanTextForPDF(entry.term), margin, yPos);
          
          // Définition
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(70, 70, 70);
          const defLines = pdf.splitTextToSize(cleanTextForPDF(entry.definition), contentWidth - 5);
          yPos += 6;
          for (const line of defLines) {
            pdf.text(line, margin + 5, yPos);
            yPos += 5;
          }
          yPos += 6;
        }
      }

      // Numéros de page (sauf page de titre)
      const totalPages = pdf.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${i - 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      const fileName = `${book.title.replace(/[^a-zA-Z0-9àâäéèêëïîôöùûüç\s]/gi, '_')}_documentaire.pdf`;
      pdf.save(fileName);
      toast.success('PDF exporté!', { description: fileName });

    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  const exportToWord = async () => {
    if (!book) return;

    try {
      // Helper pour créer des paragraphes à partir du texte
      const createParagraphs = (text: string, spacing?: number) => {
        const cleanText = cleanTextForPDF(text);
        const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim());
        
        return paragraphs.map((para, idx) => 
          new Paragraph({
            children: [
              new TextRun({
                text: para.trim(),
                size: 24, // 12pt
              }),
            ],
            spacing: {
              after: spacing || 240, // 12pt après
              line: 360, // 1.5 interligne
            },
            alignment: AlignmentType.JUSTIFIED,
          })
        );
      };

      const children: any[] = [];

      // === PAGE DE TITRE ===
      children.push(
        new Paragraph({
          children: [],
          spacing: { before: 2000 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: book.title,
              bold: true,
              size: 72, // 36pt
              color: "2D3748",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      if (book.subtitle) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: book.subtitle,
                italics: true,
                size: 36, // 18pt
                color: "4A5568",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          })
        );
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `par ${book.author}`,
              size: 28, // 14pt
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "DOCUMENTAIRE",
              bold: true,
              size: 20,
              color: "718096",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 2400 },
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // === TABLE DES MATIÈRES ===
      children.push(
        new Paragraph({
          text: "Table des matières",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
        })
      );

      book.chapters.forEach((chapter, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${idx + 1}. ${cleanTextForPDF(chapter.title)}`,
                size: 24,
              }),
            ],
            spacing: { after: 120 },
            indent: { left: 360 },
          })
        );
      });

      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // === INTRODUCTION ===
      children.push(
        new Paragraph({
          text: "Introduction",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
        })
      );
      children.push(...createParagraphs(book.introduction));
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // === CHAPITRES ===
      for (const [idx, chapter] of book.chapters.entries()) {
        // Titre du chapitre
        children.push(
          new Paragraph({
            text: `Chapitre ${idx + 1}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: cleanTextForPDF(chapter.title),
                bold: true,
                size: 36,
                color: "2D3748",
              }),
            ],
            spacing: { after: 200 },
          })
        );

        if (chapter.subtitle) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cleanTextForPDF(chapter.subtitle),
                  italics: true,
                  size: 26,
                  color: "4A5568",
                }),
              ],
              spacing: { after: 400 },
            })
          );
        }

        // Contenu du chapitre
        children.push(...createParagraphs(chapter.content));

        // Faits marquants
        if (chapter.facts.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "À retenir :",
                  bold: true,
                  size: 24,
                  color: "2B6CB0",
                }),
              ],
              spacing: { before: 400, after: 200 },
              border: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "2B6CB0" },
              },
            })
          );

          chapter.facts.forEach(fact => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${cleanTextForPDF(fact)}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 360 },
              })
            );
          });
        }

        // Sources du chapitre
        if (chapter.sources.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Sources :",
                  bold: true,
                  size: 20,
                  color: "718096",
                }),
              ],
              spacing: { before: 300, after: 100 },
            })
          );

          chapter.sources.forEach(source => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `- ${cleanTextForPDF(source)}`,
                    size: 18,
                    italics: true,
                    color: "718096",
                  }),
                ],
                indent: { left: 360 },
              })
            );
          });
        }

        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }

      // === CONCLUSION ===
      children.push(
        new Paragraph({
          text: "Conclusion",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
        })
      );
      children.push(...createParagraphs(book.conclusion));
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // === BIBLIOGRAPHIE ===
      if (book.bibliography.length > 0) {
        children.push(
          new Paragraph({
            text: "Bibliographie",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          })
        );

        book.bibliography.forEach((ref, idx) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${idx + 1}. ${cleanTextForPDF(ref)}`,
                  size: 22,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        });

        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }

      // === GLOSSAIRE ===
      if (book.glossary.length > 0) {
        children.push(
          new Paragraph({
            text: "Glossaire",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          })
        );

        book.glossary.forEach(entry => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cleanTextForPDF(entry.term),
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: ` : ${cleanTextForPDF(entry.definition)}`,
                  size: 22,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        });
      }

      // Créer le document
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children,
        }],
        styles: {
          paragraphStyles: [
            {
              id: "Heading1",
              name: "Heading 1",
              basedOn: "Normal",
              next: "Normal",
              run: {
                size: 48,
                bold: true,
                color: "2D3748",
              },
              paragraph: {
                spacing: { before: 400, after: 200 },
              },
            },
          ],
        },
      });

      // Générer et télécharger
      const blob = await Packer.toBlob(doc);
      const fileName = `${book.title.replace(/[^a-zA-Z0-9àâäéèêëïîôöùûüç\s]/gi, '_')}_documentaire.docx`;
      saveAs(blob, fileName);
      
      toast.success('Document Word exporté!', { description: fileName });

    } catch (error) {
      console.error('Erreur export Word:', error);
      toast.error('Erreur lors de l\'export Word');
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

                {/* Section Export NOUVEAU 2026 */}
                <ExportSection
                  onExportPDF={exportToPDF}
                  onExportWord={exportToWord}
                  onSave={async () => {
                    if (!book) return;
                    setIsSavingProject(true);
                    await saveSpecializedProject({
                      title: book.title,
                      author_name: book.author,
                      project_type: 'documentary',
                      target_audience: targetAudience,
                      preface: book.introduction,
                      conclusion: book.conclusion,
                      chapters: book.chapters.map(ch => ({
                        title: ch.title,
                        content: ch.content,
                        facts: ch.facts,
                        sources: ch.sources,
                      })),
                      number_of_chapters: book.chapters.length,
                      book_summary: book.subtitle,
                    });
                    setIsSavingProject(false);
                  }}
                  isSaving={isSavingProject}
                  pdfLabel="PDF"
                  wordLabel="Word (.docx)"
                />

                <Button
                  variant="ghost"
                  onClick={() => setBook(null)}
                  className="w-full mt-3"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Créer un nouveau documentaire
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Simulateur Amazon */}
      {book && (
        <SpecializedAmazonPreview
          productType="documentary"
          title={book.title}
          authorName={book.author || "Votre Nom"}
          pageCount={book.chapters.length * 10}
          description={book.introduction}
          targetAudience={targetAudience}
          theme={DOCUMENTARY_CATEGORIES.find(c => c.value === category)?.label}
        />
      )}

      {/* Outils KDP */}
      {book && (
        <KdpQuickTools
          productType="documentary"
          title={book.title}
          pageCount={book.chapters.length * 10}
          targetAudience={targetAudience}
          theme={category}
        />
      )}
    </div>
  );
};

export default EbookDocumentaryGenerator;
