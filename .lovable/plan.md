# Page de création : simple comme une maison d'édition

Aujourd'hui `/v3/create` empile 9 blocs et 2 onglets sur la même page (dialogue, correcteur de passages, co-constructeur de sommaire, ambiance, réglages, pipeline, clés IA, fiche manuelle, barre d'actions). On s'y perd. Objectif : **un seul chemin en 4 bureaux**, comme dans une maison d'édition, sans perdre un seul bouton d'action.

## Le schéma

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  MA MAISON D'ÉDITION — « Vitesse interdite »          [Enregistré 14:02] │
│  ①  Mon récit  →  ②  Sommaire  →  ③  Rédaction  →  ④  Livre & couverture │
└──────────────────────────────────────────────────────────────────────────┘

  ┌───────────────────────── BUREAU ACTIF ─────────────────────┐ ┌─────────────┐
  │ ① MON RÉCIT (le bureau d'écriture)                         │ │ VOTRE LIVRE │
  │                                                            │ │  EN DIRECT  │
  │  ┌──────────────────────────────────────────────────┐      │ │             │
  │  │ J'écris ici, avec mes mots…                      │      │ │ Titre       │
  │  └──────────────────────────────────────────────────┘      │ │ 12 chap.    │
  │  [ Envoyer au Génie ]   (il corrige, ne résume jamais)     │ │ 3 écrits    │
  │                                                            │ │ 7 400 mots  │
  │  Sa version corrigée  ▸  [ Je garde ]  [ Refaire ]         │ │ ▓▓▓░░░░ 25% │
  │  Mes mots d'origine restent accessibles à un clic          │ │             │
  └────────────────────────────────────────────────────────────┘ │ 1. …  écrit │
                                                                 │ 2. …  cours │
  ② SOMMAIRE : les chapitres 3 par 3, [Garder][Reformuler]       │ 3. …  écrire│
     [Retirer] → [ Valider le sommaire ]                         │             │
                                                                 │ Reprendre ▸ │
  ③ RÉDACTION : le Génie écrit chapitre par chapitre et les      └─────────────┘
     range dans le sommaire, à sa place, tout seul.

  ④ LIVRE & COUVERTURE : lire · corriger · exporter · couvrir

┌──────────────────────── VOS ACTIONS (toujours visibles) ─────────────────┐
│ Valider le sommaire · Commencer la rédaction · Enregistrer mon livre     │
│ Corriger mon livre · Voir mon livre · EXPORTER (Word/PDF) · COUVERTURE   │
│ Données KDP · Traduire (10 langues) · Version audio · Avis clients       │
└──────────────────────────────────────────────────────────────────────────┘
```

## Ce qui change concrètement

**1. Quatre bureaux au lieu de neuf blocs.** Un seul bureau visible à la fois, choisi par la barre du haut (① ② ③ ④). Rien n'est supprimé : ce qui existe est simplement rangé derrière le bon numéro.

**2. Le cycle « j'écris → le Génie corrige → il place le chapitre ».** Dans le bureau ①, une seule zone de texte et un seul bouton « Envoyer au Génie ». Il rend le texte corrigé (jamais résumé, mots d'origine conservés), on garde ou on refait. Dans le bureau ③, chaque chapitre écrit va se ranger de lui-même à sa place dans le sommaire, sans manipulation.

**3. Fin des onglets en double.** Les deux onglets « Sommaire / Mon livre » de la colonne de droite fusionnent en **une seule liste** : chaque ligne = un chapitre, son état (à écrire / en cours / écrit), et un clic déplie le texte écrit avec « Corriger » et « Réécrire ».

**4. Réglages repliés.** Titre, sous-titre, nombre de chapitres, mots par chapitre, ambiance, clés IA, fiche manuelle : tout passe dans un seul volet replié « Réglages du livre », ouvert à la demande. Les valeurs saisies restent verrouillées face au Génie.

**5. Export et couverture ajoutés aux actions.** Deux boutons manquent aujourd'hui : **Exporter mon livre** (Word / PDF) et **Faire ma couverture**. Ils rejoignent la barre d'actions, grisés avec l'explication « après le premier chapitre écrit ».

**6. Sauvegarde et reprise visibles.** Un indicateur « Enregistré à 14:02 » en haut, l'enregistrement automatique à chaque étape, et un bouton **« Reprendre où j'en étais »** dans la colonne de droite qui ramène le livre, le sommaire et le texte déjà écrit, même des semaines plus tard depuis un autre appareil.

## Détails techniques

- `src/pages/v3public/V3CreatePage.tsx` : remplacement de l'empilement par un état `desk: 1|2|3|4` + barre d'étapes ; les composants existants sont montés selon le bureau (① `V3PassageCorrector`, ② `V3OutlineCoBuilder`, ③ `V3CreateWizard`, ④ actions + export/couverture). Grille `lg:grid-cols-[1fr_380px]` conservée, `aside` toujours `sticky`.
- `src/components/v3public/V3GenieOutlinePanel.tsx` : suppression de l'état `tab` — une liste unifiée (`outline` + `readWrittenProgress`) rendue par `V3OutlinePanel`/`V3WrittenBookTab` fusionnés ; réglages + récit source déplacés dans un `<details>` « Réglages du livre » ; ajout de l'horodatage d'enregistrement et du bouton de reprise (réutilise `V3ResumeBookCard`).
- `src/components/v3public/V3BookActionsBar.tsx` : ajout de « Exporter mon livre » (réutilise l'export local Markdown/DOCX/PDF déjà en place côté Version Longue) et « Faire ma couverture » → `/v3/hub?tab=parcours&module=cover-studio-pro` ; états désactivés dérivés de `writtenCount`.
- `V3PipelinePanel`, `V3KeyHint`, `V3AmbiancePicker`, `V3BriefRecap` : conservés, déplacés dans le volet Réglages (aucune suppression de fonction).
- Aucun changement de base, de sécurité, de calcul KDP, de paiement ni de tarif ; aucun appel IA nouveau (le cycle correction utilise l'edge function de relecture déjà déployée).
