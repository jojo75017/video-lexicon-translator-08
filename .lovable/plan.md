## Problème

L'onglet **Attente** (`/admin/attente`) n'affiche que des résumés courts : chaque sujet gelé tient dans une petite carte avec 2 phrases. Les décisions détaillées (prix, modules, limites par plan, conditions de résiliation, stratégie V4 en 15 modules) sont écrasées en une seule ligne de texte, donc illisible.

## Ce que je vais faire

Réécrire `src/pages/admin/AdminAttentePage.tsx` pour que chaque sujet gelé devienne une fiche complète et dépliable, avec l'intégralité de ce qui a été décidé en conversation.

### Structure de chaque fiche (Accordion shadcn, ouvrable/fermable)

En-tête toujours visible : numéro, titre, badge date de reprise, statut « Gelé ».

Contenu déplié, en sections :
1. **Objectif** — ce qu'on veut obtenir, en clair.
2. **Décisions actées** — liste à puces de tout ce qui a été validé (tarifs exacts, limites, règles).
3. **Détail technique** — tables/fonctions/pages concernées quand c'est pertinent.
4. **Pourquoi gelé** — la citation exacte de la demande de mise en attente.
5. **Conditions de reprise** — ce qui doit arriver pour débloquer (date, réception de clés API, décision).

### Contenu complet à restituer (5 sujets)

1. **Facturation annuelle + tacite reconduction** — 3 plans (Débutant 9,99 €/mois, Expert 12,99 €/mois, Auteur/Éditeur 59 €), option annuelle avec économie affichée, tacite reconduction chaque année, résiliation self-service, portail client pour annulation, synchro des annulations côté backend.
2. **Essai gratuit — 1 ebook sans workflow** — 1 projet, 8 chapitres max, génération 1 passe, export PDF filigrané, pas d'accès au workflow multi-agents, offre lifetime V2/V3 honorée, palier `trial` dans les droits utilisateur.
3. **Améliorations workflows V3 (août 2026)** — Débutant : 10 livres/mois, 20 chapitres, workflow standard. Expert : 20 livres/mois, 40 chapitres, presets Kids Book. Éditeur 59 € : Mode Recherche Approfondie, enrichissement marché en amont du plan, fiches produit KDP automatiques, pack ZIP complet, qualité éditoriale renforcée.
4. **KDP Pilot + lien affilié** — intégration Amazon PA-API pour BSR réel, volumes de mots-clés, notes concurrents ; carte d'affiliation KDP Pilot avec commission ; option d'un abonnement 19 €/mois côté backend comme source de données mutualisée. Bloqué en attente des clés PA-API.
5. **Stratégie V4 (2027) — Maison d'Édition Professionnelle** — forfaits 19 € / 29 € / 79 €, upgrade fidélité pour les lifetime V2+V3 (V4 non incluse), et les **15 modules listés un par un** avec une phrase de description chacun : Market Intelligence Hub, Data Layer multi-sources, Quota & metering, Niche Validator, Keyword Engine Pro, Deep Research Writing, Editorial Board, Style DNA, Studio Illustration unifié, Séries & Univers, Publication Pack KDP, Post-Launch Tracker, Pricing Optimizer, Ads & Lancement, Abonnements & entitlements.

### Ergonomie

- Bouton « Tout déplier / Tout replier » en haut.
- Première fiche ouverte par défaut.
- Texte en pleine largeur avec interlignage lisible, plus de troncature ni de blocs compressés.
- Rappel de la règle de conduite (aucun code ni migration avant la date de reprise) conservé en haut.

### Fichiers touchés

- `src/pages/admin/AdminAttentePage.tsx` — réécriture de l'affichage et enrichissement des données.
- `.lovable/plan-attente.md` — mise à jour pour refléter le même niveau de détail (source de vérité écrite).

Aucun changement de route, de navigation, de base de données ni de logique métier. Rien n'est dégelé : c'est uniquement de l'affichage.
