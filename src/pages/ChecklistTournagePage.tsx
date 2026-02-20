import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Camera, Film, RotateCcw, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CAPTURES = [
  { id: 1, label: "PDF final exporté (150 pages)", sequence: "Hook", tip: "Ouvrez un PDF déjà exporté, scrollez pour montrer le volume", route: "/ebook-planner" },
  { id: 2, label: "Recherche concurrents Amazon/Google", sequence: "Problème", tip: "Ouvrez Amazon KDP + Google côte à côte, montrez la masse de livres", route: null },
  { id: 3, label: "Document Word vide", sequence: "Problème", tip: "Ouvrez un fichier Word vierge avec curseur clignotant", route: null },
  { id: 4, label: "Planificateur — champ rempli", sequence: "Planificateur", tip: "Remplissez titre + genre + nb chapitres AVANT de capturer", route: "/ebook-planner" },
  { id: 5, label: "Planificateur — loading (spinner)", sequence: "Planificateur", tip: "Lancez la génération et capturez PENDANT le spinner", route: "/ebook-planner" },
  { id: 6, label: "Planificateur — résultat complet", sequence: "Planificateur", tip: "Montrez le plan avec tous les chapitres générés", route: "/ebook-planner" },
  { id: 7, label: "Bouton P4 Rédaction Experte", sequence: "Rédaction", tip: "Zoomez sur le bouton/onglet Rédaction Experte", route: "/ebook-planner" },
  { id: 8, label: "Génération en cours (chapitre)", sequence: "Rédaction", tip: "Lancez la rédaction d'un chapitre, capturez le loading", route: "/ebook-planner" },
  { id: 9, label: "Chapitre terminé — zoom texte", sequence: "Rédaction", tip: "Montrez un chapitre complet avec du vrai contenu lisible", route: "/ebook-planner" },
  { id: 10, label: "Compteur ~150 pages", sequence: "Rédaction", tip: "Montrez les stats (mots, pages estimées) dans le dashboard", route: "/ebook-planner" },
  { id: 11, label: "Générateur couverture — interface", sequence: "Couverture", tip: "Montrez l'interface du générateur de couverture vide", route: "/ebook-planner" },
  { id: 12, label: "Couverture générée", sequence: "Couverture", tip: "Montrez une couverture fraîchement générée en gros plan", route: "/ebook-planner" },
  { id: 13, label: "Galerie couvertures", sequence: "Couverture", tip: "Si plusieurs couvertures, montrez la galerie/sélection", route: "/ebook-planner" },
  { id: 14, label: "KDP Keywords générés", sequence: "SEO & Export", tip: "Montrez les 7 mots-clés KDP suggérés par l'IA", route: "/ebook-planner" },
  { id: 15, label: "Description KDP", sequence: "SEO & Export", tip: "Montrez la description Amazon générée automatiquement", route: "/ebook-planner" },
  { id: 16, label: "Bouton export + formats (PDF/Word)", sequence: "SEO & Export", tip: "Montrez la section d'export avec les boutons PDF + Word", route: "/ebook-planner" },
];

const SEQUENCE_COLORS: Record<string, string> = {
  "Hook": "bg-red-500",
  "Problème": "bg-orange-500",
  "Planificateur": "bg-blue-500",
  "Rédaction": "bg-violet-500",
  "Couverture": "bg-pink-500",
  "SEO & Export": "bg-emerald-500",
};

const ChecklistTournagePage: React.FC = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (id: number) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const reset = () => setChecked({});
  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = (doneCount / CAPTURES.length) * 100;

  const sequences = [...new Set(CAPTURES.map(c => c.sequence))];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/offres" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Retour
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Checklist Tournage Vidéo</h1>
        </div>
        <p className="text-muted-foreground">
          Script : <strong>"150 pages en 47 minutes avec l'IA"</strong> — Durée cible : 3min30
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-6 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span className="font-semibold">{doneCount}/{CAPTURES.length} captures</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                ~20 min de capture
              </span>
              <Button variant="outline" size="sm" onClick={reset} className="gap-1">
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
          {doneCount === CAPTURES.length && (
            <p className="mt-3 text-sm text-green-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Toutes les captures sont faites ! 🎉 Prêt pour le montage.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Captures by sequence */}
      {sequences.map(seq => {
        const items = CAPTURES.filter(c => c.sequence === seq);
        const seqDone = items.every(i => checked[i.id]);
        return (
          <Card key={seq} className={`mb-4 transition-all ${seqDone ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Badge className={`${SEQUENCE_COLORS[seq]} text-white`}>{seq}</Badge>
                {seqDone && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map(cap => (
                <div
                  key={cap.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                    checked[cap.id] ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'border-border'
                  }`}
                  onClick={() => toggle(cap.id)}
                >
                  <Checkbox
                    checked={!!checked[cap.id]}
                    onCheckedChange={() => toggle(cap.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">#{cap.id}</span>
                      <span className={`font-medium ${checked[cap.id] ? 'line-through text-muted-foreground' : ''}`}>
                        {cap.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                      <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-amber-500" />
                      {cap.tip}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Rappels tournage */}
      <Card className="mt-6 border-dashed border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/10">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-500" />
            Rappels tournage
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>📐 Résolution : <strong>1920×1080</strong> minimum</li>
            <li>🖱️ Utilisez <strong>Win+Shift+S</strong> (Windows) ou <strong>Cmd+Shift+4</strong> (Mac)</li>
            <li>🧹 Fermez les onglets inutiles avant chaque capture</li>
            <li>🔤 Zoomez le navigateur à <strong>110-125%</strong> pour que le texte soit lisible</li>
            <li>⏱️ Pour les captures "loading", lancez l'action puis capturez immédiatement</li>
            <li>💡 Astuce : faites d'abord toutes les captures d'un même onglet avant de passer au suivant</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChecklistTournagePage;
