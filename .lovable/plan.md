# Enrichissement V3 — Nouveaux modules à ajouter

## Constat

Les ~38 modules V3 actuels sont tous en statut `done`. Pour continuer à muscler l'offre **Publication Assistée Pro (197€)** et se rapprocher de la référence kdpaiccelerator, voici une sélection de modules **nouveaux** (aucun doublon avec l'existant), répartis par pilier. La liste reste éditable : on garde, retire ou réordonne avant de coder.

## Nouveaux modules proposés

### 📦 Publier
1. **Convertisseur Manuscrit Universel** — importe `.docx`/`.pdf`/Google Docs et nettoie automatiquement (styles, sauts de page, notes) vers format KDP propre.
2. **Vérificateur de Conformité Contenu** — détecte contenu interdit KDP (liens, mentions concurrents, langage promo) avant soumission pour éviter le blocage.
3. **Générateur Page de Copyright / Mentions légales** — page légale + dédicace + table des matières cliquable, multi-langue.

### 💰 Monétiser
4. **Simulateur de Royalties Multi-Prix** — compare gains nets 35% vs 70% selon prix et marché, avec point d'équilibre.
5. **Détecteur de Niches Rentables (KU)** — croise demande/concurrence pour estimer le potentiel de pages lues KU.
6. **Stratégie de Prix de Lancement Dynamique** — calendrier prix montant (0,99€ → prix cible) sur les premiers jours.

### 📣 Marketing
7. **Calendrier Éditorial Réseaux 30 jours** — planning de posts multi-plateformes généré depuis le livre.
8. **Générateur de Visuels Citations** — extrait des phrases fortes du manuscrit en visuels partageables.
9. **Kit Presse / Media Kit Auteur** — dossier de presse (bio, pitch, couverture HD, FAQ) prêt à envoyer.
10. **Optimiseur Goodreads** — fiche, description et plan d'animation lecteurs Goodreads.

### 🧠 IA avancée
11. **Agent P23 — Cohérence Univers (Bible)** — vérifie continuité noms/lieux/timeline sur toute une série.
12. **Agent P24 — Détecteur de Clichés & Répétitions** — repère tics d'écriture, répétitions et formules toutes faites.
13. **Agent P25 — Adaptation de Ton par Public** — réécrit un passage selon la cible (ados, pro, grand public).
14. **Agent P26 — Score de Potentiel Commercial** — note hook, titre, couverture et niche pour prédire le succès.

## Mise en œuvre (quand validé)

- **Source de vérité** : ajouter chaque module choisi dans `src/data/roadmapV3.ts` (statut `todo`).
- Suivre le patron existant : composant autonome dans `src/components/admin/`, thème clair KDP (teal #008296 / hover #FF9E2D), IA via clé Gemini BYOK (`aiWritingService`).
- Câblage cockpit dans `src/pages/AdminCockpitPage.tsx` (id `clickable`, largeur dialog, branche de rendu).
- Persistance locale (`localStorage`) pour les données utilisateur.
- Lancement progressif (octobre) : on bascule `todo → in_progress → done` au fil de la construction.

## À confirmer avant de coder

- Quels modules de cette liste retenir (tous, ou un sous-ensemble) ?
- Faut-il juste **inscrire** ces modules dans la roadmap V3 (statut `todo`, visibles dans le cockpit) ou aussi **commencer à en construire** maintenant ?
