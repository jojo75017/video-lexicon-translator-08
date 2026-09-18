import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ListVideo, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import {
  SCRIPTS_TUTORIELS,
  TYPE_LABELS,
  scriptToText,
  tousLesScriptsTexte,
  type ScriptTutoriel,
} from '@/data/scriptsTutorielsLoom';

const STORAGE_KEY = 'admin:scripts-tutoriels:faits';

function chargerFaits(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

function CopyButton({ value, label = 'Copier' }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
      {done ? 'Copié' : label}
    </Button>
  );
}

function ScriptCard({
  script,
  fait,
  onToggle,
}: {
  script: ScriptTutoriel;
  fait: boolean;
  onToggle: () => void;
}) {
  const mots = useMemo(
    () => scriptToText(script).split(/\s+/).filter(Boolean).length,
    [script],
  );

  return (
    <Card className="p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Vidéo {script.numero}</Badge>
            <Badge variant="outline">{script.duree} min</Badge>
            <Badge variant="outline">{TYPE_LABELS[script.type]}</Badge>
          </div>
          <h2 className="mt-2 text-lg font-semibold">{script.titre}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{script.objectif}</p>
          <p className="mt-1 text-sm">
            <span className="font-semibold">À ouvrir :</span> {script.route}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">≈ {mots} mots à lire</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <CopyButton value={scriptToText(script)} />
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={fait} onCheckedChange={onToggle} />
            Vidéo enregistrée
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {script.sections.map((section) => (
          <div key={section.titre} className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold">{section.titre}</p>
            {section.ecran && (
              <p className="mt-1 text-sm italic text-muted-foreground">À l'écran : {section.ecran}</p>
            )}
            <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{section.texte}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Présentateur (robot) : {script.presentateur ?? 'à définir plus tard'}
      </p>
    </Card>
  );
}

export default function AdminScriptsTutorielsPage() {
  const navigate = useNavigate();
  const [faits, setFaits] = useState<number[]>(() => chargerFaits());

  const toggle = (numero: number) => {
    setFaits((prev) => {
      const next = prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* stockage indisponible : l'affichage reste correct */
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminPanelNav />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Retour au dashboard
        </Button>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Video className="h-6 w-6" />
            Scripts tutoriels Loom
          </h1>
          <Badge variant="secondary">{SCRIPTS_TUTORIELS.length} vidéos</Badge>
          <Badge variant="secondary">
            {faits.length} / {SCRIPTS_TUTORIELS.length} enregistrées
          </Badge>
          <CopyButton value={tousLesScriptsTexte()} label="Copier tous les scripts" />
        </div>

        <Card className="mb-6 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ListVideo className="h-4 w-4" />
            Ordre d'enregistrement
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vidéo 0 : votre présentation face caméra (5 minutes). Ensuite les 20 onglets dans
            l'ordre de fabrication d'un livre : Créer, Écrire, Habiller, Publier, Vendre, Réglages.
            Chaque script tient en 5 minutes à débit calme. Les vidéos « Écran seul » se tournent
            sans caméra.
          </p>
          <ol className="mt-3 space-y-1 text-sm">
            {SCRIPTS_TUTORIELS.map((s) => (
              <li key={s.numero} className="flex items-center gap-2">
                <span className="w-6 text-right text-muted-foreground">{s.numero}.</span>
                <span className={faits.includes(s.numero) ? 'line-through text-muted-foreground' : ''}>
                  {s.titre}
                </span>
                <span className="text-xs text-muted-foreground">— {TYPE_LABELS[s.type]}</span>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          {SCRIPTS_TUTORIELS.map((s) => (
            <ScriptCard
              key={s.numero}
              script={s}
              fait={faits.includes(s.numero)}
              onToggle={() => toggle(s.numero)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
