# Tunnel de vente BD & Jeunesse (ComicAgent) — page de vente + upsell

## Réponse à votre question : oui, c'est en partie un doublon

Le "dashboard ebook_comic_agent" existe déjà dans votre projet :
- `/bd-studio` : page + générateur complet (choix de style Tintin/Astérix/Lucky Luke…, scénario IA, illustration des cases, export PDF/KDP), avec gating abonné.
- Table `comic_books` en base, modèles dans `bdTemplates.ts`, agents `agent-illustrator` / `agent-kids-stories` côté serveur.

Donc on ne recrée pas l'application. On construit uniquement ce qui manque : **la page de vente style WarriorPlus, le tunnel de paiement, et la page d'upsell**, qui débouchent sur BD Studio comme dashboard.

## Ce qui sera créé

### 1. Page de vente `/bd-offre` (style WarriorPlus)
- Barre d'urgence en haut (offre limitée + compte à rebours).
- Titre d'accroche + sous-titre, zone vidéo VSL (emplacement prêt, lien à fournir).
- Cartes de fonctionnalités : création de personnages, planches BD, histoires jeunesse illustrées, export KDP.
- Section "Pour qui ?" (parents, auteurs KDP, illustrateurs débutants, enseignants).
- Bonus, garantie 30 jours, FAQ, preuves sociales, CTA répétés.
- Design cohérent avec le reste du site (tokens Emerald & Gold, pas de couleurs en dur).

### 2. Tunnel de paiement — offre principale 17 €
- Bloc email + paiement **Stripe** (carte) et **PayPal**, comme sur `/commander`.
- Nouveau produit catalogue `bd_comic_17` (17 €, paiement unique).
- Après paiement : redirection automatique vers la page d'upsell (pas directement le dashboard).

### 3. Page d'upsell unique `/bd-upsell` — 47 €
(47 € au lieu de 67 €, pour rester dans vos paliers 17/27/47 €.)
- Offre unique affichée une seule fois : version avancée, crédits illustrations étendus, styles Pro, export multi-formats.
- Deux boutons : "Oui, j'ajoute" (Stripe/PayPal, produit `bd_comic_pro_47`) et "Non merci, accéder à mon studio".
- Les deux chemins mènent ensuite au dashboard `/bd-studio`.

### 4. Accès au dashboard — oui, c'est réellement fonctionnel
- L'achat crée une entitlement pour l'email acheteur, ce qui déverrouille `/bd-studio` (générateur existant) et la version Pro si l'upsell est pris.
- Après paiement, l'acheteur crée de vrais livres : personnages, scénario IA, cases illustrées, histoires jeunesse, export PDF/KDP et Word. Ce n'est pas une maquette : le générateur, la table `comic_books` et les agents serveur (`agent-illustrator`, `agent-kids-stories`) tournent déjà.

### 5. Mise en avant « Grande nouveauté V4 »
- Encart proéminent en haut de la page d'accueil V3 : bandeau « Grande nouveauté V4 — Studio BD & Jeunesse », visuel, 3 bénéfices, CTA vers `/bd-offre`.
- Même encart (version compacte) sur `/v3/upsells`, en première position du groupe création.
- Ajout de la nouveauté dans `v3Nouveautes.ts` (source unique) pour que le badge « NOUVEAU » et la page `/v3/nouveautes` se mettent à jour automatiquement.

## Détails techniques
- Nouvelles pages : `src/pages/bd/BDOffrePage.tsx`, `src/pages/bd/BDUpsellPage.tsx`, `src/pages/bd/BDMerciPage.tsx` + routes dans `App.tsx`.
- Paiement : réutilisation du schéma `stripe-checkout` (catalogue produits) et du flux PayPal existant ; ajout des clés `bd_comic_17` et `bd_comic_pro_47`.
- Entitlements : lignes `module_entitlements` (`module = 'bd_comic'` / `'bd_comic_pro'`) écrites par le webhook de paiement ; `BDStudioPage` lit cette entitlement en plus du test abonné actuel.
- Aucun `npm run build` : le serveur de dev tourne déjà, la prévisualisation se met à jour automatiquement.

## À me fournir ensuite
- Le lien de la vidéo VSL (sinon je laisse un encart placeholder).
- Le texte exact de garantie si vous en avez un préféré.
