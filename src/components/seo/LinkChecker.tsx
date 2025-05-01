
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { checkLinks } from "@/utils/seo/linkChecker";

const LinkChecker = () => {
  const [links, setLinks] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResults, setCheckResults] = useState<Array<{
    url: string;
    status: number;
    isWorking: boolean;
    errorMessage?: string;
  }>>([]);

  const handleCheck = async () => {
    if (!links.trim()) {
      toast.error("Veuillez saisir au moins un lien à vérifier");
      return;
    }

    // Parse links from textarea (separated by new lines, commas, or spaces)
    const linkList = links
      .split(/[\n,\s]+/)
      .map(link => link.trim())
      .filter(link => link.length > 0)
      .map(link => {
        // Add https:// if no protocol specified
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          return `https://${link}`;
        }
        return link;
      });

    if (linkList.length === 0) {
      toast.error("Aucun lien valide trouvé");
      return;
    }

    setIsChecking(true);
    setCheckResults([]);
    toast.info(`Vérification de ${linkList.length} liens en cours...`);

    try {
      const results = await checkLinks(linkList);
      setCheckResults(results);
      
      const brokenCount = results.filter(r => !r.isWorking).length;
      if (brokenCount > 0) {
        toast.warning(`${brokenCount} liens cassés détectés`, {
          description: "Consultez les résultats pour plus de détails"
        });
      } else {
        toast.success("Tous les liens sont fonctionnels", {
          description: `${results.length} liens vérifiés avec succès`
        });
      }
    } catch (error) {
      console.error("Error checking links:", error);
      toast.error("Erreur lors de la vérification des liens", {
        description: error instanceof Error ? error.message : "Une erreur est survenue"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          Vérificateur de liens cassés
        </CardTitle>
        <CardDescription>
          Vérifiez si vos liens sont fonctionnels ou cassés. Entrez un lien par ligne ou séparés par des virgules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="https://exemple.com&#10;https://exemple.com/page&#10;https://autre-site.com"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            rows={5}
            className="font-mono text-sm"
          />
          
          <Button 
            onClick={handleCheck} 
            disabled={isChecking || !links.trim()}
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification en cours...
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                Vérifier les liens
              </>
            )}
          </Button>

          {checkResults.length > 0 && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">État</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead className="w-64">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkResults.map((result, index) => (
                    <TableRow key={index} className={!result.isWorking ? "bg-red-50" : undefined}>
                      <TableCell>
                        {result.isWorking ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs break-all">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {result.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        {result.status === 200 ? (
                          <span className="text-green-600 font-medium">{result.status}</span>
                        ) : (
                          <span className="text-red-600 font-medium">{result.status}</span>
                        )}
                      </TableCell>
                      <TableCell>{result.errorMessage || (result.isWorking ? "OK" : "Erreur")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {checkResults.length > 0 && (
            <Alert className="mt-4">
              <AlertTitle>Résumé de la vérification</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Liens vérifiés: <strong>{checkResults.length}</strong></li>
                  <li>Liens fonctionnels: <strong className="text-green-600">{checkResults.filter(r => r.isWorking).length}</strong></li>
                  <li>Liens cassés: <strong className="text-red-600">{checkResults.filter(r => !r.isWorking).length}</strong></li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkChecker;
