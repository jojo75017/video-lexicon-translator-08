import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Heart, Star, Sparkles, Download, Loader2, BookHeart, Calendar, Flower2, Moon, Sun, Rainbow, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

interface EbookDiaryGeneratorProps {
  ebookTitle?: string;
}

const DIARY_THEMES = [
  { id: 'romantic', label: '💕 Romantique', colors: ['#FFB6C1', '#FF69B4', '#FFC0CB'], icon: Heart },
  { id: 'elegant', label: '✨ Élégant', colors: ['#DDA0DD', '#E6E6FA', '#D8BFD8'], icon: Crown },
  { id: 'nature', label: '🌸 Nature & Fleurs', colors: ['#98FB98', '#90EE90', '#FFB7C5'], icon: Flower2 },
  { id: 'cosmic', label: '🌙 Cosmique', colors: ['#191970', '#4B0082', '#9370DB'], icon: Moon },
  { id: 'sunshine', label: '☀️ Soleil', colors: ['#FFD700', '#FFA500', '#FFFFE0'], icon: Sun },
  { id: 'rainbow', label: '🌈 Arc-en-ciel', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'], icon: Rainbow },
  { id: 'minimal', label: '🤍 Minimaliste', colors: ['#F5F5F5', '#E0E0E0', '#FAFAFA'], icon: Sparkles },
  { id: 'boho', label: '🪶 Bohème', colors: ['#D2691E', '#DEB887', '#F5DEB3'], icon: Star },
];

const DIARY_TYPES = [
  { id: 'journal', label: 'Journal Intime', description: 'Pages datées avec espaces d\'écriture libre' },
  { id: 'agenda', label: 'Agenda Scolaire', description: 'Planning semaine, emploi du temps, notes' },
  { id: 'gratitude', label: 'Journal de Gratitude', description: 'Pages pour noter ses remerciements quotidiens' },
  { id: 'dreams', label: 'Carnet de Rêves', description: 'Pages pour noter et analyser ses rêves' },
  { id: 'wellness', label: 'Bien-être', description: 'Suivi humeur, méditation, self-care' },
  { id: 'creative', label: 'Créatif', description: 'Pages mixtes: dessin, écriture, collage' },
];

const INTERIOR_SECTIONS = [
  { id: 'daily', label: 'Pages journalières', default: true },
  { id: 'weekly', label: 'Vue semaine', default: true },
  { id: 'monthly', label: 'Calendriers mensuels', default: true },
  { id: 'notes', label: 'Pages de notes', default: true },
  { id: 'reminders', label: 'Pense-bêtes / To-do', default: true },
  { id: 'quotes', label: 'Citations inspirantes', default: false },
  { id: 'mood', label: 'Tracker d\'humeur', default: false },
  { id: 'goals', label: 'Objectifs & Rêves', default: false },
  { id: 'memories', label: 'Souvenirs à garder', default: false },
  { id: 'lists', label: 'Listes (films, livres, envies)', default: false },
  { id: 'doodle', label: 'Pages griffonnage', default: false },
  { id: 'photos', label: 'Espaces photos/stickers', default: false },
];

const AGE_GROUPS = [
  { id: '8-12', label: '8-12 ans', style: 'Coloré et ludique' },
  { id: '13-16', label: '13-16 ans', style: 'Trendy et expressif' },
  { id: '17-25', label: '17-25 ans', style: 'Moderne et minimaliste' },
  { id: '25+', label: '25+ ans', style: 'Élégant et sophistiqué' },
];

const COVER_STYLES = [
  { id: 'photo', label: 'Photo personnalisée' },
  { id: 'illustrated', label: 'Illustration artistique' },
  { id: 'pattern', label: 'Motifs décoratifs' },
  { id: 'minimal', label: 'Design épuré' },
  { id: 'vintage', label: 'Style vintage' },
  { id: 'watercolor', label: 'Aquarelle' },
];

const INSPIRATIONAL_QUOTES = [
  "Crois en tes reves",
  "Tu es capable de grandes choses",
  "Chaque jour est une nouvelle chance",
  "Sois toi-meme, les autres sont deja pris",
  "La vie est belle quand on y croit",
  "Brille comme tu sais le faire",
  "Tes pensees creent ta realite",
  "Aujourd'hui est un bon jour",
];

const EbookDiaryGenerator: React.FC<EbookDiaryGeneratorProps> = ({ ebookTitle }) => {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [ageGroup, setAgeGroup] = useState('13-16');
  const [diaryType, setDiaryType] = useState('journal');
  const [theme, setTheme] = useState('romantic');
  const [coverStyle, setCoverStyle] = useState('illustrated');
  const [numberOfPages, setNumberOfPages] = useState([120]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedSections, setSelectedSections] = useState<string[]>(
    INTERIOR_SECTIONS.filter(s => s.default).map(s => s.id)
  );
  const [customTitle, setCustomTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCover, setGeneratedCover] = useState<string | null>(null);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);

  const selectedTheme = DIARY_THEMES.find(t => t.id === theme);
  const selectedType = DIARY_TYPES.find(t => t.id === diaryType);
  const selectedAgeGroup = AGE_GROUPS.find(a => a.id === ageGroup);

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const generateCover = async () => {
    const themeData = DIARY_THEMES.find(t => t.id === theme);
    const typeData = DIARY_TYPES.find(t => t.id === diaryType);
    const ageData = AGE_GROUPS.find(a => a.id === ageGroup);

    const coverPrompt = `Create a beautiful diary/journal cover design for a ${ageData?.style.toLowerCase()} style.
Theme: ${themeData?.label} with colors ${themeData?.colors.join(', ')}.
Type: ${typeData?.label}.
Cover style: ${COVER_STYLES.find(s => s.id === coverStyle)?.label}.
Include decorative elements like flowers, stars, hearts, or butterflies.
The design should be feminine, elegant, and inviting.
Leave space at the center-top for a title.
${firstName ? `Personalized for someone named ${firstName}.` : ''}
High quality, professional book cover design, vertical format 6x9 inches.`;

    try {
      const diaryTitle = customTitle || `Journal ${firstName || 'Intime'}`;
      const { data, error } = await supabase.functions.invoke('generate-cover-image', {
        body: { 
          title: diaryTitle,
          prompt: coverPrompt,
          width: 612,
          height: 792
        }
      });

      if (error) throw error;
      return data?.imageUrl || null;
    } catch (error) {
      console.error('Cover generation skipped:', error);
      // Don't show error toast - cover is optional, PDF will work without it
      return null;
    }
  };

  const generateDiaryContent = async () => {
    setIsGenerating(true);
    toast.info('Génération de votre agenda personnalisé...');

    try {
      // Generate cover
      const coverUrl = await generateCover();
      if (coverUrl) {
        setGeneratedCover(coverUrl);
      }

      // Generate page templates based on selected sections
      const pages: any[] = [];
      const themeColors = selectedTheme?.colors || ['#FFB6C1', '#FF69B4', '#FFC0CB'];

      // Title page
      pages.push({
        type: 'title',
        content: {
          title: customTitle || `Le Journal de ${firstName || 'Moi'}`,
          subtitle: subtitle || selectedType?.description,
          year: year,
          decoration: theme
        }
      });

      // Personal info page - empty fields for buyer to fill
      pages.push({
        type: 'personal',
        content: {
          sections: [
            { label: 'Mon prénom' },
            { label: 'Mon âge' },
            { label: 'Mon anniversaire' },
            { label: 'Ma couleur préférée' },
            { label: 'Mon animal préféré' },
            { label: 'Ma chanson préférée' },
            { label: 'Mon rêve' },
            { label: 'Ce qui me rend heureuse' },
            { label: 'Ma meilleure amie' },
            { label: 'Mon mot secret' },
          ]
        }
      });

      // Monthly calendars
      if (selectedSections.includes('monthly')) {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        months.forEach(month => {
          pages.push({
            type: 'monthly',
            content: { month, year }
          });
        });
      }

      // Weekly pages
      if (selectedSections.includes('weekly')) {
        for (let week = 1; week <= 52; week++) {
          pages.push({
            type: 'weekly',
            content: { weekNumber: week, year }
          });
        }
      }

      // Daily pages
      if (selectedSections.includes('daily')) {
        for (let i = 0; i < Math.min(30, numberOfPages[0] / 4); i++) {
          pages.push({
            type: 'daily',
            content: { 
              quote: INSPIRATIONAL_QUOTES[i % INSPIRATIONAL_QUOTES.length],
              hasGratitude: selectedSections.includes('mood')
            }
          });
        }
      }

      // Notes pages
      if (selectedSections.includes('notes')) {
        for (let i = 0; i < 10; i++) {
          pages.push({ type: 'notes', content: { pageNum: i + 1 } });
        }
      }

      // Reminder / To-do pages
      if (selectedSections.includes('reminders')) {
        for (let i = 0; i < 5; i++) {
          pages.push({ type: 'reminder', content: { pageNum: i + 1 } });
        }
      }

      // Goals page
      if (selectedSections.includes('goals')) {
        pages.push({ type: 'goals', content: {} });
      }

      // Mood tracker
      if (selectedSections.includes('mood')) {
        pages.push({ type: 'mood', content: {} });
      }

      // Lists pages
      if (selectedSections.includes('lists')) {
        ['Films à voir', 'Livres à lire', 'Musiques favorites', 'Endroits à visiter', 'Bucket List'].forEach(listTitle => {
          pages.push({ type: 'list', content: { title: listTitle } });
        });
      }

      // Doodle pages
      if (selectedSections.includes('doodle')) {
        for (let i = 0; i < 5; i++) {
          pages.push({ type: 'doodle', content: {} });
        }
      }

      setGeneratedPages(pages);
      toast.success(`${pages.length} pages générées avec succès!`);
    } catch (error) {
      console.error('Error generating diary:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    if (generatedPages.length === 0) {
      toast.error('Veuillez d\'abord générer le contenu');
      return;
    }

    toast.info('Création du PDF en cours...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [152.4, 228.6] // 6x9 inches
    });

    const pageWidth = 152.4;
    const pageHeight = 228.6;
    const margin = 15;
    const themeColors = selectedTheme?.colors || ['#FFB6C1', '#FF69B4', '#FFC0CB'];

    // Helper function to draw decorative elements
    const drawDecorations = (type: string) => {
      pdf.setDrawColor(themeColors[1]);
      pdf.setLineWidth(0.5);
      
      // Corner decorations
      if (type !== 'doodle') {
        // Top left corner
        pdf.line(margin - 5, margin + 10, margin - 5, margin - 5);
        pdf.line(margin - 5, margin - 5, margin + 10, margin - 5);
        
        // Top right corner
        pdf.line(pageWidth - margin + 5, margin + 10, pageWidth - margin + 5, margin - 5);
        pdf.line(pageWidth - margin + 5, margin - 5, pageWidth - margin - 10, margin - 5);
        
        // Bottom decorations
        pdf.line(margin - 5, pageHeight - margin - 10, margin - 5, pageHeight - margin + 5);
        pdf.line(margin - 5, pageHeight - margin + 5, margin + 10, pageHeight - margin + 5);
      }
    };

    // Cover page
    if (generatedCover) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = generatedCover;
        });
        pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
      } catch (e) {
        // Fallback cover
        pdf.setFillColor(themeColors[0]);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.setFontSize(24);
        pdf.setTextColor(themeColors[1]);
        pdf.text('Mon Journal', pageWidth / 2, pageHeight / 2, { align: 'center' });
      }
    } else {
      // Simple cover
      pdf.setFillColor(themeColors[0]);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setFontSize(28);
      pdf.setTextColor('#333333');
      pdf.text('Mon Journal', pageWidth / 2, 80, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text(subtitle || selectedType?.description || '', pageWidth / 2, 100, { align: 'center' });
      pdf.setFontSize(14);
      pdf.text(year, pageWidth / 2, 180, { align: 'center' });
    }

    // Generate each page
    for (const page of generatedPages) {
      pdf.addPage();
      drawDecorations(page.type);

      switch (page.type) {
        case 'title':
          pdf.setFontSize(28);
          pdf.setTextColor('#333333');
          pdf.text('Mon Journal', pageWidth / 2, 60, { align: 'center' });
          pdf.setFontSize(14);
          pdf.text(page.content.subtitle || '', pageWidth / 2, 80, { align: 'center' });
          pdf.setFontSize(18);
          pdf.text(`- ${page.content.year} -`, pageWidth / 2, 120, { align: 'center' });
          break;

        case 'personal':
          pdf.setFontSize(20);
          pdf.setTextColor(themeColors[1]);
          pdf.text('A propos de moi', pageWidth / 2, 30, { align: 'center' });
          pdf.setFontSize(12);
          pdf.setTextColor('#333333');
          let yPos = 50;
          page.content.sections.forEach((section: any) => {
            pdf.text(`${section.label}:`, margin, yPos);
            pdf.setDrawColor('#CCCCCC');
            pdf.line(margin + 45, yPos, pageWidth - margin, yPos);
            yPos += 18;
          });
          break;

        case 'monthly':
          pdf.setFontSize(22);
          pdf.setTextColor(themeColors[1]);
          pdf.text(`${page.content.month} ${page.content.year}`, pageWidth / 2, 25, { align: 'center' });
          
          // Simple lined format instead of grid
          pdf.setFontSize(11);
          pdf.setTextColor('#333333');
          
          // Draw lines for each day (31 days max)
          pdf.setDrawColor('#DDDDDD');
          for (let day = 1; day <= 31; day++) {
            const lineY = 40 + (day - 1) * 6;
            if (lineY < pageHeight - 40) {
              pdf.setFontSize(9);
              pdf.text(`${day}`, margin, lineY);
              pdf.line(margin + 8, lineY, pageWidth - margin, lineY);
            }
          }
          
          // Notes section at bottom
          pdf.setFontSize(11);
          pdf.text('Notes:', margin, pageHeight - 35);
          pdf.line(margin + 15, pageHeight - 35, pageWidth - margin, pageHeight - 35);
          pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
          pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
          break;

        case 'weekly':
          pdf.setFontSize(16);
          pdf.setTextColor(themeColors[1]);
          pdf.text(`Semaine ${page.content.weekNumber}`, pageWidth / 2, 20, { align: 'center' });
          
          const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
          const dayHeight = 28;
          
          pdf.setFontSize(11);
          pdf.setTextColor('#333333');
          weekDays.forEach((day, i) => {
            const yStart = 30 + i * dayHeight;
            pdf.setFillColor('#FAFAFA');
            pdf.rect(margin, yStart, pageWidth - 2 * margin, dayHeight - 2, 'F');
            pdf.text(day, margin + 2, yStart + 6);
            pdf.setDrawColor('#EEEEEE');
            pdf.line(margin, yStart + 8, pageWidth - margin, yStart + 8);
          });
          break;

        case 'daily':
          pdf.setFontSize(12);
          pdf.setTextColor(themeColors[1]);
          pdf.text('Date: ___/___/______', margin, 25);
          
          // Quote
          pdf.setFontSize(11);
          pdf.setTextColor('#666666');
          pdf.text(`"${page.content.quote}"`, pageWidth / 2, 40, { align: 'center' });
          
          // Mood section if enabled
          if (page.content.hasGratitude) {
            pdf.setFontSize(10);
            pdf.setTextColor('#333333');
            pdf.text('Mon humeur: (entourer) Joyeuse - Calme - Triste - Energique - Fatiguee', margin, 55);
          }
          
          // Writing lines
          pdf.setDrawColor('#DDDDDD');
          const startY = page.content.hasGratitude ? 65 : 55;
          for (let i = 0; i < 18; i++) {
            pdf.line(margin, startY + i * 10, pageWidth - margin, startY + i * 10);
          }
          break;

        case 'notes':
          pdf.setFontSize(16);
          pdf.setTextColor(themeColors[1]);
          pdf.text('Notes', pageWidth / 2, 20, { align: 'center' });
          
          pdf.setDrawColor('#DDDDDD');
          for (let i = 0; i < 20; i++) {
            pdf.line(margin, 35 + i * 10, pageWidth - margin, 35 + i * 10);
          }
          break;

        case 'reminder':
          pdf.setFontSize(16);
          pdf.setTextColor(themeColors[1]);
          pdf.text('Pense-bete', pageWidth / 2, 20, { align: 'center' });
          
          pdf.setFontSize(10);
          pdf.setTextColor('#333333');
          for (let i = 0; i < 15; i++) {
            pdf.rect(margin, 35 + i * 12, 5, 5);
            pdf.line(margin + 10, 40 + i * 12, pageWidth - margin, 40 + i * 12);
          }
          break;

        case 'goals':
          pdf.setFontSize(18);
          pdf.setTextColor(themeColors[1]);
          pdf.text('Mes Objectifs et Reves', pageWidth / 2, 25, { align: 'center' });
          
          pdf.setFontSize(12);
          pdf.setTextColor('#333333');
          
          const goalSections = ['Court terme (1 mois)', 'Moyen terme (6 mois)', 'Long terme (1 an)', 'Mes reves fous'];
          goalSections.forEach((section, idx) => {
            const sectionY = 45 + idx * 45;
            pdf.text(`${section}:`, margin, sectionY);
            for (let i = 0; i < 3; i++) {
              pdf.text('-', margin + 5, sectionY + 10 + i * 10);
              pdf.line(margin + 10, sectionY + 10 + i * 10, pageWidth - margin, sectionY + 10 + i * 10);
            }
          });
          break;

        case 'mood':
          pdf.setFontSize(16);
          pdf.setTextColor(themeColors[1]);
          pdf.text('Suivi de mon humeur', pageWidth / 2, 20, { align: 'center' });
          
          // Simple mood tracker with lines instead of grid
          pdf.setFontSize(10);
          pdf.setTextColor('#333333');
          
          const moodLabels = ['Joyeuse', 'Calme', 'Triste', 'Energique', 'Fatiguee', 'Stresse'];
          pdf.text('Entoure ton humeur chaque jour:', margin, 40);
          
          moodLabels.forEach((mood, idx) => {
            pdf.text(`${mood}:`, margin, 55 + idx * 15);
            pdf.setDrawColor('#DDDDDD');
            pdf.line(margin + 25, 55 + idx * 15, pageWidth - margin, 55 + idx * 15);
          });
          
          pdf.setFontSize(11);
          pdf.text('Notes sur mon humeur ce mois:', margin, 160);
          pdf.setDrawColor('#DDDDDD');
          for (let i = 0; i < 6; i++) {
            pdf.line(margin, 170 + i * 10, pageWidth - margin, 170 + i * 10);
          }
          break;

        case 'list':
          pdf.setFontSize(16);
          pdf.setTextColor(themeColors[1]);
          pdf.text(page.content.title, pageWidth / 2, 20, { align: 'center' });
          
          pdf.setFontSize(10);
          pdf.setTextColor('#333333');
          for (let i = 0; i < 20; i++) {
            pdf.text(`${i + 1}.`, margin, 40 + i * 10);
            pdf.line(margin + 8, 40 + i * 10, pageWidth - margin, 40 + i * 10);
          }
          break;

        case 'doodle':
          pdf.setFontSize(14);
          pdf.setTextColor(themeColors[1]);
          pdf.text('Espace creatif', pageWidth / 2, 20, { align: 'center' });
          
          // Simple lined space for creativity instead of dots
          pdf.setDrawColor('#EEEEEE');
          for (let i = 0; i < 20; i++) {
            pdf.line(margin, 35 + i * 10, pageWidth - margin, 35 + i * 10);
          }
          break;
      }
    }

    // Save PDF
    const fileName = `${customTitle || `Journal_${firstName || 'Mon_Agenda'}`}_${year}.pdf`;
    pdf.save(fileName);
    toast.success(`PDF exporté: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-pink-700">
            <BookHeart className="w-6 h-6" />
            Générateur d'Agendas & Journaux Intimes
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {numberOfPages[0]} pages
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Créez des agendas et journaux personnalisés avec prénom, thèmes et sections intérieures
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personalization Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white/60 rounded-lg border border-pink-100">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Prénom
              </Label>
              <Input
                placeholder="Ex: Emma, Léa, Chloé..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-pink-200 focus:border-pink-400"
              />
            </div>

            <div className="space-y-2">
              <Label>Âge (optionnel)</Label>
              <Input
                placeholder="Ex: 12"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-pink-200"
              />
            </div>

            <div className="space-y-2">
              <Label>Tranche d'âge</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger className="border-pink-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.label} - {group.style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Année</Label>
              <Input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border-pink-200"
              />
            </div>
          </div>

          {/* Type and Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Type de journal
              </Label>
              <Select value={diaryType} onValueChange={setDiaryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIARY_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Thème visuel
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIARY_THEMES.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        {t.label}
                        <div className="flex gap-1">
                          {t.colors.map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/60 rounded-lg border border-purple-100">
            <div className="space-y-2">
              <Label>Titre personnalisé (optionnel)</Label>
              <Input
                placeholder={`Le Journal de ${firstName || 'Emma'}`}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sous-titre (optionnel)</Label>
              <Input
                placeholder="Mon année magique"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>
          </div>

          {/* Cover style */}
          <div className="space-y-2">
            <Label>Style de couverture</Label>
            <Select value={coverStyle} onValueChange={setCoverStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COVER_STYLES.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of pages */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span>Nombre de pages</span>
              <Badge variant="outline">{numberOfPages[0]} pages</Badge>
            </Label>
            <Slider
              value={numberOfPages}
              onValueChange={setNumberOfPages}
              min={50}
              max={400}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              KDP recommande entre 120 et 300 pages pour les agendas
            </p>
          </div>

          {/* Interior sections */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold flex items-center gap-2">
              📖 Sections intérieures
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-white/60 rounded-lg border">
              {INTERIOR_SECTIONS.map(section => (
                <div key={section.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => toggleSection(section.id)}
                  />
                  <label
                    htmlFor={section.id}
                    className="text-sm cursor-pointer hover:text-pink-600"
                  >
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedSections.length} sections sélectionnées
            </p>
          </div>

          {/* Preview */}
          {generatedCover && (
            <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
              <Label className="mb-2 block">Aperçu de la couverture</Label>
              <img 
                src={generatedCover} 
                alt="Couverture" 
                className="max-w-xs mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={generateDiaryContent}
              disabled={isGenerating}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer l'agenda
                </>
              )}
            </Button>

            {generatedPages.length > 0 && (
              <Button
                onClick={exportToPDF}
                variant="outline"
                className="border-pink-300 text-pink-700 hover:bg-pink-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter PDF ({generatedPages.length} pages)
              </Button>
            )}
          </div>

          {/* Summary */}
          {generatedPages.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">✅ Contenu généré</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>📅 {generatedPages.filter(p => p.type === 'monthly').length} calendriers</div>
                <div>📆 {generatedPages.filter(p => p.type === 'weekly').length} semaines</div>
                <div>📝 {generatedPages.filter(p => p.type === 'daily').length} pages quotidiennes</div>
                <div>📋 {generatedPages.filter(p => p.type === 'notes' || p.type === 'reminder').length} pages notes/rappels</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookDiaryGenerator;
