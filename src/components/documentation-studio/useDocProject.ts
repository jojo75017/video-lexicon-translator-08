// Documentation Studio AI — état du projet, persistance locale, score & estimation
import { useCallback, useEffect, useMemo, useState } from 'react';
import { emptyProject, type DocProject } from './types';
import { ALL_DELIVERABLES } from './constants';

const STORAGE_KEY = 'docstudio_project_v1';

function load(): DocProject {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...emptyProject(), ...JSON.parse(raw) } as DocProject;
  } catch { /* ignore */ }
  return emptyProject();
}

export function useDocProject() {
  const [project, setProject] = useState<DocProject>(load);

  // Persistance locale (debounce léger).
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...project, updatedAt: new Date().toISOString() }));
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(t);
  }, [project]);

  const patch = useCallback((updater: (p: DocProject) => DocProject) => {
    setProject((prev) => updater(structuredClone(prev)));
  }, []);

  const reset = useCallback(() => setProject(emptyProject()), []);

  // ===== Score de complétude (style SEO) =====
  const scoreDetail = useMemo(() => computeScore(project), [project]);

  // ===== Estimation avant génération =====
  const estimation = useMemo(() => computeEstimation(project), [project]);

  return { project, patch, reset, setProject, score: scoreDetail.score, scoreDetail, estimation };
}

export interface ScoreItem { label: string; ok: boolean; weight: number; hint?: string }
export interface ScoreResult { score: number; items: ScoreItem[] }

function filled(v: string) { return typeof v === 'string' && v.trim().length > 0; }

function computeScore(p: DocProject): ScoreResult {
  const items: ScoreItem[] = [
    { label: 'Type de produit choisi', ok: !!p.productType, weight: 8, hint: 'Sélectionnez un type de produit (Étape 0).' },
    { label: 'Nom du produit', ok: filled(p.project.name), weight: 8, hint: 'Ajoutez le nom de votre produit.' },
    { label: 'Version renseignée', ok: filled(p.project.version), weight: 3 },
    { label: 'Entreprise / éditeur', ok: filled(p.project.company), weight: 4 },
    { label: 'Slogan', ok: filled(p.project.slogan), weight: 3, hint: 'Une phrase d\'accroche renforce le Brand Book.' },
    { label: 'Vision', ok: filled(p.positioning.vision), weight: 7 },
    { label: 'Mission', ok: filled(p.positioning.mission), weight: 7 },
    { label: 'Public cible', ok: filled(p.positioning.audience), weight: 7, hint: 'Décrivez à qui s\'adresse le produit.' },
    { label: 'Problème résolu', ok: filled(p.positioning.problem), weight: 7 },
    { label: 'Promesse unique', ok: filled(p.positioning.promise), weight: 6 },
    { label: 'Valeurs', ok: filled(p.positioning.values), weight: 4 },
    { label: 'Style / modèle visuel', ok: filled(p.identity.template), weight: 5 },
    { label: 'Couleurs de marque', ok: filled(p.identity.colors), weight: 3, hint: 'Indiquez vos couleurs (ex. #E8951E).' },
    { label: 'Au moins 1 module', ok: p.modules.length > 0, weight: 8, hint: 'Ajoutez les modules de votre produit.' },
    { label: 'Modules détaillés', ok: p.modules.length > 0 && p.modules.every((m) => filled(m.name) && filled(m.description)), weight: 4 },
    { label: 'Au moins 1 fonctionnalité', ok: p.features.length > 0, weight: 6, hint: 'Détaillez au moins une fonctionnalité clé.' },
    { label: 'Au moins 1 livrable sélectionné', ok: p.exports.length > 0, weight: 10, hint: 'Choisissez les documents à générer (Étape 7).' },
  ];
  const total = items.reduce((s, i) => s + i.weight, 0);
  const got = items.reduce((s, i) => s + (i.ok ? i.weight : 0), 0);
  return { score: Math.round((got / total) * 100), items };
}

export interface Estimation { deliverables: number; pages: number; words: number; minutes: number }

function computeEstimation(p: DocProject): Estimation {
  const selected = p.exports.filter((id) => ALL_DELIVERABLES.some((d) => d.id === id));
  const base = selected.length;
  // Volume dépend du contenu réellement saisi (modules + fonctionnalités + agents).
  const contentUnits = p.modules.length + p.features.length + p.agents.length;
  const pagesPerDeliverable = 3 + Math.round(contentUnits * 0.8);
  const pages = base * pagesPerDeliverable;
  const words = pages * 320;
  const minutes = Math.max(1, Math.round(base * 0.8 + contentUnits * 0.4));
  return { deliverables: base, pages, words, minutes };
}
