# 3 forfaits, 6 boutons sous le livre, langue au départ et Sommaire IA partout

## Ce que montre l'outil aujourd'hui (vérifié)

- Sous un livre terminé, il n'y a que 4 boutons secondaires : Couverture, Ambiances, Sauvegarder le brouillon, Nouveau livre. Ni « Voir mon livre », ni « Corriger », ni accès direct aux données KDP.
- Le brief du livre n'a **aucun champ langue** : l'abonné ne peut pas choisir sa langue au démarrage.
- La traduction 10 langues existe déjà comme page séparée (`/v3/outils/traduction`) et côté serveur (`translate-content`), mais elle n'est jamais reliée au livre qui vient d'être généré.
- Le Sommaire IA existe (étape 3 du wizard + onglet dialogue) mais n'est **écrit dans aucune fiche de forfait**.
- Aucun onglet Upsells côté abonné. Seuls deux compléments sont définis en interne et ne sont proposés nulle part.
- Les tarifs 17 €/27 € sont écrits **en dur dans plusieurs endroits** en plus de la fiche tarifaire : menu de l'en-tête, questions/réponses, base de connaissances de l'assistant. Un changement de prix doit passer partout, sinon l'abonné voit deux prix différents.

## 1. Six boutons sous le livre généré (rien à chercher)

Dès que le livre est terminé, une barre large et visible, juste sous le livre :

```text
[💾 Sauvegarder]  [🪄 Corriger mon livre]  [📖 Voir mon livre]
[📊 Données KDP]  [🌍 Traduire (10 langues)]  [⬇️ Exporter Word / PDF / EPUB]
```

Plus deux raccourcis en second rang : **🎨 Couverture** et **🎧 Audiolivre**.

- Chaque bouton part du livre réellement généré : aucun copier-coller, aucune ressaisie.
- La barre reste collée en bas de l'écran sur mobile tant que le livre est ouvert.
- Chaque bouton affiche un état clair : « Sauvegardé ✓ », « Corrigé ✓ », « Traduit en 3 langues ✓ ».

## 2. Langue du livre choisie dès le début

- Champ **« Langue du livre »** à l'étape 1, avant le style.
- 10 langues : français, anglais, espagnol, allemand, italien, portugais, néerlandais, polonais, japonais, chinois.
- La langue s'applique à tout : sommaire, chapitres, préface, conclusion, description KDP, couverture.
- Elle est mémorisée avec le livre et survit à un rechargement.
- **Les 10 langues sont incluses dans les 3 forfaits.** Aucune langue vendue en supplément.

## 3. Sommaire IA écrit dans les trois forfaits

- **Plume** : Sommaire IA guidé (dialogue) — vous construisez le plan avec l'IA.
- **Édition** : Sommaire IA avancé — plan long, sous-chapitres, cohérence de série.
- **Studio Pro** : Sommaire IA avancé + architecture de série multi-tomes.

## 4. Les trois forfaits, avec tous les upsells dans le troisième

| | **Plume** | **Édition** ⭐ | **Studio Pro** 👑 |
| --- | --- | --- | --- |
| Mensuel | **27 €** | **47 €** | **97 €** |
| Annuel (2 mois offerts) | **270 €** | **470 €** | **970 €** |
| Livres / mois | 30 | Illimité | Illimité |
| Chapitres max | 40 | 60 | 60 + séries |
| Sommaire IA | Guidé | Avancé | Avancé + séries |
| 10 langues | Incluses | Incluses | Incluses |
| Audiolivre | Standard | Pro (voix premium) | Pro + distribution |
| Cover Studio Pro | — | Inclus | Inclus |
| BD Studio Pro | — | Inclus | Inclus |
| Amazon Spy / Audit ASIN | Basique | Complet | Complet + suivi |
| **BookPerfect AI (97 €)** | — | — | **Inclus** |
| **Pack Traductions relues (97 €)** | — | — | **Inclus** |
| **Audiolivre Premium (67 €)** | — | — | **Inclus** |
| **Pack Sérénité — Zoom 1-à-1 (30 €)** | — | — | **Inclus** |
| **Sélection maisons d'édition (77 €)** | — | — | **Inclus** |
| Accompagnement | Support 24 h | Prioritaire | Coaching mensuel + priorité nouveautés |

