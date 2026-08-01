# 🧊 Sujets en attente

Gel demandé jusqu'après août 2026. Ce fichier contient l'intégralité des décisions prises sur chaque sujet gelé.
Vue admin correspondante : `/admin/attente`.

## Règle de conduite

- Aucun code, migration, edge function ou modification de base de données ne sera effectué sur ces sujets avant la date de reprise indiquée ou une nouvelle décision explicite.
- Ce fichier est relu et mis à jour à chaque reprise de l'un des sujets.

---

## 1. Facturation annuelle + tacite reconduction

**Reprise estimée : Septembre 2026**

### Objectif
Passer les 3 forfaits d'abonnement en facturation annuelle par défaut, avec tacite reconduction chaque année, tout en laissant l'abonné libre de résilier lui-même à tout moment.

### Décisions actées
- Trois plans concernés : Débutant 9,99 €/mois, Expert 12,99 €/mois, Auteur/Éditeur 59 €.
- Chaque plan propose une formule mensuelle et une formule annuelle, avec l'économie réalisée affichée clairement sur la formule annuelle.
- La formule annuelle est reconduite tacitement chaque année, sauf résiliation de l'abonné.
- Justification de la reconduction annuelle : les améliorations s'accumulent année après année, et la V4 très professionnelle arrive en 2027.
- L'abonné doit pouvoir résilier seul, sans passer par le support : accès à un portail client d'abonnement.
- Une résiliation coupe l'accès à la fin de la période déjà payée, pas immédiatement.
- Les annulations doivent redescendre automatiquement dans la base pour désactiver les droits au bon moment.

### Détail technique prévu
- Page des forfaits : ajout d'un sélecteur Mensuel / Annuel avec badge d'économie.
- Création d'un portail d'abonnement self-service (résiliation, changement de formule, historique de factures).
- Écoute des événements d'annulation d'abonnement pour synchroniser les droits utilisateur.
- Mise à jour des CGV : mention explicite de la tacite reconduction et des modalités de résiliation.

### Pourquoi gelé
« met cela en attente on en reparle » — puis « tout cela doit être mis en attente pour août ».

### Conditions de reprise
- Reprise prévue en septembre 2026, après le lancement V3 d'octobre.
- Nécessite une décision finale sur le prix annuel exact de chaque plan (remise appliquée).

---

## 2. Essai gratuit — 1 ebook sans workflow

**Reprise estimée : Septembre 2026**

### Objectif
Offrir une porte d'entrée gratuite au moment du lancement, suffisante pour que le prospect touche le produit, mais volontairement limitée pour ne pas cannibaliser les abonnements.

