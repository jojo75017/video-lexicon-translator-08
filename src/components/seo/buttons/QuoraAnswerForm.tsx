
import React, { useRef, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from 'react-hook-form';
import * as z from "zod";
import QuoraFormatToolbar from './QuoraFormatToolbar';
import { Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const quoraAnswerSchema = z.object({
  questionToAnswer: z.string().min(10, "Sélectionnez une question à répondre"),
  answer: z.string().min(50, "La réponse doit contenir au moins 50 caractères"),
  sources: z.string().optional(),
});

export type QuoraAnswerData = z.infer<typeof quoraAnswerSchema>;

interface QuoraAnswerFormProps {
  form: UseFormReturn<QuoraAnswerData>;
  popularQuestions: string[];
  textAnswer: string;
  setTextAnswer: (text: string) => void;
  textSources: string;
  setTextSources: (text: string) => void;
  handleTextSelection: (fieldType: 'details' | 'answer' | 'sources', start: number, end: number, text: string) => void;
  applyFormatting: (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => void;
  onSubmit: (data: QuoraAnswerData) => void;
}

const QuoraAnswerForm = ({
  form,
  popularQuestions,
  textAnswer,
  setTextAnswer,
  textSources,
  setTextSources,
  handleTextSelection,
  applyFormatting,
  onSubmit
}: QuoraAnswerFormProps) => {
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const sourcesRef = useRef<HTMLTextAreaElement>(null);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const generateAIAnswer = async () => {
    const question = form.getValues("questionToAnswer");
    
    if (!question || question === "") {
      toast.error("Veuillez d'abord sélectionner une question");
      return;
    }

    setIsGeneratingAnswer(true);
    
    try {
      // Simulons une réponse IA 
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer une réponse selon le type de question
      let aiResponse = "";
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes("référencement") || lowerQuestion.includes("seo") || lowerQuestion.includes("e-commerce")) {
        aiResponse = "Le référencement d'un site e-commerce en 2024 nécessite une approche multidimensionnelle :\n\n**1. Optimisation technique**\n- Améliorez la vitesse de chargement des pages (utilisez Google PageSpeed Insights)\n- Assurez-vous que votre site est responsive et optimisé pour mobile\n- Implémentez une structure de données schema.org pour les produits\n\n**2. Optimisation du contenu**\n- Créez des descriptions de produits uniques et détaillées\n- Développez un blog avec du contenu informatif lié à vos produits\n- Intégrez naturellement des mots-clés pertinents\n\n**3. Amélioration de l'expérience utilisateur**\n- Simplifiez la navigation et la recherche sur votre site\n- Réduisez les taux de rebond avec un design attrayant\n- Optimisez le parcours d'achat pour réduire les abandons de panier\n\n**4. Stratégie de backlinks**\n- Obtenez des liens depuis des sites d'autorité dans votre secteur\n- Collaborez avec des influenceurs pertinents\n\nUne analyse régulière de vos performances avec Google Analytics et Search Console vous permettra d'ajuster votre stratégie en fonction des résultats.";
      } 
      else if (lowerQuestion.includes("backlinks") || lowerQuestion.includes("liens")) {
        aiResponse = "Pour développer une stratégie de backlinks efficace pour un nouveau site web, voici les meilleures approches :\n\n**1. Créez du contenu de qualité**\n- Développez des articles approfondis, des guides et des infographies que les autres voudront naturellement référencer\n- Utilisez la méthode du \"skyscraper\" : trouvez du contenu populaire, améliorez-le, puis contactez ceux qui y font référence\n\n**2. Guest blogging stratégique**\n- Identifiez des blogs pertinents dans votre secteur avec une bonne autorité\n- Proposez du contenu de valeur avec des liens contextuels vers votre site\n\n**3. Relations publiques digitales**\n- Contactez des journalistes et blogueurs via HARO (Help A Reporter Out)\n- Partagez des études de cas ou des données originales dignes d'intérêt\n\n**4. Réparez les liens brisés**\n- Trouvez des liens cassés sur des sites d'autorité dans votre niche\n- Proposez votre contenu comme alternative\n\n**5. Utilisez les annuaires et plateformes spécialisées**\n- Inscrivez-vous sur des annuaires de qualité spécifiques à votre secteur\n- Créez des profils sur des plateformes comme Google Business Profile\n\nÉvitez à tout prix les services de liens en masse ou de mauvaise qualité qui peuvent entraîner des pénalités Google.";
      }
      else if (lowerQuestion.includes("featured snippet") || lowerQuestion.includes("position zéro")) {
        aiResponse = "Pour optimiser votre contenu pour le featured snippet (ou \"position zéro\") de Google, suivez ces étapes stratégiques :\n\n**1. Identifiez les bonnes opportunités**\n- Recherchez des requêtes pertinentes dans votre domaine qui déclenchent déjà des featured snippets\n- Utilisez des outils comme Ahrefs ou SEMrush pour trouver ces opportunités\n\n**2. Structurez votre contenu efficacement**\n- Répondez directement à la question dans les 40-60 premiers mots\n- Utilisez le format approprié selon le type de snippet visé :\n  - *Paragraphes* : fournissez une réponse concise (40-60 mots)\n  - *Listes* : utilisez des balises <ul>, <ol> et <li> avec des sous-titres clairs\n  - *Tableaux* : créez des tableaux bien structurés avec HTML\n  - *Étapes* : numérotez clairement les processus\n\n**3. Améliorez la lisibilité et la clarté**\n- Utilisez un langage simple et direct\n- Employez des mots-clés pertinents dans vos sous-titres (H2, H3)\n- Structurez votre contenu avec des balises HTML appropriées\n\n**4. Utilisez le balisage schema.org**\n- Implémentez les données structurées pertinentes (FAQ, HowTo, etc.)\n- Validez votre balisage avec l'outil de test des données structurées de Google\n\nSuivez régulièrement vos performances dans Search Console et ajustez votre stratégie en fonction des résultats obtenus.";
      }
      else if (lowerQuestion.includes("outils") || lowerQuestion.includes("analyse") || lowerQuestion.includes("concurrence")) {
        aiResponse = "Pour analyser efficacement votre concurrence SEO, ces outils indispensables vous aideront à obtenir des insights précieux :\n\n**1. Outils d'analyse de mots-clés et de positionnement**\n- *SEMrush* : Analysez les mots-clés que vos concurrents ciblent et leur trafic organique\n- *Ahrefs* : Étudiez le profil de backlinks et le contenu performant des concurrents\n- *Moz Pro* : Obtenez des données sur l'autorité de domaine et identifiez les opportunités manquées\n\n**2. Outils d'analyse de contenu**\n- *Surfer SEO* : Analysez le contenu on-page des concurrents performants\n- *Clearscope* : Identifiez les mots-clés et sujets connexes à intégrer dans votre contenu\n- *MarketMuse* : Comparez la profondeur et la pertinence de votre contenu avec la concurrence\n\n**3. Outils d'audit technique**\n- *Screaming Frog* : Analysez la structure du site et identifiez les problèmes techniques\n- *Sitebulb* : Obtenez des insights visuels sur l'architecture du site concurrent\n\n**4. Outils de suivi et de reporting**\n- *Google Search Console* : Surveillez vos performances par rapport aux requêtes ciblées\n- *Google Analytics* : Comprenez les comportements des utilisateurs sur votre site\n- *Databox* : Créez des tableaux de bord personnalisés pour suivre les KPIs importants\n\nL'utilisation combinée de ces outils vous permettra d'élaborer une stratégie SEO complète basée sur des données concrètes plutôt que sur des suppositions.";
      }
      else if (lowerQuestion.includes("contenu") || lowerQuestion.includes("rédiger") || lowerQuestion.includes("conversion")) {
        aiResponse = "Pour rédiger du contenu qui performe à la fois pour le SEO et la conversion, suivez cette méthode en 6 étapes :\n\n**1. Recherche approfondie de mots-clés**\n- Identifiez des mots-clés à intention commerciale ET informationnelle\n- Analysez l'intention de recherche derrière chaque requête\n- Utilisez des outils comme KeywordTool.io ou Ubersuggest pour trouver des questions réelles\n\n**2. Structure optimisée pour le scan visuel**\n- Créez des titres et sous-titres accrocheurs contenant vos mots-clés\n- Utilisez des listes à puces et des paragraphes courts (3-4 lignes maximum)\n- Intégrez des éléments visuels pertinents tous les 300 mots environ\n\n**3. Contenu orienté solution**\n- Commencez par identifier clairement le problème de votre audience\n- Proposez des solutions concrètes et actionnables\n- Incluez des exemples réels et des études de cas\n\n**4. Éléments persuasifs stratégiques**\n- Intégrez des preuves sociales (témoignages, avis, études)\n- Utilisez des données chiffrées pour renforcer vos arguments\n- Anticipez et répondez aux objections potentielles\n\n**5. Appels à l'action contextuels**\n- Placez des CTA pertinents en fonction du parcours de lecture\n- Variez les formulations selon le niveau d'engagement\n- Créez un sentiment d'urgence ou d'exclusivité quand c'est pertinent\n\n**6. Optimisation technique**\n- Utilisez votre mot-clé principal dans les premiers 100 mots\n- Optimisez vos balises title, meta descriptions et alt des images\n- Créez des URLs courtes et descriptives\n\nN'oubliez pas de mettre à jour régulièrement votre contenu pour maintenir sa pertinence et son classement.";
      }
      else {
        aiResponse = "Pour répondre à cette question spécifique sur " + question + ", je vous suggère d'aborder les points suivants dans votre réponse:\n\n1. **Contextualisez le sujet** - Commencez par expliquer pourquoi cette question est importante dans le domaine du SEO et du marketing digital\n\n2. **Présentez des solutions concrètes** - Offrez 3-5 tactiques spécifiques que vous avez personnellement testées ou que des experts recommandent\n\n3. **Appuyez avec des données** - Intégrez quelques statistiques ou études de cas qui renforcent vos arguments\n\n4. **Anticipez les objections** - Abordez les défis potentiels et comment les surmonter\n\n5. **Concluez avec des actions précises** - Terminez par 2-3 étapes concrètes que le lecteur peut entreprendre immédiatement\n\nN'hésitez pas à partager votre expérience personnelle sur ce sujet pour rendre votre réponse plus authentique et engageante.";
      }
      
      setTextAnswer(aiResponse);
      
      // Générer automatiquement des sources
      setTextSources("1. [Google Search Central](https://developers.google.com/search)\n2. [Moz Blog](https://moz.com/blog)\n3. [Search Engine Journal](https://www.searchenginejournal.com)\n4. [Backlinko](https://backlinko.com)");
      
      toast.success("Réponse IA générée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      toast.error("Erreur lors de la génération de la réponse");
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="questionToAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question à répondre</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Sélectionnez une question</option>
                  {popularQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </FormControl>
              <div className="flex justify-end mt-1">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-2 text-primary"
                  onClick={generateAIAnswer}
                  disabled={isGeneratingAnswer}
                >
                  {isGeneratingAnswer ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  {isGeneratingAnswer ? "Génération en cours..." : "Générer une réponse IA"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Votre réponse</FormLabel>
          <QuoraFormatToolbar fieldType="answer" onFormat={applyFormatting} />
          <Textarea 
            placeholder="Rédigez une réponse détaillée et informative..."
            className="min-h-[200px]" 
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            onSelect={(start, end, text) => handleTextSelection('answer', start, end, text)}
            ref={answerRef}
          />
          <div className="text-xs text-[#6E59A5] mt-1">
            Astuce: Sélectionnez du texte et cliquez sur l'icône de lien pour ajouter un lien hypertexte.
          </div>
        </FormItem>
        
        <FormItem>
          <FormLabel>Sources (optionnel)</FormLabel>
          <QuoraFormatToolbar fieldType="sources" onFormat={applyFormatting} />
          <Textarea 
            placeholder="Ajoutez des liens ou références pour appuyer votre réponse..."
            className="min-h-[80px]"
            value={textSources}
            onChange={(e) => setTextSources(e.target.value)}
            onSelect={(start, end, text) => handleTextSelection('sources', start, end, text)}
            ref={sourcesRef}
          />
        </FormItem>
        
        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              form.reset();
              setTextAnswer("");
              setTextSources("");
            }}
          >
            Annuler
          </Button>
          <Button type="submit" variant="quora">Publier la réponse</Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoraAnswerForm;
