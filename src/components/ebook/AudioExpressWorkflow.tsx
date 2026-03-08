import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Target, ListOrdered, PenTool, Sparkles, Clock, Mic2,
  Volume2, Combine, Archive, ChevronRight, ChevronLeft,
  CheckCircle2, Lock, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cleanForAudio } from '@/utils/textCleaner';

interface AudioExpressStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  estimatedMinutes: number;
}

const AUDIO_STEPS: AudioExpressStep[] = [
  { id: 'A1', label: 'Brief Directeur', description: 'Titre, auteur, catégorie, introduction et contenu des chapitres', icon: Target, estimatedMinutes: 3 },
  { id: 'A2', label: 'Structure Audible', description: 'Plan optimisé pour l\'écoute (chapitres courts, transitions)', icon: ListOrdered, estimatedMinutes: 5 },
  { id: 'A3', label: 'Rédaction Voix Haute', description: 'Phrases courtes, ton amical et conversationnel', icon: PenTool, estimatedMinutes: 15 },
  { id: 'A4', label: 'Nettoyage & Polissage', description: 'Retrait des astérisques, markdown et défauts', icon: Sparkles, estimatedMinutes: 2 },
  { id: 'A5', label: 'Script de Ponctuation', description: 'Insertion de pauses naturelles (virgules, points)', icon: Clock, estimatedMinutes: 3 },
  { id: 'A6', label: 'Casting Vocal', description: 'Choix de l\'avatar Azure : Denise, Henri, etc.', icon: Mic2, estimatedMinutes: 2 },
  { id: 'A7', label: 'Production Audio', description: 'Synthèse vocale par chapitre via Azure Neural', icon: Volume2, estimatedMinutes: 10 },
  { id: 'A8', label: 'Fusion Master', description: 'Assemblage Intro + Chapitres + Outro en 1 MP3', icon: Combine, estimatedMinutes: 5 },
  { id: 'A9', label: 'Archivage & Export', description: 'Sauvegarde en bibliothèque et téléchargement final', icon: Archive, estimatedMinutes: 2 },
];

const CATEGORIES = [
  { value: 'enfants-3-8', label: '👶 Enfants 3-8 ans' },
  { value: 'ados-12-16', label: '🧒 Ados 12-16 ans' },
  { value: 'thriller', label: '🔪 Thriller' },
  { value: 'romance', label: '💕 Romance' },
  { value: 'saga', label: '📖 Saga' },
  { value: 'spiritualite', label: '🧘 Spiritualité' },
  { value: 'marketing', label: '💼 Marketing' },
];

const AZURE_VOICES = [
  { id: 'fr-FR-EloiseNeural', label: '👶 Eloise (Enfants 3-6)', niche: 'enfants' },
  { id: 'fr-FR-BrigitteNeural', label: '🧒 Brigitte (Enfants 6-12)', niche: 'jeunesse' },
  { id: 'fr-FR-HenriNeural', label: '🔪 Henri (Thriller)', niche: 'thriller' },
  { id: 'fr-FR-DeniseNeural', label: '💕 Denise (Romance)', niche: 'romance' },
  { id: 'fr-FR-AlainNeural', label: '🧘 Alain (Spiritualité)', niche: 'spiritualite' },
  { id: 'fr-FR-JeromeNeural', label: '💼 Jérôme (Business)', niche: 'business' },
  { id: 'fr-FR-CelesteNeural', label: '📚 Céleste (Histoire)', niche: 'histoire' },
];

interface AudioExpressWorkflowProps {
  ebookTitle?: string;
  chapters?: any[];
  preface?: string;
  conclusion?: string;
}

