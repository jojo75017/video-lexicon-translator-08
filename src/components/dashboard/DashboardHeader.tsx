
import React from 'react';
import { RocketIcon, Sparkles, Zap, BarChart4, Gauge, Globe, Search, FileSignature } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  const stats = [
    { label: 'Score SEO', value: '78/100', icon: <Gauge className="h-5 w-5 text-success-500" />, change: '+12%', trend: 'up' },
    { label: 'Pages analysées', value: '42', icon: <Search className="h-5 w-5 text-primary-500" />, change: '+5', trend: 'up' },
    { label: 'Visiteurs', value: '1,245', icon: <Globe className="h-5 w-5 text-success-500" />, change: '+18%', trend: 'up' },
    { label: 'Temps de chargement', value: '1.4s', icon: <Zap className="h-5 w-5 text-primary-500" />, change: '-0.3s', trend: 'down' },
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 shadow-lg rounded-xl p-8 mb-8 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h1 className="text-3xl font-bold mb-3 flex items-center">
                <BarChart4 className="h-8 w-8 mr-3 text-white" />
                Tableau de bord SEO
              </h1>
              <p className="text-primary-100 text-lg">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl">
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
      </div>
    </>
  );
};

export default DashboardHeader;