**Le message de vente du 3ᵉ forfait** : 368 € de compléments inclus pour 97 €/mois. Plus rien à acheter, jamais.

Engagements respectés :

- Les abonnés actuels gardent leur prix à vie.
- La remise **-20 % à vie ancien client V2** s'applique aux nouveaux montants : Plume 21,60 €, Édition 37,60 €, Studio Pro 77,60 €.
- L'accès à vie 47 € reste inchangé jusqu'au 30/09/2026.

## 5. Un onglet Upsells quand même — mais pour Plume et Édition

- Nouvel onglet **« Compléments »** dans la barre latérale, et rappel sous le livre terminé.
- Un abonné **Studio Pro** y voit tout marqué « Inclus dans votre forfait » : jamais de double vente.
- Un abonné Plume ou Édition y voit le prix à l'unité **et** l'économie réalisée en passant à Studio Pro.

## 6. Difficulté et durée honnêtes

Non, ce n'est pas difficile — mais c'est **large**, parce que le prix est écrit à plusieurs endroits. La bonne méthode : une source unique de vérité pour les tarifs, et toutes les pages qui la lisent au lieu de répéter les chiffres.

Pages et endroits à mettre à jour dans le même passage :

1. Fiche des forfaits (`/v3/forfaits`) — passage à 3 colonnes.
2. Menu « Forfaits » de l'en-tête V3.
3. Page de vente `/commander` et page `/v3/offre`.
4. Page « Mon compte & abonnement ».
5. Page « Ancien client V2 » (`/v3/migration`) avec les nouveaux prix remisés.
6. Questions / réponses V3 et base de connaissances de l'assistant IA.
7. Panneau admin des plans V3.
8. Emails et bandeaux qui citent un prix.

Après ce passage, un changement de prix futur se fera **en un seul endroit**.

## 7. Pourquoi personne ne clique — chiffres réels des 10 derniers jours

| Étape | Valeur mesurée |
| --- | --- |
| Emails envoyés | 4 358 |
| Emails avec un état de livraison enregistré | **0** |
| Ouvertures | 1 491 (328 personnes différentes) |
| Clics | 32 (**9 personnes différentes**) |
| Événements sur le site | 570 |
| Emails laissés sur le site | 3 |
| Commandes | 0 |

Ce que ces chiffres disent :

1. **On ne sait pas si les emails arrivent.** 4 358 envois et zéro état de livraison enregistré : rebonds, spam et désinscriptions ne remontent pas. Impossible de savoir si des milliers de messages sont tombés dans les indésirables. C'est le trou n° 1 et il fausse tout le reste.
2. **Les gens ouvrent (328 personnes) mais ne cliquent pas (9).** Ce n'est donc pas l'objet le problème : c'est le corps de l'email qui ne donne pas envie d'appuyer — trop long, trop de liens, promesse pas assez concrète, ou le lien sent la vente.
3. **Les clics se concentrent sur les anciens emails « offre 47 »** (14 clics sur `offre-47-unique-5`). Les nouveaux modèles cadeau/relance font 1 clic chacun : volume trop faible pour conclure, ou ils n'accrochent pas.
4. **570 visites sur le site, 3 emails laissés.** La capture ne fonctionne pas non plus.

### Les corrections, dans cet ordre

**a. Voir ce qui arrive vraiment (prioritaire)**
- Brancher les événements du prestataire d'envoi (livré, rebond, spam, désinscription) sur le journal d'envoi.
- Tableau « Santé emails » dans l'admin : livrés / rebonds / spam / ouvertures / clics, par modèle.
- Couper l'envoi automatique aux adresses jamais ouvertes après 5 envois et aux rebonds durs.

**b. Un email = un seul clic possible**
- Un seul lien, une seule action, dans les 3 premières lignes.
- Objet et première phrase promettent un **résultat**, pas une offre : « Votre sommaire de 40 chapitres, écrit en 4 minutes ».
- Le lien mène au **cadeau** (`/10-niches-offertes`), jamais au paiement : le premier clic doit être gratuit et sans risque.
- Texte lisible, aucune image lourde, expéditeur nominatif (Georges, pas « no-reply »).

