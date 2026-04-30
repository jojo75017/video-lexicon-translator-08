# Sidebar simplifiée : 5 étapes au lieu de 16 items

## Le problème

Aujourd'hui la sidebar (`MagazineSidebar.tsx`) affiche **16 boutons en vrac** sans logique :
Projets, Planificateur, Templates, Paramètres, Personnages, Rédaction, Outils, KDP, 4ème Couv, Business, Marketing, Monétisation, Export, Sommaire, Images, Correcteur.

Résultat : on ne sait pas par où commencer, ni dans quel ordre cliquer.

## Le nouveau menu (5 entrées seulement)

```
🏠  Accueil               → ton tableau de bord (Mes Projets)
1️⃣  Démarrer un livre    → Planificateur + Personnages + Templates
2️⃣  Écrire                → Rédaction + Correcteur + Sommaire
3️⃣  Habiller              → Couverture + 4ème Couv + Images
4️⃣  Publier               → Export + KDP
5️⃣  Vendre                → Marketing + Monétisation + Business
─────────────────────────
🔧  Tous les outils       (bouton replié, pour les pros)
⚙️  Paramètres
💳  Mon Abonnement
```

Chaque entrée principale ouvre **une seule vue** où les sous-outils sont présentés en grandes cartes claires, dans l'ordre où on les utilise.

## Ce que ça change pour toi

- **Avant** : 16 boutons → on est perdu.
- **Après** : 5 étapes numérotées → on suit le chemin naturel d'un livre.
- Les outils avancés (Audio, Audit Pilot, Extension Chrome, BD, Atlas, etc.) restent accessibles via "🔧 Tous les outils" mais ne polluent plus la vue par défaut.

## Détails techniques

- Réécrire `src/components/layout/MagazineSidebar.tsx` : remplacer le tableau `sidebarItems` (16 entrées) par 5 entrées d'étape + footer (Tous les outils, Paramètres, Abonnement).
- Chaque clic sur une étape route vers une vue groupée : réutiliser le système de tabs existant en mappant chaque étape vers un set d'`id` (ex : `démarrer` → ouvre `planner` par défaut, propose `characters`/`templates` en sous-cartes).
- Le bouton "🔧 Tous les outils" ouvre la vue Trello existante (`TrelloBoardView`) qui contient déjà tous les outils classés.
- Aucune suppression d'outil — uniquement réorganisation de la navigation.
- Conserver le footer existant (Abonnement + Admin).

## Question avant de coder

Tu valides ces 5 étapes (Accueil / Démarrer / Écrire / Habiller / Publier / Vendre) ? Ou tu préfères un autre regroupement (par ex. fusionner Habiller + Publier en une seule étape "Finaliser") ?
