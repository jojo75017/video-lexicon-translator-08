import { describe, expect, it } from 'vitest';
import { canResumeBook, detectBookType, nonFictionProductionPrompt, wizardStepAfter } from '../../../supabase/functions/_shared/bookWritingPolicy';

describe('guide pratique sans dérive romanesque', () => {
  it('guide déclenche le moteur pédagogique, roman garde son moteur', () => {
    expect(detectBookType('TYPE DE LIVRE : Guide pratique / Tutoriel').nonFiction).toBe(true);
    expect(detectBookType('TYPE DE LIVRE : Roman / Fiction').nonFiction).toBe(false);
  });
  it('les guides sautent les personnages à l’aller et au retour, pas les romans', () => {
    expect(wizardStepAfter(2, false, 1)).toBe(4);
    expect(wizardStepAfter(4, false, -1)).toBe(2);
    expect(wizardStepAfter(2, true, 1)).toBe(3);
  });
  it('ne reprend pas un roman de même titre pour un guide', () => {
    expect(canResumeBook('Potager', 'TYPE DE LIVRE : Guide pratique', 'Potager', 'TYPE DE LIVRE : Roman')).toBe(false);
    expect(canResumeBook('Potager', 'TYPE DE LIVRE : Guide pratique', 'Potager', 'TYPE DE LIVRE : Guide pratique')).toBe(true);
    expect(canResumeBook('Potager', '', 'Autre livre', '')).toBe(false);
  });
  it('impose des étapes et interdit les personnages dans les chapitres et segments', () => {
    const policy = detectBookType('TYPE DE LIVRE : Guide pratique').directive;
    for (const segmented of [true, false]) {
      const prompt = nonFictionProductionPrompt(policy, segmented);
      expect(prompt).toContain('étapes numérotées');
      expect(prompt).toContain('aucun personnage fictif');
      expect(prompt).toContain("Respecte mot pour mot les titres et l'ordre du sommaire validé");
    }
  });
});