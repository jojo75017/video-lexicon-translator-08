import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, ChevronLeft, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const modules = [
  { id: 1, title: "Configuration et Démarrage", description: "Installation, configuration API OpenAI, générateur d'idées" },
  { id: 2, title: "Planificateur d'Ebook", description: "Création du plan, gestion des chapitres, structure" },
  { id: 3, title: "Templates Professionnels", description: "Galerie de templates, personnalisation" },
  { id: 4, title: "Génération de Contenu IA", description: "Rédaction automatique, outils d'écriture avancés" },
  { id: 5, title: "Outils Avancés", description: "Générateur de couverture IA, outils de productivité" },
  { id: 6, title: "Banque d'Images IA", description: "Génération d'illustrations, optimisation visuelle" },
  { id: 7, title: "Optimisation KDP", description: "Préparation Amazon KDP, analyse concurrentielle" },
  { id: 8, title: "Marketing et Promotion", description: "Réseaux sociaux, email marketing, landing pages" },
  { id: 9, title: "Monétisation", description: "Stratégies de prix, diversification des revenus" },
  { id: 10, title: "Export Multi-Format", description: "Formats disponibles, optimisation par format" },
  { id: 11, title: "Stratégies Avancées", description: "Automatisation, scaling et growth hacking" }
];

export const EbookFormationPDF: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);

  const previewPages = [
    {
      title: "Page de Couverture",
      content: (
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 h-full flex flex-col items-center justify-center p-8 rounded-lg">
          <BookOpen className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-center mb-4">Formation Complète</h2>
          <h3 className="text-xl text-primary mb-2">Générateur d'Ebook IA</h3>
          <p className="text-muted-foreground text-sm">Guide complet de toutes les fonctionnalités</p>
        </div>
      )
    },
    {
      title: "Table des Matières",
      content: (
        <div className="p-6 h-full overflow-auto">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">TABLE DES MATIÈRES</h3>
          <ul className="space-y-2 text-sm">
            {modules.map((module, index) => (
              <li key={module.id} className="flex gap-2">
                <span className="font-semibold text-primary">Module {index + 1}:</span>
                <span>{module.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    ...modules.map((module, index) => ({
      title: `Module ${index + 1}: ${module.title}`,
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge variant="secondary" className="mb-2">Module {index + 1}</Badge>
          <h3 className="text-lg font-bold mb-2">{module.title.toUpperCase()}</h3>
          <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
          <div className="text-sm space-y-2">
            <p className="font-medium">Contenu du module :</p>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>Fonctionnalités principales</li>
              <li>Actions à effectuer</li>
              <li>Captures d'écran explicatives</li>
              <li>Conseils et astuces</li>
            </ul>
          </div>
        </div>
      )
    })),
    {
      title: "Récapitulatif",
      content: (
        <div className="p-6 h-full">
          <h3 className="text-lg font-bold mb-4">RÉCAPITULATIF DES COMPÉTENCES</h3>
          <ul className="space-y-2 text-sm mb-6">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Maîtrise complète du générateur</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Création d'ebooks professionnels</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Optimisation pour Amazon KDP</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Stratégies de marketing digital</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Techniques de monétisation</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Export multi-format</li>
          </ul>
        </div>
      )
    }
  ];

  const totalPages = previewPages.length;

  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, isTitle: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (yPos > 275) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.45;
      }
      yPos += isTitle ? 6 : 3;
    };

    // Page de titre
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Formation Complete', pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text('Generateur d\'Ebook IA', pageWidth / 2, 75, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Guide complet de toutes les fonctionnalites', pageWidth / 2, 90, { align: 'center' });
    
    // Table des matières
    pdf.addPage();
    yPos = 20;
    addText('TABLE DES MATIERES', 16, true, true);
    yPos += 5;
    
    modules.forEach((module, index) => {
      addText(`Module ${index + 1}: ${module.title}`, 11);
      addText(`   ${module.description}`, 9);
      yPos += 2;
    });

    // Contenu des modules
    modules.forEach((module, index) => {
      pdf.addPage();
      yPos = 20;
      addText(`MODULE ${index + 1}`, 14, true, true);
      addText(module.title.toUpperCase(), 16, true, true);
      yPos += 5;
      addText(module.description, 11);
      yPos += 10;
      addText('Fonctionnalites principales:', 12, true);
      addText('- Guide complet et detaille', 10);
      addText('- Captures d\'ecran explicatives', 10);
      addText('- Conseils et astuces', 10);
      addText('- Exercices pratiques', 10);
    });

    // Page finale
    pdf.addPage();
    yPos = 20;
    addText('RECAPITULATIF DES COMPETENCES', 16, true, true);
    yPos += 5;
    
    const competences = [
      'Maitrise complete du generateur d\'ebook IA',
      'Creation d\'ebooks professionnels en minutes',
      'Optimisation pour Amazon KDP',
      'Strategies de marketing digital',
      'Techniques de monetisation avancees',
      'Export multi-format professionnel'
    ];
    
    competences.forEach(comp => {
      addText('✓ ' + comp, 11);
    });

    pdf.save('Formation_Complete_Generateur_Ebook.pdf');
    toast.success('Formation exportée en PDF !');
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Formation Complète - Générateur d'Ebook IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Téléchargez la formation complète en PDF avec tous les modules détaillés pour maîtriser le générateur d'ebook IA.
          </p>

          {/* Liste des modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modules.map((module) => (
              <div key={module.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="shrink-0">{module.id}</Badge>
                <div>
                  <p className="font-medium text-sm">{module.title}</p>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton principal */}
          <Button 
            onClick={() => { setPreviewPage(0); setShowPreview(true); }}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            <Eye className="h-5 w-5" />
            Prévisualiser et Télécharger le PDF
          </Button>
        </CardContent>
      </Card>

      {/* Dialog de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Prévisualisation du PDF - {previewPages[previewPage]?.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Page {previewPage + 1} / {totalPages}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {/* Aperçu de la page */}
          <div className="border rounded-lg bg-white text-foreground min-h-[400px] shadow-inner">
            {previewPages[previewPage]?.content}
          </div>

          {/* Navigation et actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
                disabled={previewPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewPage(Math.min(totalPages - 1, previewPage + 1))}
                disabled={previewPage === totalPages - 1}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Miniatures */}
            <div className="flex gap-1 overflow-x-auto max-w-xs">
              {previewPages.slice(0, 6).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPreviewPage(idx)}
                  className={`w-8 h-10 rounded border text-xs flex items-center justify-center transition-all ${
                    previewPage === idx 
                      ? 'border-primary bg-primary/10 text-primary font-bold' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              {previewPages.length > 6 && (
                <span className="text-xs text-muted-foreground self-center">+{previewPages.length - 6}</span>
              )}
            </div>

            <Button onClick={exportFormationPDF} className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbookFormationPDF;
