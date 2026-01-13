import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Youtube, 
  FileText, 
  Globe, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Download,
  Wand2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useConfetti } from '@/hooks/useConfetti';

interface ExtractedContent {
  youtube?: { title: string; content: string; url: string };
  article?: { title: string; content: string; url: string };
  website?: { title: string; content: string; url: string };
}

interface GeneratedGuide {
  title: string;
  subtitle?: string;
  summary?: string;
  targetAudience?: string;
  chapters: Array<{
    number: number;
    title: string;
    content: string;
    keyPoints?: string[];
    actionItems?: string[];
  }>;
  conclusion?: string;
  sources?: string[];
  rawContent?: string;
}

interface EbookUrlImportProps {
  onGuideGenerated?: (guide: GeneratedGuide) => void;
}

const EbookUrlImport: React.FC<EbookUrlImportProps> = ({ onGuideGenerated }) => {
  const { fireStars, fireSideCanons } = useConfetti();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [ebookTitle, setEbookTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(7);
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [generatedGuide, setGeneratedGuide] = useState<GeneratedGuide | null>(null);
  const [step, setStep] = useState<'input' | 'extracted' | 'generated'>('input');

  const hasAtLeastOneUrl = youtubeUrl.trim() || articleUrl.trim() || websiteUrl.trim();

  const handleExtract = async () => {
    if (!hasAtLeastOneUrl) {
      toast.error("Veuillez entrer au moins une URL");
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-url-content', {
        body: {
          youtubeUrl: youtubeUrl.trim() || undefined,
          articleUrl: articleUrl.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined,
        }
      });

      if (error) throw error;

      if (data.success) {
        setExtractedContent(data.content);
        setStep('extracted');
        toast.success("Contenu extrait avec succès !");
        
        if (data.warnings?.length > 0) {
          data.warnings.forEach((w: string) => toast.warning(w));
        }
      } else {
        throw new Error(data.error || "Erreur lors de l'extraction");
      }
    } catch (error: any) {
      console.error("Erreur extraction:", error);
      toast.error(error.message || "Impossible d'extraire le contenu");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!extractedContent) {
      toast.error("Aucun contenu à transformer");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-from-urls', {
        body: {
          extractedContent,
          ebookTitle: ebookTitle.trim() || undefined,
          targetAudience: targetAudience.trim() || undefined,
          numberOfChapters,
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedGuide(data.guide);
        setStep('generated');
        
        // 🎉 Effet confettis spectaculaire !
        fireStars();
        setTimeout(() => fireSideCanons(), 500);
        
        toast.success("🎉 Guide pratique généré avec succès !");
        onGuideGenerated?.(data.guide);
      } else {
        throw new Error(data.error || "Erreur lors de la génération");
      }
    } catch (error: any) {
      console.error("Erreur génération:", error);
      toast.error(error.message || "Impossible de générer le guide");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setYoutubeUrl('');
    setArticleUrl('');
    setWebsiteUrl('');
    setEbookTitle('');
    setTargetAudience('');
    setNumberOfChapters(7);
    setExtractedContent(null);
    setGeneratedGuide(null);
    setStep('input');
  };

  const renderUrlInput = (
    label: string,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    icon: React.ReactNode,
    color: string
  ) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <span className={cn("p-1.5 rounded-lg", color)}>
          {icon}
        </span>
        {label}
        <span className="text-xs text-muted-foreground">(optionnel)</span>
      </Label>
      <Input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          Créer un Ebook depuis des URLs
        </h2>
        <p className="text-muted-foreground">
          Transformez automatiquement une vidéo YouTube, un article ou un site web en guide pratique structuré
        </p>
      </div>

      {/* Étapes visuelles */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {[
          { id: 'input', label: '1. URLs', icon: Globe },
          { id: 'extracted', label: '2. Extraction', icon: FileText },
          { id: 'generated', label: '3. Guide', icon: BookOpen }
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all",
              step === s.id 
                ? "bg-primary text-primary-foreground" 
                : step === 'generated' || (step === 'extracted' && i < 2) || (step === 'input' && i === 0)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
            )}>
              <s.icon className="w-4 h-4" />
              <span>{s.label}</span>
            </div>
            {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>

      {/* Étape 1: Saisie des URLs */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sources de contenu</CardTitle>
            <CardDescription>
              Entrez au moins une URL. L'IA analysera et fusionnera le contenu de toutes les sources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderUrlInput(
              "Vidéo YouTube",
              "https://www.youtube.com/watch?v=...",
              youtubeUrl,
              setYoutubeUrl,
              <Youtube className="w-4 h-4 text-red-500" />,
              "bg-red-500/10"
            )}
            
            {renderUrlInput(
              "Article de blog",
              "https://exemple.com/article",
              articleUrl,
              setArticleUrl,
              <FileText className="w-4 h-4 text-blue-500" />,
              "bg-blue-500/10"
            )}
            
            {renderUrlInput(
              "Site web",
              "https://exemple.com",
              websiteUrl,
              setWebsiteUrl,
              <Globe className="w-4 h-4 text-green-500" />,
              "bg-green-500/10"
            )}

            <div className="pt-4 border-t">
              <Button
                onClick={handleExtract}
                disabled={!hasAtLeastOneUrl || isExtracting}
                className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                size="lg"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Extraction en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Extraire le contenu
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Contenu extrait */}
      {step === 'extracted' && extractedContent && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Contenu extrait
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {extractedContent.youtube && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
                    <Youtube className="w-4 h-4" />
                    {extractedContent.youtube.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {extractedContent.youtube.content.slice(0, 200)}...
                  </p>
                </div>
              )}
              
              {extractedContent.article && (
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                    {extractedContent.article.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {extractedContent.article.content.slice(0, 200)}...
                  </p>
                </div>
              )}
              
              {extractedContent.website && (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                    <Globe className="w-4 h-4" />
                    {extractedContent.website.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {extractedContent.website.content.slice(0, 200)}...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personnaliser le guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Titre du guide (optionnel)</Label>
                <Input
                  placeholder="L'IA proposera un titre si laissé vide"
                  value={ebookTitle}
                  onChange={(e) => setEbookTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Public cible</Label>
                <Input
                  placeholder="Ex: Débutants en marketing digital"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nombre de chapitres</Label>
                <div className="flex items-center gap-2">
                  {[5, 7, 10, 12].map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={numberOfChapters === n ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNumberOfChapters(n)}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Recommencer
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5 mr-2" />
                      Générer le Guide
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Étape 3: Guide généré */}
      {step === 'generated' && generatedGuide && (
        <div className="space-y-4">
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                {generatedGuide.title}
              </CardTitle>
              {generatedGuide.subtitle && (
                <CardDescription className="text-base">
                  {generatedGuide.subtitle}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedGuide.summary && (
                <p className="text-muted-foreground">{generatedGuide.summary}</p>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Table des matières</h4>
                <div className="space-y-2">
                  {generatedGuide.chapters?.map((chapter) => (
                    <div 
                      key={chapter.number}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0">
                        {chapter.number}
                      </span>
                      <div>
                        <p className="font-medium">{chapter.title}</p>
                        {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {chapter.keyPoints.length} points clés
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {generatedGuide.sources && generatedGuide.sources.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-sm">Sources utilisées</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {generatedGuide.sources.map((source, i) => (
                      <li key={i}>• {source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Nouvelle importation
            </Button>
            <Button
              onClick={() => {
                // Copier le contenu dans le presse-papier ou l'exporter
                const content = generatedGuide.chapters?.map(c => 
                  `# Chapitre ${c.number}: ${c.title}\n\n${c.content}`
                ).join('\n\n---\n\n');
                navigator.clipboard.writeText(content || '');
                toast.success("Contenu copié dans le presse-papier !");
              }}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Copier le contenu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookUrlImport;
