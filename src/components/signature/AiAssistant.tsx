
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, SendIcon, User, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AiAssistantProps {
  onUseResponse: (response: string) => void;
}

const AiAssistant = ({ onUseResponse }: AiAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyingToIndex, setReplyingToIndex] = useState<number | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }

    // Ajouter la question à la conversation
    const newMessage = { role: 'user' as const, content: question };
    if (isReplyMode && replyingToIndex !== null) {
      // Créer une copie de la conversation
      const updatedConversation = [...conversation];
      // Insérer la réponse après la question à laquelle on répond
      updatedConversation.splice(replyingToIndex + 1, 0, newMessage);
      setConversation(updatedConversation);
    } else {
      setConversation(prev => [...prev, newMessage]);
    }
    
    setIsLoading(true);
    
    try {
      // Simule une réponse IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Amélioration du système de réponses pour une meilleure correspondance
      let aiResponse = "";
      const lowerQuestion = question.toLowerCase();
      
      // Analyse des mots-clés principaux pour déterminer l'intention de la question
      const hasYoutubeKeywords = lowerQuestion.includes("youtube") || lowerQuestion.includes("abonnés") || 
                                 lowerQuestion.includes("vues") || lowerQuestion.includes("vidéo");
      
      const hasMarketingKeywords = lowerQuestion.includes("marketing") || lowerQuestion.includes("publicité") || 
                                   lowerQuestion.includes("promotion") || lowerQuestion.includes("marque") || 
                                   lowerQuestion.includes("stratégie");
      
      const hasSeoKeywords = lowerQuestion.includes("seo") || lowerQuestion.includes("référencement") || 
                             lowerQuestion.includes("google") || lowerQuestion.includes("moteur de recherche") || 
                             lowerQuestion.includes("classement");
      
      const hasSignatureKeywords = lowerQuestion.includes("signature") || lowerQuestion.includes("email") || 
                                   lowerQuestion.includes("courriel") || lowerQuestion.includes("mail");
      
      const hasDesignKeywords = lowerQuestion.includes("couleur") || lowerQuestion.includes("design") || 
                                lowerQuestion.includes("style") || lowerQuestion.includes("visuel") || 
                                lowerQuestion.includes("apparence");
      
      const hasLogoKeywords = lowerQuestion.includes("logo") || lowerQuestion.includes("image") || 
                              lowerQuestion.includes("icône") || lowerQuestion.includes("marque") || 
                              lowerQuestion.includes("identité visuelle");
      
      const hasLinkKeywords = lowerQuestion.includes("lien") || lowerQuestion.includes("url") || 
                              lowerQuestion.includes("hyperlien") || lowerQuestion.includes("cliquer") || 
                              lowerQuestion.includes("redirection");
      
      // Question sur l'obtention rapide d'abonnés YouTube
      if (hasYoutubeKeywords && (lowerQuestion.includes("rapide") || lowerQuestion.includes("vite") || 
          lowerQuestion.includes("rapidement") || lowerQuestion.includes("journée") || lowerQuestion.includes("jour"))) {
        if (lowerQuestion.includes("1000") || lowerQuestion.includes("mille")) {
          aiResponse = "Pour obtenir 1000 abonnés rapidement sur YouTube, voici des méthodes éthiques et efficaces :\n\n" +
          "1. **Créez un contenu ciblé et de qualité** - Identifiez une niche spécifique et créez du contenu qui répond à un besoin réel. La qualité prime sur la quantité.\n\n" +
          "2. **Optimisez vos vidéos pour le SEO** - Utilisez des mots-clés pertinents dans vos titres, descriptions et tags. YouTube est le deuxième moteur de recherche mondial.\n\n" +
          "3. **Collaborez avec d'autres créateurs** - Trouvez des YouTubeurs de taille similaire dans votre niche et proposez des collaborations mutuellement bénéfiques.\n\n" +
          "4. **Partagez sur d'autres plateformes** - Diffusez vos vidéos sur vos réseaux sociaux, forums spécialisés, et communautés en ligne pertinentes.\n\n" +
          "5. **Engagez votre audience** - Répondez aux commentaires et créez une communauté autour de votre contenu.\n\n" +
          "⚠️ **Attention** : Les promesses d'obtenir 1000 abonnés en une seule journée sont généralement trompeuses. De telles méthodes (achat d'abonnés, échanges artificiels) peuvent entraîner la suppression de votre chaîne pour violation des conditions d'utilisation de YouTube. La croissance organique prend du temps mais construit une audience de qualité.";
        } else {
          aiResponse = "Pour développer rapidement votre chaîne YouTube, concentrez-vous sur ces stratégies éprouvées :\n\n" +
          "1. **Publiez régulièrement** - Établissez un calendrier de publication cohérent que vous pouvez maintenir.\n\n" +
          "2. **Analysez vos concurrents** - Identifiez ce qui fonctionne bien dans votre niche sans simplement copier.\n\n" +
          "3. **Optimisez vos miniatures** - Créez des miniatures accrocheuses qui génèrent des clics sans être trompeuses.\n\n" +
          "4. **Exploitez les tendances** - Adaptez les sujets populaires à votre style et niche.\n\n" +
          "5. **Utilisez les shorts** - Les courts formats peuvent générer beaucoup de visibilité rapidement.\n\n" +
          "Méfiez-vous des services promettant des milliers d'abonnés instantanés. Ces méthodes non organiques nuisent à l'engagement et peuvent entraîner des pénalités de la part de YouTube. La croissance authentique peut prendre du temps, mais attire une audience véritablement intéressée par votre contenu.";
        }
      }
      // Question sur les signatures email professionnelles
      else if (hasSignatureKeywords && (lowerQuestion.includes("professionnel") || lowerQuestion.includes("travail") || 
               lowerQuestion.includes("entreprise") || lowerQuestion.includes("business"))) {
        aiResponse = "Une signature email professionnelle efficace doit contenir ces éléments essentiels :\n\n" +
        "1. **Informations de base** - Votre nom complet, titre professionnel, nom de l'entreprise et coordonnées (téléphone, email professionnel)\n\n" +
        "2. **Design cohérent** - Respectez la charte graphique de votre entreprise avec un design sobre et élégant\n\n" +
        "3. **Logo d'entreprise** - Intégrez-le en taille réduite (pas plus de 200px de large)\n\n" +
        "4. **Liens pertinents** - Votre site web, profil LinkedIn, et éventuellement d'autres réseaux sociaux professionnels\n\n" +
        "5. **Call-to-action** - Un lien vers votre calendrier de réservation ou votre dernier projet\n\n" +
        "Évitez les erreurs courantes comme : trop d'informations, police illisible, taille excessive, et images trop lourdes qui peuvent déclencher les filtres anti-spam. Votre signature doit être responsive pour s'afficher correctement sur mobile, où plus de 60% des emails sont désormais consultés.";
      }
      // Questions sur le design et les couleurs
      else if (hasDesignKeywords) {
        aiResponse = "Pour un design de signature email efficace, voici les principes essentiels à suivre :\n\n" +
        "1. **Psychologie des couleurs** - Choisissez des couleurs alignées avec votre identité de marque :\n" +
        "   • Bleu : confiance, professionnalisme, sérénité\n" +
        "   • Vert : croissance, santé, éco-responsabilité\n" +
        "   • Rouge : énergie, urgence, passion\n" +
        "   • Noir : élégance, luxe, autorité\n\n" +
        "2. **Hiérarchie visuelle** - Organisez les informations par ordre d'importance avec des variations subtiles de taille et de poids de police\n\n" +
        "3. **Espacement et alignement** - Utilisez des marges cohérentes et alignez proprement les éléments\n\n" +
        "4. **Sobriété et cohérence** - Limitez-vous à 2-3 couleurs maximum et 1-2 polices\n\n" +
        "5. **Séparateurs visuels** - Utilisez des lignes fines ou des espaces pour délimiter les sections\n\n" +
        "Le design de votre signature est souvent le dernier élément de votre email que vos contacts verront - assurez-vous qu'il reflète professionnellement votre marque tout en restant léger et fonctionnel.";
      }
      // Questions sur les logos
      else if (hasLogoKeywords) {
        aiResponse = "Pour intégrer efficacement votre logo dans votre signature email :\n\n" +
        "1. **Format optimal** - Utilisez un PNG avec fond transparent pour une meilleure intégration visuelle\n\n" +
        "2. **Taille recommandée** - Maintenez une largeur de 150-200px maximum pour éviter de surcharger la signature\n\n" +
        "3. **Résolution adaptée** - Optimisez l'image à 72dpi, suffisant pour l'affichage écran tout en limitant le poids du fichier\n\n" +
        "4. **Positionnement stratégique** - Placez généralement le logo en haut ou à gauche de la signature pour une meilleure visibilité selon les habitudes de lecture occidentales\n\n" +
        "5. **Version simplifiée** - Si votre logo est complexe, envisagez une version simplifiée spécifiquement pour les signatures\n\n" +
        "6. **Test multi-plateforme** - Vérifiez l'apparence sur différents clients de messagerie et appareils\n\n" +
        "Un logo bien intégré renforce considérablement la mémorabilité de votre marque dans chaque interaction email, mais assurez-vous qu'il reste léger (idéalement moins de 30Ko) pour ne pas ralentir le chargement de l'email.";
      }
      // Questions sur les liens et URL
      else if (hasLinkKeywords) {
        aiResponse = "Pour ajouter des liens efficaces dans votre signature email :\n\n" +
        "1. **Types de liens essentiels** :\n" +
        "   • Site web principal de l'entreprise\n" +
        "   • Profils professionnels (LinkedIn, Twitter professionnel)\n" +
        "   • Calendrier de réservation (Calendly, HubSpot)\n" +
        "   • Portfolio ou études de cas récentes\n\n" +
        "2. **Bonnes pratiques techniques** :\n" +
        "   • Utilisez des attributs title pour améliorer l'accessibilité\n" +
        "   • Testez tous les liens avant de finaliser la signature\n" +
        "   • Préférez des textes d'ancrage descriptifs plutôt que des URLs brutes\n" +
        "   • Assurez-vous que la couleur des liens offre un contraste suffisant\n\n" +
        "3. **Approche visuelle** :\n" +
        "   • Pour les réseaux sociaux, utilisez des icônes reconnaissables plutôt que du texte\n" +
        "   • Maintenez une taille suffisante pour faciliter le clic sur mobile\n" +
        "   • Espacez suffisamment les liens pour éviter les erreurs de clic\n\n" +
        "4. **Suivi et analyse** :\n" +
        "   • Envisagez d'utiliser des UTM parameters pour suivre le trafic généré\n" +
        "   • Utilisez des services de raccourcissement d'URL avec analytics intégrés\n\n" +
        "Les liens dans votre signature représentent des opportunités stratégiques de redirection - choisissez-les judicieusement pour maximiser leur impact commercial.";
      }
      // Questions sur le SEO et le référencement
      else if (hasSeoKeywords) {
        aiResponse = "Pour optimiser le référencement naturel (SEO) de votre site web en 2024, concentrez-vous sur ces stratégies essentielles :\n\n" +
        "1. **Contenu E-E-A-T de qualité** - Google accorde une importance croissante à l'Expertise, l'Expérience, l'Autorité et la Fiabilité. Créez du contenu approfondi qui démontre votre expertise réelle.\n\n" +
        "2. **Optimisation pour l'intention de recherche** - Allez au-delà des mots-clés pour comprendre pourquoi les utilisateurs recherchent certains termes. Structurez votre contenu pour répondre précisément à leurs questions.\n\n" +
        "3. **Expérience utilisateur optimale** - Les Core Web Vitals et l'expérience mobile sont des facteurs de classement directs. Assurez-vous que votre site se charge rapidement et offre une navigation fluide.\n\n" +
        "4. **Stratégie de liens naturelle** - Privilégiez la qualité à la quantité pour vos backlinks. Un seul lien provenant d'un site autoritaire dans votre domaine vaut mieux que des dizaines de liens de faible qualité.\n\n" +
        "5. **Optimisation technique** - Assurez-vous que votre site utilise HTTPS, possède un sitemap XML à jour, et implémente correctement les données structurées pour les rich snippets.\n\n" +
        "Le SEO évolue constamment vers une approche plus holistique. Les techniques de manipulation qui fonctionnaient il y a quelques années peuvent désormais pénaliser votre site. Concentrez-vous sur la création de valeur réelle pour vos utilisateurs.";
      }
      // Questions sur le marketing et la publicité
      else if (hasMarketingKeywords) {
        aiResponse = "Pour développer une stratégie de marketing digital efficace en 2024, voici les éléments fondamentaux à intégrer :\n\n" +
        "1. **Approche omnicanale cohérente** - Assurez une expérience fluide entre tous vos points de contact digitaux (site web, réseaux sociaux, email, etc.)\n\n" +
        "2. **Personnalisation avancée** - Utilisez les données comportementales pour créer des parcours client hautement personnalisés. 80% des consommateurs sont plus susceptibles d'acheter auprès de marques offrant des expériences personnalisées.\n\n" +
        "3. **Marketing de contenu stratégique** - Développez un mix de formats (articles, vidéos, podcasts, infographies) adaptés à chaque étape du parcours client.\n\n" +
        "4. **Attribution multi-touch** - Implémentez des modèles d'attribution qui reconnaissent l'impact de chaque interaction dans le processus de conversion.\n\n" +
        "5. **Automatisation intelligente** - Déployez des solutions de marketing automation qui s'adaptent au comportement des utilisateurs en temps réel.\n\n" +
        "La clé d'une stratégie marketing efficace réside dans l'équilibre entre l'innovation technologique et l'authenticité humaine. Les marques qui réussissent ne se contentent pas de suivre les tendances - elles créent des connexions émotionnelles durables avec leur audience tout en exploitant les données pour améliorer continuellement leurs performances.";
      }
      // Réponse par défaut - plus générique mais toujours utile
      else {
        aiResponse = "Votre question touche un sujet intéressant qui mérite une réponse détaillée. Bien que je n'aie pas identifié un thème spécifique comme YouTube, SEO, signatures email ou marketing dans votre question, je peux vous offrir quelques conseils généraux:\n\n" +
        "1. **Recherche approfondie** - Commencez par explorer les ressources existantes sur ce sujet spécifique. Les études de cas, statistiques récentes et exemples concrets renforceront votre compréhension.\n\n" +
        "2. **Application pratique** - La théorie est importante, mais l'expérimentation vous permettra de découvrir ce qui fonctionne spécifiquement dans votre contexte.\n\n" +
        "3. **Mesure des résultats** - Définissez des indicateurs clés de performance pertinents pour évaluer l'efficacité de vos actions.\n\n" +
        "4. **Adaptation continue** - Les meilleures pratiques évoluent constamment. Restez informé des dernières tendances dans ce domaine.\n\n" +
        "5. **Apprentissage communautaire** - Rejoignez des groupes professionnels ou forums spécialisés pour échanger avec d'autres personnes intéressées par ce sujet.\n\n" +
        "Si vous souhaitez une réponse plus ciblée, n'hésitez pas à reformuler votre question avec des détails supplémentaires sur le contexte spécifique qui vous intéresse (YouTube, SEO, marketing digital, signatures email, etc.).";
      }
      
      // S'assurer que la réponse fait au moins 500 caractères
      if (aiResponse.length < 500) {
        const additionalInfo = "Pour approfondir ce sujet, je vous recommande également d'explorer les dernières tendances et meilleures pratiques dans ce domaine. Les technologies et stratégies évoluent rapidement, et rester informé des développements récents vous donnera un avantage concurrentiel. N'hésitez pas à me poser des questions plus spécifiques sur certains aspects particuliers qui vous intéressent, et je pourrai vous donner des conseils plus ciblés adaptés à votre situation.";
        aiResponse += " " + additionalInfo;
      }
      
      // Ajouter la réponse à la conversation
      if (isReplyMode && replyingToIndex !== null) {
        // Créer une copie de la conversation
        const updatedConversation = [...conversation];
        // Insérer la réponse après notre réponse utilisateur
        updatedConversation.splice(replyingToIndex + 2, 0, { role: 'assistant', content: aiResponse });
        setConversation(updatedConversation);
      } else {
        setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
      
      // Réinitialiser le mode de réponse
      setIsReplyMode(false);
      setReplyingToIndex(null);
    } catch (error) {
      toast.error("Erreur lors de la génération de la réponse");
      console.error("Erreur IA:", error);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const handleUseResponse = (response: string) => {
    onUseResponse(response);
    toast.success("Réponse utilisée dans votre signature");
  };
  
  const handleReplyClick = (index: number) => {
    setIsReplyMode(true);
    setReplyingToIndex(index);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const insertLink = () => {
    if (!linkUrl.trim() || !linkText.trim()) {
      toast.error("Veuillez saisir une URL et un texte pour le lien");
      return;
    }
    
    const formattedLink = `[${linkText}](${linkUrl})`;
    
    // Insérer le lien à la position du curseur ou remplacer la sélection
    const currentQuestion = question;
    const newQuestion = 
      currentQuestion.substring(0, selectionStart) + 
      formattedLink + 
      currentQuestion.substring(selectionEnd);
    
    setQuestion(newQuestion);
    setShowLinkPopover(false);
    setLinkUrl("");
    setLinkText("");
    
    // Remettre le focus sur le textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleTextareaSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      setSelectionStart(start);
      setSelectionEnd(end);
      
      // Si du texte est sélectionné, l'utiliser comme texte du lien
      if (start !== end) {
        const selectedText = question.substring(start, end);
        setLinkText(selectedText);
      }
    }
  };

  return (
    <Card className="p-4 border-t-4 border-t-primary">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        Assistant IA pour signatures
      </h3>
      
      <div className="mb-4 max-h-60 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-md">
        {conversation.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Posez une question sur les signatures email, marketing, YouTube ou SEO pour obtenir des conseils personnalisés.
          </p>
        ) : (
          conversation.map((message, index) => (
            <div 
              key={index} 
              className={`flex gap-2 p-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-gray-100 ml-4' 
                  : 'bg-primary/10 mr-4'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 mt-1 flex-shrink-0" />
              ) : (
                <Bot className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
              )}
              <div className="flex-1">
                <p className="text-sm whitespace-pre-wrap" 
                   dangerouslySetInnerHTML={{
                     __html: message.content.replace(
                       /\[([^\]]+)\]\(([^)]+)\)/g,
                       '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>'
                     )
                   }} 
                />
                <div className="mt-1 flex items-center justify-between">
                  {message.role === 'assistant' ? (
                    <>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-xs"
                        onClick={() => handleUseResponse(message.content)}
                      >
                        Utiliser cette réponse
                      </Button>
                      <span className="text-xs text-gray-500">{message.content.length} caractères</span>
                    </>
                  ) : (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs ml-auto"
                      onClick={() => handleReplyClick(index)}
                    >
                      Répondre
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="ml-2 text-sm">Génération de la réponse...</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Insérer un lien</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Texte du lien"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="URL (https://...)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={insertLink}
                      className="text-xs"
                    >
                      Insérer
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex-1 relative">
            {isReplyMode && (
              <div className="absolute -top-6 left-0 text-xs flex items-center text-gray-500">
                <span>En réponse à la question {replyingToIndex !== null ? replyingToIndex + 1 : ''}</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs ml-2"
                  onClick={() => {
                    setIsReplyMode(false);
                    setReplyingToIndex(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            )}
            <Textarea
              ref={textareaRef}
              placeholder={isReplyMode ? "Écrivez votre réponse..." : "Posez une question (YouTube, SEO, email, marketing)..."}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onSelect={handleTextareaSelection}
              disabled={isLoading}
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {question.length > 0 && `${question.length} caractères`}
          </div>
          <Button type="submit" size="sm" disabled={isLoading} className="ml-auto">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <SendIcon className="w-4 h-4 mr-2" />
                {isReplyMode ? "Répondre" : "Envoyer"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AiAssistant;
