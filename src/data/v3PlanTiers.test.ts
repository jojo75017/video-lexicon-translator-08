import { describe, expect, it } from 'vitest';
import { isPathLockedForTier, minTierForPath, requiredPlanLabel } from './v3PlanTiers';

describe('Grille des 3 formules (Starter 27 € / Auteur 97 € / Édition 197 €)', () => {
  it('BD Studio est interdit à Starter, ouvert à Auteur et Édition', () => {
    expect(isPathLockedForTier('/bd-studio', 'starter')).toBe(true);
    expect(isPathLockedForTier('/bd-studio', 'auteur')).toBe(false);
    expect(isPathLockedForTier('/bd-studio', 'edition')).toBe(false);
  });

  it('Studio Couverture broché est interdit à Starter et Auteur, ouvert à Édition', () => {
    expect(isPathLockedForTier('/v3/studio-v4', 'starter')).toBe(true);
    expect(isPathLockedForTier('/v3/studio-v4', 'auteur')).toBe(true);
    expect(isPathLockedForTier('/v3/studio-v4', 'edition')).toBe(false);
  });

  it('Cover Studio KDP Pro est réservé à Édition', () => {
    expect(minTierForPath('/v3/cover-pro')).toBe('edition');
    expect(isPathLockedForTier('/v3/cover-pro', 'auteur')).toBe(true);
  });

  it('Album illustré jeunesse est réservé à Édition (préfixe le plus long gagne)', () => {
    expect(minTierForPath('/v3/create/album-illustre')).toBe('edition');
    expect(isPathLockedForTier('/v3/create/album-illustre', 'auteur')).toBe(true);
    expect(isPathLockedForTier('/v3/create/album-illustre', 'edition')).toBe(false);
  });

  it('Audiolivres réservés à Édition', () => {
    expect(minTierForPath('/v3/outils/audiobook')).toBe('edition');
  });

  it('Je raconte un livre (/v3/create) est ouvert dès Auteur', () => {
    expect(minTierForPath('/v3/create')).toBe('auteur');
    expect(isPathLockedForTier('/v3/create', 'starter')).toBe(true);
    expect(isPathLockedForTier('/v3/create', 'auteur')).toBe(false);
  });

  it('Correction éditoriale et HumanizeAI sont ouverts dès Auteur', () => {
    expect(minTierForPath('/v3/corriger')).toBe('auteur');
    expect(minTierForPath('/v3/outils/humanizer')).toBe('auteur');
    expect(minTierForPath('/bookperfect')).toBe('auteur');
  });

  it('Traducteur 10 langues est ouvert à tous, Starter inclus', () => {
    expect(minTierForPath('/v3/outils/traduction')).toBeNull();
    expect(isPathLockedForTier('/v3/outils/traduction', 'starter')).toBe(false);
  });

  it('Écrire un livre (/v3/lancer) et les exports restent ouverts dès Starter', () => {
    expect(minTierForPath('/v3/lancer')).toBeNull();
    expect(minTierForPath('/v3/library')).toBeNull();
    expect(isPathLockedForTier('/v3/lancer', 'starter')).toBe(false);
  });

  it('Un compte sans nouvelle formule (client historique) ne voit aucun cadenas', () => {
    expect(isPathLockedForTier('/bd-studio', null)).toBe(false);
    expect(isPathLockedForTier('/v3/studio-v4', null)).toBe(false);
    expect(isPathLockedForTier('/v3/create', null)).toBe(false);
  });

  it('Le libellé du plan requis est correct pour l’affichage du cadenas', () => {
    expect(requiredPlanLabel('/bd-studio')).toBe('Auteur');
    expect(requiredPlanLabel('/v3/studio-v4')).toBe('Édition');
    expect(requiredPlanLabel('/v3/library')).toBeNull();
  });

  it('Les paramètres de requête n’influencent pas le verrou', () => {
    expect(minTierForPath('/v3/create?sommaire=ia')).toBe('auteur');
  });
});
