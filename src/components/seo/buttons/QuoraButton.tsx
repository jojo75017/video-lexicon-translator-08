
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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ClipboardCopy, HelpCircle, MessageSquare, Search, Copy, CheckIcon } from 'lucide-react';
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
            
            <TabsContent value="search" className="flex-1">
              <form onSubmit={searchForm.handleSubmit(onSearch as any)}>
                <FormField
                  control={searchForm.control}
                  name="searchQuery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rechercher sur Quora</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Ex: référencement, seo, backlinks..."
                            {...field}
                          />
                        </FormControl>
                        <Button type="submit" disabled={isSearching}>
                          {isSearching ? "Recherche..." : "Rechercher"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
              
              <ScrollArea className="h-[400px] mt-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <Card key={result.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-medium mb-2">{result.question}</h3>
                              <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                                <span>{result.answerCount} réponses</span>
                                <span>{result.viewCount} vues</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyQuestion(result.question)}
                              className="h-8"
                            >
                              <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                              Copier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isSearching ? (
                      <p>Recherche en cours...</p>
                    ) : (
                      <p>Utilisez le champ de recherche ci-dessus pour trouver des questions</p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="create" className="flex-1">
              <form onSubmit={responseForm.handleSubmit(onCreateResponse as any)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FormField
                      control={responseForm.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Saisissez ou collez ici la question Quora"
                              className="h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormField
                      control={responseForm.control}
                      name="authorBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biographie de l'auteur (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Votre expertise ou expérience dans ce domaine"
                              className="h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Utilisée pour personnaliser votre réponse
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">Templates de réponse</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                  {responseTemplates.map((template) => (
                    <Button
                      key={template.id}
                      type="button"
                      variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                      className="h-auto py-2 px-3 justify-start"
                      onClick={() => applyTemplate(template)}
                    >
                      <span className="text-left text-sm font-normal">{template.title}</span>
                    </Button>
                  ))}
                </div>
                
                <FormField
                  control={responseForm.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre réponse</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Rédigez votre réponse ici..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Générer la réponse</Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="help" className="flex-1">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Conseils pour les réponses Quora</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Assurez-vous que votre réponse apporte réellement de la valeur</li>
                        <li>Utilisez un format facile à lire avec des paragraphes courts</li>
                        <li>Incluez des listes à puces ou numérotées quand c'est pertinent</li>
                        <li>Utilisez votre expertise personnelle ou professionnelle</li>
                        <li>Incluez des références et des sources fiables</li>
                        <li>Évitez le jargon inutile et les termes trop techniques</li>
                        <li>Concluez avec une invitation à l'interaction</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Structure recommandée</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">1. Introduction</h4>
                          <p className="text-sm text-gray-600">
                            Répondez directement à la question, établissez votre crédibilité.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">2. Corps de la réponse</h4>
                          <p className="text-sm text-gray-600">
                            Développez votre argumentation point par point, utilisez des exemples.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">3. Conclusion</h4>
                          <p className="text-sm text-gray-600">
                            Résumez votre réponse, ajoutez une touche personnelle.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <h4 className="text-sm font-medium mb-2">Exemple de bonne réponse</h4>
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">
                            <strong>Question :</strong> Comment améliorer le SEO d'un site WordPress ?
                          </p>
                          <p className="mb-2">
                            <strong>Réponse :</strong>
                          </p>
                          <div className="pl-4 border-l-2 border-gray-300 py-1">
                            <p className="mb-2">
                              Après avoir optimisé plus de 50 sites WordPress, je peux vous confirmer que ces 3 techniques sont essentielles :
                            </p>
                            <ol className="list-decimal pl-5 mb-2 space-y-1">
                              <li>Installez un plugin SEO comme Yoast ou Rank Math qui vous guidera pour chaque page</li>
                              <li>Optimisez la vitesse de chargement avec un bon hébergement et un plugin de cache</li>
                              <li>Créez du contenu de qualité qui répond aux questions de votre audience</li>
                            </ol>
                            <p>
                              La clé est de rester cohérent. J'ai vu des sites doubler leur trafic en 3 mois simplement en appliquant ces principes de base.
                            </p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(
                              "Après avoir optimisé plus de 50 sites WordPress, je peux vous confirmer que ces 3 techniques sont essentielles :\n\n1. Installez un plugin SEO comme Yoast ou Rank Math qui vous guidera pour chaque page\n2. Optimisez la vitesse de chargement avec un bon hébergement et un plugin de cache\n3. Créez du contenu de qualité qui répond aux questions de votre audience\n\nLa clé est de rester cohérent. J'ai vu des sites doubler leur trafic en 3 mois simplement en appliquant ces principes de base.",
                              "example"
                            )}
                            className="text-xs flex items-center mt-2 text-blue-600 hover:text-blue-800"
                          >
                            {copiedId === "example" ? (
                              <>
                                <CheckIcon className="h-3 w-3 mr-1" />
                                Copié !
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copier cet exemple
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
