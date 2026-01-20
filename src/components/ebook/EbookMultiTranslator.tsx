import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Languages, Globe, Download, RefreshCw, Check, AlertCircle, FileText, BookOpen } from 'lucide-react';
import Flag from 'react-world-flags';

interface Chapter {
  id: string;
  title: string;
  content?: string;
  subChapters?: SubChapter[];
}

interface SubChapter {
  id: string;
  title: string;
  content?: string;
}

interface TranslatedVersion {
  language: string;
  languageCode: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
  progress: number;
  status: 'pending' | 'translating' | 'completed' | 'error';
}

interface EbookMultiTranslatorProps {
  ebookTitle: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
}

const EbookMultiTranslator: React.FC<EbookMultiTranslatorProps> = ({
  ebookTitle,
  chapters,
  preface,
  conclusion
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [translations, setTranslations] = useState<TranslatedVersion[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  const availableLanguages = [
    { code: 'en', name: 'Anglais', flag: 'GB', market: '🇺🇸🇬🇧 Marché #1 mondial' },
    { code: 'es', name: 'Espagnol', flag: 'ES', market: '🇪🇸🇲🇽 500M+ locuteurs' },
    { code: 'de', name: 'Allemand', flag: 'DE', market: '🇩🇪🇦🇹 Marché premium' },
    { code: 'it', name: 'Italien', flag: 'IT', market: '🇮🇹 60M+ lecteurs' },
    { code: 'pt', name: 'Portugais', flag: 'PT', market: '🇧🇷🇵🇹 250M+ locuteurs' },
    { code: 'nl', name: 'Néerlandais', flag: 'NL', market: '🇳🇱🇧🇪 25M+ locuteurs' },
    { code: 'pl', name: 'Polonais', flag: 'PL', market: '🇵🇱 40M+ locuteurs' },
    { code: 'ja', name: 'Japonais', flag: 'JP', market: '🇯🇵 Marché manga/ebooks' },
    { code: 'zh', name: 'Chinois', flag: 'CN', market: '🇨🇳 1.4B+ potentiel' },
    { code: 'ko', name: 'Coréen', flag: 'KR', market: '🇰🇷 Webtoons populaires' },
  ];

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const selectAllLanguages = () => {
    if (selectedLanguages.length === availableLanguages.length) {
      setSelectedLanguages([]);
    } else {
      setSelectedLanguages(availableLanguages.map(l => l.code));
    }
  };

  const translateContent = async (text: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
          sourceLanguage: 'fr'
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de traduction');
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Erreur traduction:', error);
      return text;
    }
  };

  const handleTranslate = async () => {
    if (selectedLanguages.length === 0) {
      toast.error('Sélectionnez au moins une langue');
      return;
    }

    if (chapters.length === 0) {
      toast.error('Aucun chapitre à traduire');
      return;
    }

    setIsTranslating(true);
    setGlobalProgress(0);

    const initialTranslations: TranslatedVersion[] = selectedLanguages.map(langCode => ({
      language: availableLanguages.find(l => l.code === langCode)?.name || langCode,
      languageCode: langCode,
      chapters: [],
      progress: 0,
      status: 'pending'
    }));

    setTranslations(initialTranslations);

    try {
      const totalItems = selectedLanguages.length * (chapters.length + (preface ? 1 : 0) + (conclusion ? 1 : 0));
      let completedItems = 0;

      for (let langIndex = 0; langIndex < selectedLanguages.length; langIndex++) {
        const langCode = selectedLanguages[langIndex];
        const langName = availableLanguages.find(l => l.code === langCode)?.name || langCode;

        setTranslations(prev => prev.map((t, i) =>
          i === langIndex ? { ...t, status: 'translating' } : t
        ));

        toast.info(`🌍 Traduction en ${langName} en cours...`);

        const translatedChapters: Chapter[] = [];

        // Translate preface
        let translatedPreface = '';
        if (preface) {
          translatedPreface = await translateContent(preface, langCode);
          completedItems++;
          setGlobalProgress(Math.round((completedItems / totalItems) * 100));
        }

        // Translate chapters
        for (const chapter of chapters) {
          const translatedChapter: Chapter = {
            id: chapter.id,
            title: await translateContent(chapter.title, langCode),
            content: chapter.content ? await translateContent(chapter.content, langCode) : undefined,
            subChapters: []
          };

          if (chapter.subChapters) {
            for (const subChapter of chapter.subChapters) {
              translatedChapter.subChapters?.push({
                id: subChapter.id,
                title: await translateContent(subChapter.title, langCode),
                content: subChapter.content ? await translateContent(subChapter.content, langCode) : undefined
              });
            }
          }

          translatedChapters.push(translatedChapter);
          completedItems++;
          
          const langProgress = Math.round((translatedChapters.length / chapters.length) * 100);
          setTranslations(prev => prev.map((t, i) =>
            i === langIndex ? { ...t, chapters: [...translatedChapters], progress: langProgress } : t
          ));
          setGlobalProgress(Math.round((completedItems / totalItems) * 100));
        }

        // Translate conclusion
        let translatedConclusion = '';
        if (conclusion) {
          translatedConclusion = await translateContent(conclusion, langCode);
          completedItems++;
          setGlobalProgress(Math.round((completedItems / totalItems) * 100));
        }

        setTranslations(prev => prev.map((t, i) =>
          i === langIndex ? { 
            ...t, 
            chapters: translatedChapters, 
            preface: translatedPreface,
            conclusion: translatedConclusion,
            progress: 100, 
            status: 'completed' 
          } : t
        ));

        toast.success(`✅ Traduction ${langName} terminée !`);
      }

      setGlobalProgress(100);
      toast.success(`🎉 ${selectedLanguages.length} traductions terminées !`);
    } catch (error) {
      console.error('Erreur traduction:', error);
      toast.error('Erreur lors de la traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownloadTranslation = (translation: TranslatedVersion) => {
    let content = `# ${ebookTitle} (${translation.language})\n\n`;
    
    if (translation.preface) {
      content += `## Préface\n\n${translation.preface}\n\n`;
    }
    
    translation.chapters.forEach((chapter, index) => {
      content += `## Chapitre ${index + 1}: ${chapter.title}\n\n`;
      if (chapter.content) {
        content += `${chapter.content}\n\n`;
      }
      chapter.subChapters?.forEach(sub => {
        content += `### ${sub.title}\n\n`;
        if (sub.content) {
          content += `${sub.content}\n\n`;
        }
      });
    });
    
    if (translation.conclusion) {
      content += `## Conclusion\n\n${translation.conclusion}\n\n`;
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ebookTitle.replace(/\s+/g, '-')}-${translation.languageCode}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`📥 Version ${translation.language} téléchargée !`);
  };

  const countWords = () => {
    let total = 0;
    if (preface) total += preface.split(/\s+/).length;
    if (conclusion) total += conclusion.split(/\s+/).length;
    chapters.forEach(ch => {
      if (ch.content) total += ch.content.split(/\s+/).length;
      ch.subChapters?.forEach(sub => {
        if (sub.content) total += sub.content.split(/\s+/).length;
      });
    });
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-gradient-to-r from-blue-500 to-cyan-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>🌍 Traduction Multi-Langues</span>
              <Badge className="ml-3 bg-gradient-to-r from-amber-500 to-orange-500">2026</Badge>
            </div>
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Traduisez automatiquement votre ebook complet en 10+ langues pour atteindre un marché mondial
          </p>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-violet-500" />
            <div>
              <p className="text-2xl font-bold">{chapters.length}</p>
              <p className="text-sm text-muted-foreground">Chapitres</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{countWords().toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Mots à traduire</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{selectedLanguages.length}</p>
              <p className="text-sm text-muted-foreground">Langues sélectionnées</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Language Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Sélectionnez les langues cibles
            </CardTitle>
            <Button variant="outline" size="sm" onClick={selectAllLanguages}>
              {selectedLanguages.length === availableLanguages.length ? 'Désélectionner tout' : 'Sélectionner tout'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedLanguages.includes(lang.code)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-border hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Flag code={lang.flag} className="h-6 w-8 rounded shadow-sm" />
                  <Checkbox checked={selectedLanguages.includes(lang.code)} />
                </div>
                <p className="font-medium">{lang.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{lang.market}</p>
              </button>
            ))}
          </div>

          {/* Global Progress */}
          {isTranslating && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression globale</span>
                <span>{globalProgress}%</span>
              </div>
              <Progress value={globalProgress} className="h-3" />
            </div>
          )}

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={isTranslating || selectedLanguages.length === 0 || chapters.length === 0}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            size="lg"
          >
            {isTranslating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Traduction en cours... ({globalProgress}%)
              </>
            ) : (
              <>
                <Languages className="h-5 w-5 mr-2" />
                Traduire en {selectedLanguages.length} langue(s)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Translations Results */}
      {translations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📚 Versions Traduites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {translations.map((translation) => {
                const lang = availableLanguages.find(l => l.code === translation.languageCode);
                return (
                  <Card key={translation.languageCode} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {lang && <Flag code={lang.flag} className="h-6 w-8 rounded shadow-sm" />}
                      <div className="flex-1">
                        <p className="font-medium">{translation.language}</p>
                        <p className="text-xs text-muted-foreground">
                          {translation.chapters.length} chapitres
                        </p>
                      </div>
                      {translation.status === 'completed' && (
                        <Badge className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Terminé
                        </Badge>
                      )}
                      {translation.status === 'translating' && (
                        <Badge className="bg-blue-500">
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          En cours
                        </Badge>
                      )}
                      {translation.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Erreur
                        </Badge>
                      )}
                    </div>

                    <Progress value={translation.progress} className="h-2 mb-3" />

                    {translation.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDownloadTranslation(translation)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger (.md)
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">💡 Conseils pour la traduction</h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• <strong>Marchés prioritaires :</strong> Anglais (US/UK), Espagnol et Allemand sont les plus rentables sur KDP</li>
            <li>• <strong>Relecture :</strong> Faites toujours relire par un natif avant publication</li>
            <li>• <strong>Mots-clés :</strong> Pensez à traduire aussi vos mots-clés KDP pour chaque marché</li>
            <li>• <strong>Couverture :</strong> Adaptez le texte de couverture pour chaque langue</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookMultiTranslator;
