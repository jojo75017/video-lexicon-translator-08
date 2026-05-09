## Problème

La page `/demo` (route fonctionnelle dans `App.tsx`) existe toujours, mais depuis la refonte joyeuse de `/offres`, plus aucun lien visible n'y mène :

- Le menu du header contient seulement : Découvrir, Les agents, Tarif, Connexion
- Le footer pointe vers l'ancre interne `#demo-live` (la mini-démo animée scriptée), pas vers la vraie page interactive `/demo`
- Le visiteur n'a donc aucun moyen d'accéder à la démo Gemini réelle

## Ce que je vais faire

### 1. Header `/offres` — ajouter un lien "Démo"
Dans `src/pages/SalesPage.tsx` (nav ligne 241-246), ajouter une entrée :
```
<Link to="/demo">Démo gratuite</Link>
```
Placée juste avant "Connexion" pour rester visible au-dessus de la fold.

### 2. Footer `/offres` — corriger le lien démo
Remplacer l'ancre `#demo-live` (ligne 332) par un vrai `<Link to="/demo">` vers la page de démo Gemini.

### 3. Section `JoyfulLiveDemo` — ajouter un pont vers la vraie démo
Sous le CTA "Moi aussi je veux essayer" du composant `src/components/sales/joyful/JoyfulLiveDemo.tsx`, ajouter un second bouton secondaire / lien texte :
```
"Tu veux tester avec ton propre sujet ? → Lancer la démo interactive"
```
qui route vers `/demo`. Ainsi la mini-animation scriptée garde son rôle "teaser" et les visiteurs curieux ont un chemin clair vers la vraie démo.

### 4. Bandeau mobile (optionnel mais recommandé)
Le menu desktop est `hidden md:flex` — les mobiles ne voient ni Découvrir, ni Démo. Ajouter un petit bouton "Démo" discret à côté du logo en mobile, ou intégrer la démo dans un menu burger si tu préfères (à confirmer).

## Ce qui ne change pas

- La page `/demo` elle-même (déjà refondue en style joyeux)
- La logique de génération, le edge function `demo-generate-plan`, le tracking
- La section `JoyfulLiveDemo` reste comme teaser visuel
- Aucune modification backend

## Question

Pour le mobile, tu préfères :
- A) Un bouton "Démo" visible à côté du CTA "67€"
- B) Un menu burger complet (Découvrir, Agents, Démo, Tarif, Connexion)
- C) Rien sur mobile, juste le footer suffit
