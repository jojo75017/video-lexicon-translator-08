
## Objectif

Donner aux abonnés un générateur IA qui produit une **séquence de 5 emails prêts à envoyer** pour annoncer la sortie de leur livre (newsletter de lancement). L'abonné copie-colle dans son outil habituel (Mailchimp, Brevo, Systeme.io, ConvertKit, MailerLite…). **Aucun envoi depuis EbookStudio.**

## Contraintes (zéro casse)

- Ne PAS toucher à `SimpleSidebar.tsx`, `EbookPlannerPage.tsx`, ni à la navigation/onglets existants.
- Ne PAS créer de nouvelle route ni de nouveau bouton sidebar.
- Ne PAS toucher à `useEbookGeneration`, `useWorkflowResults`, ni à la pipeline P1-P15.
- Ajout purement additif : un nouveau composant inséré dans un onglet déjà existant.

## Emplacement

Le composant `EbookMarketing.tsx` (onglet **Vendre** du planner) contient déjà des cartes "Posts réseaux sociaux", "Landing page", "Système Email Marketing (séquence 5 emails)", "Publicités". Le bouton "Système Email Marketing" est actuellement un placeholder (`toast.info('Fonctionnalité disponible via la page de gestion')`).

→ On **active réellement** cette carte existante en branchant la génération IA dessus, et on la spécialise pour le **lancement de livre**. Aucun nouveau composant à insérer ailleurs, aucune réorganisation.

## Ce qui sera ajouté

### 1. Edge function `generate-launch-email-campaign`

Nouvelle fonction edge (n'impacte aucune fonction existante) :
- Reçoit : `{ ebookTitle, authorName, targetAudience, bookSummary, launchDate, geminiApiKey }`
- Utilise la clé Gemini BYOK de l'abonné (cohérent avec la stratégie API existante)
- Demande à Gemini 2.5 Flash de générer 5 emails au format JSON :
  1. **J-7 Teasing** : "Quelque chose arrive..."
  2. **J-3 Révélation** : couverture + pitch
  3. **Jour J Lancement** : appel à l'achat + lien
  4. **J+3 Preuve sociale** : premiers retours / témoignages
  5. **J+7 Dernière chance** : urgence / bonus de lancement
- Chaque email retourne : `{ subject, preheader, bodyText, bodyHtml }`
- `verify_jwt = false` (cohérent avec les autres fonctions BYOK du projet)
- Validation Zod du payload

### 2. Mise à jour de `EbookMarketing.tsx`

Branchement réel de la carte "Système Email Marketing" déjà présente (lignes ~110-130) :
- Renommer la carte en **"Campagne Email de Lancement (5 emails prêts à envoyer)"**
- Ajouter 2 inputs locaux : `launchDate` (date) et `bookPitch` (textarea court, optionnel — fallback sur `book_summary` du projet)
- `generateEmailCampaign` appelle vraiment la nouvelle edge function et stocke les 5 emails dans `emailTemplates`
- Pour chaque email affiché : badge "Email N — J-X", **objet**, preheader, **corps**, et 3 boutons :
  - 📋 Copier le texte brut
  - 📋 Copier le HTML
  - 💾 Télécharger `.eml` (importable dans n'importe quel outil)
- Bouton global : **"Télécharger les 5 emails (.zip)"** via `jsZip` (déjà dans le projet pour les exports KDP/audio)
- Note explicative en haut de la carte : *"Ces emails sont à copier-coller dans ton outil d'emailing (Mailchimp, Brevo, Systeme.io…). EbookStudio ne les envoie pas."*

### 3. Récupération automatique des données du projet

Le composant reçoit déjà `ebookTitle` et `chapters` en props. On va aussi lire depuis le projet courant (via le state existant déjà disponible dans `EbookPlannerPage`) :
- `author_name`
- `book_summary`
- `target_audience`

Ces 3 valeurs sont passées en props supplémentaires à `EbookMarketing` (changement de signature additif, défauts à `''`).

## Ce qui ne sera PAS fait

- Pas d'envoi d'email automatique
- Pas de capture d'emails / liste d'abonnés gérée par EbookStudio
- Pas de configuration de domaine email
- Pas de modification de la sidebar, des onglets, ou de la navigation
- Pas de nouvelle table en BDD
- Pas de cron, pas de séquence programmée, pas de pgmq

## Fichiers touchés

```text
NOUVEAU  supabase/functions/generate-launch-email-campaign/index.ts
MODIFIÉ  src/components/ebook/EbookMarketing.tsx     (branchement réel + UI campagne lancement)
MODIFIÉ  src/pages/EbookPlannerPage.tsx              (passer 3 props supplémentaires au composant)
```

Aucun autre fichier touché. Le dashboard, la sidebar, la pipeline P1-P15, le tracking, le KDP, l'audio, les exports : **rien n'est modifié**.

## Test après déploiement

1. Ouvrir un projet ebook existant → onglet **Vendre**
2. Vérifier que la carte "Campagne Email de Lancement" s'affiche
3. Renseigner la date de lancement → cliquer "Générer la séquence"
4. Vérifier que 5 emails apparaissent avec objet + corps cohérents avec le titre du livre
5. Tester "Télécharger .zip" → vérifier que les 5 `.eml` s'ouvrent bien dans Apple Mail / Outlook / Gmail (drag & drop)
6. Vérifier que le reste du dashboard fonctionne toujours (création projet, pipeline, KDP, audio)

Si tu valides, je passe en implémentation.
