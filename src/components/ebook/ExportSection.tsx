import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, FileText, Save, Loader2, Sparkles } from 'lucide-react';

interface ExportSectionProps {
  onExportPDF: () => void;
  onExportWord: () => void;
  onSave?: () => void;
  isExporting?: boolean;
  isSaving?: boolean;
  disabled?: boolean;
  pdfLabel?: string;
  wordLabel?: string;
  showSave?: boolean;
  variant?: 'default' | 'compact';
}

const ExportSection: React.FC<ExportSectionProps> = ({
  onExportPDF,
  onExportWord,
  onSave,
  isExporting = false,
  isSaving = false,
  disabled = false,
  pdfLabel = 'Export PDF',
  wordLabel = 'Export Word',
  showSave = true,
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2 items-center p-3 rounded-lg border-2 border-dashed border-amber-400/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5">
          NOUVEAU 2026
        </Badge>
        
        {showSave && onSave && (
          <Button
            onClick={onSave}
            disabled={isSaving || disabled}
            variant="outline"
            size="sm"
            className="border-violet-500 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
          >
            {isSaving ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Save className="mr-1 h-3 w-3" />
            )}
            Sauvegarder
          </Button>
        )}
        
        <Button
          onClick={onExportPDF}
          disabled={isExporting || disabled}
          size="sm"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          {isExporting ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <FileDown className="mr-1 h-3 w-3" />
          )}
          {pdfLabel}
        </Button>
        
        <Button
          onClick={onExportWord}
          disabled={isExporting || disabled}
          variant="outline"
          size="sm"
          className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          {isExporting ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <FileText className="mr-1 h-3 w-3" />
          )}
          {wordLabel}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-amber-400/50 bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-yellow-50/50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-yellow-950/20 shadow-lg">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header avec badge */}
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-sm font-semibold shadow-md">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              NOUVEAU 2026
            </Badge>
            <span className="text-sm text-muted-foreground">
              Exportez votre création en PDF ou Word modifiable
            </span>
          </div>
          
          {/* Boutons d'export */}
          <div className="flex flex-wrap gap-3">
            {showSave && onSave && (
              <Button
                onClick={onSave}
                disabled={isSaving || disabled}
                variant="outline"
                className="border-violet-500 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 min-w-[140px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={onExportPDF}
              disabled={isExporting || disabled}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md min-w-[140px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Export...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  {pdfLabel}
                </>
              )}
            </Button>
            
            <Button
              onClick={onExportWord}
              disabled={isExporting || disabled}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 shadow-md min-w-[140px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Export...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  {wordLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportSection;
