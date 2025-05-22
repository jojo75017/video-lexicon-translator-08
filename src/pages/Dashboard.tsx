import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Link2, FileSpreadsheet, Search, Globe, CheckCircle2, Text } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-teal-500 font-medium text-sm flex items-center">
          <Globe className="h-4 w-4 mr-1" />
          Accueil
        </Link>
        <span className="text-gray-500 font-bold">Dashboard SEO</span>
      </div>
      
      {/* URL et Indexabilité - BOUTON TRÈS VISIBLE */}
      <div className="mb-6 bg-pink-100 p-4 rounded-lg border-2 border-pink-400 shadow-md">
        <Link to="/indexability" className="flex flex-col items-center justify-center">
          <Search className="h-12 w-12 text-pink-500 mb-2" />
          <span className="text-xl font-bold text-pink-600 uppercase">VÉRIFIER VOTRE URL ET INDEXABILITÉ</span>
          <span className="text-sm text-pink-500 mt-1">Cliquez ici pour tester l'accessibilité de votre site</span>
        </Link>
      </div>
      
      {/* Compteur de mots - BOUTON TRÈS VISIBLE */}
      <div className="mb-6 bg-orange-100 p-4 rounded-lg border-2 border-orange-400 shadow-md animate-pulse">
        <Link to="/word-count" className="flex flex-col items-center justify-center">
          <Text className="h-12 w-12 text-orange-500 mb-2" />
          <span className="text-xl font-bold text-orange-600 uppercase">COMPTEUR DE MOTS</span>
          <span className="text-sm text-orange-500 mt-1">Cliquez ici pour accéder à l'outil</span>
        </Link>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-2 mb-8 p-4 bg-white rounded-lg shadow-sm">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
          Accueil
        </Link>
        <Link to="/keyword-meta" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
          Title & Meta
        </Link>
        <Link to="/internal-linking" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
          Liens Internes
        </Link>
        <Link to="/tracking" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center">
          <span className="mr-1">Suivi Positions</span>
        </Link>
        <Link to="/domain-analysis" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center">
          <span className="mr-1">Analyse de Domaine</span>
        </Link>
        <Link to="/pinterest" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
          Pinterest
        </Link>
        <Link to="/signature" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
          Signature Email
        </Link>
        <Link to="/structure" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
          Structure Site
        </Link>
        <Link to="/keyword-generator" className="hover:bg-gray-100 px-4 py-2 rounded-md text-sm">
          Générateur de mots-clés
        </Link>
        <Link to="/indexability" className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm">
          Vérifier URL
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Bienvenue sur votre Dashboard SEO</h1>
        
        <p className="text-center mb-8 text-gray-600">
          Utilisez nos outils pour analyser et améliorer le référencement de votre site web. Accédez rapidement aux
          différentes fonctionnalités ci-dessous.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link 
            to="/keyword-meta" 
            className="bg-[#0EA5E9] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FileText className="h-4 w-4" />
            <span>Title & Meta</span>
          </Link>
          
          <Link 
            to="/keyword-generator" 
            className="bg-[#0EA5E9] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FileText className="h-4 w-4" />
            <span>Générateur de mots-clés</span>
          </Link>
          
          <Link 
            to="/internal-linking" 
            className="bg-[#4F46E5] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Link2 className="h-4 w-4" />
            <span>Vérifier les liens cassés</span>
          </Link>
          
          <Link 
            to="/word-count" 
            className="bg-[#F97316] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Text className="h-4 w-4" />
            <span>Compteur de mots</span>
          </Link>
          
          <Link 
            to="/content" 
            className="bg-[#0EA5E9] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FileText className="h-4 w-4" />
            <span>Contenu</span>
          </Link>
          
          <Link 
            to="/quora" 
            className="bg-[#b92b27] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FileText className="h-4 w-4" />
            <span>Quora & Forums</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Link 
            to="/sitemap" 
            className="bg-[#38BDF8] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Soumettre un Sitemap</span>
          </Link>
          
          <Link 
            to="/indexability" 
            className="bg-[#38BDF8] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Search className="h-4 w-4" />
            <span>Indexabilité</span>
          </Link>
          
          <Link 
            to="/resources" 
            className="bg-[#38BDF8] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Ressources</span>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Analyse de Domaine</h2>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-center">Analyse de Domaine</h3>
          </div>
          
          <p className="text-center mb-6">
            Analysez n'importe quel domaine pour obtenir des insights concurrentiels complets
          </p>
          
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Link to="/domain-analysis?view=overview" className="bg-blue-500 text-white px-4 py-2 rounded-md text-center flex-1">
              Vue d'ensemble
            </Link>
            <Link to="/domain-analysis?view=organic" className="bg-white border border-gray-300 px-4 py-2 rounded-md text-center flex-1">
              Recherche organique
            </Link>
            <Link to="/domain-analysis?view=availability" className="bg-white border border-gray-300 px-4 py-2 rounded-md text-center flex-1">
              Disponibilité
            </Link>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Entrez un nom de domaine (ex: mondomaine.com)" 
              className="w-full border border-gray-300 rounded-md px-4 py-3 pr-20"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md">
              Vérifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
