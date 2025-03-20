
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import QuoraButton from "@/components/seo/buttons/QuoraButton";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, 
  MessageSquareText, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Award, 
  ArrowLeft, 
  FileText,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

const QuoraPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* === HEADER SECTION === */}
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-6 w-6 text-[#b92b27]" />
              <h1 className="text-2xl font-bold tracking-tight">Assistant Quora</h1>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1">
        <div className="container py-6">
          {/* Introduction Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Créer du contenu pour Quora</h2>
            <p className="text-muted-foreground mb-4">
              Créez du contenu optimisé pour Quora et augmentez votre autorité en ligne
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#b92b27]" />
                <span className="font-medium">Créez des réponses de 200-300 mots pour un impact optimal</span>
              </div>
              <div className="flex gap-2">
                <QuoraButton />
              </div>
            </div>
            
            <div className="bg-[#b92b27]/10 p-4 rounded-lg border border-[#b92b27]/20 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#b92b27] mt-1" />
                <div>
                  <h3 className="font-semibold">Contenu optimisé pour Quora</h3>
                  <p className="text-sm">Notre générateur produit des réponses Quora concises mais détaillées, avec des références, des exemples concrets et une structure optimisée pour maximiser l'engagement.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Benefits Cards Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Bénéfices de Quora pour votre visibilité</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <span>Visibilité</span>
                  </CardTitle>
                  <CardDescription>Augmentez votre exposition</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Quora reçoit plus de 300 millions de visiteurs uniques par mois, offrant une opportunité unique d'exposition et de génération de trafic.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>Autorité</span>
                  </CardTitle>
                  <CardDescription>Établissez votre expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Positionnez-vous comme un expert dans votre domaine en fournissant des réponses détaillées et informatives à des questions pertinentes.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Trafic Qualifié</span>
                  </CardTitle>
                  <CardDescription>Attirez des visiteurs ciblés</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Générez du trafic qualifié vers votre site en incluant stratégiquement des liens pertinents dans vos réponses Quora.</p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Best Practices Tabs Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Guide des bonnes pratiques</h2>
            <Tabs defaultValue="strategies" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="strategies">Stratégies Quora</TabsTrigger>
                <TabsTrigger value="examples">Exemples Réussis</TabsTrigger>
                <TabsTrigger value="tips">Conseils Avancés</TabsTrigger>
              </TabsList>
              
              <TabsContent value="strategies" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Cibler les questions pertinentes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Recherchez des questions qui correspondent à votre domaine d'expertise et qui sont susceptibles d'attirer votre audience cible.</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Utilisez les filtres de recherche pour trouver des questions récentes</li>
                        <li>Concentrez-vous sur les questions avec peu de réponses pour maximiser la visibilité</li>
                        <li>Abonnez-vous à des sujets pertinents pour être notifié des nouvelles questions</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Créer des réponses de qualité</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Les réponses détaillées, informatives et bien structurées obtiennent plus de vues et d'upvotes.</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Commencez par un paragraphe d'introduction accrocheur</li>
                        <li>Structurez votre réponse avec des sous-titres et des listes</li>
                        <li>Incluez des données, statistiques et exemples concrets</li>
                        <li>Ajoutez une conclusion avec un appel à l'action subtil</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>Calendrier de publication optimal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Fréquence</th>
                            <th className="text-left py-2 px-4">Meilleur moment</th>
                            <th className="text-left py-2 px-4">Avantages</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-4">Quotidien</td>
                            <td className="py-2 px-4">8h-10h ou 19h-21h</td>
                            <td className="py-2 px-4">Visibilité maximale, croissance rapide</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4">3-4 fois/semaine</td>
                            <td className="py-2 px-4">Mardi et jeudi matin</td>
                            <td className="py-2 px-4">Équilibre entre qualité et quantité</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4">1 fois/semaine</td>
                            <td className="py-2 px-4">Dimanche soir</td>
                            <td className="py-2 px-4">Réponses très détaillées et recherchées</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-start gap-2">
                      <Award className="h-5 w-5 text-[#b92b27] mt-1" />
                      <div>
                        <CardTitle className="text-lg">Exemple 1: Réponse virale</CardTitle>
                        <CardDescription>42K vues, 837 upvotes</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium">Q: Quelles sont les stratégies SEO les plus efficaces pour un nouveau site web en 2023?</p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <p>Après avoir lancé plus de 50 sites web et analysé leur performance SEO, voici ce qui fonctionne réellement en 2023:</p>
                        <p className="mt-2">1. <strong>Contenu E-E-A-T optimisé</strong> - Google met désormais l'accent sur l'Expertise, l'Expérience, l'Autorité et la Fiabilité...</p>
                        <p className="italic text-xs mt-2">[Réponse tronquée pour l'exemple]</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Pourquoi ça fonctionne: Approche basée sur l'expérience, données concrètes, structure claire
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-start gap-2">
                      <Award className="h-5 w-5 text-[#b92b27] mt-1" />
                      <div>
                        <CardTitle className="text-lg">Exemple 2: Génération de trafic</CardTitle>
                        <CardDescription>18K vues, 412 upvotes, 280 clics</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium">Q: Comment créer un plan marketing digital efficace avec un budget limité?</p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <p>Un plan marketing digital efficace ne nécessite pas forcément un budget conséquent. Voici comment j'ai aidé une startup à générer plus de 100K€ avec seulement 5K€ de budget marketing:</p>
                        <p className="mt-2">Étape 1: <strong>Audit et analyse</strong> - Avant tout investissement, comprendre précisément où se trouve votre audience...</p>
                        <p className="italic text-xs mt-2">[Réponse tronquée pour l'exemple]</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Pourquoi ça fonctionne: Histoire concrète, plan étape par étape, lien naturel vers une ressource
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Éléments communs des réponses performantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="font-medium text-blue-700 mb-2">Structure</h3>
                        <ul className="space-y-1 text-sm">
                          <li>Introduction accrocheuse</li>
                          <li>Points principaux clairement identifiés</li>
                          <li>Sous-titres pour faciliter la lecture</li>
                          <li>Conclusion mémorable</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-md">
                        <h3 className="font-medium text-green-700 mb-2">Contenu</h3>
                        <ul className="space-y-1 text-sm">
                          <li>Informations originales</li>
                          <li>Exemples concrets et chiffres</li>
                          <li>Expertise personnelle partagée</li>
                          <li>Réponse complète à la question</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-md">
                        <h3 className="font-medium text-purple-700 mb-2">Engagement</h3>
                        <ul className="space-y-1 text-sm">
                          <li>Style conversationnel</li>
                          <li>Utilisation judicieuse du formatage</li>
                          <li>Citations et références</li>
                          <li>Questions rhétoriques</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tips" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span>Optimisation du profil</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Un profil optimisé augmente considérablement la crédibilité de vos réponses.</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Bio professionnelle</strong> - Mettez en avant votre expertise et vos réalisations</li>
                        <li><strong>Photo de qualité</strong> - Utilisez une photo professionnelle avec un bon éclairage</li>
                        <li><strong>Créneaux d'expertise</strong> - Définissez clairement vos domaines de compétence</li>
                        <li><strong>Liens pertinents</strong> - Ajoutez des liens vers votre site, blog ou réseaux sociaux</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span>Analyse des performances</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Suivez et analysez régulièrement les performances de vos réponses pour optimiser votre stratégie.</p>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Vues et upvotes</strong> - Identifiez les sujets et formats qui génèrent le plus d'engagement</li>
                        <li><strong>Taux de clics</strong> - Mesurez l'efficacité de vos liens avec Google Analytics</li>
                        <li><strong>Questions connexes</strong> - Repérez les opportunités de répondre à des questions similaires</li>
                        <li><strong>Commentaires</strong> - Utilisez les feedbacks pour améliorer vos futures réponses</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Techniques avancées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Storytelling stratégique</h3>
                        <p className="text-sm">Intégrez des histoires personnelles et des études de cas dans vos réponses pour créer une connexion émotionnelle avec les lecteurs et renforcer votre crédibilité.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Réutilisation de contenu</h3>
                        <p className="text-sm">Adaptez le contenu existant de votre blog ou site web pour créer des réponses Quora détaillées, maximisant ainsi l'impact de votre contenu.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Réseautage stratégique</h3>
                        <p className="text-sm">Suivez et interagissez avec des influenceurs de votre niche sur Quora pour augmenter votre visibilité et construire des relations professionnelles.</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Questions et réponses</h3>
                        <p className="text-sm">Posez des questions pertinentes à votre expertise puis répondez-y de manière détaillée pour créer un contenu contrôlé qui met en valeur votre expertise.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      
      {/* === FOOTER SECTION === */}
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SEO-GPT. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Tableau de bord</Link>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Confidentialité</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Conditions d'utilisation</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuoraPage;
