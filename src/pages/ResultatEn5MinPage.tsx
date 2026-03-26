import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Shield, Play, BookOpen, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackDemoClick } from '@/utils/analytics';

const ResultatEn5MinPage: React.FC = () => {
  const navigate = useNavigate();

  const planChapitres = [
    "Introduction : pourquoi l'ebook reste rentable en 2026",
    "Choisir un sujet qui se vend",
    "Structurer un ebook clair et logique",
    "Rédiger rapidement sans blocage",
    "Publier et vendre son ebook",
    "Conclusion et prochaines étapes"
  ];

  const pourToi = [
    "tu veux créer un ebook sans partir de zéro",
    "tu veux un plan clair immédiatement",
    "tu veux publier plus vite, sans te compliquer la vie"
  ];

  const pasPourToi = [
    "tu veux écrire entièrement à la main",
    "tu n'as aucune idée de sujet",
    "tu ne comptes pas publier"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-violet-50/30 to-background dark:from-background dark:via-violet-950/20 dark:to-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* BLOC 1 — PROMESSE CLAIRE */}
        <section className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Voici ce que le générateur produit en 5 minutes
            <span className="block text-xl md:text-2xl font-normal text-muted-foreground mt-3">
              (avant toute inscription)
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Pas une promesse. <strong className="text-foreground">Un exemple réel.</strong>
            <br />
            Tu juges le résultat avant d'aller plus loin.
          </p>
        </section>

        {/* BLOC 2 — EXEMPLE DE RÉSULTAT */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            <BookOpen className="inline-block w-8 h-8 mr-3 text-violet-500" />
            Exemple : Ebook "Créer un revenu avec un ebook"
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan généré */}
            <Card className="border-violet-200 dark:border-violet-800 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-violet-500" />
                  <h3 className="font-semibold text-lg text-foreground">Plan généré automatiquement :</h3>
                </div>
                <ul className="space-y-3">
                  {planChapitres.map((chapitre, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{chapitre}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Extrait de chapitre */}
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-lg text-foreground">Extrait de chapitre généré :</h3>
                </div>
                <blockquote className="text-muted-foreground italic border-l-4 border-emerald-400 pl-4 py-2 bg-white/50 dark:bg-black/20 rounded-r-lg">
                  "Créer un ebook rentable ne demande pas d'être écrivain.
                  <br /><br />
                  La clé est d'avoir une structure claire, un objectif précis et une méthode simple.
                  <br /><br />
                  Dans ce chapitre, nous allons poser les bases pour passer de l'idée à un contenu concret…"
                </blockquote>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Aperçu généré en quelques secondes
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* BLOC 3 — CTA DÉMO GRATUITE */}
        <section className="text-center mb-12">
          <Button 
            size="lg" 
            className="text-lg md:text-xl px-10 py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => {
              trackDemoClick("Accéder à la démo gratuite");
              navigate('/demo');
            }}
          >
            <Play className="w-6 h-6 mr-3" />
            Accéder à la démo gratuite
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Accès immédiat • Sans carte bancaire • Tu vois le résultat avant de décider
          </p>
        </section>

        {/* BLOC 4 — GARANTIE */}
        <section className="mb-16">
          <Card className="border-emerald-300 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <Shield className="w-10 h-10 text-emerald-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    ✅ Garantie satisfait ou remboursé 30 jours
                  </h3>
                  <p className="text-muted-foreground">
                    Teste EbookStudio Pro en conditions réelles.
                    <br />
                    Si ce n'est pas pour toi, tu demandes le remboursement, <strong>sans discussion.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* BLOC 5 — POUR QUI / PAS POUR QUI */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pour toi */}
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                  ✅ Pour toi si :
                </h3>
                <ul className="space-y-3">
                  {pourToi.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pas pour toi */}
            <Card className="border-red-200 dark:border-red-800/50">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                  ❌ Pas pour toi si :
                </h3>
                <ul className="space-y-3">
                  {pasPourToi.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* BLOC 6 — RAPPEL OFFRE DISCRET */}
        <section className="text-center py-8 border-t border-border/50">
          <p className="text-muted-foreground mb-4">
            <strong className="text-foreground">Offre actuelle :</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
              37 € pour les 20 premiers
            </span>
            <span className="px-4 py-2 bg-muted rounded-full">
              puis 37 €
            </span>
            <span className="px-4 py-2 bg-muted rounded-full">
              67 € pour l'accès complet
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Tu peux tester la <button onClick={() => { trackDemoClick("démo gratuite - footer"); navigate('/demo'); }} className="text-violet-600 dark:text-violet-400 underline hover:no-underline">démo gratuite</button> avant toute décision.
          </p>
        </section>

      </div>
    </div>
  );
};

export default ResultatEn5MinPage;
