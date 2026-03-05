
import React, { useState, useMemo } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Image, BookOpen, Printer, Settings, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useEbookGeneration';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { Character } from './EbookCharacters';
import { EbookExportPreview } from './EbookExportPreview';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { exportProfessionalDocx } from '@/utils/docxExportEngine';
import {
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  TableOfContents,
  StyleLevel,
  convertInchesToTwip,
  SectionType,
  BorderStyle,
  Tab,
  TabStopType,
  TabStopPosition,
  UnderlineType
} from 'docx';

// Structure KDP complète
interface KdpStructure {
  introduction?: {
    titre: string;
    accroche: string;
    promesse: string;
    contenu?: string;
  };
  blocsPratiques?: {
    checklist?: string[];
    faq?: Array<{ question: string; reponse: string }>;
    etudeDeCas?: string;
    planAction?: string[];
  };
  aproposAuteur?: {
    bio: string;
    expertise?: string;
    contact?: string;
  };
  annexes?: {
    titre: string;
    ressources?: string[];
    references?: string[];
  };
}

interface EbookExporterProps {
  ebookTitle: string;
  authorName: string;
  preface: string;
  conclusion: string;
  epilogue?: string;
  chapters: Chapter[];
  characters?: Character[];
  kdpStructure?: KdpStructure;
}

