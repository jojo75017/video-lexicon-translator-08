import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Copy, CheckCircle, Download, Sparkles, Image as ImageIcon, Loader2, Link, Plus, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PracticalSheet {
  id: number;
  title: string;
  content: string;
  remember: string;
  exercise: string;
  closing: string;
  imagePrompt?: string;
  imageUrl?: string;
}

const THEMES_PRESETS = [
  { id: 'sleep', label: '😴 Sommeil & Bien-être', description: 'Fiches pour mieux dormir' },
  { id: 'stress', label: '🧘 Gestion du Stress', description: 'Techniques anti-stress' },
  { id: 'nutrition', label: '🥗 Nutrition Saine', description: 'Conseils alimentaires' },
  { id: 'fitness', label: '💪 Remise en Forme', description: 'Exercices et motivation' },
  { id: 'mindfulness', label: '🧠 Pleine Conscience', description: 'Méditation et présence' },
  { id: 'productivity', label: '⚡ Productivité', description: 'Organisation et efficacité' },
  { id: 'creativity', label: '🎨 Créativité', description: 'Libérer son potentiel créatif' },
  { id: 'relationships', label: '❤️ Relations', description: 'Communication et liens' },
  { id: 'custom', label: '✏️ Personnalisé', description: 'Définir votre propre thème' },
];

const VISUAL_STYLES = [
  { id: 'watercolor', label: 'Aquarelle douce', prompt: 'Soft watercolor illustration style. Hand-drawn look, colored pencil texture. Minimalist, calm, cozy atmosphere. Pastel colors: soft blue, cream, beige, sage green. Gentle, reassuring, non-realistic style. White background with lots of negative space. Wellness illustration for adults. No strong contrast, no sharp lines. Warm, peaceful, safe mood.' },
  { id: 'minimalist', label: 'Minimaliste moderne', prompt: 'Clean minimalist illustration. Simple geometric shapes. Soft neutral colors. Plenty of white space. Modern and elegant. Flat design style. Professional and calming aesthetic.' },
  { id: 'kawaii', label: 'Kawaii mignon', prompt: 'Cute kawaii illustration style. Soft pastel colors. Rounded friendly characters. Big eyes and gentle expressions. Playful and comforting mood. Simple clean lines.' },
  { id: 'botanical', label: 'Botanique naturel', prompt: 'Botanical illustration style. Soft greens and earth tones. Delicate plant elements. Natural organic feeling. Hand-drawn aesthetic. Peaceful nature-inspired design.' },
];

const PracticalSheetsGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [sheets, setSheets] = useState<PracticalSheet[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Configuration
  const [theme, setTheme] = useState('sleep');
  const [customTheme, setCustomTheme] = useState('');
  const [customTopics, setCustomTopics] = useState('');
  const [numberOfSheets, setNumberOfSheets] = useState('5');
  const [tone, setTone] = useState('doux');
  const [visualStyle, setVisualStyle] = useState('watercolor');
  const [generateImages, setGenerateImages] = useState(false);
  
  // Liens promotionnels
  const [promoLinks, setPromoLinks] = useState<{ label: string; url: string }[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const addPromoLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setPromoLinks([...promoLinks, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }]);
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const removePromoLink = (index: number) => {
    setPromoLinks(promoLinks.filter((_, i) => i !== index));
  };

  const getThemeLabel = () => {
    if (theme === 'custom') return customTheme;
    return THEMES_PRESETS.find(t => t.id === theme)?.label || theme;
  };

  const generateSheets = async () => {
    const themeToUse = theme === 'custom' ? customTheme : getThemeLabel();
    
    if (!themeToUse.trim()) {
      toast.error("Veuillez sélectionner ou saisir un thème");
      return;
    }

    setIsGenerating(true);
    setSheets([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-practical-sheets', {
        body: {
          theme: themeToUse,
          customTopics: customTopics.trim() || undefined,
          numberOfSheets: parseInt(numberOfSheets),
          tone,
          visualStyle: VISUAL_STYLES.find(s => s.id === visualStyle)?.prompt || '',
        }
      });

      if (error) throw error;
      
      if (data?.sheets) {
        setSheets(data.sheets);
        toast.success(`${data.sheets.length} fiches générées avec succès !`);
        
        // Generate images if requested
        if (generateImages && data.sheets.length > 0) {
          await generateSheetImages(data.sheets);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error("Erreur lors de la génération des fiches");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSheetImages = async (sheetsToProcess: PracticalSheet[]) => {
    setIsGeneratingImages(true);
    const style = VISUAL_STYLES.find(s => s.id === visualStyle)?.prompt || '';
    
    const updatedSheets = [...sheetsToProcess];
    
    for (let i = 0; i < updatedSheets.length; i++) {
      try {
        toast.info(`Génération image ${i + 1}/${updatedSheets.length}...`);
        
        const { data, error } = await supabase.functions.invoke('generate-sheet-image', {
          body: {
            sheetTitle: updatedSheets[i].title,
            sheetContent: updatedSheets[i].content,
            visualStyle: style,
            imagePrompt: updatedSheets[i].imagePrompt,
          }
        });

        if (!error && data?.imageUrl) {
          updatedSheets[i] = { ...updatedSheets[i], imageUrl: data.imageUrl };
          setSheets([...updatedSheets]);
        }
      } catch (err) {
        console.error(`Erreur image ${i + 1}:`, err);
      }
    }
    
    setIsGeneratingImages(false);
    toast.success('Images générées !');
  };

  const copySheet = async (sheet: PracticalSheet, index: number) => {
    let text = `# ${sheet.title}

${sheet.content}

📌 À RETENIR
${sheet.remember}

✨ MINI-EXERCICE
${sheet.exercise}

💫 ${sheet.closing}`;

    // Ajouter les liens promotionnels si présents
    if (promoLinks.length > 0) {
      text += `\n\n🔗 LIENS UTILES\n`;
      promoLinks.forEach(link => {
        text += `→ ${link.label}: ${link.url}\n`;
      });
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success('Fiche copiée !');
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  const exportAllSheets = () => {
    if (sheets.length === 0) {
      toast.error('Aucune fiche à exporter');
      return;
    }

    // Section liens promotionnels
    const linksSection = promoLinks.length > 0
      ? `\n🔗 LIENS UTILES\n${promoLinks.map(link => `→ ${link.label}: ${link.url}`).join('\n')}\n`
      : '';
    
    const content = sheets.map((sheet, index) => `
═══════════════════════════════════════════════════════════════
                    FICHE ${index + 1} : ${sheet.title.toUpperCase()}
═══════════════════════════════════════════════════════════════

${sheet.content}

┌─────────────────────────────────────────────────────────────┐
│  📌 À RETENIR                                                │
├─────────────────────────────────────────────────────────────┤
│  ${sheet.remember}
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ✨ MINI-EXERCICE                                            │
├─────────────────────────────────────────────────────────────┤
│  ${sheet.exercise}
└─────────────────────────────────────────────────────────────┘

💫 ${sheet.closing}
${linksSection}
${sheet.imagePrompt ? `\n🎨 PROMPT IMAGE :\n${sheet.imagePrompt}\n` : ''}
`).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiches-pratiques-${getThemeLabel().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Fiches exportées avec succès !');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/ebook-planner')}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Fiches Bien-être & Santé
          </h1>
          <p className="text-muted-foreground">Créez des fiches illustrées pour vos ebooks santé et développement personnel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-violet-200/50 dark:border-violet-800/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="w-5 h-5 mr-2 text-violet-500" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Thématique</label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une thématique" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES_PRESETS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex flex-col">
                          <span>{t.label}</span>
                          <span className="text-xs text-muted-foreground">{t.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Theme Input */}
              {theme === 'custom' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Votre thème personnalisé</label>
                  <Input
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    placeholder="Ex: Apprendre la méditation..."
                  />
                </div>
              )}

              {/* Custom Topics */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sujets des fiches (optionnel)
                </label>
                <Textarea
                  value={customTopics}
                  onChange={(e) => setCustomTopics(e.target.value)}
                  placeholder="1. Comprendre le sommeil&#10;2. Créer un rituel du coucher&#10;3. Apaiser le mental..."
                  className="min-h-[100px] text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Laissez vide pour génération automatique, ou listez vos sujets
                </p>
              </div>

              {/* Number of Sheets */}
              <div>
                <label className="block text-sm font-medium mb-2">Nombre de fiches</label>
                <Select value={numberOfSheets} onValueChange={setNumberOfSheets}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 fiches</SelectItem>
                    <SelectItem value="5">5 fiches</SelectItem>
                    <SelectItem value="7">7 fiches</SelectItem>
                    <SelectItem value="10">10 fiches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium mb-2">Ton</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doux">🌸 Doux et rassurant</SelectItem>
                    <SelectItem value="motivant">⚡ Motivant et énergique</SelectItem>
                    <SelectItem value="expert">🎓 Expert et pédagogique</SelectItem>
                    <SelectItem value="amical">😊 Amical et accessible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visual Style */}
              <div>
                <label className="block text-sm font-medium mb-2">Style visuel</label>
                <Select value={visualStyle} onValueChange={setVisualStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISUAL_STYLES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Promotional Links */}
              <div className="space-y-3">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <Link className="w-4 h-4 text-violet-500" />
                  Liens promotionnels (optionnel)
                </label>
                
                {/* Existing links */}
                {promoLinks.length > 0 && (
                  <div className="space-y-2">
                    {promoLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm">
                        <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{link.label}</span>
                        <span className="text-muted-foreground truncate flex-1 text-xs">{link.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePromoLink(index)}
                          className="h-6 w-6 p-0 hover:bg-destructive/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new link */}
                <div className="space-y-2 p-3 border border-dashed border-violet-200/50 dark:border-violet-800/30 rounded-lg">
                  <Input
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    placeholder="Texte du lien (ex: Découvrir le programme)"
                    className="text-sm"
                  />
                  <Input
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="URL (ex: https://monsite.com/offre)"
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPromoLink}
                    disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter ce lien
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ces liens seront ajoutés à la fin de chaque fiche
                </p>
              </div>

              {/* Generate Images Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200/50 dark:border-violet-800/30">
                <input
                  type="checkbox"
                  id="generateImages"
                  checked={generateImages}
                  onChange={(e) => setGenerateImages(e.target.checked)}
                  className="w-4 h-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="generateImages" className="text-sm cursor-pointer">
                  <span className="font-medium">🎨 Générer les images</span>
                  <p className="text-xs text-muted-foreground">Illustrations pour chaque fiche</p>
                </label>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateSheets}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer {numberOfSheets} Fiches
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Card className="border-violet-200/50 dark:border-violet-800/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-violet-500" />
                  Fiches Générées
                  {sheets.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({sheets.length} fiches)
                    </span>
                  )}
                </CardTitle>
                {sheets.length > 0 && (
                  <div className="flex gap-2">
                    {!isGeneratingImages && !generateImages && (
                      <Button 
                        onClick={() => generateSheetImages(sheets)} 
                        variant="outline" 
                        size="sm"
                        disabled={isGeneratingImages}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Générer Images
                      </Button>
                    )}
                    <Button onClick={exportAllSheets} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 mx-auto text-violet-500 animate-spin mb-4" />
                  <p className="text-muted-foreground">Création de vos fiches pratiques...</p>
                  <p className="text-sm text-muted-foreground mt-1">Cela peut prendre quelques instants</p>
                </div>
              ) : sheets.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Configurez les paramètres et cliquez sur "Générer" pour créer vos fiches pratiques
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
                  {sheets.map((sheet, index) => (
                    <div 
                      key={sheet.id} 
                      className="border rounded-xl p-5 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10 border-violet-200/50 dark:border-violet-800/30"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-lg">{sheet.title}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copySheet(sheet, index)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* Image */}
                      {sheet.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img 
                            src={sheet.imageUrl} 
                            alt={sheet.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      {isGeneratingImages && !sheet.imageUrl && (
                        <div className="mb-4 h-48 rounded-lg bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 mx-auto text-violet-500 animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Génération de l'image...</p>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                        {sheet.content}
                      </p>

                      {/* Remember Box */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-amber-600">📌</span>
                          <span className="font-medium text-sm text-amber-800 dark:text-amber-300">À retenir</span>
                        </div>
                        <p className="text-sm text-amber-700 dark:text-amber-400">{sheet.remember}</p>
                      </div>

                      {/* Exercise Box */}
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-emerald-600">✨</span>
                          <span className="font-medium text-sm text-emerald-800 dark:text-emerald-300">Mini-exercice</span>
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">{sheet.exercise}</p>
                      </div>

                      {/* Closing */}
                      <p className="text-sm italic text-violet-600 dark:text-violet-400">
                        💫 {sheet.closing}
                      </p>

                      {/* Promotional Links */}
                      {promoLinks.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Link className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-sm text-blue-800 dark:text-blue-300">Liens utiles</span>
                          </div>
                          <div className="space-y-1">
                            {promoLinks.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Prompt (collapsible) */}
                      {sheet.imagePrompt && (
                        <details className="mt-3">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            🎨 Voir le prompt image
                          </summary>
                          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                            {sheet.imagePrompt}
                          </p>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PracticalSheetsGeneratorPage;
