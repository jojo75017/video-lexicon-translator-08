# V3 : finaliser les 2 forfaits + débloquer la création de livre

Deux chantiers dans ce lot : (1) verrouiller les avantages exacts de Plume et Édition partout dans l'app, (2) réparer le blocage qui empêche de lancer la création d'un livre depuis l'onglet Créer.

## 1. Les avantages, forfait par forfait

Principe assumé : **aucun onglet n'est amputé**. Les deux forfaits donnent accès à tout le studio. Édition = la version professionnelle des mêmes outils + les upsells inclus + le quota illimité.

### Plume — 29 €/mois ou 290 €/an (2 mois offerts)

Ce que l'abonné a :
- 30 livres par mois
- Tous les onglets : Plan, Écrire, Habiller, Publier, Vendre
- Workflow 22 agents (P1 → P22)
- 40 chapitres max · 5 000 mots par chapitre · 8 personnages
- Sommaire Ultime + validation du plan
- Export PDF / DOCX / EPUB avec sommaire propre
- Couverture complète : recto + tranche + 4e de couverture (wrap PDF prêt KDP)
- **Audiolivre inclus** (voix standard)
- Import de manuscrit : DOCX, PDF, URL (15 / mois)
- Livre illustré maternelle + Histoires du soir 3-7 ans
- Traductions 10 langues incluses
- Recherche de niches (20 / mois), mots-clés Amazon, catégories, description KDP
- KDP Pilot : audit complet, BSR quotidien, 30 suggestions de mots-clés, scan Top 10
- Forum communauté + support email 24 h

### Édition — 49 €/mois ou 490 €/an (2 mois offerts)

Tout Plume, plus :
- **Livres illimités**
- **Mode Recherche Approfondie** (workflow renforcé, sources élargies) — 30 agents (P1 → P30)
- 60 chapitres max · 8 000 mots par chapitre · personnages illimités
- **Cover Studio Pro** : 300 DPI, gabarits KDP, variantes illimitées, direction artistique IA
- **Audiolivre Pro** : voix premium, chapitrage, export long, prêt ACX
- **BD Studio Pro**
- **KDP Pilot Pro** : scoring expert 12 critères, BSR live + historique 30 j, 100 mots-clés, comparateur multi-niches, plan d'action IA 30/60/90 j, rapports PDF/CSV, audits illimités
- Amazon Spy / Audit ASIN / mots-clés avancés
- Pack KDP prêt à publier (ZIP) + checklist pré-publication
- Publication pro + KDP étranger, sélection maisons d'édition
- Centre business : CRM, prospects, affiliation, dashboard marketing, influenceurs
- **Upsells inclus** au lieu d'être payants : BookPerfect AI, relecture IA premium, sélection éditeurs, packs marketing
- Masterclass + coaching mensuel + support prioritaire 12 h

### Ce qu'il reste à propager

Les fichiers de tarifs et de droits sont déjà passés à `plume` / `edition`. À terminer :
- Créer les 4 prix chez le fournisseur de paiement : 29 €/mois, 290 €/an, 49 €/mois, 490 €/an (IDs stables `v3_plume_monthly`, `v3_plume_annual`, `v3_edition_monthly`, `v3_edition_annual`, code fiscal service numérique).
- Passer les droits d'accès existants vers les nouveaux niveaux sans casser personne : anciens Débutant / Studio → Plume ; ancien Éditeur / VIP / accès à vie 47 € → Édition.
- Badge « Version Pro — Édition » sur les fonctions pro, avec lien vers la page forfaits — jamais de blocage sec d'un onglet.
- Tableau comparatif sous les cartes tarifs : mention « standard » / « pro » plutôt que coche / croix.
- Mettre la mémoire projet à jour (l'ancienne note KDP Pilot parle encore de 3 forfaits).

## 2. Pourquoi la création de livre est bloquée

Constat vérifié sur `/v3/create` : la page s'affiche, mais le bouton **Lancer le workflow** reste désactivé et affiche « Il manque encore : le titre, le nom de l'auteur, le synopsis, la Cible & Promesse (bouton IA), la validation du sommaire ».

Deux causes réelles :

1. **Cinq conditions obligatoires, toutes bloquantes.** Le workflow refuse de démarrer sans titre, auteur, synopsis de 30 caractères, Cible & Promesse générée par l'IA **et** sommaire validé. Un abonné qui veut juste lancer son livre est arrêté par deux étapes IA préalables.
2. **La génération du sommaire exige une clé IA personnelle.** Sans clé Gemini enregistrée, le bouton « Générer le sommaire » refuse de partir. Comme le sommaire validé est une condition du lancement, l'absence de clé bloque toute la création — l'abonné se retrouve dans une impasse.

### Ce qu'on change

- **Réduire les conditions bloquantes à l'essentiel** : titre + auteur + synopsis. La Cible & Promesse et le sommaire deviennent des étapes recommandées, pas des verrous : si le sommaire n'est pas validé, le workflow le génère lui-même à la première étape.
- **Repli serveur quand l'abonné n'a pas de clé** : la génération de sommaire passe par la fonction serveur (comme le fait déjà la Cible & Promesse) au lieu d'échouer. La clé personnelle reste prioritaire quand elle existe, avec un message clair sur son intérêt (volume, rapidité) plutôt qu'un blocage.
- **Message d'état lisible** : au lieu d'une liste de reproches, indiquer ce qui manque vraiment pour partir et ce que l'IA complétera automatiquement.
- **Quota affiché** : sur l'onglet Créer, rappeler le quota du forfait (30 livres / mois sur Plume, illimité sur Édition) et le niveau du workflow (standard ou Recherche Approfondie).

## Détails techniques

- `src/components/v3public/V3BriefRecap.tsx` : le tableau `missing` ne conserve que titre / auteur / synopsis pour calculer `ready` ; Cible & Promesse et sommaire passent dans une liste « conseillé » non bloquante.
- `src/components/v3public/V3OutlinePanel.tsx` : supprimer le retour anticipé quand `resolveProvider()` est vide ; router l'appel vers une fonction serveur de secours et ne conserver le message clé IA qu'en information.
- `src/components/v3public/V3CreateWizard.tsx` : si `outlineValidated` est faux au lancement, générer le sommaire en première étape avant les agents.
- `src/data/v3Pricing.ts`, `src/data/v3ToolPlans.ts`, `src/data/kdpPilotTiers.ts`, `src/config/kidsBookConfig.ts` : déjà en 2 forfaits, servir de source unique aux affichages.
- `src/hooks/useV3Entitlement.ts` : mapper les anciens paliers et l'accès à vie 47 € vers `plume` / `edition`.
- `supabase/functions/v3-subscription-checkout/index.ts` : `ALLOWED_PRICES` déjà aligné sur les 4 nouveaux IDs ; `paypal-subscribe` aligné sur 29 / 290 / 49 / 490.

## Hors périmètre

- L'offre accès à vie 47 € sur `/commander` reste inchangée jusqu'au 30/09/2026 ; les abonnements ne démarrent qu'au 01/10/2026.
- Aucun email ni campagne marketing dans ce lot.