export const EbookExporter: React.FC<EbookExporterProps> = ({
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
  characters = [],
  kdpStructure
}) => {
  // ✅ Nettoyage automatique de TOUT le contenu avant export
  const cleanedPreface = useMemo(() => cleanGeneratedText(preface), [preface]);
  const cleanedConclusion = useMemo(() => cleanGeneratedText(conclusion), [conclusion]);
  const cleanedEpilogue = useMemo(() => epilogue ? cleanGeneratedText(epilogue) : '', [epilogue]);
  const cleanedChapters = useMemo(() => chapters.map(ch => ({
    ...ch,
    title: cleanGeneratedText(ch.title || ''),
    content: ch.content ? cleanGeneratedText(ch.content) : '',
    subChapters: ch.subChapters.map(sub => ({
      ...sub,
      title: cleanGeneratedText(sub.title || ''),
      content: sub.content ? cleanGeneratedText(sub.content) : '',
    })),
  })), [chapters]);

  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt' | 'html' | 'epub' | 'googledocs' | 'idml'>('pdf');
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [generateKdpMetadata, setGenerateKdpMetadata] = useState(false);
  const [includeCharacterList, setIncludeCharacterList] = useState(true);
  const [showGoogleDocsPreview, setShowGoogleDocsPreview] = useState(false);
  const [isExportingGoogleDocs, setIsExportingGoogleDocs] = useState(false);
  
  // Options de typographie
  type FontFamily = 'Georgia' | 'Times New Roman' | 'Garamond' | 'Palatino Linotype' | 'Comic Sans MS';
  const [selectedFont, setSelectedFont] = useState<FontFamily>('Georgia');
  const [fontSize, setFontSize] = useState<number>(12); // Taille en points (12-18)
  
  const fontOptions: { value: FontFamily; label: string; description: string }[] = [
    { value: 'Georgia', label: 'Georgia', description: 'Classique, lisible (Recommandé)' },
    { value: 'Times New Roman', label: 'Times New Roman', description: 'Traditionnel, professionnel' },
    { value: 'Garamond', label: 'Garamond', description: 'Élégant, livres classiques' },
    { value: 'Palatino Linotype', label: 'Palatino', description: 'Moderne, confortable' },
    { value: 'Comic Sans MS', label: 'Comic Sans', description: 'Enfants, ludique' },
  ];
  
  const fontSizeOptions = [
    { value: 12, label: '12 pt', description: 'Adultes (standard)' },
    { value: 13, label: '13 pt', description: 'Adultes (confort)' },
    { value: 14, label: '14 pt', description: 'Lecture facile' },
    { value: 15, label: '15 pt', description: 'Jeunes lecteurs' },
    { value: 16, label: '16 pt', description: 'Enfants 8-12 ans' },
    { value: 17, label: '17 pt', description: 'Enfants 6-8 ans' },
    { value: 18, label: '18 pt', description: 'Enfants 4-6 ans (gros)' },
  ];

  const generateEbookContent = () => {
    let content = '';
    
    // 1. PAGE DE TITRE
    if (includeCoverPage) {
      content += `${ebookTitle}\n`;
      content += `${'='.repeat(ebookTitle.length)}\n\n`;
      if (authorName) {
        content += `Par ${authorName}\n\n`;
      }
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 2. PAGE BLANCHE (symbolique dans le texte)
    content += `\n\n`;

    // 3. PRÉFACE
    if (cleanedPreface) {
      content += `📝 PRÉFACE\n`;
      content += `${'='.repeat(50)}\n\n`;
      content += `${cleanedPreface}\n\n`;
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 4. TABLE DES MATIÈRES
    if (includeTableOfContents) {
      content += `📚 TABLE DES MATIÈRES\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      let currentPage = cleanedPreface ? 5 : 3;
      
      // Introduction
      if (kdpStructure?.introduction) {
        content += `Introduction ................................................ ${currentPage}\n`;
        currentPage += 3;
      }
      
      // Chapitres
      cleanedChapters.forEach((chapter, index) => {
        const chapterNumber = index + 1;
        content += `${chapterNumber}. ${chapter.title}`;
        const dots = Math.max(2, 45 - chapter.title.length - chapterNumber.toString().length);
        content += `${'.'.repeat(dots)} ${currentPage}\n`;
        
        chapter.subChapters.forEach((subChapter, subIndex) => {
          const subNumber = `${chapterNumber}.${subIndex + 1}`;
          content += `   ${subNumber} ${subChapter.title}`;
          const subDots = Math.max(2, 42 - subChapter.title.length - subNumber.length);
          content += `${'.'.repeat(subDots)} ${currentPage + subIndex + 1}\n`;
        });
        
        content += '\n';
        currentPage += Math.max(5, chapter.subChapters.length + 3);
      });
      
      // Blocs pratiques
      if (kdpStructure?.blocsPratiques) {
        content += `Blocs pratiques ................................ ${currentPage}\n`;
        currentPage += 5;
      }
      
      // Conclusion
      if (cleanedConclusion) {
        content += `Conclusion ................................ ${currentPage}\n`;
        currentPage += 3;
      }
      
      // À propos de l'auteur
      if (kdpStructure?.aproposAuteur) {
        content += `À propos de l'auteur ................................ ${currentPage}\n`;
        currentPage += 2;
      }
      
      // Annexes
      if (kdpStructure?.annexes) {
        content += `Annexes ................................ ${currentPage}\n`;
        currentPage += 3;
      }
      
      // Personnages
      if (includeCharacterList && characters.length > 0) {
        content += `Personnages ................................ ${currentPage}\n`;
      }
      
      content += `\n${'='.repeat(50)}\n\n\n`;
    }

    // 5. INTRODUCTION
    if (kdpStructure?.introduction) {
      content += `📖 INTRODUCTION\n`;
      content += `${'='.repeat(50)}\n\n`;
      if (kdpStructure.introduction.accroche) {
        content += `${kdpStructure.introduction.accroche}\n\n`;
      }
      if (kdpStructure.introduction.promesse) {
        content += `${kdpStructure.introduction.promesse}\n\n`;
      }
      if (kdpStructure.introduction.contenu) {
        content += `${kdpStructure.introduction.contenu}\n\n`;
      }
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 6. CHAPITRES PRINCIPAUX
    cleanedChapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;
      
      content += `📖 CHAPITRE ${chapterNumber}: ${chapter.title.toUpperCase()}\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      if (chapter.content) {
        content += `${chapter.content}\n\n`;
      }
      
      // Sous-chapitres
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        content += `${subNumber}. ${subChapter.title}\n`;
        content += `${'-'.repeat(30)}\n\n`;
        
        if (subChapter.content) {
          content += `${subChapter.content}\n\n`;
        }
      });
      
      content += `${'='.repeat(50)}\n\n\n`;
    });

    // 7. BLOCS PRATIQUES
    if (kdpStructure?.blocsPratiques) {
      content += `🛠️ BLOCS PRATIQUES\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      // Checklist
      if (kdpStructure.blocsPratiques.checklist && kdpStructure.blocsPratiques.checklist.length > 0) {
        content += `✅ CHECKLIST\n`;
        content += `${'-'.repeat(30)}\n`;
        kdpStructure.blocsPratiques.checklist.forEach((item, i) => {
          content += `☐ ${item}\n`;
        });
        content += `\n`;
      }
      
      // FAQ
      if (kdpStructure.blocsPratiques.faq && kdpStructure.blocsPratiques.faq.length > 0) {
        content += `❓ QUESTIONS FRÉQUENTES\n`;
        content += `${'-'.repeat(30)}\n\n`;
        kdpStructure.blocsPratiques.faq.forEach((item) => {
          content += `Q: ${item.question}\n`;
          content += `R: ${item.reponse}\n\n`;
        });
      }
      
      // Étude de cas
      if (kdpStructure.blocsPratiques.etudeDeCas) {
        content += `📋 ÉTUDE DE CAS\n`;
        content += `${'-'.repeat(30)}\n`;
        content += `${kdpStructure.blocsPratiques.etudeDeCas}\n\n`;
      }
      
      // Plan d'action
      if (kdpStructure.blocsPratiques.planAction && kdpStructure.blocsPratiques.planAction.length > 0) {
        content += `🎯 PLAN D'ACTION ÉTAPE PAR ÉTAPE\n`;
        content += `${'-'.repeat(30)}\n`;
        kdpStructure.blocsPratiques.planAction.forEach((step, i) => {
          content += `${i + 1}. ${step}\n`;
        });
        content += `\n`;
      }
      
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 8. CONCLUSION
    if (cleanedConclusion) {
      content += `🎯 CONCLUSION\n`;
      content += `${'='.repeat(50)}\n\n`;
      content += `${cleanedConclusion}\n\n`;
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 9. À PROPOS DE L'AUTEUR
    if (kdpStructure?.aproposAuteur) {
      content += `👤 À PROPOS DE L'AUTEUR\n`;
      content += `${'='.repeat(50)}\n\n`;
      content += `${kdpStructure.aproposAuteur.bio}\n\n`;
      if (kdpStructure.aproposAuteur.expertise) {
        content += `Expertise : ${kdpStructure.aproposAuteur.expertise}\n\n`;
      }
      if (kdpStructure.aproposAuteur.contact) {
        content += `Contact : ${kdpStructure.aproposAuteur.contact}\n\n`;
      }
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 10. ANNEXES
    if (kdpStructure?.annexes) {
      content += `📎 ${kdpStructure.annexes.titre?.toUpperCase() || 'ANNEXES'}\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      if (kdpStructure.annexes.ressources && kdpStructure.annexes.ressources.length > 0) {
        content += `Ressources utiles :\n`;
        kdpStructure.annexes.ressources.forEach((res) => {
          content += `• ${res}\n`;
        });
        content += `\n`;
      }
      
      if (kdpStructure.annexes.references && kdpStructure.annexes.references.length > 0) {
        content += `Références :\n`;
        kdpStructure.annexes.references.forEach((ref) => {
          content += `• ${ref}\n`;
        });
        content += `\n`;
      }
      
      content += `${'='.repeat(50)}\n\n\n`;
    }

    // 11. NOTES ET PAGES DE TRAVAIL
    content += `📝 NOTES ET PAGES DE TRAVAIL\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `(Pages laissées intentionnellement vierges pour vos notes)\n\n`;
    content += `\n\n\n\n\n\n\n\n`;
    content += `${'='.repeat(50)}\n\n\n`;

    // 12. PERSONNAGES (si applicable)
    if (includeCharacterList && characters.length > 0) {
      content += `🎭 PERSONNAGES\n`;
      content += `${'='.repeat(50)}\n\n`;
      characters.forEach((character) => {
        content += `**${character.name}**`;
        if (character.role) {
          content += ` (${character.role})`;
        }
        content += `\n`;
        if (character.description) {
          content += `${character.description}\n`;
        }
        content += `\n`;
      });
      content += `${'='.repeat(50)}\n\n`;
    }

    // Pied de page
    content += `\n\n${'='.repeat(50)}\n`;
    content += `Généré avec EbookStudio Pro\n`;
    content += `${new Date().toLocaleDateString()}\n`;
    content += `${'='.repeat(50)}`;

    return content;
  };

  const exportAsText = () => {
    const content = generateEbookContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookTitle || 'Mon-Ebook'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Ebook exporté en format TXT !');
  };

  // Utilitaire pour supprimer les emojis (non supportés par jsPDF)
  const stripEmojis = (text: string): string => {
    return text
      .replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/  +/g, ' ')
      .trim();
  };

  const exportAsPDF = () => {
    const pdf = new jsPDF({ unit: 'mm', format: [152.4, 228.6] }); // Format KDP 6x9 pouces
    let yPosition = 25;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const marginLeft = 19; // Marge intérieure KDP
    const marginRight = 13; // Marge extérieure KDP
    const usableWidth = pageWidth - marginLeft - marginRight;
    const marginBottom = 20;

    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - marginBottom) {
        pdf.addPage();
        yPosition = 25;
      }
    };

    const splitTextToSize = (text: string, maxWidth: number, size: number) => {
      pdf.setFontSize(size);
      return pdf.splitTextToSize(stripEmojis(text), maxWidth);
    };

    // Page de couverture
    if (includeCoverPage) {
      yPosition = pageHeight * 0.3; // Centré verticalement
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      const titleLines = splitTextToSize(ebookTitle, usableWidth, 24);
      titleLines.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 12;
      });

      yPosition += 15;
      // Séparateur
      pdf.setDrawColor(150);
      pdf.line(pageWidth * 0.3, yPosition, pageWidth * 0.7, yPosition);
      yPosition += 15;
      
      if (authorName) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'italic');
        pdf.text(stripEmojis(authorName), pageWidth / 2, yPosition, { align: 'center' });
      }

      pdf.addPage();
      yPosition = 25;

      // Page de copyright
      yPosition = pageHeight * 0.7;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const year = new Date().getFullYear();
      const copyrightLines = [
        `© ${year} ${stripEmojis(authorName || 'Auteur')}. Tous droits reserves.`,
        '',
        'Aucune partie de cette publication ne peut etre reproduite',
        'sans l\'autorisation ecrite prealable de l\'auteur.',
        '',
        `Premiere edition : ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      ];
      copyrightLines.forEach(line => {
        pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 5;
      });

      pdf.addPage();
      yPosition = 25;
    }

    // Table des matières
    if (includeTableOfContents) {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TABLE DES MATIERES', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      if (cleanedPreface) {
        pdf.text('Preface', marginLeft, yPosition);
        yPosition += 8;
      }

      cleanedChapters.forEach((chapter, index) => {
        checkPageBreak(8);
        const chapterNumber = index + 1;
        pdf.text(`${chapterNumber}. ${stripEmojis(chapter.title)}`, marginLeft, yPosition);
        yPosition += 8;

        chapter.subChapters.forEach((subChapter, subIndex) => {
          checkPageBreak(6);
          const subNumber = `${chapterNumber}.${subIndex + 1}`;
          pdf.text(`   ${subNumber} ${stripEmojis(subChapter.title)}`, marginLeft + 10, yPosition);
          yPosition += 6;
        });
      });

      if (cleanedConclusion) {
        checkPageBreak(8);
        pdf.text('Conclusion', marginLeft, yPosition);
        yPosition += 8;
      }

      pdf.addPage();
      yPosition = 20;
    }

    // Calculer l'interligne basé sur la taille de police utilisateur
    const lineHeight = Math.round(fontSize * 0.55); // ~1.5x line spacing in mm

    // Préface
    if (cleanedPreface) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PREFACE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      const prefaceLines = splitTextToSize(cleanedPreface, usableWidth, fontSize);
      prefaceLines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });

      pdf.addPage();
      yPosition = 20;
    }

    // Chapitres
    cleanedChapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;

      // Titre du chapitre
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const chapterTitle = `CHAPITRE ${chapterNumber}: ${stripEmojis(chapter.title).toUpperCase()}`;
      const titleLines = splitTextToSize(chapterTitle, usableWidth, 14);
      
      checkPageBreak(titleLines.length * 8 + 10);
      titleLines.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 8;
      });
      yPosition += 10;

      // Contenu du chapitre
      if (chapter.content) {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        const contentLines = splitTextToSize(chapter.content, usableWidth, fontSize);
        contentLines.forEach((line: string) => {
          checkPageBreak(lineHeight);
          pdf.text(line, marginLeft, yPosition);
          yPosition += lineHeight;
        });
        yPosition += 10;
      }

      // Sous-chapitres
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        
        pdf.setFontSize(Math.round(fontSize * 1.1));
        pdf.setFont('helvetica', 'bold');
        const subTitle = `${subNumber}. ${stripEmojis(subChapter.title)}`;
        const subTitleLines = splitTextToSize(subTitle, usableWidth, Math.round(fontSize * 1.1));
        
        checkPageBreak(subTitleLines.length * 7 + 10);
        subTitleLines.forEach((line: string) => {
          pdf.text(line, marginLeft, yPosition);
          yPosition += 7;
        });
        yPosition += 8;

        if (subChapter.content) {
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'normal');
          const subContentLines = splitTextToSize(subChapter.content, usableWidth, fontSize);
          subContentLines.forEach((line: string) => {
            checkPageBreak(lineHeight);
            pdf.text(line, marginLeft, yPosition);
            yPosition += lineHeight;
          });
          yPosition += 10;
        }
      });

      // Nouvelle page pour le chapitre suivant
      if (index < cleanedChapters.length - 1) {
        pdf.addPage();
        yPosition = 20;
      }
    });

    // Conclusion
    if (cleanedConclusion) {
      pdf.addPage();
      yPosition = 20;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CONCLUSION', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      const conclusionLines = splitTextToSize(cleanedConclusion, usableWidth, fontSize);
      conclusionLines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
    }

    // Épilogue
    if (cleanedEpilogue) {
      pdf.addPage();
      yPosition = 20;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EPILOGUE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      const epilogueLines = splitTextToSize(cleanedEpilogue, usableWidth, fontSize);
      epilogueLines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        pdf.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
    }

    // Liste des personnages (Dramatis Personae)
    if (includeCharacterList && characters.length > 0) {
      pdf.addPage();
      yPosition = 20;
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PERSONNAGES', marginLeft, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Liste des personnages et leurs roles dans cette histoire', marginLeft, yPosition);
      yPosition += 20;

      characters.forEach((character) => {
        checkPageBreak(40);
        
        // Nom du personnage
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.text(character.name || 'Personnage sans nom', marginLeft, yPosition);
        yPosition += 8;
        
        // Description/Rôle
        if (character.description) {
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'italic');
          const descLines = splitTextToSize(character.description, usableWidth, fontSize);
          descLines.forEach((line: string) => {
            checkPageBreak(lineHeight);
            pdf.text(line, marginLeft, yPosition);
            yPosition += lineHeight;
          });
        }
        
        yPosition += 10;
      });
    }

    // Numérotation des pages (skip cover + copyright = first 2 pages)
    if (includePageNumbers) {
      const totalPages = pdf.getNumberOfPages();
      const startPage = includeCoverPage ? 3 : 1; // Skip cover + copyright
      for (let i = startPage; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const displayNumber = i - startPage + 1;
        pdf.text(`${displayNumber}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
      }
    }

    pdf.save(`${ebookTitle || 'Mon-Ebook'}.pdf`);
    toast.success('Ebook exporté en format PDF !');
  };

  const exportAsHTML = () => {
    const textContent = generateEbookContent();
    
    // Conversion basique du texte en HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ebookTitle}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        .cover {
            text-align: center;
            padding: 50px 0;
            border-bottom: 3px solid #333;
            margin-bottom: 30px;
        }
        .title {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .author {
            font-size: 1.2em;
            color: #7f8c8d;
            font-style: italic;
        }
        .chapter {
            margin: 40px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chapter-title {
            font-size: 1.8em;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .subchapter {
            margin: 20px 0;
            padding-left: 20px;
        }
        .subchapter-title {
            font-size: 1.3em;
            color: #34495e;
            margin-bottom: 10px;
        }
        .content {
            text-align: justify;
            margin-bottom: 15px;
        }
        .toc {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        @media print {
            body { background: white; }
            .chapter { box-shadow: none; }
        }
    </style>
</head>
<body>
    ${textContent.split('\n').map(line => {
      if (line.includes('📚 TABLE DES MATIÈRES') || line.includes('='.repeat(50))) {
        return `<div class="toc">${line}</div>`;
      } else if (line.includes('📖 CHAPITRE')) {
        return `<h1 class="chapter-title">${line}</h1>`;
      } else if (line.match(/^\d+\.\d+\. /)) {
        return `<h2 class="subchapter-title">${line}</h2>`;
      } else if (line.trim()) {
        return `<p class="content">${line}</p>`;
      }
      return '<br>';
    }).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookTitle || 'Mon-Ebook'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Ebook exporté en format HTML !');
  };

  const exportAsEPUB = async () => {
    try {
      const zip = new JSZip();
      const uuid = `urn:uuid:${crypto.randomUUID()}`;
      const now = new Date().toISOString();

      // mimetype (doit être le premier fichier, non compressé)
      zip.file('mimetype', 'application/epub+zip');

      // META-INF/container.xml
      zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

      // OEBPS/content.opf (métadonnées et manifest)
      let manifestItems = '';
      let spineItems = '';
      
      // Navigation
      manifestItems += `    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n`;
      manifestItems += `    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>\n`;
      spineItems += `    <itemref idref="nav"/>\n`;

      // Couverture
      if (includeCoverPage) {
        manifestItems += `    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>\n`;
        spineItems += `    <itemref idref="cover"/>\n`;
      }

      // Préface
      if (cleanedPreface) {
        manifestItems += `    <item id="preface" href="preface.xhtml" media-type="application/xhtml+xml"/>\n`;
        spineItems += `    <itemref idref="preface"/>\n`;
      }

      // Chapitres
      cleanedChapters.forEach((_, index) => {
        const chapterId = `chapter${index + 1}`;
        manifestItems += `    <item id="${chapterId}" href="${chapterId}.xhtml" media-type="application/xhtml+xml"/>\n`;
        spineItems += `    <itemref idref="${chapterId}"/>\n`;
      });

      // Conclusion
      if (cleanedConclusion) {
        manifestItems += `    <item id="conclusion" href="conclusion.xhtml" media-type="application/xhtml+xml"/>\n`;
        spineItems += `    <itemref idref="conclusion"/>\n`;
      }

      const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${uuid}</dc:identifier>
    <dc:title>${ebookTitle}</dc:title>
    <dc:language>fr</dc:language>
    <dc:creator>${authorName || 'Auteur inconnu'}</dc:creator>
    <dc:date>${now.split('T')[0]}</dc:date>
    <meta property="dcterms:modified">${now}</meta>
  </metadata>
  <manifest>
${manifestItems}  </manifest>
  <spine toc="ncx">
${spineItems}  </spine>
</package>`;

      zip.file('OEBPS/content.opf', contentOpf);

      // OEBPS/toc.ncx
      let navPoints = '';
      let playOrder = 1;

      if (includeCoverPage) {
        navPoints += `    <navPoint id="nav-cover" playOrder="${playOrder++}">
      <navLabel><text>Couverture</text></navLabel>
      <content src="cover.xhtml"/>
    </navPoint>\n`;
      }

      if (cleanedPreface) {
        navPoints += `    <navPoint id="nav-preface" playOrder="${playOrder++}">
      <navLabel><text>Préface</text></navLabel>
      <content src="preface.xhtml"/>
    </navPoint>\n`;
      }

      cleanedChapters.forEach((chapter, index) => {
        navPoints += `    <navPoint id="nav-chapter${index + 1}" playOrder="${playOrder++}">
      <navLabel><text>${chapter.title}</text></navLabel>
      <content src="chapter${index + 1}.xhtml"/>
    </navPoint>\n`;
      });

      if (cleanedConclusion) {
        navPoints += `    <navPoint id="nav-conclusion" playOrder="${playOrder++}">
      <navLabel><text>Conclusion</text></navLabel>
      <content src="conclusion.xhtml"/>
    </navPoint>\n`;
      }

      const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
  <head>
    <meta name="dtb:uid" content="${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${ebookTitle}</text></docTitle>
  <navMap>
${navPoints}  </navMap>
</ncx>`;

      zip.file('OEBPS/toc.ncx', tocNcx);

      // OEBPS/nav.xhtml (EPUB 3 navigation)
      let navContent = '';
      if (includeCoverPage) navContent += `      <li><a href="cover.xhtml">Couverture</a></li>\n`;
      if (cleanedPreface) navContent += `      <li><a href="preface.xhtml">Préface</a></li>\n`;
      cleanedChapters.forEach((chapter, index) => {
        navContent += `      <li><a href="chapter${index + 1}.xhtml">${chapter.title}</a></li>\n`;
      });
      if (cleanedConclusion) navContent += `      <li><a href="conclusion.xhtml">Conclusion</a></li>\n`;

      const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Table des matières</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table des matières</h1>
    <ol>
${navContent}    </ol>
  </nav>
</body>
</html>`;

      zip.file('OEBPS/nav.xhtml', navXhtml);

      // OEBPS/cover.xhtml
      if (includeCoverPage) {
        const coverXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${ebookTitle}</title>
  <style>
    body { 
      text-align: center; 
      padding: 3em 2em; 
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    h1 { 
      font-size: 3em; 
      margin-bottom: 0.8em; 
      color: #1a202c;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      letter-spacing: 0.05em;
    }
    .author { 
      font-size: 1.8em; 
      font-style: italic; 
      color: #4a5568;
      margin-top: 1em;
      font-weight: 300;
    }
  </style>
</head>
<body>
  <h1>${ebookTitle}</h1>
  ${authorName ? `<p class="author">Par ${authorName}</p>` : ''}
</body>
</html>`;
        zip.file('OEBPS/cover.xhtml', coverXhtml);
      }

      // OEBPS/preface.xhtml
      if (cleanedPreface) {
        const prefaceXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Préface</title>
  <style>
    body { 
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; 
      line-height: 1.8; 
      padding: 2em 1.5em; 
      max-width: 38em; 
      margin: 0 auto;
      color: #2d3748;
      font-size: 1.1em;
    }
    h1 { 
      text-align: center; 
      margin-bottom: 1.5em;
      font-size: 2.2em;
      color: #1a202c;
      border-bottom: 3px solid #4299e1;
      padding-bottom: 0.5em;
    }
    p { 
      text-align: justify; 
      margin-bottom: 1.2em;
      text-indent: 1.5em;
    }
    p:first-of-type {
      text-indent: 0;
    }
  </style>
</head>
<body>
  <h1>Préface</h1>
  ${cleanedPreface.split('\n\n').map(p => `  <p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n')}
</body>
</html>`;
        zip.file('OEBPS/preface.xhtml', prefaceXhtml);
      }

      // OEBPS/chapterX.xhtml
      cleanedChapters.forEach((chapter, index) => {
        let chapterHtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${chapter.title}</title>
  <style>
    body { 
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; 
      line-height: 1.8; 
      padding: 2em 1.5em; 
      max-width: 38em; 
      margin: 0 auto;
      color: #2d3748;
      font-size: 1.1em;
    }
    h1 { 
      text-align: center; 
      margin-bottom: 1.5em;
      font-size: 2.2em;
      color: #1a202c;
      border-bottom: 3px solid #4299e1;
      padding-bottom: 0.5em;
    }
    h2 { 
      margin-top: 2.5em; 
      margin-bottom: 1em; 
      color: #2c5282;
      font-size: 1.6em;
      border-left: 4px solid #4299e1;
      padding-left: 0.8em;
    }
    p { 
      text-align: justify; 
      margin-bottom: 1.2em;
      text-indent: 1.5em;
    }
    h1 + p, h2 + p {
      text-indent: 0;
    }
  </style>
</head>
<body>
  <h1>Chapitre ${index + 1}: ${chapter.title}</h1>
`;
        if (chapter.content) {
          chapterHtml += chapter.content.split('\n\n').map(p => `  <p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
        }

        chapter.subChapters.forEach((sub) => {
          chapterHtml += `\n  <h2>${sub.title}</h2>\n`;
          if (sub.content) {
            chapterHtml += sub.content.split('\n\n').map(p => `  <p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n');
          }
        });

        chapterHtml += `
</body>
</html>`;
        zip.file(`OEBPS/chapter${index + 1}.xhtml`, chapterHtml);
      });

      // OEBPS/conclusion.xhtml
      if (cleanedConclusion) {
        const conclusionXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Conclusion</title>
  <style>
    body { 
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif; 
      line-height: 1.8; 
      padding: 2em 1.5em; 
      max-width: 38em; 
      margin: 0 auto;
      color: #2d3748;
      font-size: 1.1em;
    }
    h1 { 
      text-align: center; 
      margin-bottom: 1.5em;
      font-size: 2.2em;
      color: #1a202c;
      border-bottom: 3px solid #4299e1;
      padding-bottom: 0.5em;
    }
    p { 
      text-align: justify; 
      margin-bottom: 1.2em;
      text-indent: 1.5em;
    }
    p:first-of-type {
      text-indent: 0;
    }
  </style>
</head>
<body>
  <h1>Conclusion</h1>
  ${cleanedConclusion.split('\n\n').map(p => `  <p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('\n')}
</body>
</html>`;
        zip.file('OEBPS/conclusion.xhtml', conclusionXhtml);
      }

      // Générer le fichier EPUB
      const epubBlob = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/epub+zip',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      const url = URL.createObjectURL(epubBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebookTitle || 'Mon-Ebook'}.epub`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Ebook exporté en format EPUB conforme !');
    } catch (error) {
      console.error('Erreur export EPUB:', error);
      toast.error('Erreur lors de la génération de l\'EPUB');
    }
  };

  // Export InDesign IDML (format interchange)
  const exportAsIDML = async () => {
    try {
      const zip = new JSZip();

      // Mimetype
      zip.file('mimetype', 'application/vnd.adobe.indesign-idml-package');

      // META-INF/container.xml
      zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<container xmlns="http://www.idpf.org/2007/opf">
  <rootfiles>
    <rootfile full-path="designmap.xml"/>
  </rootfiles>
</container>`);

      // Generate unique IDs
      const generateId = () => Math.random().toString(36).substring(2, 15);
      const storyId = generateId();

      // Resources/Fonts.xml
      zip.file('Resources/Fonts.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Fonts xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="18.0">
  <FontFamily Self="di${generateId()}" Name="Adobe Garamond Pro">
    <Font Self="di${generateId()}" Name="Adobe Garamond Pro" FontFamily="Adobe Garamond Pro" FontStyleName="Regular" FontType="TrueType" WritingScript="0"/>
  </FontFamily>
  <FontFamily Self="di${generateId()}" Name="Helvetica Neue">
    <Font Self="di${generateId()}" Name="Helvetica Neue" FontFamily="Helvetica Neue" FontStyleName="Bold" FontType="TrueType" WritingScript="0"/>
  </FontFamily>
</idPkg:Fonts>`);

      // Resources/Styles.xml
      const titleStyleId = generateId();
      const chapterStyleId = generateId();
      const subchapterStyleId = generateId();
      const bodyStyleId = generateId();

      zip.file('Resources/Styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Styles xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="18.0">
  <RootParagraphStyleGroup Self="di${generateId()}">
    <ParagraphStyle Self="ParagraphStyle/${titleStyleId}" Name="Titre Livre" PointSize="36" FontStyle="Bold" Justification="CenterAlign" SpaceBefore="72" SpaceAfter="36"/>
    <ParagraphStyle Self="ParagraphStyle/${chapterStyleId}" Name="Titre Chapitre" PointSize="24" FontStyle="Bold" Justification="LeftAlign" SpaceBefore="48" SpaceAfter="24"/>
    <ParagraphStyle Self="ParagraphStyle/${subchapterStyleId}" Name="Sous-Chapitre" PointSize="16" FontStyle="Bold" Justification="LeftAlign" SpaceBefore="24" SpaceAfter="12"/>
    <ParagraphStyle Self="ParagraphStyle/${bodyStyleId}" Name="Corps Texte" PointSize="11" FontStyle="Regular" Justification="LeftJustify" FirstLineIndent="14" SpaceAfter="6" Leading="15"/>
  </RootParagraphStyleGroup>
</idPkg:Styles>`);

      // Build story content
      let storyContent = '';
      
      // Title
      if (includeCoverPage) {
        storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${titleStyleId}">
  <Content>${escapeXml(ebookTitle)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
        if (authorName) {
          storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${bodyStyleId}">
  <Content>Par ${escapeXml(authorName)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
        }
      }

      // Preface
      if (cleanedPreface) {
        storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${chapterStyleId}">
  <Content>Préface</Content>
  <Br/>
</ParagraphStyleRange>
`;
        cleanedPreface.split('\n\n').forEach(para => {
          if (para.trim()) {
            storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${bodyStyleId}">
  <Content>${escapeXml(para)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
          }
        });
      }

      // Chapters
      cleanedChapters.forEach((chapter, index) => {
        storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${chapterStyleId}">
  <Content>Chapitre ${index + 1}: ${escapeXml(chapter.title)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
        if (chapter.content) {
          chapter.content.split('\n\n').forEach(para => {
            if (para.trim()) {
              storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${bodyStyleId}">
  <Content>${escapeXml(para)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
            }
          });
        }

        chapter.subChapters.forEach((sub, subIndex) => {
          storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${subchapterStyleId}">
  <Content>${index + 1}.${subIndex + 1} ${escapeXml(sub.title)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
          if (sub.content) {
            sub.content.split('\n\n').forEach(para => {
              if (para.trim()) {
                storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${bodyStyleId}">
  <Content>${escapeXml(para)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
              }
            });
          }
        });
      });

      // Conclusion
      if (cleanedConclusion) {
        storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${chapterStyleId}">
  <Content>Conclusion</Content>
  <Br/>
</ParagraphStyleRange>
`;
        cleanedConclusion.split('\n\n').forEach(para => {
          if (para.trim()) {
            storyContent += `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/${bodyStyleId}">
  <Content>${escapeXml(para)}</Content>
  <Br/>
</ParagraphStyleRange>
`;
          }
        });
      }

      // Stories/Story.xml
      zip.file(`Stories/Story_${storyId}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="18.0">
  <Story Self="u${storyId}" AppliedTOCStyle="n" TrackChanges="false" StoryTitle="${escapeXml(ebookTitle)}">
    ${storyContent}
  </Story>
</idPkg:Story>`);

      // designmap.xml (main document reference)
      zip.file('designmap.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Document xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="18.0" Self="d${generateId()}">
  <idPkg:Fonts src="Resources/Fonts.xml"/>
  <idPkg:Styles src="Resources/Styles.xml"/>
  <idPkg:Story src="Stories/Story_${storyId}.xml"/>
  <DocumentPreference PageWidth="612" PageHeight="792" FacingPages="true" PageBinding="LeftToRight" DocumentBleedBottomOffset="9" DocumentBleedTopOffset="9" DocumentBleedInsideOrLeftOffset="9" DocumentBleedOutsideOrRightOffset="9"/>
  <Language Self="Language/$ID/French" Name="$ID/French" ICULocaleName="fr_FR" HyphenationVendor="Hunspell" SpellingVendor="Hunspell"/>
</Document>`);

      // Generate IDML file
      const idmlBlob = await zip.generateAsync({ 
        type: 'blob',
        mimeType: 'application/vnd.adobe.indesign-idml-package',
        compression: 'DEFLATE'
      });

      const url = URL.createObjectURL(idmlBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebookTitle || 'Mon-Ebook'}.idml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Fichier InDesign IDML exporté ! Ouvrez-le dans InDesign pour la mise en page professionnelle.');
    } catch (error) {
      console.error('Erreur export IDML:', error);
      toast.error('Erreur lors de la génération du fichier IDML');
    }
  };

  // Fonction pour parser le markdown en TextRuns Word avec gras, italique et souligné
  const parseMarkdownToTextRuns = (text: string, baseSize: number = 24, fontName: string = selectedFont): TextRun[] => {
    if (!text || text.trim() === '') {
      return [new TextRun({ text: '', size: baseSize, font: fontName })];
    }

    const runs: TextRun[] = [];
    
    // Tokenizer amélioré pour gérer tous les formats
    // Ordre: ***gras italique***, **gras**, __gras__, ~~souligné~~, <u>souligné</u>, *italique*, _italique_
    const tokenRegex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|__[\s\S]+?__|~~[\s\S]+?~~|<u>[\s\S]+?<\/u>|\*[^*\n]+?\*|_[^_\n]+?_)/g;
    
    let lastIndex = 0;
    let match;
    
    while ((match = tokenRegex.exec(text)) !== null) {
      // Ajouter le texte normal avant le match
      if (match.index > lastIndex) {
        const normalText = text.substring(lastIndex, match.index);
        if (normalText) {
          runs.push(new TextRun({
            text: normalText,
            size: baseSize,
            font: fontName,
          }));
        }
      }
      
      const matchedText = match[0];
      
      if (matchedText.startsWith('***') && matchedText.endsWith('***')) {
        // ***gras italique***
        runs.push(new TextRun({
          text: matchedText.slice(3, -3),
          bold: true,
          italics: true,
          size: baseSize,
          font: fontName,
        }));
      } else if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        // **gras**
        runs.push(new TextRun({
          text: matchedText.slice(2, -2),
          bold: true,
          size: baseSize,
          font: fontName,
        }));
      } else if (matchedText.startsWith('__') && matchedText.endsWith('__')) {
        // __gras__
        runs.push(new TextRun({
          text: matchedText.slice(2, -2),
          bold: true,
          size: baseSize,
          font: fontName,
        }));
      } else if (matchedText.startsWith('~~') && matchedText.endsWith('~~')) {
        // ~~souligné~~
        runs.push(new TextRun({
          text: matchedText.slice(2, -2),
          underline: { type: UnderlineType.SINGLE },
          size: baseSize,
          font: fontName,
        }));
      } else if (matchedText.startsWith('<u>') && matchedText.endsWith('</u>')) {
        // <u>souligné</u>
        runs.push(new TextRun({
          text: matchedText.slice(3, -4),
          underline: { type: UnderlineType.SINGLE },
          size: baseSize,
          font: fontName,
        }));
      } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
        // *italique*
        runs.push(new TextRun({
          text: matchedText.slice(1, -1),
          italics: true,
          size: baseSize,
          font: fontName,
        }));
      } else if (matchedText.startsWith('_') && matchedText.endsWith('_')) {
        // _italique_
        runs.push(new TextRun({
          text: matchedText.slice(1, -1),
          italics: true,
          size: baseSize,
          font: fontName,
        }));
      }
      
      lastIndex = match.index + matchedText.length;
    }
    
    // Ajouter le texte restant après le dernier match
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        runs.push(new TextRun({
          text: remainingText,
          size: baseSize,
          font: fontName,
        }));
      }
    }
    
    return runs.length > 0 ? runs : [new TextRun({ text, size: baseSize, font: fontName })];
  };

  // Export DOCX formaté KDP professionnel
  const exportAsKdpDocx = async () => {
    try {
      await exportProfessionalDocx({
        title: ebookTitle,
        authorName,
        preface: cleanedPreface,
        conclusion: cleanedConclusion,
        epilogue: cleanedEpilogue,
        chapters: cleanedChapters.map(ch => ({
          title: ch.title,
          content: ch.content,
          subChapters: ch.subChapters.map(sub => ({
            title: sub.title,
            content: sub.content,
          })),
        })),
        characters: characters.map(c => ({
          name: c.name,
          role: c.role,
          description: c.description,
        })),
        fontFamily: selectedFont,
        fontSize,
        includeTableOfContents,
        includeCoverPage,
        includePageNumbers,
        includeCopyrightPage: true,
        pageFormat: '6x9',
      });
      toast.success('DOCX professionnel exporté ! Prêt pour publication.');
    } catch (error) {
      console.error('Erreur export DOCX:', error);
      toast.error('Erreur lors de la génération du fichier DOCX');
    }
  }
  const escapeXml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const exportKdpMetadata = () => {
    const metadata = `
═══════════════════════════════════════════════════════════
          MÉTADONNÉES AMAZON KDP - ${ebookTitle}
═══════════════════════════════════════════════════════════

📖 INFORMATIONS DU LIVRE
─────────────────────────────────────────────────────────
Titre: ${ebookTitle}
Auteur: ${authorName || 'À compléter'}
Nombre de mots: ${getStats().totalWords}
Pages estimées: ${getStats().estimatedPages}

📝 DESCRIPTION COURTE (pour Amazon)
─────────────────────────────────────────────────────────
${cleanedPreface.substring(0, 200)}...

🎯 MOTS-CLÉS SUGGÉRÉS (max 7 pour KDP)
─────────────────────────────────────────────────────────
1. ${ebookTitle.split(' ')[0].toLowerCase()}
2. guide pratique
3. développement personnel
4. success
5. transformation
6. méthode
7. stratégie

📚 CATÉGORIES SUGGÉRÉES
─────────────────────────────────────────────────────────
- Non-fiction > Auto-assistance
- Business & Money > Skills
- Self-Help > Personal Transformation

💰 PRIX SUGGÉRÉS
─────────────────────────────────────────────────────────
Kindle: 2.99€ - 9.99€ (70% royalties entre 2.99€ et 9.99€)
Paperback: 9.99€ - 19.99€

🌐 MARCHÉS RECOMMANDÉS
─────────────────────────────────────────────────────────
✓ Amazon.fr (France)
✓ Amazon.com (USA)
✓ Amazon.co.uk (UK)
✓ Amazon.de (Allemagne)
✓ Amazon.es (Espagne)
✓ Amazon.it (Italie)

📋 CHECKLIST PRE-PUBLICATION
─────────────────────────────────────────────────────────
□ Relecture complète
□ Correction orthographique
□ Vérification des liens (si applicable)
□ Couverture au format 2560x1600 minimum
□ ISBN (optionnel pour Kindle, requis pour paperback)
□ Compte KDP créé
□ Informations fiscales complétées

═══════════════════════════════════════════════════════════
          Généré le ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════
`;

    const blob = new Blob([metadata], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ebookTitle.replace(/[^a-z0-9]/gi, '_')}_METADATA_KDP.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Génère un contenu formaté pour Google Docs (optimisé KDP) avec images base64 pour l'edge function
  const generateKdpContent = () => {
    let content = '';
    
    // Préface
    if (cleanedPreface) {
      content += `PRÉFACE\n\n`;
      content += `${cleanedPreface}\n\n\n`;
    }

    // Chapitres
    cleanedChapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;
      
      content += `CHAPITRE ${chapterNumber}\n${chapter.title.toUpperCase()}\n\n`;
      
      if (chapter.content) {
        content += `${chapter.content}\n\n`;
      }
      
      // Sous-chapitres
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        content += `${subNumber}. ${subChapter.title}\n\n`;
        
        if (subChapter.content) {
          content += `${subChapter.content}\n\n`;
        }
      });
      
      content += '\n';
    });

    // Conclusion
    if (cleanedConclusion) {
      content += `CONCLUSION\n\n`;
      content += `${cleanedConclusion}\n\n`;
    }

    // Épilogue
    if (cleanedEpilogue) {
      content += `ÉPILOGUE\n\n`;
      content += `${cleanedEpilogue}\n\n`;
    }

    return content;
  };

  const exportToGoogleDocs = async () => {
    setIsExportingGoogleDocs(true);
    try {
      const content = generateKdpContent();
      
      const { data, error } = await supabase.functions.invoke('export-to-google-docs', {
        body: {
          title: ebookTitle,
          content: content,
          authorName: authorName
        }
      });

      if (error) throw error;

      if (data?.success && data?.documentUrl) {
        setShowGoogleDocsPreview(false);
        toast.success('Document créé sur Google Docs !', {
          description: 'Cliquez pour ouvrir',
          action: {
            label: 'Ouvrir',
            onClick: () => window.open(data.documentUrl, '_blank')
          }
        });
      }
    } catch (error) {
      console.error('Erreur export Google Docs:', error);
      toast.error('Erreur lors de l\'export vers Google Docs');
    } finally {
      setIsExportingGoogleDocs(false);
    }
  };

  const handleOpenGoogleDocsPreview = () => {
    if (!ebookTitle) {
      toast.error('Veuillez ajouter un titre à votre ebook');
      return;
    }
    if (cleanedChapters.length === 0) {
      toast.error('Veuillez ajouter au moins un chapitre');
      return;
    }
    setShowGoogleDocsPreview(true);
  };

  const handleExport = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez ajouter un titre à votre ebook');
      return;
    }

    if (cleanedChapters.length === 0) {
      toast.error('Veuillez ajouter au moins un chapitre');
      return;
    }

    // Pre-export validation
    const emptyChapters = cleanedChapters.filter(ch => {
      const hasContent = ch.content && ch.content.trim().length > 0;
      const hasSubContent = ch.subChapters.some(sub => sub.content && sub.content.trim().length > 0);
      return !hasContent && !hasSubContent;
    });

    if (emptyChapters.length > 0) {
      const names = emptyChapters.map(ch => ch.title || 'Sans titre').join(', ');
      toast.warning(`${emptyChapters.length} chapitre(s) sans contenu : ${names}`, {
        description: 'L\'export continuera mais ces chapitres seront vides.',
        duration: 6000,
      });
    }

    setIsExporting(true);

    try {
      // Exporter les métadonnées KDP si demandé
      if (generateKdpMetadata) {
        exportKdpMetadata();
      }

      switch (exportFormat) {
        case 'txt':
          exportAsText();
          break;
        case 'html':
          exportAsHTML();
          break;
        case 'pdf':
          exportAsPDF();
          break;
        case 'docx':
          await exportAsKdpDocx();
          break;
        case 'epub':
          await exportAsEPUB();
          break;
        case 'idml':
          await exportAsIDML();
          break;
        default:
          exportAsText();
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export de l\'ebook');
    } finally {
      setIsExporting(false);
    }
  };

  const getStats = () => {
    const totalWords = chapters.reduce((total, chapter) => {
      const chapterWords = chapter.content ? chapter.content.split(' ').length : 0;
      const subChapterWords = chapter.subChapters.reduce((subTotal, sub) => {
        return subTotal + (sub.content ? sub.content.split(' ').length : 0);
      }, 0);
      return total + chapterWords + subChapterWords;
    }, 0);

    const prefaceWords = preface ? preface.split(' ').length : 0;
    const conclusionWords = conclusion ? conclusion.split(' ').length : 0;

    return {
      totalWords: totalWords + prefaceWords + conclusionWords,
      estimatedPages: Math.ceil((totalWords + prefaceWords + conclusionWords) / 250),
      readingTime: Math.ceil((totalWords + prefaceWords + conclusionWords) / 200)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter l'Ebook
          </CardTitle>
          <CardDescription>
            Téléchargez votre ebook complet dans différents formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="format">Format d'export</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="docx">📄 Word DOCX (KDP Ready - Recommandé)</SelectItem>
                <SelectItem value="pdf">📄 PDF (Pour KDP)</SelectItem>
                <SelectItem value="epub">📘 EPUB (Kindle)</SelectItem>
                <SelectItem value="html">🌐 HTML (Web)</SelectItem>
                <SelectItem value="txt">📝 Texte (.txt)</SelectItem>
                <SelectItem value="idml">🎨 InDesign IDML (Print Pro)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exportFormat === 'docx' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Format KDP Professionnel
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>✓ Format 6x9 pouces (standard KDP)</li>
                  <li>✓ Marges optimisées pour reliure</li>
                  <li>✓ Police {selectedFont} ({fontSize}pt)</li>
                  <li>✓ Interligne 1.5 (confort lecture)</li>
                  <li>✓ En-têtes et numérotation</li>
                  <li>✓ Table des matières formatée</li>
                </ul>
              </div>

              {/* Options de typographie */}
              <div className="border border-primary/20 rounded-lg p-4 space-y-4 bg-muted/30">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  🔤 Typographie personnalisée
                </h4>
                
                {/* Sélection de la police */}
                <div className="space-y-2">
                  <Label htmlFor="font-select">Police de caractères</Label>
                  <Select value={selectedFont} onValueChange={(value: FontFamily) => setSelectedFont(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une police" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <div className="flex flex-col">
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                            <span className="text-xs text-muted-foreground">{font.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sélection de la taille */}
                <div className="space-y-2">
                  <Label htmlFor="font-size">Taille de police ({fontSize}pt)</Label>
                  <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((size) => (
                        <SelectItem key={size.value} value={size.value.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{size.label}</span>
                            <span className="text-xs text-muted-foreground">- {size.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    💡 Recommandé : 12pt pour adultes, 16-18pt pour enfants
                  </p>
                </div>

                {/* Aperçu de la police */}
                <div className="p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Aperçu :</p>
                  <p style={{ fontFamily: selectedFont, fontSize: `${fontSize}px` }}>
                    Voici un exemple de texte avec la police {selectedFont} en {fontSize}pt.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Options d'export</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cover"
                checked={includeCoverPage}
                onCheckedChange={(checked) => setIncludeCoverPage(checked === true)}
              />
              <Label htmlFor="cover">Inclure la page de couverture</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="toc"
                checked={includeTableOfContents}
                onCheckedChange={(checked) => setIncludeTableOfContents(checked === true)}
              />
              <Label htmlFor="toc">Inclure la table des matières</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pages"
                checked={includePageNumbers}
                onCheckedChange={(checked) => setIncludePageNumbers(checked === true)}
              />
              <Label htmlFor="pages">Inclure la numérotation des pages</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="kdp-metadata"
                checked={generateKdpMetadata}
                onCheckedChange={(checked) => setGenerateKdpMetadata(checked === true)}
              />
              <Label htmlFor="kdp-metadata">Générer fichier métadonnées KDP</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="character-list"
                checked={includeCharacterList}
                onCheckedChange={(checked) => setIncludeCharacterList(checked === true)}
                disabled={characters.length === 0}
              />
              <Label htmlFor="character-list" className={characters.length === 0 ? 'text-muted-foreground' : ''}>
                Inclure la liste des personnages ({characters.length})
              </Label>
            </div>
          </div>

          {generateKdpMetadata && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                📋 Un fichier texte avec vos métadonnées KDP (titre, auteur, mots-clés suggérés) sera créé lors de l'export.
              </p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Statistiques de l'ebook</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalWords}</div>
                <div className="text-muted-foreground">Mots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.estimatedPages}</div>
                <div className="text-muted-foreground">Pages estimées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.readingTime}</div>
                <div className="text-muted-foreground">Min de lecture</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleOpenGoogleDocsPreview}
              disabled={isExportingGoogleDocs || !ebookTitle || chapters.length === 0}
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/5"
              size="lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              👁️ Prévisualiser avant Google Docs
            </Button>

            <Button
              onClick={handleExport}
              disabled={isExporting || !ebookTitle || chapters.length === 0}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Printer className="h-4 w-4 mr-2 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  📚 Exporter l'Ebook Complet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <EbookExportPreview
        isOpen={showGoogleDocsPreview}
        onClose={() => setShowGoogleDocsPreview(false)}
        onConfirmExport={exportToGoogleDocs}
        ebookTitle={ebookTitle}
        authorName={authorName}
        preface={preface}
        conclusion={conclusion}
        epilogue={epilogue}
        chapters={chapters}
        characters={characters}
        isExporting={isExportingGoogleDocs}
      />
    </div>
  );
};
