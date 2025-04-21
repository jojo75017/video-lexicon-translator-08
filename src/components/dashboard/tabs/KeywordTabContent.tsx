import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlignLeft, Search, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeKeywords, generateKeywordSuggestions } from '@/utils/seo/keywordAnalyzer';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import { KeywordSuggestion } from '@/types/seo';
import { generateSeoTitle } from '@/utils/seo/generators/titleGenerator';
import { generateSeoDescription } from '@/utils/seo/generators/descriptionGenerator';
import KeywordHistory from "@/components/seo/analysis/KeywordHistory";
import { OpenAIService } from '@/utils/seo/openaiService';

// Fonction utilitaire pour le code couleur du badge Title
function getTitleBadgeColor(title: string) {
  if (title.length === 60) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  return "bg-red-100 text-red-800 border-red-200";
}

// Fonction utilitaire pour le code couleur du badge Meta Description
function getMetaBadgeColor(meta: string) {
  if (meta.length >= 150 && meta.length <= 155) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  return "bg-red-100 text-red-800 border-red-200";
}

// Fonction utilitaire pour le code couleur du badge Long Description (500)
function getLongMetaBadgeColor(meta: string) {
  if (meta.length === 500) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  return "bg-red-100 text-red-800 border-red-200";
}

const HISTORY_KEY = "seo_keyword_history";

