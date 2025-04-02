
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ClipboardCopy, HelpCircle, MessageSquare, Search, Copy, CheckIcon, RefreshCw } from 'lucide-react';
import { toast } from "sonner";

// Définition du schéma de validation pour la recherche
const searchFormSchema = z.object({
  searchQuery: z
    .string()
    .min(3, {
      message: "La recherche doit contenir au moins 3 caractères",
    })
    .max(100, {
      message: "La recherche ne peut pas dépasser 100 caractères",
    }),
});

// Définition du schéma de validation pour la création de réponse
const responseFormSchema = z.object({
  question: z
    .string()
    .min(10, {
      message: "La question doit contenir au moins 10 caractères",
    })
    .max(200, {
      message: "La question ne peut pas dépasser 200 caractères",
    }),
  answer: z
    .string()
    .min(50, {
      message: "La réponse doit contenir au moins 50 caractères",
    })
    .max(5000, {
      message: "La réponse ne peut pas dépasser 5000 caractères",
    }),
  authorBio: z
    .string()
    .max(500, {
      message: "La bio ne peut pas dépasser 500 caractères",
    })
    .optional(),
});

// Type pour les résultats de recherche Quora
interface QuoraResult {
  id: string;
  question: string;
  url: string;
  answerCount: number;
  viewCount: number;
}

interface QuoraTemplate {
  id: string;
  title: string;
  content: string;
}

// Exemples de résultats de recherche Quora
const mockQuoraResults: QuoraResult[] = [
  {
    id: "1",
    question: "Quels sont les meilleurs outils pour améliorer le référencement d'un site web en 2023 ?",
    url: "https://fr.quora.com/quels-meilleurs-outils-referencement-2023",
    answerCount: 8,
    viewCount: 2345
  },
  {
    id: "2",
    question: "Comment optimiser le contenu d'un site web pour le SEO ?",
    url: "https://fr.quora.com/comment-optimiser-contenu-site-web-seo",
    answerCount: 12,
    viewCount: 3678
  },
  {
    id: "3",
    question: "Quelle est l'importance des balises meta pour le référencement ?",
    url: "https://fr.quora.com/importance-balises-meta-referencement",
    answerCount: 5,
    viewCount: 1890
  },
  {
    id: "4",
    question: "Comment analyser efficacement les backlinks d'un site web ?",
    url: "https://fr.quora.com/comment-analyser-backlinks-site-web",
    answerCount: 6,
    viewCount: 2100
  },
  {
    id: "5",
    question: "Quelle est la meilleure stratégie de mots-clés en 2023 ?",
    url: "https://fr.quora.com/meilleure-strategie-mots-cles-2023",
    answerCount: 9,
    viewCount: 2876
  }
];

// Exemples de templates de réponses
const responseTemplates: QuoraTemplate[] = [
  {
    id: "template1",
    title: "Réponse détaillée avec sources",
    content: `Voici une analyse approfondie de cette question :

1. **Point principal 1**
   * Sous-point avec explication
   * Exemple concret et application

2. **Point principal 2**
   * Explications détaillées
   * Statistiques pertinentes

3. **Point principal 3**
   * Conseils pratiques
   * Étapes à suivre

Sources :
- [Source 1](https://exemple.com)
- [Source 2](https://exemple.com)

J'espère que cela répond à votre question !`
  },
  {
    id: "template2",
    title: "Réponse concise et efficace",
    content: `Pour répondre simplement à cette question :

✅ Élément 1 : brève explication
✅ Élément 2 : brève explication
✅ Élément 3 : brève explication

Le point essentiel à retenir est que [insérer conclusion].

N'hésitez pas à me demander des précisions si nécessaire.`
  },
  {
    id: "template3",
    title: "Réponse basée sur l'expérience",
    content: `D'après mon expérience dans ce domaine depuis plus de 10 ans :

La meilleure approche que j'ai trouvée est de [explication]. J'ai pu constater que [résultat] après avoir mis en place cette stratégie pour plusieurs clients.

Un exemple concret : [partager une étude de cas].

Les erreurs à éviter sont [liste d'erreurs].

Je reste disponible pour échanger davantage sur ce sujet passionnant.`
  }
];

