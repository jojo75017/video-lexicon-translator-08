import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Tag, FileText, KeyRound, Info, Search, Link, Copy, Check, SwitchCamera } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { OpenAIService } from '@/utils/seo/openaiService';
import KeywordSuggestions from '@/components/seo/analysis/KeywordSuggestions';
import OpenAIKeyForm from '@/components/settings/OpenAIKeyForm';

// Demo keywords pour tester l'interface sans API
const demoKeywords: KeywordSuggestion[] = [
  {
    keyword: "analyse seo",
    searchVolume: 9500,
    difficulty: 67,
    relevance: 85,
    competition: 70,
    cpc: 2.50,
    suggestedTitle: "Analyse SEO complète : Boostez votre visibilité en ligne ✓",
    suggestedDescription: "Découvrez comment optimiser votre site web avec notre analyse SEO experte. Améliorez votre classement et augmentez votre trafic organique.",
    suggestedShortDescription: "Découvrez notre analyse SEO experte pour optimiser votre site web, améliorer votre classement et augmenter votre trafic organique.",
    suggestedLongDescription: "Découvrez comment optimiser votre site web avec notre analyse SEO experte. Notre méthode complète examine tous les aspects techniques et stratégiques qui influencent votre positionnement dans les moteurs de recherche. Identifiez les opportunités d'amélioration, corrigez les problèmes techniques qui freinent votre visibilité, et développez une stratégie de contenu qui répond précisément aux attentes de votre audience. Nos experts vous accompagnent pour implémenter les bonnes pratiques SEO et vous aider à surpasser vos concurrents. Améliorez votre classement, augmentez votre trafic organique et boostez vos conversions grâce à une visibilité optimale."
  },
  {
    keyword: "audit référencement",
    searchVolume: 5400,
    difficulty: 45,
    relevance: 80,
    competition: 65,
    cpc: 1.80,
    suggestedTitle: "Audit de Référencement Professionnel | Résultats Garantis",
    suggestedDescription: "Un audit de référencement complet pour identifier les points forts et faibles de votre site. Recommandations personnalisées et plan d'action détaillé.",
    suggestedShortDescription: "Audit de référencement complet identifiant forces et faiblesses de votre site. Recommandations personnalisées et plan d'action détaillé.",
    suggestedLongDescription: "Bénéficiez d'un audit de référencement complet réalisé par nos experts pour identifier précisément les points forts et les faiblesses de votre site web. Notre analyse approfondie examine plus de 200 facteurs SEO, de la structure technique aux stratégies de contenu et de linking. Vous recevrez un rapport détaillé incluant une évaluation de votre positionnement actuel, une analyse de votre concurrence, et surtout des recommandations personnalisées classées par priorité. Notre plan d'action détaillé vous guidera étape par étape pour améliorer votre visibilité en ligne et générer plus de trafic qualifié. Profitez de notre expertise pour optimiser durablement votre présence sur les moteurs de recherche."
  },
  {
    keyword: "seo google",
    searchVolume: 12000,
    difficulty: 72,
    relevance: 90,
    competition: 75,
    cpc: 3.20,
    suggestedTitle: "SEO Google 2023 : Stratégies qui fonctionnent vraiment 🚀",
    suggestedDescription: "Maîtrisez les dernières techniques SEO pour Google. Guide expert pour améliorer votre classement et respecter les algorithmes les plus récents.",
    suggestedShortDescription: "Maîtrisez les dernières techniques SEO pour Google. Améliorez votre classement avec des stratégies conformes aux algorithmes récents.",
    suggestedLongDescription: "Maîtrisez les dernières techniques de référencement naturel pour Google avec notre guide expert complet. Découvrez les stratégies SEO 2023 qui fonctionnent réellement et qui vous permettront d'améliorer significativement votre positionnement dans les résultats de recherche. Notre approche est constamment mise à jour pour rester alignée avec les évolutions des algorithmes de Google, y compris les mises à jour Core, l'importance croissante des signaux d'expérience utilisateur et l'intelligence artificielle qui alimente désormais le moteur de recherche. Apprenez à optimiser vos pages pour les Featured Snippets, à créer un contenu qui répond parfaitement aux intentions de recherche, et à développer une stratégie d'acquisition de backlinks éthique et durable."
  },
  {
    keyword: "optimisation site web",
    searchVolume: 7200,
    difficulty: 53,
    relevance: 75,
    competition: 60,
    cpc: 2.10,
    suggestedTitle: "Optimisation Site Web : Performance & Conversion Maximale",
    suggestedDescription: "Services d'optimisation de site web pour une meilleure performance, un meilleur référencement et des taux de conversion plus élevés. Résultats mesurables.",
    suggestedShortDescription: "Services d'optimisation web pour améliorer performance, référencement et taux de conversion. Résultats mesurables garantis.",
    suggestedLongDescription: "Transformez votre site web en une véritable machine de performance et de conversion grâce à nos services d'optimisation professionnels. Notre approche globale combine l'amélioration technique (vitesse de chargement, responsive design, architecture de l'information), l'optimisation SEO (structure sémantique, maillage interne, stratégie de mots-clés) et l'optimisation de l'expérience utilisateur (parcours client, clarté des appels à l'action, tests A/B). Nos interventions sont basées sur une analyse approfondie de vos métriques actuelles et sur les meilleures pratiques du secteur. Vous bénéficierez d'un suivi détaillé avec des rapports réguliers montrant l'évolution de vos indicateurs clés de performance et le retour sur investissement de chaque optimisation réalisée."
  },
  {
    keyword: "meta description seo",
    searchVolume: 3600,
    difficulty: 38,
    relevance: 70,
    competition: 50,
    cpc: 1.50,
    suggestedTitle: "Meta Descriptions SEO : Guide Complet pour 2023",
    suggestedDescription: "Apprenez à rédiger des meta descriptions efficaces pour le SEO. Conseils d'experts, exemples et meilleures pratiques pour augmenter vos clics.",
    suggestedShortDescription: "Apprenez à rédiger des meta descriptions efficaces pour le SEO. Conseils d'experts et exemples pour augmenter vos clics.",
    suggestedLongDescription: "Apprenez à rédiger des meta descriptions parfaitement optimisées pour le SEO avec notre guide complet 2023. Ces courts paragraphes affichés dans les résultats de recherche sont essentiels pour convaincre les utilisateurs de cliquer sur votre lien plutôt que sur celui d'un concurrent. Découvrez comment trouver le juste équilibre entre optimisation pour les moteurs de recherche et copywriting persuasif, comment inclure intelligemment vos mots-clés sans faire de bourrage, et comment adapter vos descriptions à différents types de pages (accueil, produits, articles de blog, etc.). Notre guide inclut une analyse de nombreux exemples réussis dans différents secteurs, des templates personnalisables, et un processus étape par étape pour créer et tester l'efficacité de vos meta descriptions."
  }
];

