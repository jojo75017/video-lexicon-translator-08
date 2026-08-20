/**
 * Une fiche chapitre du Sommaire Stratégique : titre, objectif, points à traiter,
 * mise en forme riche, mot-clé, ton, longueur, verrouillage et glisser-déposer.
 */
import { useState } from 'react';
import {
  ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, GripVertical, Lock, LockOpen,
  Merge, Plus, Scissors, Trash2, X,
} from 'lucide-react';
import type { BriefOutlineChapter, OutlineBlockId } from '@/lib/v3/bookBrief';
import { OUTLINE_BLOCKS } from '@/lib/v3/outlineStudio';

type Props = {
  chapter: BriefOutlineChapter;
  index: number;
  total: number;
  fallbackWords: number;
  onPatch: (patch: Partial<BriefOutlineChapter>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMerge: () => void;
  onSplit: () => void;
  onInsertAfter: () => void;
  onDragStart: () => void;
  onDropOn: () => void;
};

const inputStyle = { borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: '#fff' } as const;

export default function V3OutlineChapterCard({
  chapter, index, total, fallbackWords, onPatch, onMove, onRemove, onDuplicate,
  onMerge, onSplit, onInsertAfter, onDragStart, onDropOn,
}: Props) {
  const [open, setOpen] = useState(false);
  const [newPoint, setNewPoint] = useState('');
  const points = chapter.points || [];
  const blocks = chapter.blocks || [];

  const toggleBlock = (id: OutlineBlockId) => {
    onPatch({ blocks: blocks.includes(id) ? blocks.filter((b) => b !== id) : [...blocks, id] });
  };

  const addPoint = () => {
    const value = newPoint.trim();
    if (!value) return;
    onPatch({ points: [...points, value] });
    setNewPoint('');
  };

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onDropOn(); }}
      className="rounded-xl border px-3 py-2"
      style={{ borderColor: chapter.locked ? 'var(--v3-gold, #c9a84c)' : 'var(--v3-border)', background: '#fff' }}
    >
      <div className="flex items-start gap-2">
        <span className="mt-2 cursor-grab" title="Glisser pour réordonner" style={{ color: 'var(--v3-muted)' }}>
          <GripVertical className="h-4 w-4" />
        </span>
        <span className="mt-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
          Ch. {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <input
            value={chapter.titre}
            onChange={(e) => onPatch({ titre: e.target.value })}
            placeholder="Titre du chapitre"
            className="w-full rounded-lg border px-2 py-1.5 text-sm font-bold outline-none"
            style={inputStyle}
          />
          <input
            value={chapter.objectif || ''}
            onChange={(e) => onPatch({ objectif: e.target.value })}
            placeholder="Objectif du chapitre (ce que le lecteur gagne)"
            className="mt-1 w-full rounded-lg border px-2 py-1.5 text-xs outline-none"
            style={{ ...inputStyle, color: 'var(--v3-muted)' }}
          />
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]" style={{ color: 'var(--v3-muted)' }}>
            <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1 font-bold uppercase tracking-wider">
              {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Détails éditoriaux
            </button>
            {points.length > 0 && <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(140,106,63,0.1)' }}>{points.length} point(s)</span>}
            {blocks.length > 0 && <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(201,168,76,0.18)' }}>{blocks.length} bloc(s)</span>}
            <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(6,78,59,0.08)' }}>
              ~{chapter.wordsTarget || fallbackWords} mots
            </span>
            {chapter.keyword && <span className="rounded-full px-2 py-0.5" style={{ background: 'rgba(6,78,59,0.08)' }}>{chapter.keyword}</span>}
          </div>
        </div>
        <div className="mt-1 flex flex-col gap-1">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} title="Monter"
            className="rounded-lg border p-1.5 disabled:opacity-40" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} title="Descendre"
            className="rounded-lg border p-1.5 disabled:opacity-40" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onRemove} title="Supprimer ce chapitre"
            className="rounded-lg border p-1.5" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 space-y-3 rounded-xl border p-3" style={{ borderColor: 'var(--v3-border)', background: 'rgba(140,106,63,0.04)' }}>
          {/* Points à traiter */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
              Points à traiter obligatoirement
            </p>
            <ul className="mt-1.5 space-y-1">
              {points.map((point, pi) => (
                <li key={pi} className="flex items-center gap-1.5">
                  <input
                    value={point}
                    onChange={(e) => onPatch({ points: points.map((p, i) => (i === pi ? e.target.value : p)) })}
                    className="w-full rounded-lg border px-2 py-1 text-xs outline-none"
                    style={inputStyle}
                  />
                  <button type="button" title="Retirer ce point" onClick={() => onPatch({ points: points.filter((_, i) => i !== pi) })}
                    className="rounded-lg border p-1" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-1.5 flex gap-1.5">
              <input
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPoint(); } }}
                placeholder="Ajouter un point (ex. : l’erreur n°1 des débutants)"
                className="w-full rounded-lg border px-2 py-1 text-xs outline-none"
                style={inputStyle}
              />
              <button type="button" onClick={addPoint} className="v3-btn v3-btn-outline text-[11px]">
                <Plus className="h-3 w-3" /> Ajouter
              </button>
            </div>
          </div>

          {/* Mise en forme riche */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
              Mise en forme demandée à l’IA
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {OUTLINE_BLOCKS.map((block) => {
                const active = blocks.includes(block.id);
                return (
                  <button
                    key={block.id}
                    type="button"
                    title={block.hint}
                    onClick={() => toggleBlock(block.id)}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-semibold transition"
                    style={{
                      borderColor: active ? 'var(--v3-gold, #c9a84c)' : 'var(--v3-border)',
                      background: active ? 'rgba(201,168,76,0.18)' : '#fff',
                      color: 'var(--v3-ink)',
                    }}
                  >
                    {block.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Réglages fins */}
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
              Mot-clé Amazon
              <input value={chapter.keyword || ''} onChange={(e) => onPatch({ keyword: e.target.value })}
                className="mt-1 w-full rounded-lg border px-2 py-1 text-xs outline-none" style={inputStyle} />
            </label>
            <label className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
              Ton du chapitre
              <input value={chapter.tone || ''} onChange={(e) => onPatch({ tone: e.target.value })}
                placeholder="ex. : direct, chaleureux"
                className="mt-1 w-full rounded-lg border px-2 py-1 text-xs outline-none" style={inputStyle} />
            </label>
            <label className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
              Mots visés
              <input
                type="number" min={200} step={100}
                value={chapter.wordsTarget || ''}
                onChange={(e) => onPatch({ wordsTarget: Number(e.target.value) > 0 ? Number(e.target.value) : undefined })}
                placeholder={String(fallbackWords)}
                className="mt-1 w-full rounded-lg border px-2 py-1 text-xs outline-none" style={inputStyle} />
            </label>
          </div>

          <label className="block text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            Question réelle du lecteur
            <input value={chapter.readerQuestion || ''} onChange={(e) => onPatch({ readerQuestion: e.target.value })}
              placeholder="ex. : combien de temps avant mes premières ventes ?"
              className="mt-1 w-full rounded-lg border px-2 py-1 text-xs outline-none" style={inputStyle} />
          </label>

          <label className="block text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            Consigne transmise mot pour mot à l’IA
            <textarea value={chapter.note || ''} onChange={(e) => onPatch({ note: e.target.value })} rows={2}
              placeholder="ex. : raconte l’anecdote du premier client, sans jargon"
              className="mt-1 w-full rounded-lg border px-2 py-1 text-xs outline-none" style={inputStyle} />
          </label>

          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => onPatch({ locked: chapter.locked ? undefined : true })} className="v3-btn v3-btn-outline text-[11px]">
              {chapter.locked ? <><LockOpen className="h-3 w-3" /> Déverrouiller</> : <><Lock className="h-3 w-3" /> Verrouiller</>}
            </button>
            <button type="button" onClick={onDuplicate} className="v3-btn v3-btn-outline text-[11px]">
              <Copy className="h-3 w-3" /> Dupliquer
            </button>
            <button type="button" onClick={onSplit} className="v3-btn v3-btn-outline text-[11px]">
              <Scissors className="h-3 w-3" /> Scinder en deux
            </button>
            <button type="button" onClick={onMerge} disabled={index === total - 1} className="v3-btn v3-btn-outline text-[11px] disabled:opacity-40">
              <Merge className="h-3 w-3" /> Fusionner avec le suivant
            </button>
            <button type="button" onClick={onInsertAfter} className="v3-btn v3-btn-outline text-[11px]">
              <Plus className="h-3 w-3" /> Insérer après
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
