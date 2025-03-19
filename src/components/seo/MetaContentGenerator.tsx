
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Wand2, Copy, RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const MetaContentGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    metaDescription: string;
    content: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez saisir un mot-clé");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate title (60-70 characters)
      const title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Guide Complet et Stratégies Efficaces en 2024`;
      
      // Generate meta description (150-160 characters)
      const metaDescription = `Découvrez les meilleures pratiques et stratégies pour ${keyword}. Guide complet avec conseils d'experts et techniques éprouvées pour maximiser vos résultats.`;
      
      // Generate content
      const content = `
<h1>${title}</h1>

<p>Dans un marché en constante évolution, <strong>${keyword}</strong> représente un enjeu majeur pour les entreprises souhaitant se démarquer de la concurrence. Ce guide vous explique en détail les stratégies les plus efficaces pour tirer parti de ${keyword} et améliorer vos performances.</p>

<h2>Pourquoi ${keyword} est essentiel</h2>

<p>Les études récentes montrent que la maîtrise de <strong>${keyword}</strong> peut augmenter votre visibilité de 42% et votre taux de conversion de 27%. Les organisations qui investissent dans ${keyword} voient leur retour sur investissement multiplié par 3 en moyenne.</p>

<p>Voici les principaux avantages:</p>

<ul>
  <li>Augmentation significative de la visibilité en ligne</li>
  <li>Amélioration du taux d'engagement des utilisateurs</li>
  <li>Croissance organique du trafic qualifié</li>
  <li>Renforcement de l'autorité de domaine</li>
  <li>Optimisation du taux de conversion</li>
</ul>

<h2>Comment mettre en œuvre une stratégie de ${keyword} efficace</h2>

<p>La mise en place d'une stratégie de <strong>${keyword}</strong> nécessite une approche méthodique et des outils adaptés. Commencez par analyser votre situation actuelle et définissez des objectifs précis pour mesurer votre progression.</p>

<h3>Étape 1: Analyse de la situation actuelle</h3>

<p>Avant de vous lancer, évaluez votre positionnement actuel par rapport à <strong>${keyword}</strong>. Utilisez des outils d'analyse pour mesurer vos performances et identifier les axes d'amélioration.</p>

<h3>Étape 2: Définition des objectifs</h3>

<p>Fixez des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes et Temporels) pour votre stratégie de ${keyword}. Par exemple, "Augmenter le trafic organique lié à ${keyword} de 30% en 6 mois".</p>

<h3>Étape 3: Implémentation des bonnes pratiques</h3>

<p>Suivez ces recommandations pour optimiser votre approche:</p>

<ul>
  <li>Créez du contenu de qualité axé sur <strong>${keyword}</strong> et les termes associés</li>
  <li>Optimisez vos balises title, meta descriptions et structure HTML</li>
  <li>Améliorez l'expérience utilisateur sur votre site</li>
  <li>Développez une stratégie de backlinks qualitative</li>
  <li>Utilisez les réseaux sociaux pour amplifier votre portée</li>
</ul>

<h2>Outils recommandés pour ${keyword}</h2>

<p>Plusieurs outils peuvent vous aider à optimiser votre stratégie de <strong>${keyword}</strong>:</p>

<ul>
  <li>Google Analytics: pour suivre votre trafic et analyser les performances</li>
  <li>SEMrush: pour l'analyse de mots-clés et la surveillance de la concurrence</li>
  <li>Ahrefs: pour l'analyse de backlinks et l'audit SEO</li>
  <li>Yoast SEO: pour l'optimisation on-page</li>
  <li>Screaming Frog: pour l'audit technique de votre site</li>
</ul>

<h2>Conclusion</h2>

<p>Investir dans <strong>${keyword}</strong> est désormais incontournable pour les entreprises souhaitant développer leur présence en ligne. En suivant les recommandations de ce guide et en adaptant votre stratégie à vos objectifs spécifiques, vous maximiserez vos chances de succès.</p>

<p>N'oubliez pas que l'optimisation pour ${keyword} est un processus continu qui nécessite des ajustements réguliers. Restez informé des dernières tendances et soyez prêt à adapter votre approche en fonction de l'évolution du marché.</p>
`;

      setGeneratedContent({
        title,
        metaDescription,
        content
      });
      
      toast.success("Contenu généré avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération du contenu :", error);
      toast.error("Une erreur est survenue lors de la génération du contenu");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papier`);
  };

  const regenerate = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Générateur de Contenu IA</h3>
        <p className="text-sm text-gray-600 mb-4">
          Entrez un mot-clé et notre IA générera automatiquement un titre optimisé, une meta description et du contenu adapté pour votre site.
        </p>
        
        <div className="flex items-center gap-2 mb-6">
          <Input
            placeholder="Entrez un mot-clé (ex: référencement naturel)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !keyword.trim()}
            className="whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Générer
              </>
            )}
          </Button>
        </div>
        
        {isGenerating ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-6 w-2/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : generatedContent ? (
          <div className="space-y-6">
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Titre de la page</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent.title, 'Titre')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-blue-600 font-medium">{generatedContent.title}</p>
              <p className="text-xs text-gray-500">{generatedContent.title.length} caractères (optimal: 50-60)</p>
            </div>
            
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Meta Description</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent.metaDescription, 'Meta description')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-green-700">{generatedContent.metaDescription}</p>
              <p className="text-xs text-gray-500">{generatedContent.metaDescription.length} caractères (optimal: 150-160)</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Contenu généré</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(generatedContent.content, 'Contenu')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={regenerate}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Régénérer
                  </Button>
                </div>
              </div>
              <div 
                className="border p-4 rounded-md max-h-96 overflow-y-auto bg-white" 
                dangerouslySetInnerHTML={{ __html: generatedContent.content }}
              />
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default MetaContentGenerator;
