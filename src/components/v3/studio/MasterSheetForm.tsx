import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BOOK_KIND_LABELS, BookKind, MasterSheetDraft, isFictionKind } from '@/types/studioPro';

interface Props {
  value: MasterSheetDraft;
  onChange: (patch: Partial<MasterSheetDraft>) => void;
  onSubmit: () => void;
  saving?: boolean;
  submitLabel?: string;
}

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

/** Étape 1 — Fiche maître du livre. Référence centrale de tous les agents IA. */
const MasterSheetForm: React.FC<Props> = ({ value, onChange, onSubmit, saving, submitLabel }) => {
  const fiction = isFictionKind(value.book_kind);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Identité du livre</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Titre provisoire *">
            <Input
              value={value.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Ex. Noces de Vendetta"
            />
          </Field>
          <Field label="Sous-titre">
            <Input
              value={value.subtitle || ''}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Ex. Le prix du silence"
            />
          </Field>
          <Field label="Type de livre">
            <Select value={value.book_kind || 'roman'} onValueChange={(v) => onChange({ book_kind: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(BOOK_KIND_LABELS) as BookKind[]).map((k) => (
                  <SelectItem key={k} value={k}>{BOOK_KIND_LABELS[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Genre">
            <Input
              value={value.genre || ''}
              onChange={(e) => onChange({ genre: e.target.value })}
              placeholder={fiction ? 'Ex. thriller psychologique' : 'Ex. développement personnel'}
            />
          </Field>
          <Field label="Public cible">
            <Input
              value={value.target_audience || ''}
              onChange={(e) => onChange({ target_audience: e.target.value })}
              placeholder="Ex. femmes 30-55 ans lectrices de romans noirs"
            />
          </Field>
          <Field label="Objectif du livre" hint="Ce que le lecteur doit vivre, comprendre ou obtenir.">
            <Input
              value={value.objective || ''}
              onChange={(e) => onChange({ objective: e.target.value })}
              placeholder={fiction ? 'Tenir le lecteur en haleine jusqu’au retournement final' : 'Permettre de publier son premier livre en 30 jours'}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Format et voix</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre de chapitres souhaité" hint="Jusqu’à 40 chapitres.">
            <Input
              type="number"
              min={3}
              max={40}
              value={value.chapters_target || 12}
              onChange={(e) => onChange({ chapters_target: Math.min(40, Math.max(3, Number(e.target.value) || 12)) })}
            />
          </Field>
          <Field label="Longueur approximative">
            <Input
              value={value.length_target || ''}
              onChange={(e) => onChange({ length_target: e.target.value })}
              placeholder="Ex. 45 000 mots (≈ 180 pages)"
            />
          </Field>
          <Field label="Ton">
            <Input value={value.tone || ''} onChange={(e) => onChange({ tone: e.target.value })} placeholder="Ex. sombre, tendu, sensuel" />
          </Field>
          <Field label="Style">
            <Input value={value.writing_style || ''} onChange={(e) => onChange({ writing_style: e.target.value })} placeholder="Ex. phrases courtes, immersif" />
          </Field>
          <Field label="Niveau de langage">
            <Input value={value.language_level || ''} onChange={(e) => onChange({ language_level: e.target.value })} placeholder="Ex. courant soutenu, accessible" />
          </Field>
          {fiction && (
            <Field label="Point de vue narratif">
              <Input value={value.narrative_pov || ''} onChange={(e) => onChange({ narrative_pov: e.target.value })} placeholder="Ex. première personne, narratrice" />
            </Field>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Univers et matière première</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Époque">
              <Input value={value.era || ''} onChange={(e) => onChange({ era: e.target.value })} placeholder="Ex. Sicile, années 1990" />
            </Field>
            <Field label="Lieux">
              <Input value={value.places || ''} onChange={(e) => onChange({ places: e.target.value })} placeholder="Ex. Palerme, une villa isolée" />
            </Field>
          </div>
          <Field
            label={fiction ? 'Personnages principaux' : 'Intervenants / cas cités'}
            hint="Un par ligne : nom, rôle, particularité."
          >
            <Textarea
              rows={4}
              value={value.main_characters || ''}
              onChange={(e) => onChange({ main_characters: e.target.value })}
              placeholder={fiction ? 'Elena, 34 ans, avocate — elle ignore le pacte familial\nSalvatore, son beau-père — garde un secret' : 'Marie, autrice débutante — publie son premier guide'}
            />
          </Field>
          <Field label="Contraintes particulières" hint="Ce que l’IA ne doit jamais faire ni oublier.">
            <Textarea
              rows={3}
              value={value.constraints || ''}
              onChange={(e) => onChange({ constraints: e.target.value })}
              placeholder="Ex. aucune scène explicite, chronologie sur 3 semaines, pas de flashback"
            />
          </Field>
          <Field label="Informations ou documents sources" hint="Collez ici vos notes, extraits ou recherches.">
            <Textarea
              rows={5}
              value={value.source_notes || ''}
              onChange={(e) => onChange({ source_notes: e.target.value })}
              placeholder="Notes, plan existant, documentation…"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch checked={!!value.with_images} onCheckedChange={(v) => onChange({ with_images: v })} id="with-images" />
              <Label htmlFor="with-images" className="text-sm">Livre avec illustrations</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={value.mode === 'auto'}
                onCheckedChange={(v) => onChange({ mode: v ? 'auto' : 'guide' })}
                id="mode-auto"
              />
              <Label htmlFor="mode-auto" className="text-sm">
                Mode automatique {value.mode === 'auto' ? '(l’IA enchaîne les étapes)' : '(je valide chaque étape)'}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={onSubmit} disabled={saving || (value.title || '').trim().length < 3}>
          {saving ? 'Enregistrement…' : submitLabel || 'Enregistrer la fiche maître'}
        </Button>
      </div>
    </div>
  );
};

export default MasterSheetForm;
