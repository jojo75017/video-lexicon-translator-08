
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileEdit, Link2, ListChecks, FileSpreadsheet, Search } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  useEffect(() => {
    // Notification pour guider l'utilisateur
    toast.info("Bienvenue sur le tableau de bord", {
      description: "Cliquez sur le bouton orange pour accéder au compteur de mots",
      duration: 5000
    });
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Bienvenue sur votre Dashboard SEO</h1>
      
      <p className="text-center mb-8 text-gray-600">
        Utilisez nos outils pour analyser et améliorer le référencement de votre site web. Accédez rapidement aux
        différentes fonctionnalités ci-dessous.
      </p>
      
      {/* Bouton Compteur de mots très visible et grand en haut */}
      <div className="grid grid-cols-1 mb-8">
        <Link 
          to="/word-count" 
          className="bg-[#F97316] text-white rounded-lg p-8 flex items-center justify-center gap-4 hover:bg-[#F97316]/90 transition-all shadow-xl border-4 border-[#F97316]/30 animate-pulse"
          onClick={() => toast.success("Accès au compteur de mots")}
        >
          <FileText size={40} />
          <span className="font-bold text-3xl">COMPTEUR DE MOTS</span>
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
      
      <div className="mt-8 p-6 bg-orange-50 rounded-lg text-center border-2 border-orange-200">
        <p className="text-orange-800 font-medium text-lg">⬆️ Cliquez sur le GRAND BOUTON ORANGE en haut pour accéder au compteur de mots ⬆️</p>
      </div>
    </div>
  );
};

export default Dashboard;