### Décisions actées
- 1 seul projet de livre autorisé par compte gratuit.
- 8 chapitres maximum sur ce projet.
- Génération en 1 seule passe : pas d'accès au workflow multi-agents complet.
- Export limité à un PDF filigrané (pas de DOCX, pas de pack KDP, pas d'export propre).
- Aucun accès aux modules Pro : pas de Cover Studio Pro, pas de BD Studio, pas de Recherche Approfondie.
- Les abonnés existants et les acheteurs de l'offre à vie ne sont pas impactés : leur accès V2 + V3 reste honoré intégralement.
- Question tranchée sur la V4 : les lifetime V2+V3 gardent V2 et V3 à vie, mais la V4 (2027) fera l'objet d'un supplément fidélité — ce n'est pas inclus dans l'offre à vie actuelle.

### Détail technique prévu
- Introduction d'un palier `trial` dans la logique de droits d'accès utilisateur.
- Blocage des exports non filigranés et des modules Pro pour ce palier.
- Compteur de projets plafonné à 1, compteur de chapitres plafonné à 8.
- Ajout d'une mention dans les conditions : V4 et versions ultérieures non incluses dans l'accès à vie V3.

### Pourquoi gelé
« ok met cela en attente ».

### Conditions de reprise
- Reprise prévue en septembre 2026.
- À décider avant reprise : durée de l'essai (illimité dans le temps ou fenêtre de X jours).

---

## 3. Améliorations workflows V3 (août 2026)

**Reprise estimée : Août 2026 selon planning utilisateur**

### Objectif
Différencier nettement la qualité de génération entre les trois plans, pour que le prix payé corresponde à une vraie différence de résultat — et que le plan haut de gamme justifie son tarif.

### Décisions actées
- Plan Débutant (9,99 €) : 10 livres par mois, 20 chapitres maximum, workflow standard, doit fonctionner sans accroc — la fiabilité passe avant la richesse.
- Plan Expert (12,99 €) : 20 livres par mois, 40 chapitres maximum, workflow enrichi, accès aux presets Livre Illustré et Histoires du soir 3-7 ans.
- Plan Éditeur (59 €) : Mode Recherche Approfondie activé — le workflow va chercher les informations beaucoup plus loin avant d'écrire.
- Éditeur : enrichissement marché en amont du plan du livre (analyse de niche, concurrence, angle éditorial) injecté dans les prompts des agents.
- Éditeur : fiches produit KDP générées automatiquement (titre, sous-titre, description, mots-clés, catégories).
- Éditeur : pack ZIP complet de publication (manuscrit, couverture, métadonnées).
- Éditeur : qualité éditoriale renforcée avec passes de relecture supplémentaires.
- Principe directeur : « pour les autres cela doit fonctionner sans anicroches » — priorité à la stabilité sur les plans d'entrée.

### Détail technique prévu
- Paramétrage des limites livres/mois et chapitres par palier d'abonnement.
- Branchement conditionnel du Mode Recherche Approfondie sur le palier Éditeur.
- Étapes de workflow supplémentaires réservées au palier haut, avec garde-fous de coût.

### Pourquoi gelé
« dans le mois d'août on va perfectionner le workflow des 2 plans » et « on va aussi améliorer le workflow à 59 € beaucoup plus performant ».

### Conditions de reprise
- Reprise en août 2026 selon le planning utilisateur.
- À faire en priorité avant le lancement des abonnements d'octobre 2026.

---

## 4. KDP Pilot + lien affilié

**Reprise estimée : Dès réception des clés PA-API**

### Objectif
Alimenter l'outil en données Amazon réelles (et non estimées) pour la recherche de niche, et créer au passage une source de revenus complémentaire via l'affiliation.

### Décisions actées
- Intégration de l'API Amazon Product Advertising (PA-API) pour récupérer des données réelles : BSR, volumes de mots-clés, notes et nombre d'avis des concurrents.
- Objectif affiché aux abonnés : « ils auront les vraies données de KDP », plus d'estimation approximative.
- Mise en place d'un lien affilié KDP Pilot : les abonnés qui souhaitent l'outil complet passent par ce lien, avec commission perçue.
- Piste étudiée : souscrire soi-même l'abonnement KDP Pilot à 19 €/mois comme source de données côté backend, mutualisée pour tous les abonnés, et ajuster les tarifs en conséquence.
- Les données réelles doivent être mises en cache pour maîtriser les coûts et les quotas d'appel.

### Détail technique prévu
- Fonction serveur dédiée à la recherche PA-API, clés stockées côté backend uniquement.
- Carte d'affiliation KDP Pilot à afficher dans les modules de recherche de niche.
- Cache des résultats par ASIN / mot-clé avec durée de validité.

### Pourquoi gelé
En attente de réception des clés PA-API : « je te le donnerais je ne l'ai pas encore ».

### Conditions de reprise
- Déblocage dès réception des clés PA-API (Access Key, Secret Key, Partner Tag).
- Décision à prendre en parallèle : prendre ou non l'abonnement KDP Pilot 19 €/mois côté backend.

---

## 5. Stratégie V4 (2027) — Maison d'Édition Professionnelle

**Reprise estimée : Fin 2026 / début 2027**

### Objectif
Construire en 2027 une véritable maison d'édition professionnelle assistée par IA, adossée à des données de marché précises, et non plus un simple générateur de livres.

### Décisions actées
- Trois forfaits V4 validés : Auteur 19 €/mois, Studio 29 €/mois, Éditeur 79 €/mois.
- Positionnement : données de marché précises comme cœur de valeur, l'écriture devient une conséquence de l'analyse.
- Les acheteurs lifetime V2+V3 conservent V2 et V3 à vie, mais la V4 nécessitera un upgrade fidélité (tarif préférentiel, pas gratuit).
- Mention à ajouter dans les conditions : l'accès à vie couvre V2 et V3, pas les versions majeures suivantes.
- Périmètre arrêté : 15 modules (détaillés ci-dessous).
- Décision de lancement à reconfirmer après le lancement V3 d'octobre 2026 et les premiers retours d'abonnés.

### Les 15 modules prévus
1. **Market Intelligence Hub** — tableau de bord central des données de marché : niches, tendances, saisonnalité, opportunités.
2. **Data Layer multi-sources** — couche d'agrégation unifiée (PA-API, KDP Pilot, scraping de secours) avec cache et normalisation.
3. **Quota & metering** — comptage précis des appels IA et data par abonné, plafonds par forfait, alertes de dépassement.
4. **Niche Validator** — scoring d'une niche avant écriture : demande, concurrence, prix moyen, saturation, verdict go / no-go.
5. **Keyword Engine Pro** — génération et qualification de mots-clés Amazon avec volumes réels et difficulté.
6. **Deep Research Writing** — écriture adossée à une phase de recherche documentée, avec sources et notes conservées.
7. **Editorial Board** — comité de relecture IA multi-rôles (éditeur, correcteur, lecteur cible) avec rapport de recommandations.
8. **Style DNA** — capture du style d'un auteur et application cohérente sur tous ses ouvrages.
9. **Studio Illustration unifié** — couvertures, intérieurs, BD, livres enfants dans une seule interface avec cohérence graphique.
10. **Séries & Univers** — gestion de collections multi-volumes : bible d'univers, personnages récurrents, continuité narrative.
11. **Publication Pack KDP** — pack de publication complet prêt à téléverser : manuscrit, couverture 300 DPI, métadonnées, catégories.
12. **Post-Launch Tracker** — suivi après publication : évolution du BSR, avis, ventes estimées, alertes.
13. **Pricing Optimizer** — recommandation de prix selon le marché et simulation de royalties.
14. **Ads & Lancement** — plan de lancement et de campagnes publicitaires Amazon, budgets et mots-clés suggérés.
15. **Abonnements & entitlements** — gestion complète des forfaits, upgrades, upgrade fidélité lifetime, résiliations.

### Pourquoi gelé
V4 prévue pour 2027, à décider après le lancement V3 — « et met cela en attente ».

### Conditions de reprise
- Reprise fin 2026 / début 2027.
- Prérequis : lancement V3 d'octobre 2026 stabilisé, et données KDP réelles opérationnelles (sujet n°4).
