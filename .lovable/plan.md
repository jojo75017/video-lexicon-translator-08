## Problème

L'accueil V3 n'a plus de point de départ : plus de geste « je tape mon titre → je suis redirigé vers les infos du livre ». Et les clés API sont enterrées (bannière en haut + panneau replié sur `/v3/create`), donc des abonnés lancent un livre ou une recherche sans clé et ça échoue.

## Ce qu'on met en place

### 1. Barre de démarrage sur l'accueil
Juste sous le héros, une carte « Commencez votre livre » :
- champ **Titre du livre** (grand, doré, focus auto) + bouton **Continuer →**, validation à la touche Entrée
- au clic : le titre est enregistré dans la fiche livre puis redirection vers `/v3/create`, titre déjà prérempli (sans écraser le reste d'une fiche existante)
- si un livre est déjà en cours : ligne « Reprendre : *Titre* » sous le champ
- champ vide : bouton inactif + aide « Donnez d'abord un titre — vous pourrez le modifier ensuite »

### 2. Bloc Clés API remonté juste avant la zone de recherche / de démarrage
Encart **« Vos clés IA »** placé **au-dessus** de la barre de démarrage sur l'accueil et **au-dessus** de la zone de recherche sur `/v3/recherche` :
- **Clé manquante** : encart ambre ouvert par défaut, « Sans clé Gemini, la recherche Amazon et l'écriture ne démarrent pas », boutons « Obtenir ma clé gratuite » et « Coller ma clé ».
- **Clé active** : encart replié en une ligne verte « Clé IA active ✓ — modifier ».
- `/v3/create` réutilise ce même composant à la place du panneau actuel (plus de doublon).

### 3. Module « Couleurs V3 »
Petit module en bas de page (accueil), carte discrète repliable listant la palette officielle en pastilles + code hex, lue depuis les variables CSS `.v3pub` :

```text
Émeraude #064e3b · Émeraude 600 #0d7a5f · Émeraude 50 #ecf5f1
Or #c9a84c · Or 600 #b0902f · Or pâle #f5f0e0
Papier #fbfaf6 · Crème #f5f3ee
Encre #0a1f18 · Encre 2 #1a2e26 · Texte discret #5b6b64
Bordures rgba(6,78,59,0.10)
```

Chaque pastille est cliquable pour copier le hex (toast de confirmation).

## Détails techniques

- Nouveaux composants : `src/components/v3public/V3ApiKeysGate.tsx` (encart clés partagé, s'appuie sur `ApiProviderQuickSettings`), `src/components/v3public/V3StartBookBar.tsx` (champ titre → `writeBookBrief({ title })` → `navigate('/v3/create')`), `src/components/v3public/V3PaletteModule.tsx` (palette, tokens en dur alignés sur `src/styles/v3-public.css`).
- Fichiers modifiés : `src/pages/v3public/V3HomePage.tsx`, `src/pages/v3public/V3CreatePage.tsx`, `src/pages/v3public/V3RecherchePage.tsx`.
- Aucun changement de base de données ni de backend.
