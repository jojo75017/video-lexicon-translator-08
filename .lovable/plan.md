## Objectif

1. Annoncer le parrainage dans le bandeau `UrgencyBanner` avec la **couleur orange charte** (`#FF9E2D` / `kdp-orange`).
2. **Verrouiller le programme** jusqu'au **1er juillet 2026** : aucun lien de parrainage récupérable, aucune action possible avant cette date.

## Modifications

### 1. `src/components/sales/UrgencyBanner.tsx`
- Remplacer le fond actuel `bg-secondary` par un fond **orange charte** (`bg-[#FF9E2D]` ou `bg-kdp-orange`) avec texte sombre lisible.
- Ajouter en tête de la liste de messages :
  - 🎁 **"Programme de parrainage — à votre succès ! Lancement officiel le 1er juillet"**
  - ⏳ **"Parrainage : ouverture le 1er juillet — préparez vos contacts"**
- Pas de lien cliquable (le programme n'est pas actif).

### 2. Verrouillage du parrainage avant le 1er juillet 2026

Créer une constante partagée `REFERRAL_LAUNCH_DATE = new Date("2026-07-01T00:00:00+02:00")` (dans `src/lib/referralLaunch.ts` ou similaire) + helper `isReferralActive()`.

Sur la page `/promo/affilie` (`src/pages/promo/PromoAffiliePage.tsx`) et tout composant exposant le **lien de parrainage / dashboard filleuls** :
- Si `Date.now() < REFERRAL_LAUNCH_DATE` → afficher un écran "🔒 Programme de parrainage — Ouverture le 1er juillet 2026" avec compte à rebours, et **masquer** le lien personnel + boutons de partage.
- Sinon → comportement actuel inchangé.

Vérifier également :
- `src/hooks/useReferral.ts` / `useReferralTracking.ts` : ne pas générer/exposer le code avant la date (retourner `null` ou `locked: true`).
- Composants liés (boutons "Copier mon lien", widgets dashboard parrainage) : afficher l'état verrouillé.

### 3. Footer `FunnelLayout`
Le lien "💰 Programme d'affiliation - 30%" reste visible mais redirige vers la page verrouillée (avec compte à rebours), pas de changement de routing.

## Hors scope
- Pas de modification du tracking serveur (sera réactivé naturellement le 1er juillet).
- Pas de retrait du lien dans la navigation — la page elle-même gère le verrouillage.
- Pas de touche au CTA 67€ ni aux autres bandeaux.