**c. Donner une raison de cliquer maintenant**
- Preuve visible : une page réelle du livre exporté, la capture du sommaire, la couverture générée.
- Une seule échéance rappelée en une ligne (30/09/2026), pas un compte à rebours partout.
- Aux 9 cliqueurs identifiés : message personnel, court, avec **une question** — ce sont les seuls prospects chauds aujourd'hui.

**d. Mesurer le clic sur le bouton de paiement**
- Événement dédié sur le bouton de `/commander` : on saura si le bouton est vu et ignoré, ou jamais atteint.
- Relance automatique de tout paiement resté en attente plus de 2 h.

**e. Réparer la capture sur le site**
- Un seul encart, une seule promesse chiffrée (« 10 niches rentables, gratuit »), un seul champ email, déclenché à 40 % de défilement ou à la sortie.

Tant que le point (a) n'est pas branché, chaque campagne part à l'aveugle : c'est à faire avant de réécrire un seul email.

## 8. Le bouton « Version audio · 9,99 € » — état réel et ce qu'il manque

Ce qui existe déjà (vérifié) :

- La carte d'offre **« Convertir en audiobook · 9,99 € »** existe et s'affiche sur la page de lecture d'un livre.
- Mais elle ne fait **rien** aujourd'hui : elle affiche « La conversion arrive bientôt » et le bouton se contente d'inscrire le livre dans une liste d'attente stockée dans le navigateur. **Aucun paiement, aucun audio produit.**
- Le texte actuel demande à l'abonné **sa propre clé Azure Speech** — c'est ce qu'il faut supprimer.
- Côté serveur, la machinerie audio est déjà là : une fonction de synthèse qui sait utiliser **ElevenLabs, Azure Speech ou OpenAI** selon la clé disponible, et une fonction d'envoi du fichier par email.

**Réponse à votre question : non, l'abonné n'a pas besoin de mettre une clé.** On est assez bons : la synthèse tourne côté serveur avec **nos** clés. C'est même indispensable pour vendre à 9,99 € — personne ne paie 9,99 € pour ensuite devoir créer un compte Azure. Le seul point à vérifier avant de lancer : quelle clé de voix est réellement active sur le projet (ElevenLabs ou Azure). La qualité ElevenLabs est nettement supérieure en français ; c'est celle à privilégier pour un produit payant.

**Ce que le bouton fera après cette mise à jour :**

1. Clic sur **🎧 Version audio · 9,99 €** sous le livre.
2. Paiement 9,99 € (carte ou PayPal), paiement unique, aucun abonnement.
3. Choix de la voix (2 voix femme, 2 voix homme) et du découpage (un seul MP3 ou un MP3 par chapitre).
4. Génération chapitre par chapitre avec une barre de progression honnête, sans blocage sur les longs livres.
5. **Après le règlement, l'abonné reçoit :** la page d'écoute en ligne, le lien de téléchargement des MP3, un email de confirmation contenant les mêmes liens, et le rappel « votre audio reste disponible dans Mes livres → onglet Audio ».
6. Le fichier est rangé dans sa bibliothèque : le lien ne se perd jamais.

Pour le forfait **Studio Pro**, ce bouton affiche **« Inclus dans votre forfait »** au lieu du prix.

## 9. Ambiance choisie pour le Sommaire IA

Les ambiances existent déjà (14 ambiances classées claires / sombres / vibrantes / classiques, avec police et couleurs). Elles ne sont simplement pas reliées au sommaire.

- À l'étape Sommaire IA, un sélecteur **« Ambiance du sommaire »** avec aperçu immédiat.
- L'ambiance choisie décide de l'apparence du sommaire à l'export : police du titre, filet décoratif, teinte des numéros de chapitre, motif discret ou fond doré.
- Elle est mémorisée avec le livre : le même sommaire ressort identique à chaque export.
- Un bouton « Aperçu du sommaire » montre le rendu exact avant de générer le livre.

## 10. Tout le site en clair ou en sombre

