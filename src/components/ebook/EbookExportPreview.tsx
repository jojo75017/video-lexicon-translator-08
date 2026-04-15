import React, { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, X, FileText, CheckCircle, AlertTriangle, XCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Chapter } from '@/hooks/useEbookGeneration';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { Character } from './EbookCharacters';
import { runDocxAudit, AuditReport } from '@/utils/docxAuditService';

interface EbookExportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExport: () => void;
  ebookTitle: string;
  authorName: string;
  preface: string;
  conclusion: string;
  epilogue?: string;
  chapters: Chapter[];
  characters?: Character[];
  isExporting?: boolean;
}

export const EbookExportPreview: React.FC<EbookExportPreviewProps> = ({
  isOpen,
  onClose,
  onConfirmExport,
  ebookTitle,
  authorName,
  preface,
  conclusion,
  epilogue,
  chapters,
  characters = [],
  isExporting = false
}) => {
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);

  const cleanedContent = useMemo(() => {
    const cleanedPreface = cleanGeneratedText(preface);
    const cleanedConclusion = cleanGeneratedText(conclusion);
    const cleanedEpilogue = epilogue ? cleanGeneratedText(epilogue) : '';
    const cleanedChapters = chapters.map(chapter => ({
      ...chapter,
      title: cleanGeneratedText(chapter.title),
      content: chapter.content ? cleanGeneratedText(chapter.content) : '',
      subChapters: chapter.subChapters.map(sub => ({
        ...sub,
        title: cleanGeneratedText(sub.title),
        content: sub.content ? cleanGeneratedText(sub.content) : ''
      }))
    }));
    return { preface: cleanedPreface, conclusion: cleanedConclusion, epilogue: cleanedEpilogue, chapters: cleanedChapters };
  }, [preface, conclusion, epilogue, chapters]);

  // Lancer l'audit automatiquement
  useEffect(() => {
    if (isOpen) {
      const report = runDocxAudit({
        title: ebookTitle,
        authorName,
        preface,
        conclusion,
        epilogue,
        chapters: chapters.map(ch => ({
          title: ch.title,
          content: ch.content,
          subChapters: ch.subChapters.map(s => ({ title: s.title, content: s.content })),
        })),
      });
      setAuditReport(report);
    }
  }, [isOpen, ebookTitle, authorName, preface, conclusion, epilogue, chapters]);

  const stats = useMemo(() => {
    let totalWords = 0;
    if (cleanedContent.preface) totalWords += cleanedContent.preface.split(/\s+/).filter(w => w).length;
    cleanedContent.chapters.forEach(chapter => {
      if (chapter.content) totalWords += chapter.content.split(/\s+/).filter(w => w).length;
      chapter.subChapters.forEach(sub => {
        if (sub.content) totalWords += sub.content.split(/\s+/).filter(w => w).length;
      });
    });
    if (cleanedContent.conclusion) totalWords += cleanedContent.conclusion.split(/\s+/).filter(w => w).length;
    return {
      totalWords,
      estimatedPages: Math.ceil(totalWords / 250),
      chaptersCount: cleanedContent.chapters.length,
      subChaptersCount: cleanedContent.chapters.reduce((acc, ch) => acc + ch.subChapters.length, 0)
    };
  }, [cleanedContent]);

  const truncateText = (text: string, maxLength: number = 300) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const auditStatusConfig = auditReport ? {
    conforme: { color: 'bg-green-500', icon: ShieldCheck, label: 'Conforme', textColor: 'text-green-700 dark:text-green-400' },
    problèmes: { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Problèmes détectés', textColor: 'text-yellow-700 dark:text-yellow-400' },
    critique: { color: 'bg-red-500', icon: XCircle, label: 'Critique', textColor: 'text-red-700 dark:text-red-400' },
  }[auditReport.status] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Prévisualisation avant export
          </DialogTitle>
          <DialogDescription>
            Vérifiez le contenu et l'audit de conformité avant d'exporter
          </DialogDescription>
        </DialogHeader>

        {/* Bandeau audit */}
        {auditReport && auditStatusConfig && (
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            auditReport.status === 'conforme' ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' :
            auditReport.status === 'problèmes' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800' :
            'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
          }`}>
            <auditStatusConfig.icon className={`h-5 w-5 ${auditStatusConfig.textColor}`} />
            <div className="flex-1">
              <span className={`font-semibold ${auditStatusConfig.textColor}`}>
                Score : {auditReport.score}/100 — {auditStatusConfig.label}
              </span>
              {auditReport.issues.length > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({auditReport.issues.filter(i => i.severity === 'critical').length} critique, {auditReport.issues.filter(i => i.severity === 'warning').length} avertissement)
                </span>
              )}
            </div>
            {!auditReport.canExport && (
              <Badge variant="destructive" className="text-xs">Export bloqué</Badge>
            )}
          </div>
        )}

        <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">Aperçu</TabsTrigger>
            <TabsTrigger value="audit" className="flex-1 gap-1">
              Audit
              {auditReport && auditReport.issues.length > 0 && (
                <Badge variant={auditReport.status === 'critique' ? 'destructive' : 'secondary'} className="ml-1 text-xs px-1.5 py-0">
                  {auditReport.issues.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Onglet Aperçu */}
          <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 mt-2">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm mb-2">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{stats.totalWords}</span>
                <span className="text-muted-foreground">mots</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{stats.estimatedPages}</span>
                <span className="text-muted-foreground">pages</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{stats.chaptersCount}</span>
                <span className="text-muted-foreground">chapitres</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">Contenu nettoyé</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto border rounded-lg bg-card">
              <div className="p-6 space-y-6 font-serif">
                <div className="text-center border-b pb-6">
                  <h1 className="text-2xl font-bold mb-2">{ebookTitle}</h1>
                  {authorName && <p className="text-muted-foreground italic">par {authorName}</p>}
                </div>

                {cleanedContent.preface && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3">Préface</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{truncateText(cleanedContent.preface)}</p>
                  </div>
                )}

                {cleanedContent.chapters.map((chapter, index) => (
                  <div key={index} className="space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Ch. {index + 1}</span>
                      {chapter.title}
                    </h2>
                    {chapter.content && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-4 border-l-2 border-muted">{truncateText(chapter.content)}</p>
                    )}
                    {chapter.subChapters.length > 0 && (
                      <div className="pl-4 space-y-2">
                        {chapter.subChapters.slice(0, 2).map((sub, subIndex) => (
                          <div key={subIndex} className="text-sm">
                            <h3 className="font-medium text-foreground/80">{index + 1}.{subIndex + 1} {sub.title}</h3>
                            {sub.content && <p className="text-muted-foreground text-xs mt-1 leading-relaxed whitespace-pre-line">{truncateText(sub.content, 150)}</p>}
                          </div>
                        ))}
                        {chapter.subChapters.length > 2 && (
                          <p className="text-xs text-muted-foreground italic">+ {chapter.subChapters.length - 2} autres sous-chapitres...</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {cleanedContent.conclusion && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3">Conclusion</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{truncateText(cleanedContent.conclusion)}</p>
                  </div>
                )}

                {characters.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h2 className="text-lg font-semibold text-primary">Personnages ({characters.length})</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {characters.slice(0, 4).map((char, index) => (
                        <div key={index} className="text-muted-foreground">• {char.name}</div>
                      ))}
                      {characters.length > 4 && <div className="text-xs text-muted-foreground italic col-span-2">+ {characters.length - 4} autres...</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Onglet Audit */}
          <TabsContent value="audit" className="flex-1 overflow-auto mt-2">
            {auditReport ? (
              <div className="space-y-4">
                {/* Score global */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      auditReport.score >= 80 ? 'text-green-600' :
                      auditReport.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{auditReport.score}</div>
                    <div className="text-xs text-muted-foreground">/100</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          auditReport.score >= 80 ? 'bg-green-500' :
                          auditReport.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${auditReport.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {auditReport.passedChecks}/{auditReport.totalChecks} contrôles passés
                    </p>
                  </div>
                </div>

                {/* Liste des problèmes */}
                {auditReport.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p className="text-lg font-medium text-green-700 dark:text-green-400">Aucun problème détecté</p>
                    <p className="text-sm text-muted-foreground">Votre document est prêt pour l'export</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditReport.issues.map((issue, idx) => (
                      <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        issue.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' :
                        issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800' :
                        'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                      }`}>
                        {issue.severity === 'critical' ? (
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        ) : issue.severity === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{issue.message}</p>
                          {issue.chapter && (
                            <p className="text-xs text-muted-foreground mt-0.5">📍 {issue.chapter}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {issue.type === 'json_residual' ? 'JSON' :
                           issue.type === 'title_too_long' ? 'Titre' :
                           issue.type === 'empty_chapter' ? 'Vide' :
                           issue.type === 'stuck_words' ? 'Espaces' :
                           issue.type === 'markdown_artifacts' ? 'Markdown' : 'Autre'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin" />
                Analyse en cours...
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            onClick={onConfirmExport}
            disabled={isExporting || (auditReport ? !auditReport.canExport : false)}
          >
            {isExporting ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exporter vers Google Docs
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
