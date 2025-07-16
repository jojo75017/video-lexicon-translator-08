
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useIndexabilityAnalysis } from '@/hooks/useIndexabilityAnalysis';
import { IndexabilityForm } from './indexability/IndexabilityForm';
import { IndexabilityResults } from './indexability/IndexabilityResults';

export const IndexabilityAnalyzer = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    url,
    isAnalyzing,
    corsError,
    results,
    handleUrlChange,
    handleSubmit,
    handleOpenCorsDemo,
    resetResults
  } = useIndexabilityAnalysis();

  const handleButtonClick = () => {
    setShowForm(prev => !prev);
    resetResults();
  };

  const handleCancel = () => {
    setShowForm(false);
  };
  
  return (
    <>
      <Button 
        onClick={handleButtonClick}
        className="bg-pink-200 hover:bg-pink-300 text-pink-800 border border-pink-300"
      >
        <Search className="mr-2 h-4 w-4" />
        Indexabilité
      </Button>
      
      {showForm && (
        <Card className="mt-4 border border-pink-200">
          <CardHeader className="bg-pink-50 border-b border-pink-100 pb-3">
            <CardTitle className="text-lg text-pink-800">Analyser l'indexabilité</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <IndexabilityForm
              url={url}
              isAnalyzing={isAnalyzing}
              corsError={corsError}
              onUrlChange={handleUrlChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onOpenCorsDemo={handleOpenCorsDemo}
            />
            
            {results && <IndexabilityResults results={results} url={url} />}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default IndexabilityAnalyzer;
