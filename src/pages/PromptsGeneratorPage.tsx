import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Download, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PromptsGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePrompts = async () => {
    setIsGenerating(true);
    
    // Simulation de génération des prompts
    const generatedPrompts = [
      `🟣 Prompt 1 : Créer une feuille de route pour débutant entrepreneur
Demande : [Fournir un guide étape par étape pour les débutants contenant des idées de projets qui peuvent se transformer en entreprise]
Rôle : [Vous êtes un coach expérimenté en entrepreneuriat et consultant en innovation.]
Mission : [Créer une feuille de route stratégique avec 3 à 5 idées de projets innovants à potentiel entrepreneurial réel, adaptée au profil de l'utilisateur.]
Structure attendue :
• Évaluation initiale (compétences, intérêts, ressources)
• Génération d'idées via l'intersection technologie/problème/impact
• Évaluation (marché, barrière, alignement, budget, revenus)
• Détails par projet (MVP, calendrier, financement, jalons)
• Sections formatées : <roadmap> <entrepreneur_profile> <project_ideas> <detailed_project_breakdown> <recommended_next_steps>
Style : [Clair, accessible, pragmatique, avec exemples concrets]`,

      `🔵 Prompt 2 : Stratégie de copywriting pour page de vente
Demande : [Créer une page de vente percutante qui convertit les visiteurs en clients]
Rôle : [Vous êtes un copywriter expert spécialisé dans les pages de vente haute conversion.]
Mission : [Rédiger une page de vente complète utilisant les techniques de persuasion les plus efficaces.]
Structure attendue :
• Titre accrocheur avec promesse claire
• Identification du problème et empathie
• Présentation de la solution unique
• Preuves sociales et témoignages
• Offre irrésistible avec urgence/rareté
• FAQ pour lever les objections
• Call-to-action puissant
Style : [Persuasif, émotionnel, orienté bénéfices clients]`,

      `🟡 Prompt 3 : Plan de voyage personnalisé optimisé
Demande : [Concevoir un itinéraire de voyage sur mesure avec budget et préférences]
Rôle : [Vous êtes un agent de voyage expert et planificateur d'expériences uniques.]
Mission : [Créer un plan de voyage détaillé et personnalisé incluant logistique, budget et expériences authentiques.]
Structure attendue :
• Analyse des préférences et contraintes
• Itinéraire jour par jour optimisé
• Réservations prioritaires et alternatives
• Budget détaillé par catégorie
• Conseils locaux et expériences cachées
• Kit de voyage (documents, apps, contacts)
Style : [Inspirant, pratique, riche en détails locaux]`,

      `🟢 Prompt 4 : Programme de développement personnel 30 jours
Demande : [Créer un programme de transformation personnelle avec actions quotidiennes]
Rôle : [Vous êtes un coach de vie certifié et expert en psychologie positive.]
Mission : [Concevoir un programme de 30 jours avec exercices pratiques pour atteindre un objectif de développement personnel.]
Structure attendue :
• Évaluation initiale et fixation d'objectifs SMART
• Plan hebdomadaire avec thèmes progressifs
• Exercices quotidiens (réflexion, action, mesure)
• Outils de suivi et d'évaluation
• Stratégies de motivation et résilience
• Plan de maintien post-programme
Style : [Bienveillant, motivant, scientifiquement fondé]`
    ];

    // Simuler un délai de génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPrompts(generatedPrompts);
    setIsGenerating(false);
    toast.success("20 prompts professionnels générés avec succès !");
  };

  const copyPrompt = async (prompt: string, index: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      toast.success("Prompt copié dans le presse-papiers !");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  const downloadAllPrompts = () => {
    const content = prompts.join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pack-20-prompts-professionnels.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Pack de prompts téléchargé !");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => navigate('/ebook-ideas')} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux idées
        </Button>
        <Target className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">🎯 Générateur de Prompts Professionnels</h1>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground">
          Générez un pack de 20 prompts IA professionnels, formatés et prêts à vendre
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Regroupés en catégories : Business, Copywriting, Voyage, Développement personnel...
        </p>
      </div>

      {prompts.length === 0 ? (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Prêt à générer vos prompts ?</h3>
            <div className="bg-white/50 p-6 rounded-lg mb-6 text-left max-w-2xl mx-auto">
              <h4 className="font-semibold mb-3">✨ Votre pack contiendra :</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 🟣 5 prompts Business & Entrepreneuriat</li>
                <li>• 🔵 5 prompts Copywriting & Marketing</li>
                <li>• 🟡 5 prompts Voyage & Aventure</li>
                <li>• 🟢 5 prompts Développement Personnel</li>
              </ul>
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-sm font-medium">Format professionnel avec :</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Titre coloré • Demande • Rôle • Mission • Structure • Style
                </p>
              </div>
            </div>
            <Button 
              onClick={generatePrompts}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Générer mes 20 prompts
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vos 20 Prompts Professionnels</h2>
            <Button onClick={downloadAllPrompts} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Télécharger tout
            </Button>
          </div>

          <div className="grid gap-4">
            {prompts.map((prompt, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {prompt.split('\n')[0]}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPrompt(prompt, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                    {prompt}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => {
                setPrompts([]);
                generatePrompts();
              }}
              variant="outline"
              size="lg"
            >
              <Target className="h-5 w-5 mr-2" />
              Générer un nouveau pack
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptsGeneratorPage;