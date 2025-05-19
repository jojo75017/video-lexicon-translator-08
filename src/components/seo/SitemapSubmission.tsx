
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const SitemapSubmission = () => {
  const [showForm, setShowForm] = useState(false);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleButtonClick = () => {
    setShowForm(prev => !prev);
  };

  const handleSitemapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSitemapUrl(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sitemapUrl) {
      toast.error("Veuillez entrer une URL de sitemap");
      return;
    }
    
    if (!sitemapUrl.endsWith('sitemap.xml') && !sitemapUrl.includes('sitemap')) {
      toast.warning("L'URL ne semble pas être un sitemap valide. Vérifiez qu'elle se termine par 'sitemap.xml' ou contient 'sitemap'.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Sitemap soumis avec succès: ${sitemapUrl}`);
      setIsSubmitting(false);
      setSitemapUrl('');
      setShowForm(false);
    }, 1500);
  };
  
  return (
    <>
      <Button 
        onClick={handleButtonClick}
        className="bg-orange-200 hover:bg-orange-300 text-orange-800 border border-orange-300"
      >
        <FileText className="mr-2 h-4 w-4" />
        Soumettre un Sitemap
      </Button>
      
      {showForm && (
        <Card className="mt-4 border border-orange-200">
          <CardHeader className="bg-orange-50 border-b border-orange-100 pb-3">
            <CardTitle className="text-lg text-orange-800">Soumettre un Sitemap</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit}>
              <Alert className="mb-4 bg-orange-50 border-orange-200 text-orange-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  La soumission d'un sitemap permet aux moteurs de recherche de mieux indexer votre site.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="sitemap" className="block text-sm font-medium mb-1">
                    URL du Sitemap
                  </label>
                  <Input
                    id="sitemap"
                    placeholder="https://votresite.com/sitemap.xml"
                    value={sitemapUrl}
                    onChange={handleSitemapChange}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="mr-2"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isSubmitting ? 'Traitement...' : 'Soumettre'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SitemapSubmission;
