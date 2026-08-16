# Livre généré : boutons d'action, langue au départ, Sommaire IA dans les 2 forfaits, onglet Upsells et nouveaux tarifs

## Ce que montre l'outil aujourd'hui (vérifié)

- Quand le livre est terminé, la zone du bas propose seulement : Couverture, Ambiances, Sauvegarder le brouillon, Nouveau livre. Il n'y a **aucun** bouton direct « Voir mon livre », « Corriger », ni un accès resserré aux données KDP.
- La sauvegarde existe déjà (bouton « Sauvegarder maintenant » en haut) mais elle est loin de la zone du livre terminé.
- Le brief du livre (`title`, `chapters`, `tone`, `outline`…) **n'a pas de champ langue** : l'abonné ne peut pas choisir sa langue au démarrage.
- La traduction existe bien comme outil séparé (onglet « Traduction 10 langues » et fonction serveur `translate-content`), mais elle n'est jamais reliée au livre qui vient d'être généré.
- Le Sommaire IA existe (étape 3 du wizard, onglet « Sommaire IA (dialogue) ») mais **il n'est écrit dans aucune des deux fiches de forfait** : ni Plume, ni Édition.
- Il n'existe **aucun onglet Upsells** dans la barre latérale V3. Deux compléments seulement sont définis en interne (BookPerfect 97 €, Pack Sérénité 30 €) et ne sont proposés nulle part côté abonné.
- Tarifs actuels : Plume 17 €/mois (170 €/an), Édition 27 €/mois (270 €/an).

## 1. Barre d'actions sous le livre généré

Dès que le livre est terminé, afficher juste en dessous une barre claire, toujours visible :

```text
[Sauvegarder]  [Corriger mon livre]  [Voir mon livre]  [Données KDP du livre]  [Traduire le livre]
```

- **Sauvegarder** : enregistre immédiatement dans « Mes livres » avec confirmation visible.
- **Corriger mon livre** : ouvre le correcteur avec CE livre déjà chargé (aucun copier-coller).
- **Voir mon livre** : ouvre le livre en lecture propre (chapitres, sommaire, mise en page).
- **Données KDP du livre** : titre, sous-titre, description, 7 mots-clés, 3 catégories, prix conseillé, prêts à copier.
- **Traduire le livre** : envoie le manuscrit vers la traduction avec la langue à choisir.

Chaque bouton part du livre réellement généré : rien ne se perd entre deux pages.

## 2. Choix de la langue dès le début du livre

- Nouveau champ **« Langue du livre »** à l'étape 1 (Fiche du livre), avant le style.
- 10 langues : français, anglais, espagnol, allemand, italien, portugais, néerlandais, polonais, suédois, japonais.
- La langue choisie s'applique à tout : sommaire, chapitres, préface, conclusion, description KDP et couverture.
- La langue est mémorisée avec le livre : elle reste juste après un rechargement et se retrouve dans « Mes livres ».
- Français reste la valeur par défaut.

## 3. Sommaire IA écrit dans les deux forfaits

Ajouter la ligne dans les deux fiches, pour que ce soit vu avant l'achat :

- **Plume** : « Sommaire IA guidé (dialogue) — vous construisez le plan avec l'IA »
- **Édition** : « Sommaire IA avancé — plan long, sous-chapitres, cohérence de série »

## 4. Nouvel onglet « Upsells » dans la barre latérale

