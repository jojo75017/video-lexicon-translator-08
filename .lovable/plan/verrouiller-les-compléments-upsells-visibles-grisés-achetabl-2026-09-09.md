# Verrouiller les compléments (upsells) : visibles, grisés, achetables

## Le problème constaté
Aujourd'hui les outils vendus en complément sont ouverts à tout abonné. Exemple vérifié : la page Livre audio (`/v3/outils/audiobook`) et Revenus & Scaling (`/v3/outils/royalties`) ne vérifient que « V3 ouvert + abonné », jamais l'achat du complément. Vérifié aussi : la table des achats de compléments est aujourd'hui **vide** — personne n'a encore acheté de complément, donc aucun client réel ne perd un accès qu'il a payé.

## Ce qui va changer
Chaque outil vendu séparément devient : **visible, grisé, non utilisable**, avec par-dessus un encart clair « Complément — 27 € · paiement unique » et un bouton **Débloquer** qui ouvre réellement le paiement (Stripe / PayPal déjà en place). Après paiement, l'outil s'ouvre tout seul.

Accès automatique sans achat, pour :
- vous (admin) ;
- le forfait Édition (tout inclus) ;
- toute personne qui a acheté ce complément.

## La liste à valider (gratuit / payant)
Vous ne vous souvenez plus de la répartition : voici celle que j'appliquerai, telle qu'elle est déjà écrite dans les tarifs de l'app.

**Inclus dans l'abonnement (restent libres)**
Rédaction du manuscrit, plan/chapitres, bible du livre, couverture express et Mes couvertures, éditeur de texte, humaniseur, sommaire, métadonnées Amazon de base, galerie, communauté, profil auteur, kit de démarrage, parrainage.

**Payants (deviennent grisés jusqu'à l'achat)**
| Outil | Prix |
|---|---|
| BookPerfect AI — correction éditoriale | 47 € |
| Livre audio / Audiolivre Premium | 27 € (ou 9,99 € pour un seul livre) |
| Traductions relues 10 langues | 27 € |
| Revenus & Scaling (royalties) | 47 € |
| Distribution Large | 47 € |
| Trafic Social | 47 € |
| Qualité Éditoriale | 47 € |
| Étude de Marché | 47 € |
| Documentation Studio | 47 € |
| Promotion Éditeur | 27 € |
| Transcription audio/vidéo | 27 € |
| Jeux & Énigmes, Cherche & Trouve, Histoires Courtes | 27 € chacun |
| Cover Studio Pro (maison d'édition) | 67 € — déjà verrouillé |
| Pack Boost de Lancement | 17 € |

Dites-moi si un outil doit changer de colonne, je l'ajuste avant de coder.

## Sur la page UPSELLS
- Les cartes non achetées affichent un cadenas et le bouton **Débloquer — prix** (paiement immédiat).
- Les cartes déjà acquises (ou incluses) affichent **Ouvrir** en vert.
- Plus aucun bouton n'emmène vers un outil utilisable sans achat.

## Détails techniques
- Nouveau hook générique `useModuleAccess(moduleKey)` : admin, `hasFull`, puis `get_my_module_entitlements` (statuts `active/completed/paid`, filtre environnement Stripe) — même logique que `useBookPerfectAccess`, factorisée.
- Nouvelle table de correspondance unique `src/data/v3ModuleAccess.ts` : route → clé de module → prix → `priceId`, alignée sur `UPSELL_PACK_MODULES` du webhook `payments-webhook` pour que l'achat débloque bien la bonne clé.
- Nouveau composant `V3ModulePaywall.tsx` : rend l'outil derrière un voile grisé (`pointer-events-none`, opacité) + carte d'achat qui ouvre `V3UpsellCheckout` / `V3SubscribeCheckout` déjà existants ; à l'issue du paiement, rafraîchit l'accès.
- Routes concernées enveloppées dans ce composant dans `App.tsx`, sans toucher `V3LockedGate` ni `TrialGate`.
- `V3UpsellPromoCard` : l'état « Ouvrir » ne dépend plus seulement de `hasFull`/`included` mais de l'accès réel au module.
- Aucun changement de base de données, de sécurité, de calculs KDP, de tarifs ni des fonctions de paiement. Les hooks spécifiques existants (`useBookPerfectAccess`, `useBdComicAccess`, `useCoverProAccess`…) restent en place et deviennent des cas particuliers du hook générique.

## Vérification
- Compte admin : tous les outils ouverts.
- Compte abonné sans achat : outil grisé, inutilisable, bouton Débloquer ouvre bien le paiement.
- Contrôle en base qu'un achat enregistré ouvre immédiatement l'outil correspondant.
