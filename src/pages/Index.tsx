
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Search } from "lucide-react";
import { Github } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';

const ModeToggle = () => {
  return (
    <Button variant="outline" size="icon">
      <span className="sr-only">Toggle theme</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    </Button>
  );
};

const IndexPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 py-3 border-b">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold">SEO-GPT</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <ModeToggle />
            <a href="https://github.com/your-github-repo" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>
      <main className="container pt-12 pb-24 flex-grow">
        <section className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Boostez Votre SEO avec l'IA
            </h1>
            <p className="max-w-[700px] mx-auto text-gray-500 md:text-lg leading-relaxed">
              Bienvenue sur SEO-GPT, votre assistant SEO alimenté par l'intelligence artificielle.
              Optimisez votre contenu, analysez vos performances et surpassez vos concurrents.
            </p>
            <div className="mt-6">
              <Link to="/QuoraPage">
                <Button 
                  className="bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] hover:from-[#a72724] hover:to-[#7849e0] text-white"
                >
                  <MessageSquareText className="mr-2 h-5 w-5" />
                  Créer du Contenu Quora (500+ mots)
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-neutral-950 shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Générateur de Contenu</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Créez du contenu SEO optimisé en quelques secondes. Articles de blog, descriptions de produits, et bien plus encore.
                </p>
                <Link to="/content-generator">
                  <Button variant="secondary" className="w-full">
                    Découvrir
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-neutral-950 shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Search className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">Analyse de Site Web</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analysez la structure, le contenu et les performances de votre site web pour identifier les points à améliorer.
                </p>
                <Link to="/website-analyzer">
                  <Button variant="secondary" className="w-full">
                    Analyser
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-neutral-950 shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Rocket className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold">Assistant Quora</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Générez des questions et réponses optimisées pour Quora et attirez un trafic qualifié vers votre site.
                </p>
                <Link to="/QuoraPage">
                  <Button variant="secondary" className="w-full">
                    Optimiser
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="px-4 py-8 border-t">
        <div className="container text-center text-gray-500">
          <p className="text-sm">
            © {new Date().getFullYear()} SEO-GPT. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
