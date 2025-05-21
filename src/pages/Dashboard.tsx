
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileEdit, Link2, ListChecks, FileSpreadsheet, Search } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Bienvenue sur votre Dashboard SEO</h1>
      
      <p className="text-center mb-8 text-gray-600">
        Utilisez nos outils pour analyser et améliorer le référencement de votre site web. Accédez rapidement aux
        différentes fonctionnalités ci-dessous.
      </p>
      
      {/* Ajout du bouton Compteur de mots en premier avec un style très visible */}
      <div className="grid grid-cols-1 mb-6">
        <Link to="/word-count" className="bg-[#ff5722] text-white rounded-lg p-6 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg border-2 border-[#ff7043] animate-pulse">
          <FileText size={32} />
          <span className="font-bold text-2xl">Compteur de mots</span>
        </Link>
      </div>
      
      <h2 className="text-xl font-bold mb-3 text-gray-700">Autres outils SEO</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Link to="/keyword-meta" className="bg-[#11b7cd] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <FileEdit size={20} />
          <span>Title & Meta</span>
        </Link>
        
        <Link to="/keyword-generator" className="bg-[#11b7cd] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <FileEdit size={20} />
          <span>Générateur de mots-clés</span>
        </Link>
        
        <Link to="/internal-linking" className="bg-[#4361ee] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Link2 size={20} />
          <span>Vérifier les liens cassés</span>
        </Link>
        
        <Link to="/content" className="bg-[#11b7cd] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <FileText size={20} />
          <span>Contenu</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/sitemap" className="bg-[#3db5e6] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <FileSpreadsheet size={20} />
          <span>Soumettre un Sitemap</span>
        </Link>
        
        <Link to="/indexability" className="bg-[#3db5e6] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Search size={20} />
          <span>Indexabilité</span>
        </Link>
        
        <Link to="/resources" className="bg-[#3db5e6] text-white rounded-md p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <ListChecks size={20} />
          <span>Ressources</span>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600">Cliquez sur le bouton orange animé en haut pour accéder au compteur de mots</p>
      </div>
    </div>
  );
};

export default Dashboard;
