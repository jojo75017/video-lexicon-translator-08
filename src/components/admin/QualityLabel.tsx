import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { BadgeCheck, Award, Copy } from 'lucide-react';
import { toast } from 'sonner';

const BORDEAUX = '#9B2335';

interface CheckItem { id: string; label: string; }
interface CheckGroup { title: string; items: CheckItem[]; }

/**
 * Label Qualité Maison d'Édition — checklist certifiante.
 * Le badge n'est délivré que lorsque tous les points sont validés.
 */
const GROUPS: CheckGroup[] = [
  {
    title: 'Éditorial',
    items: [
      { id: 'reading', label: 'Fiche de lecture passée (verdict « accepté »)' },
      { id: 'dev', label: 'Édition structurelle réalisée (rythme, cohérence)' },
      { id: 'copy', label: 'Copy-editing effectué (style, répétitions)' },
      { id: 'proof', label: 'Relecture orthographique et typographique finale' },
      { id: 'voice', label: "Voix de l'auteur homogène sur tout le manuscrit" },
    ],
  },
  {
    title: 'Mise en forme & fabrication',
    items: [
      { id: 'toc', label: 'Table des matières cliquable et exacte' },
      { id: 'frontmatter', label: 'Pages liminaires (titre, copyright, dédicace)' },
      { id: 'backmatter', label: 'Pages de fin (bio, autres titres, appel à avis)' },
      { id: 'typo', label: 'Typographie française respectée (espaces, guillemets)' },
      { id: 'margins', label: 'Marges, gouttières et format conformes' },
    ],
  },
  {
    title: 'Métadonnées & conformité',
    items: [
      { id: 'title', label: 'Titre + sous-titre optimisés et cohérents' },
      { id: 'desc', label: 'Description vendeuse rédigée' },
      { id: 'keywords', label: '7 mots-clés et catégories renseignés' },
      { id: 'isbn', label: 'ISBN / identifiants attribués' },
      { id: 'compliance', label: 'Contenu conforme (aucun élément interdit)' },
    ],
  },
  {
    title: 'Couverture',
    items: [
      { id: 'cover', label: 'Couverture professionnelle (lisible en miniature)' },
      { id: 'collection', label: 'Cohérente avec la charte de collection' },
    ],
  },
];

const ALL_IDS = GROUPS.flatMap((g) => g.items.map((i) => i.id));

const QualityLabel: React.FC = () => {
  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const doneCount = useMemo(() => ALL_IDS.filter((id) => checked[id]).length, [checked]);
  const pct = Math.round((doneCount / ALL_IDS.length) * 100);
  const certified = doneCount === ALL_IDS.length;

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const copyBadge = () => {
    const txt = `✅ LABEL QUALITÉ MAISON D'ÉDITION\n${title ? `Titre : ${title}\n` : ''}Tous les contrôles éditoriaux, de fabrication, de métadonnées et de couverture ont été validés.\nCertifié le ${new Date().toLocaleDateString('fr-FR')}.`;
    navigator.clipboard.writeText(txt);
    toast.success('Attestation copiée ✓');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <BadgeCheck className="h-4 w-4" style={{ color: BORDEAUX }} />
        Coche chaque contrôle. Le label n'est délivré qu'une fois tous les points validés.
      </p>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-joy-ink/60">{doneCount}/{ALL_IDS.length} contrôles validés</span>
          <span className="font-semibold" style={{ color: BORDEAUX }}>{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du livre à certifier (optionnel)"
        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g.title} className="border-joy-ink/10">
            <CardContent className="p-4 space-y-2.5">
              <h4 className="text-sm font-semibold" style={{ color: BORDEAUX }}>{g.title}</h4>
              {g.items.map((it) => (
                <label key={it.id} className="flex items-start gap-2 text-xs cursor-pointer">
                  <Checkbox checked={!!checked[it.id]} onCheckedChange={() => toggle(it.id)} className="mt-0.5" />
                  <span className={checked[it.id] ? 'line-through text-joy-ink/40' : ''}>{it.label}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {certified ? (
        <Card className="border-2" style={{ borderColor: BORDEAUX }}>
          <CardContent className="p-5 text-center space-y-2">
            <Award className="h-10 w-10 mx-auto" style={{ color: BORDEAUX }} />
            <p className="font-bold text-base" style={{ color: BORDEAUX }}>Label Qualité Maison d'Édition obtenu</p>
            <p className="text-xs text-joy-ink/60">
              {title ? `« ${title} » est ` : 'Ce livre est '} certifié sur les 4 piliers : éditorial, fabrication, métadonnées et couverture.
            </p>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={copyBadge}>
              <Copy className="h-3.5 w-3.5" /> Copier l'attestation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-xs text-joy-ink/50 text-center">
          Encore {ALL_IDS.length - doneCount} contrôle(s) à valider pour décrocher le label.
        </p>
      )}
    </div>
  );
};

export default QualityLabel;
