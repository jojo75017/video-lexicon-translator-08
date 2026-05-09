
# Offre Coaching VIP — 10 places à 47€

## Objectif
Ajouter une offre limitée (10 places) d'accompagnement privé 30 jours à 47€, payable uniquement via PayPal (`boubetgeorges@gmail.com`). **Sans toucher** aux offres existantes (Pro 67€/an, Pack Sérénité 30€, Licence Étendue 47€, paiement manuel).

## Ce qui sera créé / modifié

### 1. Nouvelle page `/coaching-vip` (`src/pages/CoachingVipPage.tsx`)
Page de vente dédiée reprenant ton texte (corrigé et structuré) :
- **Hero** : "Tu fais partie des personnes que je surveille de près 😏" + badge "10 places seulement"
- **Bloc valeur** : 30 jours d'accompagnement, 3 sessions Zoom, accès email perso direct
- **Ancrage prix** : 197€ barré → **47€** mis en avant
- **Filtre qualité** : "Je préfère 10 personnes motivées à 10 curieux"
- **Bouton PayPal** unique vers :
  `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=47&currency_code=EUR&item_name=Coaching+VIP+30+jours+EbookStudio`
- **Process en 3 étapes** : Paiement → Questionnaire → RDV Zoom/téléphone
- **FAQ courte** + lien retour vers `/offres`
- Style aligné charte KDP (background `#FAFAFA`, accent teal `#008296`, hover orange `#FF9E2D`)

### 2. Bannière sur `/offres` (`src/pages/SubscriptionPage.tsx`)
Petit encart **non intrusif** placé en haut de la page (avant les offres existantes) :
- Bandeau gradient discret avec : "🔥 Offre privée — 10 places coaching VIP 30j — 47€"
- Badge dynamique "X places restantes" (compteur statique côté front, affichage `10 places`)
- Bouton "Découvrir l'offre" → redirige vers `/coaching-vip`
- Dismissible (croix de fermeture, mémorisée en `localStorage`)

### 3. Route ajoutée dans `src/App.tsx`
Nouvelle route `/coaching-vip` pointant vers `CoachingVipPage`.

## Ce qui ne sera PAS touché
- ❌ Pas de modification de `PaiementManuelPage`, `UpsellPaiementPage`, `LicenceEtenduePage`
- ❌ Pas de changement de prix sur l'abonnement Pro (67€/an)
- ❌ Pas de Stripe — **PayPal uniquement** comme demandé
- ❌ Pas d'edge function, pas de DB, pas de compteur réel de places (statique côté UI — tu fermeras manuellement quand plein, ou on rajoutera plus tard si besoin)
- ❌ Pas d'envoi d'email automatique (tu gères les questionnaires manuellement)

## Détails techniques
- 1 nouveau fichier `src/pages/CoachingVipPage.tsx`
- 1 nouveau composant `src/components/sales/CoachingVipBanner.tsx`
- Édition de `src/pages/SubscriptionPage.tsx` (ajout bannière en haut)
- Édition de `src/App.tsx` (ajout route lazy-loaded)
- Aucun nouveau package npm

## Question ouverte
Le compteur "places restantes" est statique (10). Si tu veux un vrai compteur partagé entre visiteurs (ex: "7 places restantes" qui décrémente après chaque vente), il faudra une mini-table en base + edge function de décompte manuel. Dis-moi si tu veux ça en V2 — pour l'instant je pars sur affichage simple "10 places maximum".
