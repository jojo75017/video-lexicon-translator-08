
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilePenLine, FileText, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';

const AiWriterPage = () => {
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('article');
  const [tone, setTone] = useState('professional');
  const [wordCount, setWordCount] = useState(500);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    toast.info("Génération du contenu en cours...");

    // Simulation d'un appel API
    setTimeout(() => {
      const content = `# Guide Complet sur ${keyword}

## Introduction

${keyword} est un sujet fascinant qui mérite une attention particulière dans le contexte actuel. Dans ce guide complet, nous allons explorer tous les aspects importants de ${keyword} pour vous aider à mieux comprendre ce domaine.

## Qu'est-ce que ${keyword} ?

${keyword} représente un ensemble de concepts et de pratiques qui ont évolué au fil du temps. Il est essentiel de comprendre les fondamentaux avant de se lancer dans des stratégies plus avancées.

### Points clés à retenir :

- Comprendre les bases de ${keyword}
- Identifier les meilleures pratiques
- Éviter les erreurs courantes
- Optimiser pour les résultats

## Comment démarrer avec ${keyword}

Pour bien commencer avec ${keyword}, voici les étapes essentielles :

1. **Recherche préliminaire** : Effectuez une recherche approfondie sur votre niche
2. **Planification stratégique** : Développez un plan d'action clair
3. **Mise en œuvre** : Appliquez les techniques apprises
4. **Suivi et optimisation** : Mesurez vos résultats et ajustez votre approche

## Stratégies avancées pour ${keyword}

Une fois les bases maîtrisées, vous pouvez explorer des techniques plus sophistiquées :

- Analyse de la concurrence
- Optimisation continue
- Automatisation des processus
- Mesure de la performance

## Conclusion

${keyword} offre de nombreuses opportunités pour ceux qui sont prêts à investir du temps et des efforts. En suivant les conseils de ce guide, vous devriez être en mesure de développer une approche efficace et durable.

N'hésitez pas à expérimenter et à adapter ces stratégies à votre situation particulière. Le succès dans ${keyword} dépend souvent de la persistance et de l'adaptation continue.`;

      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success("Contenu généré avec succès !");
    }, 3000);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Contenu copié dans le presse-papier");
  };

  return (
    <UnifiedDashboard>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FilePenLine className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Rédacteur IA 2.0</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Créez du contenu de qualité avec l'aide de l'intelligence artificielle.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Mot-clé principal" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Select onValueChange={(value) => setContentType(value)} defaultValue={contentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de contenu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="blogPost">Article de blog</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="tutorial">Tutoriel</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => setTone(value)} defaultValue={tone}>
                <SelectTrigger>
                  <SelectValue placeholder="Ton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="casual">Décontracté</SelectItem>
                  <SelectItem value="persuasive">Persuasif</SelectItem>
                  <SelectItem value="informative">Informatif</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                type="number"
                placeholder="Nombre de mots" 
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min="100"
                max="2000"
              />
            </div>
            
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleGenerateContent}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Générer le contenu
                </>
              )}
            </Button>

            {generatedContent && (
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Contenu généré</h3>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={copyContent}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </Button>
                </div>
                <Textarea 
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Le contenu généré apparaîtra ici..."
                />
              </Card>
            )}
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default AiWriterPage;