const KeywordTabContent = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [longMetaDescription, setLongMetaDescription] = useState(''); // Nouvelle description longue
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [openAIKey, setOpenAIKey] = useState('');
  const [useAI, setUseAI] = useState(false);
  // Nouvel état pour l'historique
  const [history, setHistory] = useState<any[]>([]);

  // Charger la clé OpenAI depuis localStorage au chargement du composant
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_key') || localStorage.getItem('openaiKey');
    console.log("Clé OpenAI trouvée:", savedKey ? "oui" : "non");
    if (savedKey) {
      setOpenAIKey(savedKey);
      setUseAI(true);
    }
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Génère le titre et la meta description lorsqu'un mot-clé est entré
  useEffect(() => {
    if (keyword.trim().length > 3) {
      generateSuggestion();
    }
  }, [keyword]);

  // Ajout d'un effet pour le logging et débogage
  useEffect(() => {
    console.log("KeywordTabContent rendu");
    console.log("Titre actuel:", title);
    console.log("Description actuelle:", metaDescription);
    console.log("Mots-clés générés:", generatedKeywords.length);
  }, [title, metaDescription, generatedKeywords]);

  const generateWithOpenAI = async (keyword: string) => {
    if (!openAIKey) {
      console.log("Pas de clé OpenAI disponible");
      return null;
    }
    
    console.log("Génération avec OpenAI pour le mot-clé:", keyword);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Tu es un expert SEO spécialisé dans la création de balises title et meta description optimisées. Les titres doivent faire exactement 60 caractères et les descriptions exactement 155 caractères."
            },
            {
              role: "user",
              content: `Crée une balise title et une meta description pour le mot-clé: "${keyword}". Réponds uniquement sous forme d'objet JSON avec les propriétés "title" et "description". Le title doit faire exactement 60 caractères et la description exactement 155 caractères.`
            }
          ]
        })
      });
      
      console.log("Statut de réponse OpenAI:", response.status);
      
      const data = await response.json();
      console.log("Réponse OpenAI:", data);
      
      if (data.error) {
        console.error("Erreur OpenAI:", data.error);
        toast.error("Erreur lors de la génération avec OpenAI");
        return null;
      }
      
      try {
        const content = data.choices[0].message.content;
        console.log("Contenu de la réponse:", content);
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        console.log("JSON extrait:", jsonString);
        
        const parsed = JSON.parse(jsonString);
        console.log("Données parsées:", parsed);
        
        if (parsed.title && parsed.description) {
          return parsed;
        } else {
          console.error("Données incomplètes dans la réponse");
          return null;
        }
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
        return null;
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      toast.error("Erreur de connexion à l'API OpenAI");
      return null;
    }
  };

  // Fonction de génération de meta description longue
  const generateLongMetaDescription = async (keyword: string) => {
    // OpenAI si activé
    if (useAI && openAIKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Tu es un expert SEO spécialisé dans la rédaction de meta description longues et optimisées."
              },
              {
                role: "user",
                content: `Rédige uniquement une meta description optimisée SEO de 500 caractères (pas plus courte et pas plus longue) pour le mot-clé suivant : "${keyword}". Réponds uniquement par le texte de la meta description, sans rien d'autre.`
              }
            ]
          })
        });
        const data = await response.json();
        if (data.error) {
          return '';
        }
        let content = data.choices?.[0]?.message?.content || '';
        // On vérifie que la longueur est bien ajustée
        if (content.length > 500) content = content.slice(0, 500);
        return content;
      } catch {
        // Fallback si erreur d'appel OpenAI
        return generateLocalLongMetaDescription(keyword);
      }
    } else {
      // Génération locale
      return generateLocalLongMetaDescription(keyword);
    }
  };

  // Génération locale longue description
  const generateLocalLongMetaDescription = (keyword: string) => {
    let base = `Découvrez tout sur ${keyword} dans cet article complet : conseils d'experts, stratégies exclusives et analyses approfondies sur ${keyword}. Notre guide de 500 caractères vous apporte toutes les ressources, astuces et informations essentielles pour exceller dans ce domaine ! Optimisez votre référencement naturel (SEO) en maîtrisant toutes les subtilités liées à ${keyword}, lisez nos solutions pratiques et développez une stratégie gagnante durablement.`;
    // On ajuste à 500 caractères exactement
    if (base.length > 500) return base.slice(0, 500);
    if (base.length < 500) return base.padEnd(500, '.');
    return base;
  };

  // Sauvegarde dans l'historique (appelle après chaque génération)
  const saveHistory = (record: {
    keyword: string, title: string, metaDescription: string, longMetaDescription: string
  }) => {
    // Empêcher les doublons (on va garder seulement 10 entrées max, la plus récente en tête)
    let updated = [ 
      { ...record, date: new Date().toLocaleString() },
      ...history.filter(h => h.keyword !== record.keyword),
    ].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  // Fonction pour charger/rétablir une génération historique
  const handleHistoryLoad = (item: any) => {
    setKeyword(item.keyword);
    setTitle(item.title);
    setMetaDescription(item.metaDescription);
    setLongMetaDescription(item.longMetaDescription);
  };

  const generateSuggestion = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez d'abord entrer un mot-clé");
      return;
    }

    setIsGenerating(true);
    console.log("Génération de suggestions pour:", keyword);
    console.log("Utilisation de l'IA:", useAI, "Clé disponible:", openAIKey ? "oui" : "non");

    let generatedTitle = '';
    let generatedDescription = '';
    let generatedLongDescription = '';

    // Utiliser OpenAI si la clé est disponible et l'option activée
    if (useAI && openAIKey) {
      console.log("Tentative de génération avec OpenAI");
      const aiResult = await generateWithOpenAI(keyword);
      
      if (aiResult) {
        console.log("Résultat OpenAI obtenu:", aiResult);
        generatedTitle = aiResult.title;
        generatedDescription = aiResult.description;
      } else {
        console.log("Échec de génération avec OpenAI, repli sur génération locale");
        // Fallback to local generation if AI fails
        generatedTitle = generateSeoTitle(keyword);
        generatedDescription = generateSeoDescription(keyword);
      }
      // Génère la longue description séparément
      generatedLongDescription = await generateLongMetaDescription(keyword);
    } else {
      console.log("Utilisation de la génération locale");
      // Utiliser la génération locale
      generatedTitle = generateSeoTitle(keyword);
      generatedDescription = generateSeoDescription(keyword);
      generatedLongDescription = generateLocalLongMetaDescription(keyword);
    }

    console.log("Titre généré:", generatedTitle);
    console.log("Description générée:", generatedDescription);
    console.log("Description longue générée:", generatedLongDescription);

    setTitle(generatedTitle);
    setMetaDescription(generatedDescription);
    setLongMetaDescription(generatedLongDescription);

    // Simulation d'une analyse de mots-clés basée sur le mot entré
    const keywordAnalysis = analyzeKeywords(`Contenu exemple ${keyword} pour analyse. ${keyword} est un mot-clé important pour le référencement.`);
    
    // Génération de suggestions basées sur l'analyse
    const suggestions = generateKeywordSuggestions(keywordAnalysis);
    
    // Mise à jour des suggestions avec les titres et descriptions générés
    if (suggestions.length > 0) {
      // Pour chaque suggestion, générer un titre et une description spécifiques
      const updatedSuggestions = await Promise.all(
        suggestions.map(async (suggestion) => {
          let suggestedTitle, suggestedDescription;
          
          if (useAI && openAIKey) {
            const aiResult = await generateWithOpenAI(suggestion.keyword);
            if (aiResult) {
              suggestedTitle = aiResult.title;
              suggestedDescription = aiResult.description;
            } else {
              suggestedTitle = generateSeoTitle(suggestion.keyword);
              suggestedDescription = generateSeoDescription(suggestion.keyword);
            }
          } else {
            suggestedTitle = generateSeoTitle(suggestion.keyword);
            suggestedDescription = generateSeoDescription(suggestion.keyword);
          }
          
          return {
            ...suggestion,
            suggestedTitle,
            suggestedDescription
          };
        })
      );
      
      setGeneratedKeywords(updatedSuggestions);
    }

    setIsGenerating(false);
    toast.success("Suggestions générées avec succès");

    // === AJOUT: Sauvegarde dans l'historique ===
    saveHistory({
      keyword: keyword,
      title: generatedTitle,
      metaDescription: generatedDescription,
      longMetaDescription: generatedLongDescription
    });
  };

  const handleGenerateMore = () => {
    generateSuggestion();
  };

  const saveOpenAIKey = () => {
    if (openAIKey) {
      localStorage.setItem('openai_key', openAIKey);
      localStorage.setItem('openaiKey', openAIKey); // Sauvegarde avec les deux noms de clé pour compatibilité
      console.log("Clé OpenAI sauvegardée:", openAIKey.substring(0, 5) + "...");
      setUseAI(true);
      toast.success("Clé OpenAI sauvegardée");
      
      // Tester immédiatement la clé avec un appel simple
      fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log("Test de la clé API - statut:", response.status);
        if (!response.ok) {
          toast.error("La clé API semble invalide. Veuillez vérifier et réessayer.");
        } else {
          toast.success("Clé API validée avec succès!");
        }
        return response.json();
      })
      .then(data => {
        console.log("Modèles disponibles:", data);
      })
      .catch(err => {
        console.error("Erreur lors du test de la clé API:", err);
        toast.error("Erreur lors de la validation de la clé API");
      });
    } else {
      localStorage.removeItem('openai_key');
      localStorage.removeItem('openaiKey');
      setUseAI(false);
      toast.info("Génération locale activée");
    }
  };

  // Ajout copie dans le presse-papier pour la longue description
  const handleCopyLongMeta = () => {
    if (longMetaDescription) {
      navigator.clipboard.writeText(longMetaDescription);
      toast.success("Description longue copiée !");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <label htmlFor="openai-key" className="text-sm font-medium leading-none flex items-center gap-2">
              <Key className="h-4 w-4" />
              Clé API OpenAI (optionnelle)
            </label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={saveOpenAIKey}
                variant="outline"
              >
                Sauvegarder
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {useAI 
                ? "OpenAI sera utilisé pour générer des titres et descriptions plus variés" 
                : "Utilisation du générateur local (titres et descriptions moins variés)"}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="keyword" className="text-sm font-medium leading-none flex items-center gap-2">
              <Search className="h-4 w-4" />
              Mot-clé principal
            </label>
            <div className="flex gap-2">
              <Input
                id="keyword"
                placeholder="Entrez votre mot-clé principal"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={generateSuggestion} 
                disabled={isGenerating || !keyword.trim()}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer"
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Entrez un mot-clé pour générer automatiquement un titre et une meta description optimisés
            </p>
          </div>

          {/* BALISE TITLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="title" className="text-sm font-medium leading-none flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Balise Title
              </label>
              <span>
                <Badge 
                  className={getTitleBadgeColor(title) + " border"}
                >
                  {title.length}/60
                </Badge>
              </span>
            </div>
            <Input
              id="title"
              placeholder="Entrez votre titre (exactement 60 caractères)"
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value.slice(0, 60); // Limite 60 caractères
                setTitle(newTitle);
              }}
              className={
                (title.length !== 60 
                  ? "border-2 border-red-400 focus:border-red-500 bg-red-50"
                  : "border-2 border-green-400 focus:border-green-500 bg-green-50"
                ) +
                " transition duration-150"
              }
            />
            {title.length !== 60 && (
              <p className="text-xs text-red-500">
                Le titre doit faire exactement 60 caractères (actuellement {title.length})
              </p>
            )}
          </div>

          {/* META DESCRIPTION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="metaDescription" className="text-sm font-medium leading-none flex items-center gap-2">
                <AlignLeft className="h-4 w-4" />
                Meta Description
              </label>
              <Badge 
                className={getMetaBadgeColor(metaDescription) + " border"}
              >
                {metaDescription.length}/155
              </Badge>
            </div>
            <Textarea
              id="metaDescription"
              placeholder="Entrez votre meta description (entre 150 et 155 caractères)"
              value={metaDescription}
              onChange={(e) => {
                const newDescription = e.target.value.slice(0, 155); // Limite 155 caractères
                setMetaDescription(newDescription);
              }}
              className={
                (metaDescription.length < 150 || metaDescription.length > 155 
                  ? "border-2 border-red-400 bg-red-50 focus:border-red-500"
                  : "border-2 border-green-400 bg-green-50 focus:border-green-500"
                ) +
                " transition duration-150"
              }
              rows={4}
            />
            {(metaDescription.length < 150 || metaDescription.length > 155) && (
              <p className="text-xs text-red-500">
                {metaDescription.length < 150 
                  ? `La description doit faire au moins 150 caractères (actuellement ${metaDescription.length})` 
                  : `La description dépasse 155 caractères (actuellement ${metaDescription.length})`}
              </p>
            )}
          </div>

          {/* DESCRIPTION LONGUE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="longMetaDescription" className="text-sm font-medium flex items-center gap-2">
                <AlignLeft className="h-4 w-4" />
                Meta Description Longue (500 caractères)
              </label>
              <div>
                <Badge className={getLongMetaBadgeColor(longMetaDescription) + " border"}>
                  {longMetaDescription.length}/500
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={handleCopyLongMeta}
                  disabled={!longMetaDescription}
                >
                  Copier
                </Button>
              </div>
            </div>
            <Textarea
              id="longMetaDescription"
              placeholder="Une meta description SEO longue (exactement 500 caractères)"
              value={longMetaDescription}
              onChange={(e) => {
                const newDesc = e.target.value.slice(0, 500);
                setLongMetaDescription(newDesc);
              }}
              className={
                (longMetaDescription.length !== 500
                  ? "border-2 border-red-400 bg-red-50 focus:border-red-500"
                  : "border-2 border-green-400 bg-green-50 focus:border-green-500"
                ) +
                " transition duration-150"
              }
              rows={5}
            />
            {longMetaDescription.length !== 500 && (
              <p className="text-xs text-red-500">
                {longMetaDescription.length < 500
                  ? `La description doit faire exactement 500 caractères (actuellement ${longMetaDescription.length})`
                  : `La description dépasse 500 caractères (actuellement ${longMetaDescription.length})`}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Cette description est idéale pour un usage avancé (ex : sites, réseaux sociaux…)
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Historique des générations */}
      <KeywordHistory history={history} onLoad={handleHistoryLoad} />
      {/* Suggestions */}
      {console.log("Rendu de KeywordSuggestions avec", generatedKeywords.length, "mots-clés")}
      <KeywordSuggestions 
        generatedKeywords={generatedKeywords} 
        onGenerateClick={handleGenerateMore} 
      />
    </div>
  );
};

export default KeywordTabContent;
