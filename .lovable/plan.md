# Plan : Fichier de suivi des sujets en attente

## Objectif
Créer un fichier `.lovable/plan-attente.md` centralisé et visible, listant tous les sujets mis en pause sur demande explicite, avec leur contexte et la raison du gel.

## Contenu du fichier `.lovable/plan-attente.md`

### 🧊 En attente — gel demandé jusqu'après août 2026

| # | Sujet | Contexte / objectif | Pourquoi gelé | Date de reprise estimée |
|---|-------|---------------------|---------------|--------------------------|
| 1 | **Facturation annuelle + tacite reconduction** | Configurer les 3 plans (Débutant, Studio, Éditeur) en facturation annuelle par défaut, avec tacite reconduction, possibilité de résiliation utilisateur et accès portail Stripe pour annulation. | Gelé sur demande : « met cela en attente on en reparle ». | Septembre 2026 |
| 2 | **Essai gratuit — 1 ebook sans workflow** | Proposer un plan gratuit limité à 1 projet, 8 chapitres max, génération simplifiée 1 passe, export PDF filigrané. Le V2/V3 lifetime reste honoré. | Gelé sur demande : « ok met cela en attente ». | Septembre 2026 |
| 3 | **Améliorations workflows V3 (août 2026)** | Différencier les plans (Débutant limité, Expert enrichi, Éditeur avec mode recherche approfondie + workflow de qualité professionnelle). | Gelé : « dans le mois d'août on va perfectionner le workflow des 2 plans ». | Août 2026 selon planning utilisateur |
| 4 | **KDP Pilot + lien affilié** | Intégrer Amazon PA-API pour données KDP réelles (BSR, volumes, notes concurrents) et créer un lien affilié KDP Pilot. | En attente de réception des clés PA-API de l'utilisateur : « je te le donnerais je ne l'ai pas encore ». | Dès réception des clés |
| 5 | **Stratégie V4 (2027)** | Définir la politique d'accès à la V4 pour les possesseurs de V2+V3 à vie (proposition : upgrade V4 payant, mais pas inclus dans l'offre 59 €). | Gelé : V4 prévue pour 2027, à décider après le lancement V3. | Fin 2026 / début 2027 |

### Règle de conduite
- Aucun code, migration, edge function ou modification de base de données ne sera effectué sur ces sujets avant la date de reprise indiquée ou une nouvelle décision explicite.
- Ce fichier sera relu et mis à jour à chaque reprise de l'un des sujets.

## Livrable
- Fichier `.lovable/plan-attente.md` créé et rempli avec le tableau ci-dessus.
- Aucun autre fichier modifié.