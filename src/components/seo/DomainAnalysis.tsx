
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Check, Globe, Search, Shield } from "lucide-react";

const DomainAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'availability'>('overview');
  const [domain, setDomain] = useState('');
  
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };
  
  const checkDomain = () => {
    if (!domain) {
      toast.error("Veuillez entrer un nom de domaine");
      return;
    }
    
    toast.info(`Analyse du domaine ${domain} en cours...`);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border-green-100">
        <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-green-800">
            <Shield className="h-5 w-5 text-green-600" />
            Analyse de Domaine
          </CardTitle>
          <p className="text-sm text-green-700 mt-1">
            Analysez n'importe quel domaine pour obtenir des insights concurrentiels complets
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-3 mb-4">
            <Button 
              variant={activeTab === 'overview' ? "default" : "outline"}
              className={activeTab === 'overview' ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-200 text-green-700"}
              onClick={() => setActiveTab('overview')}
            >
              <Globe className="mr-2 h-4 w-4" />
              Vue d'ensemble
            </Button>
            <Button 
              variant={activeTab === 'search' ? "default" : "outline"}
              className={activeTab === 'search' ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-200 text-green-700"}
              onClick={() => setActiveTab('search')}
            >
              <Search className="mr-2 h-4 w-4" />
              Recherche organique
            </Button>
            <Button 
              variant={activeTab === 'availability' ? "default" : "outline"}
              className={activeTab === 'availability' ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-200 text-green-700"}
              onClick={() => setActiveTab('availability')}
            >
              <Check className="mr-2 h-4 w-4" />
              Disponibilité
            </Button>
          </div>
          
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="Entrez un nom de domaine (ex: mondomaine.com)" 
              value={domain}
              onChange={handleDomainChange}
              className="flex-1"
            />
            <Button 
              onClick={checkDomain} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Analyser
            </Button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {activeTab === 'overview' && "Entrez un domaine pour voir sa vue d'ensemble"}
              {activeTab === 'search' && "Entrez un domaine pour analyser sa recherche organique"}
              {activeTab === 'availability' && "Entrez un domaine pour vérifier sa disponibilité"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainAnalysis;
