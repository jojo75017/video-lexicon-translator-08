
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QuoraStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const QuoraStep: React.FC<QuoraStepProps> = ({ onNext, onPrevious }) => {
  const [question, setQuestion] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAnswer = async () => {
    if (!question.trim()) {
      toast.error("Veuillez entrer une question");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulation de génération de réponse
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnswer = `Excellente question ! Pour répondre à "${question}", voici une approche structurée :

**1. Analyse du contexte**
Cette question touche un point important que beaucoup se posent. Basé sur mon expérience, voici ce que je recommande :

**2. Solution pratique**
• Première étape : Commencez par analyser votre situation actuelle
• Deuxième étape : Identifiez les points d'amélioration
• Troisième étape : Mettez en place un plan d'action

**3. Conseils d'expert**
Dans ma pratique professionnelle, j'ai observé que les meilleures approches incluent :
- Une planification minutieuse
- Une exécution progressive
- Un suivi régulier des résultats

**4. Erreurs à éviter**
Attention à ne pas tomber dans ces pièges courants :
- Précipitation dans la mise en œuvre
- Négligence du suivi
- Manque de patience

**Conclusion**
Cette approche méthodique vous permettra d'obtenir des résultats durables. N'hésitez pas si vous avez d'autres questions !

*Réponse basée sur 10+ années d'expérience dans le domaine.*`;

      setGeneratedAnswer(mockAnswer);
      toast.success("Réponse générée avec succès !");
      
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAnswer = () => {
    navigator.clipboard.writeText(generatedAnswer);
    toast.success("Réponse copiée dans le presse-papier");
  };

  const regenerateAnswer = () => {
    generateAnswer();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Générateur de réponses Quora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Question Quora</label>
            <Textarea
              placeholder="Collez ici la question Quora à laquelle vous voulez répondre..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Audience cible</label>
              <Input
                placeholder="ex: entrepreneurs, étudiants, professionnels..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ton de la réponse</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professionnel">Professionnel</option>
                <option value="amical">Amical</option>
                <option value="expert">Expert</option>
                <option value="pédagogique">Pédagogique</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={generateAnswer}
            disabled={isGenerating || !question.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Générer la réponse
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedAnswer && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Réponse générée
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyAnswer}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
                <Button variant="outline" size="sm" onClick={regenerateAnswer}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Régénérer
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm">{generatedAnswer}</pre>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">Ton {tone}</Badge>
              {targetAudience && <Badge variant="outline">Audience: {targetAudience}</Badge>}
              <Badge variant="outline">{generatedAnswer.length} caractères</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!generatedAnswer}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default QuoraStep;
