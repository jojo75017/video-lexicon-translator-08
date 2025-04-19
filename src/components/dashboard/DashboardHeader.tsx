
import React from 'react';
import { RocketIcon, Sparkles, Zap, BarChart4, Gauge, Globe, Search, FileSignature } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  const stats = [
    { label: 'Score SEO', value: '78/100', icon: <Gauge className="h-4 w-4 text-success-500" />, change: '+12%', trend: 'up' },
    { label: 'Pages analysées', value: '42', icon: <Search className="h-4 w-4 text-primary-500" />, change: '+5', trend: 'up' },
    { label: 'Visiteurs', value: '1,245', icon: <Globe className="h-4 w-4 text-success-500" />, change: '+18%', trend: 'up' },
    { label: 'Temps de chargement', value: '1.4s', icon: <Zap className="h-4 w-4 text-primary-500" />, change: '-0.3s', trend: 'down' },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-md rounded-lg p-6 mb-6 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <BarChart4 className="h-7 w-7 mr-2" />
                Tableau de bord SEO
              </h1>
              <p className="text-blue-100">
                Analysez et optimisez votre présence en ligne avec nos outils professionnels
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/signature" className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center shadow-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <FileSignature className="h-5 w-5 mr-2" />
                <span className="font-medium">Signature Email</span>
              </Link>
              
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center shadow-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <RocketIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Analyse avancée</span>
              </div>
              
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center shadow-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="font-medium">IA Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  {stat.icon}
                  <span className="ml-1.5">{stat.label}</span>
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-success-50 text-success-600' 
                  : 'bg-primary-50 text-primary-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-8">
        <Link to="/signature">
          <Button className="px-6 py-6 bg-primary-600 hover:bg-primary-700 flex items-center gap-2">
            <FileSignature className="h-6 w-6" />
            <span className="text-lg font-medium">Créer votre signature email</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default DashboardHeader;