- Un bouton **☀️ / 🌙** dans l'en-tête, visible sur toutes les pages V3.
- Trois positions : Clair, Sombre, Automatique (suit le réglage de l'ordinateur).
- Le choix est mémorisé et s'applique dès le chargement, sans clignotement blanc.
- Le mode sombre couvre l'ensemble : barre latérale, formulaires, tableaux, panneaux de vente, lecteur de livre.
- La lecture du livre garde son fond crème même en mode sombre (confort de lecture), avec un bouton « lire en sombre » sur cette page uniquement.
- Aucune couleur écrite en dur : tout passe par les jetons de couleur du thème, sinon le mode sombre casse.

## Schéma détaillé



```text
                       ETAPE 1 - FICHE DU LIVRE
                  Titre - Sujet - Categorie - AUTEUR
                  >>> LANGUE DU LIVRE (10 langues, tous forfaits) <<<
                                  |
                       ETAPE 2 - STYLE ET LONGUEUR
                                  |
                   ETAPE 3 - SOMMAIRE IA (les 3 forfaits)
                Plume: guide | Edition: avance | Studio Pro: series
                                  |
                       ETAPE 4 - PERSONNAGES
                                  |
                       ETAPE 5 - TITRE FINAL
                                  |
                 GENERATION PAR LES AGENTS (chapitre par chapitre)
                                  |
                          == LIVRE TERMINE ==
                                  |
      +--------------+--------------+--------------+--------------+--------------+
      |              |              |              |              |              |
 1 SAUVEGARDER  2 CORRIGER    3 VOIR MON     4 DONNEES     5 TRADUIRE     6 EXPORTER
   Mes livres     Correcteur      LIVRE           KDP        10 langues    Word PDF EPUB
                                lecture       titre desc
                                 propre       7 mots-cles
                                              3 categories
                                  |
                    Second rang : 7 COUVERTURE   8 AUDIOLIVRE
                                  |
                        ONGLET COMPLEMENTS
                                  |
      Plume / Edition : prix a l unite + economie en passant a Studio Pro
      Studio Pro      : tout marque INCLUS DANS VOTRE FORFAIT

                        ======= TARIFS =======
        PLUME 27 / mois        EDITION 47 / mois       STUDIO PRO 97 / mois
        270 / an               470 / an                970 / an
        30 livres              illimite                illimite + series
        10 langues             10 langues              10 langues
        Sommaire IA guide      Sommaire IA avance      Sommaire IA + series
        --                     Cover + BD Studio Pro   TOUS LES UPSELLS INCLUS
                                                       368 de valeur incluse
        Ancien V2 : 21,60      Ancien V2 : 37,60       Ancien V2 : 77,60
```

## Détails techniques

- `src/data/v3Pricing.ts` devient la **source unique** : 3 forfaits, montants, remise ancien client V2, ligne Sommaire IA, mention 10 langues, catalogue des compléments et liste de ceux inclus dans Studio Pro.
- Supprimer les prix écrits en dur dans `v3HeaderMenu.ts`, `v3Questions.ts`, `assistantKnowledge.ts` et les pages listées, et les faire lire la source unique.
- `src/lib/v3/bookBrief.ts` : ajouter `language`, conservé aussi côté cloud avec le projet.
- `src/components/v3public/V3CreateWizard.tsx` : champ langue à l'étape 1, propagation au workflow, et nouvelle barre de 6 boutons (+2) placée immédiatement sous le livre terminé, avant les panneaux couverture et KDP.
- Les boutons passent par l'identifiant du projet enregistré : correcteur, lecteur (`/v3/livre/:id`), panneau KDP, traduction (`translate-content` avec la langue préremplie) et export.
- Nouvelle page et nouvel onglet « Compléments » avec masquage automatique selon le forfait (`useV3Entitlement`).
- Aucun changement sur les accès admin, le tunnel `/commander` ni les droits des abonnés existants.

## Validation avant de déclarer terminé

1. Générer un livre court : les 6 boutons apparaissent et chacun ouvre la bonne page avec le bon livre.
2. Choisir l'anglais à l'étape 1 : tout le livre sort en anglais.
3. Recharger en cours de route : langue et livre toujours là.
4. Parcourir les 8 emplacements de prix : partout 27 / 47 / 97, jamais 17 ou 27 ancien.
5. Ouvrir « Compléments » avec un compte Studio Pro : tout marqué inclus, rien à vendre.
