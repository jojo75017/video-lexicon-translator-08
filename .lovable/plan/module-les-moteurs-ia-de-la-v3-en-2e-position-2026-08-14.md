# Module « Les moteurs IA de la V3 » en 2e position

## Ce que vous demandez
Le module des moteurs IA doit arriver tout de suite après le bandeau d'accroche (donc 2e module de l'accueil V3), et il doit être réellement visible.

## Situation constatée
Sur l'accueil V3, l'ordre actuel est :

```text
1. Bandeau d'accroche (Hero)
2. Bannière dorée « Abonnés V2 : 3 modules offerts »
3. Bannière verte « Clé Gemini obligatoire »
4. Bandeau fin « Moteur multi-modèles »  ->  Les moteurs IA de la V3
5. Encart KDP Pilot
6. Champs « Commencez votre livre »
...
```

Le module existe et se rend bien (8 cartes), mais il est en 4e position, sous deux bannières pleine largeur : à l'ouverture de la page on ne le voit pas sans scroller. Je n'ai pas de preuve d'un bug d'affichage du module lui-même ; la vérification de ce point fait partie du travail.

## Ce que je vais faire

1. **Remonter le module en position 2** : le bandeau fin « Moteur multi-modèles » + la grille « Les moteurs IA de la V3 » passent juste sous le bandeau d'accroche. Les deux bannières (V2 offert, clé Gemini) descendent en dessous.
2. **Rendre la grille visible d'emblée** : réduction des espaces verticaux (padding de section et de carte) pour que le titre et la première ligne de cartes soient dans le premier écran.
3. **Renforcer le contraste** : titre et sous-titre en émeraude sur fond crème, libellés de rôle en or foncé, texte des cartes en gris ardoise foncé — couleurs posées en dur sur les éléments de texte pour qu'aucun style global ne puisse les éclaircir.
4. **Vérification** : rendu réel de la page contrôlé après modification (position, présence des 8 cartes, lisibilité) pour confirmer que le module est bien vu sans scroller.

## Schéma du module

```text
+------------------------------------------------------------------+
| MOTEUR MULTI-MODELES  ·  V3 n'est pas une seule IA  · Voir >     |  bandeau fin, fond émeraude/or
+------------------------------------------------------------------+

+------------------------------------------------------------------+  carte crème, filet or
|                        SOUS LE CAPOT                             |
|                Les moteurs IA de la V3                           |
|   Chaque tâche confiée au modèle le plus doué pour elle.          |
|                                                                  |
|  +------------+ +------------+ +------------+ +------------+      |
|  | Recherche  | | Rédaction  | | Visuels    | | Mise en    |      |
|  | Recherche  | | Manuscrit  | | Couverture | | page       |      |
|  | & niche    | | ChatGPT    | | Images IA  | | Cover Pro  |      |
|  | Gemini     | | la plume   | | 300 DPI    | | KDP        |      |
|  | Ouvrir >   | | Ouvrir >   | | Ouvrir >   | | Ouvrir >   |      |
|  +------------+ +------------+ +------------+ +------------+      |
|  +------------+ +------------+ +------------+ +------------+      |
|  | Narration  | | Métadonnées| | Internat.  | | Partenariat|      |
|  | Livre audio| | Amazon KDP | | 10 langues | | KDP Pilot  |      |
|  | Voix prem. | | 7 mots-clés| | Marchés    | | Ventes &   |      |
|  |            | | catégories | | étrangers  | | concurrence|      |
|  | Ouvrir >   | | Ouvrir >   | | Ouvrir >   | | Ouvrir >   |      |
|  +------------+ +------------+ +------------+ +------------+      |
|                                                                  |
|  v Autonomie réelle   v Fichiers prêts KDP   v Un seul parcours   |
+------------------------------------------------------------------+
```

## Nouvel ordre de l'accueil V3

```text
1. Bandeau d'accroche (Hero)
2. Moteur multi-modèles + Les moteurs IA de la V3   <-- remonté
3. Bannière dorée « Abonnés V2 »
4. Bannière verte « Clé Gemini »
5. Encart KDP Pilot (compact)
6. Champs « Commencez votre livre » (réduits)
7. Ce que produit l'outil / Marché / Avant-Après / Public / Garantie / Licence
8. Blog, bibliothèque, encart de démarrage
```

## Détail technique
- `src/pages/v3public/V3HomePage.tsx` : déplacement de `<V3EngineStrip />` et `<V3EngineGrid />` juste après `<V3HeroBanner />`.
- `src/components/v3public/V3EngineBanner.tsx` : compactage des paddings (`py-14` → `py-8`, cartes `p-5` → `p-4`), tailles de titre légèrement réduites, couleurs de texte explicites sur les titres, rôles, descriptions et bénéfices.
- Aucun changement de logique métier, de données ou de backend.

Note : ces changements se voient sur l'aperçu immédiatement ; pour le site en ligne (ebookstudio.fr) il faudra publier.
