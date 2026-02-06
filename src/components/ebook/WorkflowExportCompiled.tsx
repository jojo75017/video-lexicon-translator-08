import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, FileText, File, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { WORKFLOW_STEPS } from './WorkflowNavigation';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface WorkflowExportCompiledProps {
  ebookTitle: string;
  authorName: string;
}

// Remove emojis for PDF compatibility
const removeEmojis = (text: string): string => {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '');
};

export const WorkflowExportCompiled: React.FC<WorkflowExportCompiledProps> = ({
  ebookTitle,
  authorName,
}) => {
  const { results, hasStepResult, getCompletedStepsCount } = useWorkflowResults();
  const [isExporting, setIsExporting] = useState<'pdf' | 'docx' | null>(null);

  const completedCount = getCompletedStepsCount();
  const completedSteps = WORKFLOW_STEPS.filter(s => hasStepResult(s.id));

  const exportToPDF = async () => {
    setIsExporting('pdf');
    try {
      const doc = new jsPDF();
      let y = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;

      // Title page
      doc.setFontSize(24);
      doc.text(removeEmojis(ebookTitle || 'Rapport Workflow'), pageWidth / 2, 60, { align: 'center' });
      doc.setFontSize(14);
      doc.text(removeEmojis(authorName || 'Auteur'), pageWidth / 2, 80, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Rapport genere le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 100, { align: 'center' });
      doc.text(`${completedCount}/${WORKFLOW_STEPS.length} etapes completees`, pageWidth / 2, 110, { align: 'center' });

      // Each step
      for (const step of completedSteps) {
        const result = results[step.id as keyof typeof results];
        if (!result) continue;

        doc.addPage();
        y = 20;

        // Step header
        doc.setFontSize(16);
        doc.text(removeEmojis(`${step.id}: ${step.label}`), margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(removeEmojis(step.description), margin, y);
        doc.setTextColor(0);
        y += 10;

        // Step content
        const content = removeEmojis(result.displayContent || 'Pas de contenu');
        const lines = doc.splitTextToSize(content, maxWidth);
        
        for (const line of lines) {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(9);
          doc.text(line, margin, y);
          y += 5;
        }
      }

      doc.save(`workflow-${removeEmojis(ebookTitle || 'rapport').replace(/\s+/g, '-')}.pdf`);
      toast.success('📄 PDF exporté avec succès !');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(null);
    }
  };

  const exportToDocx = async () => {
    setIsExporting('docx');
    try {
      const children: any[] = [];

      // Title
      children.push(
        new Paragraph({
          text: ebookTitle || 'Rapport Workflow',
          heading: HeadingLevel.TITLE,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Par ${authorName || 'Auteur'}`, italics: true })],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: `Rapport généré le ${new Date().toLocaleDateString('fr-FR')} — ${completedCount}/${WORKFLOW_STEPS.length} étapes`,
            size: 20,
            color: '666666',
          })],
          spacing: { after: 600 },
        })
      );

      // Each completed step
      for (const step of completedSteps) {
        const result = results[step.id as keyof typeof results];
        if (!result) continue;

        children.push(
          new Paragraph({
            text: `${step.id}: ${step.label}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: step.description, italics: true, color: '888888' })],
            spacing: { after: 200 },
          })
        );

        // Split content into paragraphs
        const content = result.displayContent || '';
        const paragraphs = content.split('\n').filter((l: string) => l.trim());
        for (const para of paragraphs) {
          const isBold = para.startsWith('**') && para.endsWith('**');
          const isHeading = para.startsWith('# ');
          
          if (isHeading) {
            children.push(new Paragraph({
              text: para.replace('# ', ''),
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200 },
            }));
          } else {
            children.push(new Paragraph({
              children: [new TextRun({
                text: isBold ? para.replace(/\*\*/g, '') : para,
                bold: isBold,
              })],
              spacing: { after: 100 },
            }));
          }
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children }],
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `workflow-${(ebookTitle || 'rapport').replace(/\s+/g, '-')}.docx`);
      toast.success('📝 Word exporté avec succès !');
    } catch (error) {
      console.error('DOCX export error:', error);
      toast.error('Erreur lors de l\'export Word');
    } finally {
      setIsExporting(null);
    }
  };

  if (completedCount === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            Aucune étape complétée. Lancez le workflow pour pouvoir exporter les résultats.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export Global du Workflow
          <Badge variant="outline" className="ml-2">
            {completedCount}/{WORKFLOW_STEPS.length} étapes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Compilez tous les résultats des étapes P1-P14 en un seul document.
        </p>

        {/* Completed steps list */}
        <div className="flex flex-wrap gap-2">
          {WORKFLOW_STEPS.map(step => (
            <Badge
              key={step.id}
              variant={hasStepResult(step.id) ? 'default' : 'outline'}
              className={hasStepResult(step.id) ? 'bg-green-500 text-white' : 'text-muted-foreground'}
            >
              {hasStepResult(step.id) && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {step.id}
            </Badge>
          ))}
        </div>

        {/* Export buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={exportToPDF} disabled={!!isExporting} className="gap-2 flex-1">
            {isExporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Export PDF
          </Button>
          <Button onClick={exportToDocx} variant="outline" disabled={!!isExporting} className="gap-2 flex-1">
            {isExporting === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <File className="h-4 w-4" />}
            Export Word
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowExportCompiled;
