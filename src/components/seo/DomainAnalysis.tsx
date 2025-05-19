
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, Globe, Search, Shield } from "lucide-react";
import DomainOverview from './DomainOverview';
import OrganicSearch from './OrganicSearch';
import DomainAvailability from './DomainAvailability';
import { useCheckDomainAvailability } from '@/hooks/useCheckDomainAvailability';

const DomainAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'availability'>('overview');
  const [domain, setDomain] = useState('');
  const [submittedDomain, setSubmittedDomain] = useState('');
  const { isChecking } = useCheckDomainAvailability();
  
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };
  
  const checkDomain = () => {
    if (!domain) {
      toast.error("Veuillez entrer un nom de domaine");
      return;
    }
    
    // Format the domain if needed (add https:// if missing)
    let formattedDomain = domain.trim();
    if (formattedDomain.includes('://')) {
      formattedDomain = formattedDomain.split('://')[1];
    }
    if (formattedDomain.startsWith('www.')) {
      formattedDomain = formattedDomain.substring(4);
    }
    
    // Update the submitted domain
    setSubmittedDomain(formattedDomain);
    
    // Switch to availability tab
    setActiveTab('availability');
    toast.info(`Analyse du domaine ${formattedDomain} en cours...`);
  };
  
  // Effect to automatically check domain when switching to availability tab
  useEffect(() => {
    if (activeTab === 'availability' && submittedDomain) {
      // The actual check is handled in the DomainAvailability component
    }
  }, [activeTab, submittedDomain]);
  
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
        <CardContent className="p-0">
          <div className="bg-green-50 border-b border-green-100 p-4">
            <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide">
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
            
            <div className="flex gap-2">
              <Input 
                placeholder="Entrez un nom de domaine (ex: mondomaine.com)" 
                value={domain}
                onChange={handleDomainChange}
                className="flex-1"
              />
              <Button 
                onClick={checkDomain} 
                disabled={isChecking}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isChecking ? 'Vérification...' : 'Vérifier'}
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            {activeTab === 'overview' ? (
              <DomainOverview domain={submittedDomain || undefined} />
            ) : activeTab === 'search' ? (
              <OrganicSearch domain={submittedDomain || undefined} />
            ) : (
              <DomainAvailability domain={submittedDomain} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainAnalysis;
