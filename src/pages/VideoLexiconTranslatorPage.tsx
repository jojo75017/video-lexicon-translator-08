
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Languages, Video, FileText, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

const VideoLexiconTranslatorPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState('fr');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [lexiconTerms, setLexiconTerms] = useState<string[]>([]);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error("Veuillez entrer du texte à traduire");
      return;
    }

    setIsTranslating(true);
    
    // Simulation d'une traduction
    setTimeout(() => {
      const mockTranslation = `[Traduction ${sourceLanguage} → ${targetLanguage}] ${inputText}`;
      setTranslatedText(mockTranslation);
      
      // Générer des termes de lexique simulés
      const terms = inputText.split(' ').slice(0, 5).map(word => 
        word.replace(/[.,!?;]/g, '').toLowerCase()
      ).filter(word => word.length > 3);
      setLexiconTerms(terms);
      
      setIsTranslating(false);
      toast.success("Traduction terminée !");
    }, 2000);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papiers`);
  };

  const handleVideoAnalysis = () => {
    if (!videoUrl.trim()) {
      toast.error("Veuillez entrer une URL de vidéo");
      return;
    }
    
    toast.info("Analyse de la vidéo en cours...");
    setTimeout(() => {
      setInputText("Transcription simulée de la vidéo : Bonjour et bienvenue dans cette présentation...");
      toast.success("Transcription vidéo terminée !");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Video className="h-10 w-10 text-blue-600" />
            Video Lexicon Translator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traduisez vos contenus vidéo et créez un lexique professionnel multilingue
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Configuration de traduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-green-600" />
                Configuration de traduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Langue source</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Langue cible</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">URL de la vidéo (optionnel)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <Button onClick={handleVideoAnalysis} variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lexique généré */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Lexique généré
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lexiconTerms.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {lexiconTerms.map((term, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {term}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter le lexique
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Le lexique apparaîtra après la traduction
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Zone de traduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Texte source</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Entrez votre texte à traduire..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-y"
              />
              <Button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="w-full mt-4"
              >
                {isTranslating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Traduction en cours...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Traduire
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Traduction
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(translatedText, 'Traduction')}
                  disabled={!translatedText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="La traduction apparaîtra ici..."
                value={translatedText}
                readOnly
                className="min-h-[200px] bg-gray-50"
              />
              {translatedText && (
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Créer un document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoLexiconTranslatorPage;
