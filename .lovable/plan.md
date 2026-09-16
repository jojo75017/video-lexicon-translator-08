# Avant-première V3 — une page vitrine à envoyer à votre liste

Objectif : un visiteur découvre la V3 comme dans un tunnel de vente — il regarde, il comprend, il s'inscrit. Il ne peut rien lancer, rien casser.

## La page : `/avant-premiere`

Nouvelle page publique, sans menu latéral, sans connexion, lisible sur mobile. Palette éditoriale existante (ivoire, encre, émeraude, or discret).

Déroulé de haut en bas :

1. **Bandeau** — « Avant-première · Ouverture le 1er octobre 2026 ».
2. **Titre + promesse** — « Votre maison d'édition IA » et une phrase courte sur ce que la V3 fait vraiment.
3. **La vidéo de présentation, en grand** — l'élément central, dans son cadre éditorial (vidéo existante, réutilisée telle quelle).
4. **Ce que vous voyez dans la vidéo** — 4 à 6 points courts : le sommaire construit avec vous, les 16 agents jusqu'à Lior le relecteur, les couvertures Kindle / broché / relié, le studio jeunesse et BD, les exports KDP.
5. **Preuves visuelles** — 3 vraies couvertures et 2 aperçus d'écrans déjà présents dans le projet, en simple galerie non cliquable.
6. **Le bloc d'inscription** (le cœur) — un champ email + bouton « Je veux être prévenu à l'ouverture ». Confirmation immédiate à l'écran.
7. **Sous ce bouton, en second** — « Vous préférez ne pas attendre : accès à vie 47 € jusqu'au 30/09/2026 » avec lien vers `/commander`.
8. **Rassurance + pied de page** — garantie, aucun prélèvement pour la liste d'attente, mentions habituelles.

Règle stricte : aucun bouton d'outil sur cette page. Rien à générer, rien à ouvrir. Le mode contemplation actuel reste inchangé pour le reste de la V3.

## Le lien à envoyer

- Lien traçable `ebookstudio.fr/r/apv3` → `/avant-premiere`, avec comptage des clics comme les autres liens `/r`.
- Je vous prépare **le texte de l'email prêt à copier** dans Systeme.io : objet, 3 variantes d'objet, corps court, un seul lien. Aucun envoi n'est déclenché depuis l'app.
- Le texte est ajouté à votre panneau `/admin/sequence-email` pour copier-coller en un clic.

## Ce qui n'est pas touché

Prix, paiements, base de données, sécurité, calculs KDP, crédits IA, module V4, page d'accueil V3, interrupteur d'ouverture du 1er octobre.

## Détails techniques

- Nouvelle route `/avant-premiere` dans `App.tsx`, page dédiée hors `V3PublicLayout` (pas de barre latérale), en lazy import.
- Vidéo : réutilisation de `V3PresentationVideo` / `src/assets/v3-presentation.mp4`.
- Inscription : appel de la fonction existante `funnel-capture-lead` avec un `lead_magnet` dédié (`avant-premiere-v3`) — aucune nouvelle table, aucune migration, la synchro Systeme.io existante prend le relais.
- Lien court : nouvelle entrée dans la table de redirections déjà servie par `RedirectClickPage` (`/r/:shortKey`).
- Popups et bandeaux marketing exclus de cette page via `marketingExclusions.ts`, pour garder un seul appel à l'action.
- SEO : titre et description propres, `og:title`/`og:description`, un seul `h1`.
