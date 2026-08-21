# Verrou de lecture : lire → email → suite + CTA

## Principe retenu (le plus efficace pour ce type de page)

```text
1. Le visiteur LIT librement le début (accroche, intro, preuve)
2. COUPURE : la suite est floutée — il laisse son email pour continuer
   (+ pack 10 niches offert en cadeau)
3. La suite se débloque immédiatement, il FINIT de lire
4. Le bouton « Accès à vie 47 € » n'apparaît QU'À LA FIN, après lecture
```

La fenêtre chronométrée (popup après 40 s) interrompt la lecture et fait fuir ;
la coupure franche après l'intro est le format qui convertit le mieux ici :
le visiteur sait exactement ce qu'on lui demande et ce qu'il reçoit.

## Étape 1 — Composant `ReadingGate` (réutilisable)

Nouveau composant `src/components/marketing/ReadingGate.tsx` :

- Enrobe le contenu verrouillé : aperçu flouté (200 px, dégradé) + carte de capture.
- Texte de la carte : « La suite de la lecture est offerte » + formulaire
  (email obligatoire, prénom optionnel, validation zod, honeypot anti-bot).
- En échange : **la suite de la page + le pack 10 niches** (mention explicite).
- Envoi à `funnel-capture-lead` avec `lead_magnet: '10-niches-offertes'`,
  UTM, ref_code, landing_url (même contrat que `Niches10Offer`).
- Après envoi : la suite se débloque **sur place** (pas de redirection qui
  coupe la lecture), avec une ligne discrète « Votre pack 10 niches vous
  attend : Recevoir le pack » vers `/10-niches-offertes`.
- **Mémoire** : `localStorage` (email + `ebs_reader_unlocked`) — un visiteur
  qui a déjà laissé son email ne revoit jamais le verrou, sur aucune page.
- **Contournements prévus** : utilisateur connecté, abonné ou admin → pas de
  verrou ; paramètre `?apercu=1` pour que vous relisiez les pages en entier.
- Suivi : événements `reading_gate_view` / `reading_gate_unlock` par surface
  (v3, methode, fiche) pour mesurer le taux de déblocage.

## Étape 2 — Les 3 zones de coupure

1. **`/v3`** : visible = bannière lancement, accroche, moteurs IA,
   « Qu'est-ce que la V3 ». Verrouillé = les 6 étapes, les bénéfices, le
   tableau comparatif **et le CTA final 47 €** (il n'existe qu'après lecture).
2. **`/methode`** : visible = intro, problème, avant/après. Verrouillé =
   la valeur (689 € → 47 €), la FAQ et le CTA final.
3. **Les 5 fiches** (`/fiche/*`, `/message`, `/essai`) : la fiche se lit
   normalement, seul **le bouton final vers /commander** est verrouillé —
   et uniquement pour un visiteur **inconnu** : celui qui arrive depuis un
   de vos emails (email déjà stocké) ne voit jamais le verrou, il garde son
   bouton direct. On ne redemande jamais un email qu'on a déjà.

## Étape 3 — Réparation du cadeau 10 niches

`funnel-capture-lead` ne connaît pas encore la clé `10-niches-offertes` :
il renvoie aujourd'hui le PDF 5 niches par défaut. Ajout d'une entrée dédiée
(objet « 🎁 Votre pack 10 niches offertes », lien vers la page cadeau interne
`/10-niches-offertes`). Le visiteur reçoit donc bien le cadeau promis, en plus
de la lecture débloquée.

## Mesure

- `funnel_leads` : chaque déblocage crée un lead marqué `10-niches-offertes`
  avec la page d'origine (`landing_url`) — vous verrez quelle surface
  (/v3, /methode, fiches) capture le mieux.
- Les clics vers `/commander` restent suivis comme aujourd'hui.

## Ce qui ne change pas

- Le prix 47 €, `/commander`, Stripe : inchangés.
- Aucun envoi d'email de masse ; seul l'email cadeau part à la capture.
- Le tunnel email → fiches → /commander reste identique pour vos prospects
  connus (ils ne voient jamais le verrou).

## Détails techniques

- Nouveau : `src/components/marketing/ReadingGate.tsx`.
- Modifiés : `src/pages/v3public/V3HomePage.tsx` (coupure après
  `V3WhatIsPanel`), `src/pages/launch/MethodePage.tsx` (coupure avant
  `MethodeValeur`), `src/components/launch/FicheShell.tsx` (prop
  `gateCta` autour du bouton final), `supabase/functions/funnel-capture-lead/index.ts`
  (entrée `10-niches-offertes`), puis redéploiement de la fonction.
- Vérification navigateur : verrou visible en visiteur anonyme, déblocage
  après email, absence de verrou en `?apercu=1` et pour un email connu.
