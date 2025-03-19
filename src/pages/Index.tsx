
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Search, Signature } from "lucide-react";
import { Github } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { MessageSquareText } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/dashboard/PageHeader';
import TabNavigation from '@/components/dashboard/TabNavigation';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import InfoCards from '@/components/seo/InfoCards';

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 py-3 bg-white border-b">
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
      
      <main className="container py-8 flex-grow">
        {/* Dashboard header with overview info */}
        <PageHeader />
        
        {/* Navigation tabs */}
        <TabNavigation />
        
        {/* Feature grid showing main tool options */}
        <FeatureGrid />
        
        {/* Info cards with SEO performance metrics */}
        <InfoCards />
        
        {/* Quora Button Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Nouveau : Assistant Quora</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Créez du contenu optimisé pour Quora avec notre générateur IA. Produisez des réponses détaillées de plus de 500 mots pour maximiser votre visibilité et votre autorité.
            </p>
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
        
        {/* Signature Button Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Signature Email Professionnelle</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Créez une signature email professionnelle personnalisée avec notre générateur interactif. Ajoutez votre logo, choisissez vos couleurs et téléchargez votre signature.
            </p>
            <Link to="/SignaturePage">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
              >
                <Signature className="mr-2 h-5 w-5" />
                Créer ma Signature Email
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="px-4 py-8 border-t bg-white">
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
