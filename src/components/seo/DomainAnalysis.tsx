
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, Globe, Search, Shield } from "lucide-react";
import DomainOverview from './DomainOverview';
import OrganicSearch from './OrganicSearch';

const DomainAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'search'>('overview');
  
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
            <div className="flex gap-3">
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
            </div>
          </div>
          
          <div className="p-4">
            {activeTab === 'overview' ? (
              <DomainOverview />
            ) : (
              <OrganicSearch />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainAnalysis;
