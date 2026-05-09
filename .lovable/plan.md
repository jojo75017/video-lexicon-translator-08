## Objectif

Faire de `/coaching-vip` une vraie page de vente conçue pour convertir, avec ta vidéo HeyGen en hero, et rendre l'offre beaucoup plus visible sur `/offres`.

## 1. Intégration de la vidéo HeyGen

- Copier `Accompagnement_Privé_30_Jours_L_Offre_Exclusive_de_Georges_1080p_caption.mp4` dans `public/videos/coaching-vip-georges.mp4` (et garder un poster image pour le chargement).
- Affichage natif via balise `<video>` HTML5, contrôles natifs, `playsInline`, `preload="metadata"`.
- Responsive : `aspect-video`, max-width contrôlée, coins arrondis, ombre douce, accent teal.

## 2. Refonte de la page `/coaching-vip`

Nouvelle structure orientée conversion :

1. **Hero compact** — badge "10 places", titre court "Tu fais partie des personnes que je surveille de près 😏", sous-titre résultat ("En 30 jours, on transforme ton projet d'ebook en livre publié et vendable sur Amazon KDP").
2. **VIDÉO HeyGen** — placée immédiatement sous le hero, avec contrôles natifs et un cadre teal/orange. Mention "1 min — regarde avant de réserver".
3. **Bloc inclusions** (existant, conservé) — 3 sessions Zoom, email perso, audit ebook, conseils stratégiques.
4. **Plan 30 jours semaine par semaine** — nouveau bloc visuel :
   - Semaine 1 : Niche, angle et structure validés.
   - Semaine 2 : Rédaction + corrections du manuscrit.
   - Semaine 3 : Couverture, description, mots-clés KDP.
   - Semaine 4 : Publication et stratégie de lancement.
5. **Pour qui / pas pour qui** — deux colonnes :
   - Pour toi si : tu as une idée, tu veux publier, tu appliques.
   - Pas pour toi si : tu cherches une formation passive, tu n'as pas le temps, tu ne veux pas appliquer.
6. **Bloc honnêteté prix** (existant, conservé).
7. **CTA PayPal principal** (existant) — légèrement renforcé : badge "Places restantes affichées en clair" et micro-rassurance "Réponse sous 24h après paiement".
8. **Comment ça se passe** (existant, 3 étapes) — conservé.
9. **Objections / FAQ courte** — nouveau bloc, 5 questions :
   - "Et si je n'ai pas encore d'idée d'ebook ?"
   - "Je débute totalement, c'est pour moi ?"
   - "Combien de temps par semaine ?"
   - "Que se passe-t-il après le paiement ?"
   - "Et si finalement ça ne me convient pas ?"
10. **CTA final** (existant, conservé).
11. **Contact email** (existant, conservé).

## 3. Plus de visibilité sur `/offres`

- Remplacer l'actuelle bannière fine `CoachingVipBanner` (bandeau plein largeur) par un **bloc bannière vidéo** placé en haut de la page :
  - Mini lecteur vidéo (autoplay muet en boucle, `playsInline`) à gauche.
  - À droite : titre "Offre privée — 10 places coaching VIP 30 jours", prix 197€ → 47€, bouton "Voir l'offre".
  - Reste fermable (croix + localStorage), pour ne pas casser l'UX existante.
- L'ancienne bannière fine est supprimée du flux (le composant est remplacé in-place dans `SalesPage.tsx`, aucun autre import à changer).

## 4. Tracking

- Ajouter 3 events analytics simples (via le helper `trackEvent` déjà présent) :
  - `coaching_video_play` (lecture vidéo coaching)
  - `coaching_paypal_click` (clic PayPal)
  - `coaching_banner_click` (clic depuis `/offres`)
- Permet de savoir où ça bloque sans rien casser.

## Détails techniques

- Fichier vidéo copié vers `public/videos/coaching-vip-georges.mp4` (servi statiquement par Vite).
- Aucun changement de routes, ni de backend, ni d'auth.
- `CoachingVipBanner.tsx` réécrit pour devenir un bandeau plus riche (autoplay muet) sans casser l'API d'import.
- `CoachingVipPage.tsx` étendu, sans toucher à la logique PayPal ni au pricing (47€, 10 places, mail `boubetgeorges@gmail.com`).
- Pas de Stripe, pas d'edge function, pas de DB.

## Hors scope

- Compteur réel "places restantes".
- Système de questionnaire automatique.
- Concours, séquence email, vidéos additionnelles.
- Refonte des autres offres (67€, licence étendue, etc.).