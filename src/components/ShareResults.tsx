import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { SeoAnalysis } from '@/types/seo';

interface ShareResultsProps {
  seoAnalysis: SeoAnalysis;
}

const ShareResults: React.FC<ShareResultsProps> = ({ seoAnalysis }) => {
  const generateReport = () => {
    const report = `
SEO Analysis Report
------------------
URL: ${window.location.href}
Score: ${calculateScore()}%

Title: ${seoAnalysis.title}
Description: ${seoAnalysis.description}
Keywords: ${seoAnalysis.keywords?.join(', ')}

Structure:
- H1 tags: ${seoAnalysis.h1Count}
- H2 tags: ${seoAnalysis.h2Count}
- H3 tags: ${seoAnalysis.h3Count}
- Images: ${seoAnalysis.imgCount}

Links:
- Internal: ${seoAnalysis.internalLinks}
- External: ${seoAnalysis.externalLinks}

Word count: ${seoAnalysis.wordCount}
    `;

    return report.trim();
  };

  const calculateScore = () => {
    let score = 100;
    if (!seoAnalysis.title) score -= 20;
    if (!seoAnalysis.description) score -= 20;
    if (!seoAnalysis.keywords || seoAnalysis.keywords.length === 0) score -= 15;
    if (seoAnalysis.h1Count !== 1) score -= 10;
    return Math.max(0, score);
  };

  const copyToClipboard = async () => {
    try {
      const report = generateReport();
      await navigator.clipboard.writeText(report);
      toast.success("Rapport copié dans le presse-papier");
    } catch (error) {
      toast.error("Erreur lors de la copie du rapport");
    }
  };

  const downloadReport = () => {
    try {
      const report = generateReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'seo-report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Rapport téléchargé avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du rapport");
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        onClick={copyToClipboard}
        className="gap-2"
      >
        <Copy className="h-4 w-4" />
        Copier le rapport
      </Button>
      <Button
        variant="default"
        onClick={downloadReport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Télécharger le rapport
      </Button>
    </div>
  );
};

export default ShareResults;