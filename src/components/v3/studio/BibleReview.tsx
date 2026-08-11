import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Merge, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { BibleContent, BibleChapter, isFictionKind } from '@/types/studioPro';
import EngineBadge from './EngineBadge';

interface Props {
  bookKind: string;
  bible: BibleContent;
  onChange: (patch: Partial<BibleContent>) => void;
  onRegenerateSection: (section: string, guidance?: string) => void;
  onValidate: () => void;
  onSaveDraft: () => void;
  busySection?: string | null;
  saving?: boolean;
}

const listToText = (rows: any[], keys: string[]) =>
  rows.map((r) => keys.map((k) => String(r?.[k] ?? '')).filter(Boolean).join(' — ')).join('\n');

/** Étape 3 — Validation de la Bible : lecture, édition libre, réorganisation des chapitres. */
const BibleReview: React.FC<Props> = ({
  bookKind, bible, onChange, onRegenerateSection, onValidate, onSaveDraft, busySection, saving,
}) => {
  const fiction = isFictionKind(bookKind);
  const [guidance, setGuidance] = useState('');

  const setChapter = (i: number, patch: Partial<BibleChapter>) => {
    const next = bible.structure.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    onChange({ structure: next });
  };
  const renumber = (rows: BibleChapter[]) => rows.map((c, i) => ({ ...c, numero: i + 1 }));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= bible.structure.length) return;
    const next = [...bible.structure];
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ structure: renumber(next) });
  };
  const removeChapter = (i: number) => onChange({ structure: renumber(bible.structure.filter((_, idx) => idx !== i)) });
  const addChapter = (i: number) => {
    const next = [...bible.structure];
    next.splice(i + 1, 0, { numero: 0, titre: 'Nouveau chapitre', objectif: '', resume: '', sous_chapitres: [], mots_vises: 1800 });
    onChange({ structure: renumber(next) });
  };
  const mergeWithNext = (i: number) => {
    if (i + 1 >= bible.structure.length) return;
    const a = bible.structure[i];
    const b = bible.structure[i + 1];
    const merged: BibleChapter = {
      numero: 0,
      partie: a.partie,
      titre: a.titre,
      objectif: [a.objectif, b.objectif].filter(Boolean).join(' / '),
      resume: [a.resume, b.resume].filter(Boolean).join(' '),
      sous_chapitres: [...(a.sous_chapitres || []), ...(b.sous_chapitres || [])],
      mots_vises: (a.mots_vises || 0) + (b.mots_vises || 0) || 1800,
    };
    const next = [...bible.structure];
    next.splice(i, 2, merged);
    onChange({ structure: renumber(next) });
  };

  const SectionHeader: React.FC<{ title: string; section: string }> = ({ title, section }) => (
    <div className="flex items-center justify-between gap-3">
      <CardTitle className="text-base">{title}</CardTitle>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRegenerateSection(section, guidance)}
        disabled={!!busySection}
      >
        <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${busySection === section ? 'animate-spin' : ''}`} />
        Nouvelle proposition
      </Button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <EngineBadge engine="gemini" task="Architecture et cohérence" active={!!busySection} />
        <Badge variant="secondary">Aucune rédaction ne démarre avant votre validation</Badge>
      </div>

      <Card>
        <CardContent className="pt-5">
          <Input
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
            placeholder="Consigne pour l’architecte IA (ex. renforcer le retournement final, réduire la partie 2)"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><SectionHeader title="Concept, promesse et synopsis" section="synopsis" /></CardHeader>
        <CardContent className="space-y-3">
          <Input value={bible.concept} onChange={(e) => onChange({ concept: e.target.value })} placeholder="Concept général" />
          <Input value={bible.promise} onChange={(e) => onChange({ promise: e.target.value })} placeholder="Promesse du livre" />
          <Textarea rows={8} value={bible.synopsis} onChange={(e) => onChange({ synopsis: e.target.value })} placeholder="Synopsis" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><SectionHeader title={`Structure — ${bible.structure.length} chapitres`} section="structure" /></CardHeader>
        <CardContent className="space-y-3">
          {bible.structure.map((c, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm font-semibold text-muted-foreground">{i + 1}.</span>
                <Input value={c.titre || ''} onChange={(e) => setChapter(i, { titre: e.target.value })} placeholder="Titre du chapitre" />
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" title="Monter" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Descendre" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Fusionner avec le suivant" onClick={() => mergeWithNext(i)}><Merge className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Ajouter un chapitre après" onClick={() => addChapter(i)}><Plus className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Supprimer" onClick={() => removeChapter(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <Input value={c.objectif || ''} onChange={(e) => setChapter(i, { objectif: e.target.value })} placeholder="Objectif du chapitre" />
              <Textarea rows={2} value={c.resume || ''} onChange={(e) => setChapter(i, { resume: e.target.value })} placeholder="Résumé prévu" />
              <Textarea
                rows={2}
                value={(c.sous_chapitres || []).join('\n')}
                onChange={(e) => setChapter(i, { sous_chapitres: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Sous-chapitres (un par ligne)"
              />
            </div>
          ))}
          {bible.structure.length === 0 && (
            <Button variant="outline" onClick={() => addChapter(-1)}><Plus className="mr-1.5 h-4 w-4" />Ajouter un chapitre</Button>
          )}
        </CardContent>
      </Card>

      {fiction ? (
        <>
          <Card>
            <CardHeader><SectionHeader title="Personnages" section="characters" /></CardHeader>
            <CardContent className="space-y-3">
              {bible.characters.map((p, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2">
                  <div className="grid gap-2 md:grid-cols-3">
                    <Input value={p.nom || ''} placeholder="Nom" onChange={(e) => onChange({ characters: bible.characters.map((x, idx) => idx === i ? { ...x, nom: e.target.value } : x) })} />
                    <Input value={p.role || ''} placeholder="Rôle" onChange={(e) => onChange({ characters: bible.characters.map((x, idx) => idx === i ? { ...x, role: e.target.value } : x) })} />
                    <Input value={p.age || ''} placeholder="Âge" onChange={(e) => onChange({ characters: bible.characters.map((x, idx) => idx === i ? { ...x, age: e.target.value } : x) })} />
                  </div>
                  <Textarea
                    rows={3}
                    value={[p.personnalite, p.motivations, p.relations, p.secrets, p.arc].filter(Boolean).join('\n')}
                    onChange={(e) => onChange({ characters: bible.characters.map((x, idx) => idx === i ? { ...x, personnalite: e.target.value } : x) })}
                    placeholder="Personnalité, motivations, relations, secrets, arc"
                  />
                </div>
              ))}
              {bible.characters.length === 0 && <p className="text-sm text-muted-foreground">Aucun personnage pour l’instant.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><SectionHeader title="Chronologie" section="timeline" /></CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                value={listToText(bible.timeline, ['repere', 'evenement', 'consequence'])}
                onChange={(e) => onChange({ timeline: e.target.value.split('\n').filter(Boolean).map((l) => { const [repere, evenement, consequence] = l.split(' — '); return { repere, evenement, consequence }; }) })}
                placeholder="Repère — événement — conséquence (une ligne par entrée)"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><SectionHeader title="Lieux" section="places" /></CardHeader>
            <CardContent>
              <Textarea
                rows={5}
                value={listToText(bible.places, ['nom', 'description', 'importance'])}
                onChange={(e) => onChange({ places: e.target.value.split('\n').filter(Boolean).map((l) => { const [nom, description, importance] = l.split(' — '); return { nom, description, importance }; }) })}
                placeholder="Lieu — description — importance"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><SectionHeader title="Indices, révélations et retournements" section="plot_threads" /></CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                value={bible.plot_threads.map((t) => `${t.fil || ''} — planté ch.${t.plante_au_chapitre ?? '?'} — récolté ch.${t.recolte_au_chapitre ?? '?'} — ${t.type || ''}`).join('\n')}
                readOnly
                className="bg-muted/40"
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader><SectionHeader title="Progression pédagogique" section="pedagogy" /></CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              value={bible.pedagogy.map((p) => `Ch.${p.chapitre ?? '?'} — ${p.etape || ''} — acquis : ${p.acquis || ''}`).join('\n')}
              readOnly
              className="bg-muted/40"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Points de vigilance</CardTitle></CardHeader>
        <CardContent>
          <Textarea rows={3} value={bible.notes} onChange={(e) => onChange({ notes: e.target.value })} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-3 pb-6">
        <Button variant="outline" onClick={onSaveDraft} disabled={saving}>Enregistrer sans valider</Button>
        <Button size="lg" onClick={onValidate} disabled={saving || bible.structure.length < 2}>
          Valider la Bible et créer les chapitres
        </Button>
      </div>
    </div>
  );
};

export default BibleReview;