export const AudioExpressWorkflow: React.FC<AudioExpressWorkflowProps> = ({
  ebookTitle = '',
  chapters = [],
  preface = '',
  conclusion = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // A1 — Brief Directeur (production fields)
  const [bookTitle, setBookTitle] = useState(ebookTitle || 'Le Village Irrésistible');
  const [bookSubtitle, setBookSubtitle] = useState('Aventure gauloise drôle');
  const [authorName, setAuthorName] = useState('Georges');
  const [category, setCategory] = useState('enfants-3-8');
  const [introduction, setIntroduction] = useState(
    preface || "Bienvenue dans Le Village Irrésistible, un livre audio plein d'aventures inspiré des épopées gauloises. Entre plans farfelus et bagarres mémorables, cette histoire entraîne les enfants dans un univers captivant sur le courage et l'amitié."
  );
  const [chapterContent, setChapterContent] = useState('');

  // A4 cleaned text
  const [cleanedText, setCleanedText] = useState('');

  // A6 voice
  const [selectedVoice, setSelectedVoice] = useState('fr-FR-EloiseNeural');

  const completedSteps = Object.keys(stepResults).length;
  const progressPercent = (completedSteps / AUDIO_STEPS.length) * 100;

  // Helper to get the A1 brief data used by all subsequent steps
  const getBriefData = () => stepResults['A1'] || {};

  const markStepDone = (stepId: string, result: any = true) => {
    setStepResults(prev => ({ ...prev, [stepId]: result }));
    toast.success(`✅ ${stepId} terminé`);
  };

  const isStepCompleted = (idx: number) => !!stepResults[AUDIO_STEPS[idx].id];
  const canGoToStep = (idx: number) => idx === 0 || isStepCompleted(idx - 1);

  // A4: Auto-clean text using brief data
  const handleCleanText = useCallback(() => {
    setIsProcessing(true);
    const brief = getBriefData();
    let fullText = '';

    // Use introduction from brief
    if (brief.introduction) fullText += brief.introduction + '\n\n';

    // Use chapter content from brief, or fallback to props
    if (brief.chapterContent) {
      fullText += brief.chapterContent;
    } else {
      chapters.forEach((ch: any, i: number) => {
        fullText += `Chapitre ${i + 1}: ${ch.title || ''}\n\n${ch.content || ''}\n\n`;
        const subs = ch.subChapters || ch.subchapters || [];
        subs.forEach((s: any) => { fullText += `${s.title || ''}\n\n${s.content || ''}\n\n`; });
      });
    }

    if (conclusion) fullText += conclusion;

    const cleaned = cleanForAudio(fullText);
    setCleanedText(cleaned);
    setIsProcessing(false);
    markStepDone('A4', cleaned);
  }, [chapters, conclusion, stepResults]);

  const renderStepContent = (idx: number) => {
    const step = AUDIO_STEPS[idx];
    const brief = getBriefData();

    switch (step.id) {
      case 'A1':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>📕 Titre du Livre</Label>
                <Input value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="Ex: Le Village Irrésistible" />
              </div>
              <div className="space-y-2">
                <Label>📝 Sous-titre</Label>
                <Input value={bookSubtitle} onChange={e => setBookSubtitle(e.target.value)} placeholder="Ex: Aventure gauloise drôle" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>✍️ Auteur</Label>
                <Input value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Ex: Georges" />
              </div>
              <div className="space-y-2">
                <Label>🎯 Catégorie / Public</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>📖 Introduction / Résumé</Label>
              <Textarea value={introduction} onChange={e => setIntroduction(e.target.value)} rows={4} placeholder="Résumé ou introduction du livre audio..." />
            </div>

            <div className="space-y-2">
              <Label>📚 Contenu des Chapitres</Label>
              <Textarea value={chapterContent} onChange={e => setChapterContent(e.target.value)} rows={8} placeholder="Collez ici le texte complet de vos chapitres..." className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">
                {chapterContent ? `${chapterContent.split(/\s+/).filter(w => w).length} mots` : 'Collez le texte intégral ou générez-le via le workflow P1-P5'}
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
              <p className="font-medium">📋 Récapitulatif du Brief</p>
              <p className="text-muted-foreground mt-1">
                <strong>{bookTitle}</strong> {bookSubtitle && `— ${bookSubtitle}`} par <strong>{authorName}</strong> • {CATEGORIES.find(c => c.value === category)?.label}
              </p>
            </div>

            <Button
              onClick={() => markStepDone('A1', { bookTitle, bookSubtitle, authorName, category, introduction, chapterContent })}
              disabled={!bookTitle || !authorName}
              className="w-full"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Valider le Brief de Production
            </Button>
          </div>
        );

      case 'A2':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 border rounded-lg p-4 text-sm space-y-2">
              <p className="font-medium">📕 {brief.bookTitle} — {brief.bookSubtitle}</p>
              <p className="text-muted-foreground">Par {brief.authorName} • {CATEGORIES.find(c => c.value === brief.category)?.label}</p>
            </div>
            <p className="text-muted-foreground text-sm">La structure sera optimisée pour l'écoute : chapitres courts, transitions naturelles, titres lus à voix haute.</p>
            {brief.chapterContent ? (
              <div className="border rounded-lg p-4 bg-muted/30 max-h-40 overflow-auto text-sm">
                <p className="text-muted-foreground">{brief.chapterContent.slice(0, 500)}...</p>
                <p className="text-xs mt-2">{brief.chapterContent.split(/\s+/).filter((w: string) => w).length} mots au total</p>
              </div>
            ) : chapters.length > 0 ? (
              <div className="border rounded-lg p-4 bg-muted/30 max-h-60 overflow-auto text-sm space-y-1">
                {chapters.map((ch: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="shrink-0">{i + 1}</Badge>
                    <span>{ch.title || `Chapitre ${i + 1}`}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <Button onClick={() => markStepDone('A2')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Structure validée
            </Button>
          </div>
        );

      case 'A3':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 border rounded-lg p-4 text-sm">
              <p className="font-medium">📕 {brief.bookTitle}</p>
              <p className="text-muted-foreground">Rédaction optimisée : phrases courtes, ton amical pour {CATEGORIES.find(c => c.value === brief.category)?.label}</p>
            </div>
            <p className="text-muted-foreground text-sm">💡 Utilisez le workflow P1-P5 pour générer le contenu textuel, puis revenez ici.</p>
            <Button onClick={() => markStepDone('A3')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Rédaction prête
            </Button>
          </div>
        );

      case 'A4':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Suppression automatique des astérisques, balises Markdown, et caractères parasites du texte de <strong>{brief.bookTitle}</strong>.</p>
            <Button onClick={handleCleanText} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              🧹 Nettoyer le texte automatiquement
            </Button>
            {cleanedText && (
              <div className="space-y-2">
                <Label>📝 Texte nettoyé (éditable avant export)</Label>
                <Textarea value={cleanedText} onChange={e => setCleanedText(e.target.value)} rows={12} className="font-mono text-sm" />
                <p className="text-xs text-muted-foreground">{cleanedText.split(/\s+/).filter(w => w).length} mots • Prêt pour la synthèse vocale</p>
              </div>
            )}
          </div>
        );

      case 'A5':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Ajout de micro-pauses naturelles pour <strong>{brief.bookTitle}</strong>.</p>
            <div className="bg-muted/30 border rounded-lg p-4 text-sm space-y-2">
              <p>🔸 Virgules → pause courte (0.3s)</p>
              <p>🔸 Points → pause moyenne (0.6s)</p>
              <p>🔸 Paragraphes → pause longue (1.2s)</p>
              <p>🔸 Chapitres → silence (2s)</p>
            </div>
            <Button onClick={() => markStepDone('A5')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Ponctuation validée
            </Button>
          </div>
        );

      case 'A6':
        return (
          <div className="space-y-4">
            <Label>🎙️ Voix Azure pour « {brief.bookTitle} » ({CATEGORIES.find(c => c.value === brief.category)?.label})</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AZURE_VOICES.map(v => (
                <Card key={v.id} className={`cursor-pointer transition-all ${selectedVoice === v.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`} onClick={() => setSelectedVoice(v.id)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Mic2 className={`h-5 w-5 ${selectedVoice === v.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm">{v.label}</p>
                      <p className="text-xs text-muted-foreground">Niche : {v.niche}</p>
                    </div>
                    {selectedVoice === v.id && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => markStepDone('A6', selectedVoice)}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Voix sélectionnée
            </Button>
          </div>
        );

      case 'A7':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Lancez la synthèse vocale pour <strong>{brief.bookTitle}</strong> dans l'onglet 🎙️ Livre Audio.</p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm space-y-1">
              <p>✅ Titre : {brief.bookTitle}</p>
              <p>✅ Auteur : {brief.authorName}</p>
              <p>✅ Voix : {AZURE_VOICES.find(v => v.id === selectedVoice)?.label}</p>
              <p>✅ Texte nettoyé & ponctuation optimisée</p>
            </div>
            <Button onClick={() => markStepDone('A7')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Production terminée
            </Button>
          </div>
        );

      case 'A8':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Fusion de l'intro + chapitres + outro en un seul MP3 pour <strong>{brief.bookTitle}</strong>.</p>
            <div className="bg-muted/30 border rounded-lg p-4 text-sm">
              <p>📋 Métadonnées du fichier audio :</p>
              <p className="text-muted-foreground">Titre : {brief.bookTitle} {brief.bookSubtitle && `— ${brief.bookSubtitle}`}</p>
              <p className="text-muted-foreground">Auteur : {brief.authorName}</p>
              <p className="text-muted-foreground">Catégorie : {CATEGORIES.find(c => c.value === brief.category)?.label}</p>
            </div>
            <Button onClick={() => markStepDone('A8')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Fusion terminée
            </Button>
          </div>
        );

      case 'A9':
        return (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="font-medium">🎉 Félicitations !</p>
              <p className="text-sm text-muted-foreground mt-1">
                « <strong>{brief.bookTitle}</strong> » par <strong>{brief.authorName}</strong> est prêt. Retrouvez-le dans la 📚 Bibliothèque.
              </p>
            </div>
            <Button onClick={() => markStepDone('A9')}>
              <Archive className="h-4 w-4 mr-2" /> Archiver et terminer
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/20">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">🎧 Audio Express</h2>
          <p className="text-muted-foreground text-sm mt-1">Workflow de production audio en 9 étapes</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{completedSteps}/{AUDIO_STEPS.length} étapes</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {AUDIO_STEPS.map((step, idx) => {
          const completed = isStepCompleted(idx);
          const active = idx === currentStep;
          const locked = !canGoToStep(idx);
          return (
            <Button key={step.id} variant={active ? 'default' : completed ? 'secondary' : 'outline'} size="sm"
              className={`shrink-0 ${locked ? 'opacity-50' : ''}`}
              disabled={locked}
              onClick={() => setCurrentStep(idx)}>
              {completed ? <CheckCircle2 className="h-3 w-3 mr-1" /> : locked ? <Lock className="h-3 w-3 mr-1" /> : null}
              {step.id}
            </Button>
          );
        })}
      </div>

      {/* Current step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {React.createElement(AUDIO_STEPS[currentStep].icon, { className: 'h-5 w-5 text-primary' })}
              {AUDIO_STEPS[currentStep].id} — {AUDIO_STEPS[currentStep].label}
            </CardTitle>
            <Badge variant="outline">~{AUDIO_STEPS[currentStep].estimatedMinutes} min</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{AUDIO_STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>{renderStepContent(currentStep)}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
        </Button>
        <Button onClick={() => setCurrentStep(Math.min(AUDIO_STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === AUDIO_STEPS.length - 1 || !canGoToStep(currentStep + 1)}>
          Suivant <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AudioExpressWorkflow;