const KeywordTabContent = () => {
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [isLoadingKey, setIsLoadingKey] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [extraDescription, setExtraDescription] = useState<string>('');
  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordSuggestion[]>([]);
  const [isCopied, setIsCopied] = useState<{title: boolean, short: boolean, long: boolean, extra: boolean}>({title: false, short: false, long: false, extra: false});
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<KeywordSuggestion[]>([]);

  useEffect(() => {
    const storedKey = localStorage.getItem('openaiKey');
    if (storedKey) {
      setOpenaiKey(storedKey);
      validateApiKey(storedKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key) {
      setIsValidKey(false);
      return;
    }

    setIsLoadingKey(true);
    try {
      const openaiService = new OpenAIService(key);
      const isValid = await openaiService.validateApiKey();
      setIsValidKey(isValid);

      if (isValid) {
        localStorage.setItem('openaiKey', key);
        toast.success("Clé API OpenAI valide", {
          description: "Vous pouvez maintenant utiliser les fonctionnalités d'IA"
        });
      } else {
        toast.error("Clé API OpenAI invalide", {
          description: "Veuillez vérifier votre clé et réessayer"
        });
      }
    } catch (err) {
      console.error("Erreur lors de la validation de la clé API:", err);
      setIsValidKey(false);
      
      toast.error("Erreur de validation", {
        description: "Impossible de valider la clé API"
      });
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setOpenaiKey(key);
    validateApiKey(key);
  };

  const generateKeywordSuggestions = async (keywordText: string) => {
    if (!keywordText) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    setError(null);
    let suggestions = demoKeywords;
    if (suggestions.length > 0) {
      setGeneratedKeywords(suggestions);
      setHistory(prev => [suggestions[0], ...prev].slice(0, 10));
      setTitle(suggestions[0].suggestedTitle || '');
      setShortDescription(suggestions[0].suggestedShortDescription || suggestions[0].suggestedDescription || '');
      setLongDescription(suggestions[0].suggestedLongDescription || suggestions[0].suggestedDescription || '');
      const base = (suggestions[0].suggestedLongDescription || suggestions[0].suggestedDescription || '');
      if (base.length >= 1000) setExtraDescription(base.slice(0, 1000));
      else setExtraDescription((base + ' ').repeat(10).slice(0, 1000));
    }
    toast.success("Suggestions générées !");
  };

  const copyToClipboard = (text: string, type: 'title' | 'short' | 'long' | 'extra') => {
    navigator.clipboard.writeText(text);
    setIsCopied({
      ...isCopied,
      [type]: true
    });
    toast.success(`${(type === "title" ? "Titre" : type === "short" ? "Description courte" : type === "long" ? "Description longue" : "Description extra-longue")} copié !`);
    setTimeout(() => {
      setIsCopied(prev => ({...prev, [type]: false}));
    }, 1500);
  };

  const colorIndicator = (value: string, max: number) => {
    if (value.length > max) return 'text-red-500';
    if (value.length > max * 0.9) return 'text-yellow-500';
    return 'text-green-500';
  };

  const fillFromHistory = (s: KeywordSuggestion) => {
    setTitle(s.suggestedTitle || '');
    setShortDescription(s.suggestedShortDescription || s.suggestedDescription || '');
    setLongDescription(s.suggestedLongDescription || s.suggestedDescription || '');
    const base = (s.suggestedLongDescription || s.suggestedDescription || '');
    if (base.length >= 1000) setExtraDescription(base.slice(0, 1000));
    else setExtraDescription((base + " ").repeat(10).slice(0, 1000));
    toast.success("Suggestion appliquée !");
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Configuration de la clé API */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Configuration API</h3>
        </div>
        <OpenAIKeyForm 
          apiKey={openaiKey} 
          onSave={handleSaveApiKey} 
          isLoading={isLoadingKey}
          isValid={isValidKey}
        />
        {isValidKey && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Clé API valide. Vous pouvez utiliser toutes les fonctionnalités.
          </div>
        )}
      </Card>

      {/* Génération de mots-clés et meta tags */}
      <Card className="p-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-medium">Génération de meta tags</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Mot-clé principal
            </label>
            <div className="flex space-x-2">
              <Input 
                id="keyword"
                placeholder="seo, marketing digital, etc." 
                value={keyword} 
                onChange={handleKeywordChange}
                className="flex-1"
              />
              <Button
                onClick={() => generateKeywordSuggestions(keyword)}
                className="whitespace-nowrap"
              >
                <FileText className="mr-2 h-4 w-4" />
                Générer
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Entrez un mot-clé principal pour générer des suggestions de titres et descriptions.
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Balise Title (max 60 caractères)
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input 
                  id="title"
                  placeholder="Titre optimisé pour le SEO" 
                  value={title} 
                  onChange={handleTitleChange}
                  className={`pr-10 ${title.length > 60 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-green-300 focus:border-green-500 focus:ring-green-500'}`}
                  maxLength={80}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Button
                    onClick={() => copyToClipboard(title, 'title')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {isCopied.title ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>Le titre apparaît dans les résultats de recherche.</span>
              <span className={`font-medium ${colorIndicator(title, 60)}`}>{title.length}/60</span>
            </p>
          </div>

          {/* Descriptions */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Courte */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta description courte (max 155)
              </label>
              <div className="relative">
                <Textarea
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  maxLength={155}
                  rows={5}
                  className={`resize-none pr-10 ${shortDescription.length > 155 ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}`}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button onClick={() => copyToClipboard(shortDescription, 'short')} variant="ghost" size="icon" className="h-7 w-7">
                    {isCopied.short ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              <span className={`text-xs font-medium ${colorIndicator(shortDescription, 155)}`}>
                {shortDescription.length}/155
              </span>
            </div>
            {/* Longue */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta description longue (max 500)
              </label>
              <div className="relative">
                <Textarea
                  value={longDescription}
                  onChange={e => setLongDescription(e.target.value)}
                  maxLength={500}
                  rows={5}
                  className={`resize-none pr-10 ${longDescription.length > 500 ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}`}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button onClick={() => copyToClipboard(longDescription, 'long')} variant="ghost" size="icon" className="h-7 w-7">
                    {isCopied.long ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              <span className={`text-xs font-medium ${colorIndicator(longDescription, 500)}`}>
                {longDescription.length}/500
              </span>
            </div>
            {/* Extra longue */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta description extra-longue (max 1000)
              </label>
              <div className="relative">
                <Textarea
                  value={extraDescription}
                  onChange={e => setExtraDescription(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  className={`resize-none pr-10 ${extraDescription.length > 1000 ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}`}
                />
                <div className="absolute top-0 right-0 m-2">
                  <Button onClick={() => copyToClipboard(extraDescription, 'extra')} variant="ghost" size="icon" className="h-7 w-7">
                    {isCopied.extra ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>
              <span className={`text-xs font-medium ${colorIndicator(extraDescription, 1000)}`}>
                {extraDescription.length}/1000
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Historique : derniers titres/descriptions générés */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-bold mb-2">Historique des suggestions</h4>
        {history.length === 0
          ? <span className="text-gray-400 text-sm">Aucune suggestion générée pour le moment.</span>
          : (
            <div className="space-y-2">
              {history.map((s, idx) => (
                <div key={idx} className="bg-white p-2 rounded flex justify-between items-center cursor-pointer border hover:bg-blue-50"
                  onClick={() => fillFromHistory(s)}>
                  <div>
                    <span className="font-medium">{s.keyword} </span>
                    <span className="text-xs ml-2 text-gray-500">{(s.suggestedTitle||'').slice(0,40)}</span>
                  </div>
                  <span className="text-xs text-blue-500">Appliquer</span>
                </div>
              ))}
            </div>
          )}
      </Card>

      {/* Suggestions détails */}
      <KeywordSuggestions
        generatedKeywords={generatedKeywords}
        onGenerateClick={() => generateKeywordSuggestions(keyword)}
        fieldValue={title}
        onInsert={setTitle}
        maxLength={60}
        descriptionValue={shortDescription}
        onInsertDescription={setShortDescription}
        maxLengthDescription={155}
        descriptionType={'short'}
      />
    </div>
  );
};

export default KeywordTabContent;
