
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Search, BarChart, ChevronRight, Globe } from "lucide-react";
import { Github } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import GrilleFonctionnalites from '@/components/accueil/GrilleFonctionnalites';
import EnteteAccueil from '@/components/accueil/EnteteAccueil';
import AnalyseSiteForm from '@/components/seo/analyse/AnalyseSiteForm';
import SectionEntreprisesLocales from '@/components/SectionEntreprisesLocales';

const ModeToggle = () => {
  return (
    <Button variant="outline" size="icon">
      <span className="sr-only">Changer le thème</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    </Button>
  );
};

const Accueil = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">SEO Expert</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/seo" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Outils SEO
            </Link>
            <ModeToggle />
            <a href="https://github.com/your-github-repo" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </header>
      
      <main className="container py-8 flex-grow">
        <EnteteAccueil />
        
        <div className="mb-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Bienvenue sur votre plateforme SEO intelligente
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Optimisez votre présence en ligne grâce à nos outils d'analyse avancés et nos recommandations personnalisées.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                <div className="text-indigo-600 mb-2">
                  <Search className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Analyse complète</h3>
                <p className="text-sm text-gray-600">
                  Évaluez tous les aspects techniques et sémantiques de votre site
                </p>
              </div>
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                <div className="text-purple-600 mb-2">
                  <BarChart className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Rapports détaillés</h3>
                <p className="text-sm text-gray-600">
                  Visualisez vos performances et suivez vos progrès
                </p>
              </div>
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="text-blue-600 mb-2">
                  <Sparkles className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">IA intégrée</h3>
                <p className="text-sm text-gray-600">
                  Bénéficiez de recommandations intelligentes pour optimiser votre SEO
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/seo">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Découvrir tous nos outils
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Search className="mr-2 h-6 w-6 text-indigo-600" />
                Analysez votre site
              </h2>
              <AnalyseSiteForm />
            </div>
          </Card>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Globe className="mr-2 h-6 w-6 text-indigo-600" />
            Nos outils SEO professionnels
          </h2>
          <GrilleFonctionnalites />
        </div>
        
        <SectionEntreprisesLocales />
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">SEO Expert</h3>
              <p className="text-gray-300 mb-4">
                Solutions professionnelles pour améliorer votre référencement naturel et votre visibilité en ligne.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link to="/seo" className="text-gray-300 hover:text-white">Outils SEO</Link></li>
                <li><Link to="/quora" className="text-gray-300 hover:text-white">Quora</Link></li>
                <li><Link to="/signature" className="text-gray-300 hover:text-white">Signature</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-300">
                Vous avez des questions? N'hésitez pas à nous contacter.
              </p>
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                Nous contacter
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} SEO Expert. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Accueil;