export function QuoraButton() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<QuoraResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuoraTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedQuestion, setGeneratedQuestion] = useState("");
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  // Configuration du formulaire de recherche
  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  // Configuration du formulaire de création de réponse
  const responseForm = useForm<z.infer<typeof responseFormSchema>>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      authorBio: "",
    },
  });

  // Gestion de la recherche
  const onSearch = async (data: z.infer<typeof searchFormSchema>) => {
    setIsSearching(true);
    
    // Simulation d'une recherche
    console.log("Recherche Quora:", data.searchQuery);
    
    // Pour la démo, on utilise les résultats mockés
    setTimeout(() => {
      setSearchResults(mockQuoraResults);
      setIsSearching(false);
    }, 1000);
  };

  // Générer une question avec l'IA
  const generateQuestion = () => {
    setIsGeneratingQuestion(true);
    
    // Simulation de génération par IA
    setTimeout(() => {
      const generatedQuestions = [
        "Comment optimiser une stratégie de content marketing pour améliorer le SEO d'un site e-commerce ?",
        "Quelles sont les meilleures pratiques pour améliorer le taux de conversion d'un site web en 2024 ?",
        "Comment mesurer efficacement le ROI de ses campagnes SEO et content marketing ?",
        "Quels sont les outils indispensables pour analyser la performance d'un site web ?",
        "Comment structurer un blog d'entreprise pour maximiser son impact SEO ?"
      ];
      
      const randomIndex = Math.floor(Math.random() * generatedQuestions.length);
      setGeneratedQuestion(generatedQuestions[randomIndex]);
      responseForm.setValue("question", generatedQuestions[randomIndex]);
      setIsGeneratingQuestion(false);
      toast.success("Question générée avec succès");
    }, 1500);
  };

  // Générer une réponse avec l'IA
  const generateAnswer = () => {
    const question = responseForm.getValues("question");
    
    if (!question) {
      toast.error("Veuillez d'abord saisir ou générer une question");
      return;
    }
    
    setIsGeneratingAnswer(true);
    
    // Simulation de génération par IA
    setTimeout(() => {
      const answer = `Voici ma réponse détaillée à la question "${question}":

## Points essentiels à considérer

1. **Analyse préliminaire**
   * Identifiez vos objectifs précis et les indicateurs de performance associés
   * Effectuez un audit complet de votre situation actuelle
   * Étudiez vos concurrents directs et indirects

2. **Stratégie optimale**
   * Développez un plan d'action en 3 phases (court, moyen et long terme)
   * Priorisez les actions à fort impact et faible investissement initial
   * Intégrez des mécanismes de mesure et d'ajustement continus

3. **Mise en œuvre pratique**
   * Commencez par implémenter [détail spécifique lié à la question]
   * Utilisez des outils comme [exemples pertinents]
   * Mesurez régulièrement vos résultats avec [métriques appropriées]

En conclusion, l'approche la plus efficace combine une vision stratégique claire et une exécution méthodique. D'après mon expérience avec plusieurs clients dans ce domaine, vous pouvez vous attendre à des résultats significatifs dans un délai de 3 à 6 mois en suivant ces recommandations.

N'hésitez pas à me demander des précisions sur n'importe lequel de ces points.`;
      
      setGeneratedAnswer(answer);
      responseForm.setValue("answer", answer);
      setIsGeneratingAnswer(false);
      toast.success("Réponse générée avec succès");
    }, 2000);
  };

  // Gestion de la création de réponse
  const onCreateResponse = (data: z.infer<typeof responseFormSchema>) => {
    console.log("Réponse Quora créée:", data);
    
    // Afficher un message de succès
    toast.success("Réponse Quora créée", {
      description: "Votre réponse a été générée avec succès"
    });
    
    // Fermer la modal
    setOpen(false);
  };

  // Appliquer un template
  const applyTemplate = (template: QuoraTemplate) => {
    responseForm.setValue("answer", template.content);
    setSelectedTemplate(template);
    toast.success(`Template "${template.title}" appliqué`);
  };

  // Copier une question
  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question)
      .then(() => {
        responseForm.setValue("question", question);
        setActiveTab("create");
        toast.success("Question copiée", {
          description: "La question a été copiée dans le formulaire de réponse"
        });
      })
      .catch(() => {
        toast.error("Erreur de copie", {
          description: "Impossible de copier la question"
        });
      });
  };

  // Copier une réponse
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success("Copié dans le presse-papier");
      })
      .catch(() => {
        toast.error("Erreur lors de la copie");
      });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Quora
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Assistant Quora</DialogTitle>
            <DialogDescription>
              Recherchez des questions sur Quora ou créez des réponses optimisées pour la plateforme.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="search" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Rechercher des questions
              </TabsTrigger>
              <TabsTrigger value="create" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Créer une réponse
              </TabsTrigger>
              <TabsTrigger value="help" className="flex-1">
                <HelpCircle className="h-4 w-4 mr-2" />
                Aide
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="flex-1 overflow-hidden">
              <form onSubmit={searchForm.handleSubmit(onSearch)}>
                <FormField
                  control={searchForm.control}
                  name="searchQuery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rechercher sur Quora</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Ex: référencement, marketing digital..." {...field} />
                        </FormControl>
                        <Button type="submit" disabled={isSearching}>
                          {isSearching ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              <span>Recherche...</span>
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-4 w-4" />
                              <span>Rechercher</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
              
              <div className="mt-4 overflow-auto">
                {searchResults.length > 0 ? (
                  <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                    <div className="space-y-3">
                      {searchResults.map((result) => (
                        <Card key={result.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="mb-2">
                              <h3 className="font-medium text-blue-600">{result.question}</h3>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span>{result.answerCount} réponses</span>
                                <span>{result.viewCount} vues</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline"
                              >
                                Voir sur Quora
                              </a>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyQuestion(result.question)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Répondre
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchForm.getValues("searchQuery")
                      ? isSearching 
                        ? "Recherche en cours..." 
                        : "Aucun résultat trouvé. Essayez d'autres mots clés."
                      : "Entrez des mots clés pour rechercher des questions sur Quora."}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="flex-1 overflow-hidden">
              <Form {...responseForm}>
                <form onSubmit={responseForm.handleSubmit(onCreateResponse)} className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel>Question</FormLabel>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={generateQuestion}
                        disabled={isGeneratingQuestion}
                      >
                        {isGeneratingQuestion ? (
                          <>
                            <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                            <span>Génération...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="mr-2 h-3 w-3" />
                            <span>Générer une question</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <FormField
                      control={responseForm.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Posez une question ou utilisez la génération automatique..." 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel>Réponse</FormLabel>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={generateAnswer}
                          disabled={isGeneratingAnswer}
                        >
                          {isGeneratingAnswer ? (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              <span>Génération...</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="mr-2 h-3 w-3" />
                              <span>Générer une réponse</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <FormField
                      control={responseForm.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Rédigez votre réponse ou utilisez un modèle..." 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <FormLabel>Templates de réponses</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {responseTemplates.map((template) => (
                        <Card 
                          key={template.id} 
                          className={`cursor-pointer ${selectedTemplate?.id === template.id ? 'border-primary' : ''}`}
                          onClick={() => applyTemplate(template)}
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm mb-1">{template.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{template.content.substring(0, 100)}...</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-[#b92b27] hover:bg-[#a42521]">
                      Publier sur Quora
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="help" className="flex-1">
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Comment utiliser l'assistant Quora ?</h3>
                    <p className="text-gray-600 mb-4">
                      Cet outil vous permet de rechercher des questions existantes sur Quora ou de créer des réponses optimisées pour la plateforme.
                    </p>
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium">Recherche de questions</h4>
                        <p className="text-sm text-gray-600">Utilisez l'onglet "Rechercher des questions" pour trouver des questions pertinentes sur Quora auxquelles vous pourriez répondre.</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium">Création de réponses</h4>
                        <p className="text-sm text-gray-600">Utilisez l'onglet "Créer une réponse" pour rédiger des réponses optimisées. Vous pouvez utiliser des templates prédéfinis ou générer automatiquement des réponses.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Bonnes pratiques sur Quora</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>Répondez de manière objective et factuelle</li>
                      <li>Incluez des exemples concrets et des sources fiables</li>
                      <li>Structurez votre réponse avec des sous-titres et des listes</li>
                      <li>Écrivez dans un style conversationnel et accessible</li>
                      <li>Évitez la promotion excessive de vos produits ou services</li>
                      <li>Restez concis tout en étant informatif (200-300 mots idéalement)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Conseils pour maximiser la visibilité</h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Répondez rapidement aux questions récentes pour avoir plus de chances d'être visible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Incluez des images ou des graphiques pertinents dans vos réponses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Répondez régulièrement pour construire votre réputation sur la plateforme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Utilisez un ton amical et conversationnel qui engage le lecteur</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <p className="text-xs text-gray-500">
              Utilisez cet assistant pour trouver des questions pertinentes et créer des réponses optimisées pour Quora.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
