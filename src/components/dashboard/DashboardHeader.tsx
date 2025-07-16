
import React from 'react';
import { RocketIcon, Sparkles, Zap, BarChart4, Gauge, Globe, Search, FileSignature, FileText, ZapIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  const stats = [
    { label: 'Score SEO', value: '78/100', icon: <Gauge className="h-5 w-5 text-light-green-300" />, change: '+12%', trend: 'up' },
    { label: 'Pages analysées', value: '42', icon: <Search className="h-5 w-5 text-light-green-400" />, change: '+5', trend: 'up' },
    { label: 'Visiteurs', value: '1,245', icon: <Globe className="h-5 w-5 text-light-green-300" />, change: '+18%', trend: 'up' },
    { label: 'Temps de chargement', value: '1.4s', icon: <Zap className="h-5 w-5 text-light-green-400" />, change: '-0.3s', trend: 'down' },
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-light-green-50 via-light-green-100 to-light-green-200 shadow-lg rounded-xl p-8 mb-8 text-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h1 className="text-3xl font-bold mb-3 flex items-center">
                <BarChart4 className="h-8 w-8 mr-3 text-gray-800" />
                Tableau de bord SEO
              </h1>
              <p className="text-gray-600 text-lg">
                Analysez et optimisez votre présence en ligne avec nos outils professionnels
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/signature" className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 flex items-center shadow-sm hover:bg-white/30 transition-all duration-300 cursor-pointer">
                <FileSignature className="h-5 w-5 mr-2 text-white" />
                <span className="font-medium">Signature Email</span>
              </Link>
              
              <div className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 flex items-center shadow-sm hover:bg-white/30 transition-all duration-300 cursor-pointer">
                <RocketIcon className="h-5 w-5 mr-2 text-white" />
                <span className="font-medium">Analyse avancée</span>
              </div>
              
              <div className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 flex items-center shadow-sm hover:bg-white/30 transition-all duration-300 cursor-pointer">
                <Sparkles className="h-5 w-5 mr-2 text-white" />
                <span className="font-medium">IA Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ÉNORME BOUTON SUPER VISIBLE IMPOSSIBLE À MANQUER */}
      <div className="mb-8">
        <Link to="/outils-seo">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl shadow-2xl transform hover:scale-105 transition-all">
            <div className="absolute inset-0 bg-grid-white/5"></div>
            <div className="relative px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                <div className="flex items-center">
                  <ZapIcon className="h-12 w-12 text-white mr-3" />
                  <h2 className="text-3xl md:text-4xl font-black text-white">
                    BOÎTE À OUTILS SEO
                  </h2>
                </div>
                <p className="text-xl text-white/90 mt-3 text-center md:text-left">
                  Générateurs de méta-descriptions, vérificateurs de liens et assistants d'optimisation
                </p>
              </div>
              <Button size="lg" className="bg-white hover:bg-white/90 text-pink-600 font-bold text-lg px-8 py-6 rounded-lg shadow-md animate-pulse">
                ACCÉDER AUX OUTILS
              </Button>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-light-green-50 rounded-xl border border-light-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center">
                  {stat.icon}
                  <span className="ml-2">{stat.label}</span>
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-success-100 text-success-600' 
                  : 'bg-primary-100 text-primary-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-8">
        <Link to="/signature">
          <Button className="px-7 py-7 bg-success-500 hover:bg-success-600 flex items-center gap-3 rounded-xl shadow-md">
            <FileSignature className="h-7 w-7" />
            <span className="text-xl font-medium">Créer votre signature email</span>
          </Button>
        </Link>
        
        <Link to="/outils-seo">
          <Button className="px-7 py-7 bg-gradient-to-r from-violet-600 via-pink-500 to-red-500 hover:from-violet-700 hover:via-pink-600 hover:to-red-600 flex items-center gap-3 rounded-xl shadow-xl text-white border-2 border-purple-300 animate-pulse">
            <FileText className="h-7 w-7" />
            <span className="text-xl font-bold">BOÎTE À OUTILS SEO</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default DashboardHeader;