Un onglet dédié, aussi proposé sous le livre terminé (au bon moment : le livre est prêt, l'abonné veut le vendre).

| Complément | Ce que ça apporte | Prix |
| --- | --- | --- |
| BookPerfect AI | Direction éditoriale complète + Word corrigé | 97 € |
| Cover Studio Pro | Couverture 300 DPI, gabarits KDP, variantes | 47 € |
| Audiolivre Premium | Voix premium, chapitrage, fichiers prêts | 67 € |
| Pack Traductions 10 langues | Le livre entier traduit, prêt à publier | 97 € |
| Pack Sérénité | Zoom 1-à-1, audit, support prioritaire | 30 € |
| Pack Tout Complet | Les 5 compléments réunis | 247 € au lieu de 338 € |

Chaque carte affiche : ce que ça donne, pour qui, le prix, et un seul bouton de paiement. Les compléments déjà inclus dans Édition sont marqués « Inclus dans votre forfait » au lieu d'être vendus deux fois.

## 5. Tarifs : vous êtes trop bas

Vous vendez 30 livres par mois, 10 langues, correction, couverture, audiolivre et données KDP pour 17 €. C'est en dessous du marché et cela fait douter de la valeur. Proposition claire, sans casser vos engagements :

| Forfait | Aujourd'hui | Proposé mensuel | Proposé annuel | Ce qui justifie le prix |
| --- | --- | --- | --- | --- |
| **Plume** | 17 € / 170 € | **27 €** | **270 €** (2 mois offerts) | 30 livres/mois, 40 chapitres, Sommaire IA guidé, correction, couverture, audiolivre, 10 langues |
| **Édition** | 27 € / 270 € | **47 €** | **470 €** (2 mois offerts) | Livres illimités, 60 chapitres, Sommaire IA avancé, Cover Studio Pro, BookPerfect, Audiolivre pro, BD Studio, Amazon Spy |
| **Studio Pro** (nouveau, 3ᵉ palier) | — | **97 €** | **970 €** | Tout Édition + Pack Traductions inclus + accompagnement mensuel + priorité sur les nouveaux modules |

Règles de respect des promesses déjà faites :

- Les abonnés déjà inscrits gardent leur prix actuel à vie.
- La remise **-20 % à vie ancien client V2** s'applique aux nouveaux montants : Plume 21,60 €, Édition 37,60 €.
- L'accès à vie 47 € reste inchangé jusqu'au 30/09/2026.
- Les nouveaux tarifs s'affichent avec la date d'entrée en vigueur, et l'ancien prix barré : c'est un argument d'urgence, pas une mauvaise surprise.

## Schéma du parcours

```text
Etape 1 Fiche du livre  ->  LANGUE DU LIVRE (10 langues)
        |
Etape 2 Style
        |
Etape 3 SOMMAIRE IA          (inclus dans Plume ET Edition)
        |
Etape 4 Personnages  ->  Etape 5 Titre  ->  Generation par les agents
        |
   LIVRE TERMINE
        |
   +----+-----------+-----------------+---------------------+------------------+
   |               |                 |                     |                  |
Sauvegarder   Corriger        Voir mon livre     Donnees KDP du livre   Traduire le livre
        |
   Onglet UPSELLS : BookPerfect · Cover Studio Pro · Audiolivre Premium
                    Pack Traductions · Pack Serenite · Pack Tout Complet
```

## Détails techniques

- `src/lib/v3/bookBrief.ts` : ajouter `language` au brief et le conserver en cloud avec le projet.
- `src/components/v3public/V3CreateWizard.tsx` : champ langue à l'étape 1, propagation de la langue au workflow, et nouvelle barre d'actions sous le livre terminé (5 boutons) placée avant les panneaux couverture/KDP.
- Passage du manuscrit terminé au correcteur, au lecteur, au panneau KDP et à la traduction via l'identifiant du projet enregistré, sans réécrire le contenu dans l'URL.
- Traduction branchée sur la fonction serveur existante `translate-content`, langue préremplie avec celle du livre.
- `src/data/v3Pricing.ts` : nouveaux montants, ligne Sommaire IA dans les deux forfaits, troisième forfait Studio Pro, et catalogue des compléments (5 packs + Pack Tout Complet).
- Nouvel onglet et nouvelle page « Upsells » dans `V3Sidebar.tsx`, avec masquage automatique de ce qui est déjà inclus dans le forfait de l'abonné.
- Aucun changement sur les accès admin, le tunnel `/commander` ni les droits des abonnés existants.

## Validation avant de déclarer terminé

1. Générer un livre court et vérifier les 5 boutons : chacun ouvre la bonne page avec le bon livre.
2. Choisir l'anglais à l'étape 1 et vérifier que le livre entier sort en anglais.
3. Recharger la page en cours de route : la langue et le livre sont toujours là.
4. Vérifier « Sommaire IA » écrit dans les deux forfaits sur la page tarifs.
5. Ouvrir l'onglet Upsells avec un compte Édition : les compléments inclus sont marqués, pas vendus.
