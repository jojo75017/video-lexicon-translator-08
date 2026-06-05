import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';

const TEAL = '#008296';
const LS_KEY = 'v3_prepub_checklist';

interface Item { id: string; label: string; }
interface Group { name: string; items: Item[]; }

const GROUPS: Group[] = [
  {
    name: 'Contenu & relecture',
    items: [
      { id: 'c1', label: 'Manuscrit relu et corrigé (orthographe, grammaire)' },
      { id: 'c2', label: 'Cohérence des personnages / chapitres vérifiée' },
      { id: 'c3', label: 'Table des matières à jour' },
      { id: 'c4', label: 'Page de titre, copyright et mentions légales présentes' },
      { id: 'c5', label: 'Pages de fin ajoutées (avis, du même auteur, bio)' },
    ],
  },
  {
    name: 'Mise en page intérieure',
    items: [
      { id: 'm1', label: 'Marges et gouttière (gutter) conformes au nombre de pages' },
      { id: 'm2', label: 'Police lisible et taille adaptée (11–12 pt)' },
      { id: 'm3', label: 'Sauts de page propres entre chapitres' },
      { id: 'm4', label: 'Numérotation des pages correcte' },
      { id: 'm5', label: 'Images en 300 DPI minimum' },
    ],
  },
  {
    name: 'Couverture',
    items: [
      { id: 'v1', label: 'Couverture aux dimensions exactes KDP (bleed inclus)' },
      { id: 'v2', label: 'Titre lisible en miniature 200×300 px' },
      { id: 'v3', label: 'Dos (spine) calculé selon le nombre de pages' },
      { id: 'v4', label: 'Zone ISBN/code-barres laissée libre en 4e' },
      { id: 'v5', label: 'Résolution couverture 300 DPI' },
    ],
  },
  {
    name: 'Métadonnées & référencement',
    items: [
      { id: 'd1', label: 'Titre et sous-titre optimisés' },
      { id: 'd2', label: '7 mots-clés KDP renseignés' },
      { id: 'd3', label: '2 catégories choisies (large + spécifique)' },
      { id: 'd4', label: 'Description vendeuse rédigée (1500–2500 caractères)' },
      { id: 'd5', label: 'Tranche d’âge / public défini si applicable' },
    ],
  },
  {
    name: 'Prix & droits',
    items: [
      { id: 'p1', label: 'Prix défini selon la niche et la concurrence' },
      { id: 'p2', label: 'Choix KDP Select / distribution étendue arbitré' },
      { id: 'p3', label: 'Droits territoriaux confirmés' },
      { id: 'p4', label: 'Taux de royalties (35 % / 70 %) vérifié' },
      { id: 'p5', label: 'Épreuve (proof) commandée ou aperçu validé' },
    ],
  },
];

const ALL_IDS = GROUPS.flatMap((g) => g.items.map((i) => i.id));

const PrepubChecklist: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  const persist = (next: Record<string, boolean>) => {
    setChecked(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const toggle = (id: string) => persist({ ...checked, [id]: !checked[id] });
  const reset = () => persist({});

  const doneCount = useMemo(() => ALL_IDS.filter((id) => checked[id]).length, [checked]);
  const pct = Math.round((doneCount / ALL_IDS.length) * 100);

  return (
    <div className="space-y-4">
      <Card className="border-joy-ink/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">{doneCount} / {ALL_IDS.length} points validés</span>
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
            </Button>
          </div>
          <Progress value={pct} className="h-2" />
          {pct === 100 && (
            <p className="mt-2 text-sm font-medium" style={{ color: TEAL }}>
              🎉 Tout est prêt — tu peux publier sur KDP !
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g.name} className="border-joy-ink/10">
            <CardContent className="p-4">
              <h4 className="text-sm font-bold mb-2" style={{ color: TEAL }}>{g.name}</h4>
              <ul className="space-y-1.5">
                {g.items.map((it) => {
                  const on = !!checked[it.id];
                  return (
                    <li key={it.id}
                      onClick={() => toggle(it.id)}
                      className="flex items-start gap-2 cursor-pointer rounded-md p-1.5 hover:bg-joy-ink/5">
                      {on
                        ? <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                        : <Circle className="h-4 w-4 mt-0.5 flex-shrink-0 text-joy-ink/30" />}
                      <span className={`text-xs leading-snug ${on ? 'line-through text-joy-ink/40' : ''}`}>{it.label}</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrepubChecklist;
