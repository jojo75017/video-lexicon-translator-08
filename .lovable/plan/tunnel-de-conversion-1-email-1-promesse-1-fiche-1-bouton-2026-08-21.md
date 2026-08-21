# Tunnel de conversion : 1 email = 1 promesse = 1 fiche = 1 bouton

## Diagnostic (vérifié dans les données)

- Chaque email actuel contient **4 à 5 liens concurrents** : bouton « Commander », bloc cadeau vers /essai, bloc audio vers /message (2 liens), liens texte.
- Résultat mesuré : **37 clics partent sur l'audio gratuit, ~10 seulement sur /commander**, ~8 sur /essai. 0 commande payée, 1 panier abandonné.
- L'email essaie de vendre directement : c'est perçu comme « forcer la vente ». Le clic se fait par curiosité, pas par intention d'achat — et la curiosité va vers le gratuit.

## Le nouveau principe (ton modèle : fiche puis call-to-action)

```text
EMAIL (court, 1 promesse, 1 seul lien)
   └─> FICHE (page pont : histoire / preuve / cadeau — pré-vend sans forcer)
         └─> UN SEUL bouton « Accès à vie 47 € »
               └─> /commander (Stripe)
```

L'email ne vend plus : il donne envie de voir la fiche. La fiche convainc. Le bouton encaisse.

## Étape 1 — Réécriture des 5 emails (1 lien chacun)

- Suppression des blocs concurrents (cadeau + audio + commander dans le même email).
- Texte court, ton personnel, une seule promesse, un seul bouton vers la fiche du jour.
- Tracking conservé (email_clicks par fiche et par étape).
- Relances non-ouvreurs et panier abandonné adaptées au même principe.

## Étape 2 — Les 5 fiches (une par email)

1. **J1 — L'histoire** (Marie & Rachel, « la nouvelle voie ») : adaptation de la page Pourquoi existante, CTA unique en bas.
2. **J2 — Le message audio** : page /message remaniée — écoute d'abord, puis preuve sociale, puis CTA unique (les 3 liens actuels fusionnés en 1 bouton dominant + compte à rebours 31 août).
3. **J3 — Le cadeau** : /essai (premier chapitre gratuit). Après génération du chapitre, un écran « Pour finir votre livre » avec CTA unique vers /commander.
4. **J4 — La preuve** : nouvelle fiche témoignages + garantie + démo des 15 agents → CTA unique.
5. **J5 — Dernier jour** : nouvelle fiche urgence, compte à rebours en haut de page, CTA unique.

## Étape 3 — Mesure

- Suivi des clics par fiche dans le panneau admin (déjà en place via email_clicks).
- Vous recevez d'abord la nouvelle séquence complète en mode **[TEST]** sur votre adresse avant tout envoi réel.

## Ce qui ne change pas

- Le prix 47 €, la page /commander et le checkout Stripe : inchangés.
- Aucun envoi de masse sans votre validation après réception du test.

## Détails techniques

- `supabase/functions/send-sales-email/index.ts` : réécriture des gabarits des 5 étapes + non-ouvreurs.
- `src/pages/launch/MessageAudioPage.tsx` : refonte CTA (1 bouton dominant + urgence).
- `src/pages/launch/EssaiPage.tsx` : écran post-génération avec CTA /commander.
- 2 nouvelles fiches (preuve, dernier jour) + routes dans `src/App.tsx`.
- Redéploiement de la fonction, puis envoi test [TEST], puis votre feu vert.
