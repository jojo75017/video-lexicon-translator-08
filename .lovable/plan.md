## Décision

1TPE est **mis en pause, pas supprimé** : le code reste en place derrière un interrupteur, désactivé par défaut. Vous pourrez le réactiver en une ligne si vous décidez d'en refaire quelque chose. À partir de maintenant, **tous les liens de vente pointent chez vous**.

## Le lien unique pour vos réseaux sociaux et vos emails

```text
https://www.ebookstudio.fr/commander
```

C'est le seul lien à diffuser. Variantes utiles, toutes vers la même page :

```text
https://www.ebookstudio.fr/commander?src=facebook
https://www.ebookstudio.fr/commander?src=youtube
https://www.ebookstudio.fr/commander?src=email
https://www.ebookstudio.fr/commander?ref=VOTRECODE
```

Le paramètre `src` sert au suivi de la provenance, `ref` au suivi affilié. Ils sont conservés jusqu'à la commande, donc vous saurez quel réseau vend.

## 1. La page `/commander`

Seule page de paiement de l'offre à 59 € (accès à vie EbookStudio Pro, sans abonnement).

- Rappel de l'offre et de ce qui est inclus.
- Choix du règlement : **59 € en une fois** (mis en avant), **2 ×** et **3 ×** pour étaler.
- Champ email (clé de création du compte).
- Formulaire de paiement **intégré à la page** : carte bancaire et PayPal dans le même écran, sans redirection vers un site tiers.
- Bandeau de réassurance : paiement sécurisé, accès immédiat, contact.
- Suivi de `src` / `ref` transmis à la commande.

La mécanique de paiement en plusieurs fois existe déjà chez vous (utilisée pour le pack 547 € : suivi des échéances, relance en cas d'échec, suspension d'accès, bascule automatique en accès à vie à la dernière échéance). Je la réutilise pour le 59 €.

## 2. Après paiement

- Commande enregistrée avec l'email de l'acheteur.
- **Accès à vie attribué automatiquement** : immédiat en paiement unique ; dès la 1re échéance en plusieurs fois, avec suspension si une échéance échoue.
- Email de confirmation avec lien de connexion et code d'accès.
- Page de remerciement avec la prochaine étape (créer son 1er livre).

## 3. 1TPE mis en veille

- Un interrupteur `TPE_ENABLED = false` dans `src/data/externalLinks.ts`.
- Tant qu'il est sur `false` : aucun bouton, lien ou mention 1TPE n'apparaît nulle part (pages de vente, emails, bannières).
- Le code et le lien restent conservés, réactivables instantanément.
- Vos acheteurs 1TPE existants ne sont pas touchés : leur accès reste valide.
- Sur votre page externe `trafic-affiliation.com/ebookstudiopv`, le bouton d'achat doit être repointé vers `https://www.ebookstudio.fr/commander` — à faire de votre côté, je n'ai pas la main sur cet hébergement.

## 4. Rangement des pages (fin de la confusion)

Redirection vers `/commander` de toutes les adresses qui parlent d'offre ou de paiement : `/v3-offre`, `/valeur-offre`, `/offre-59`, `/59`, `/vente-v3`, `/essai-gratuit`, `/publication-pro`, `/bookperfect-offre`, plus les boutons de la page de présentation.

Point vérifié dans le code : `/offres` affiche aujourd'hui un **écran de connexion avec code d'accès** aux visiteurs non connectés — vos prospects venant des emails tombent donc sur un mur au lieu de l'offre. Les visiteurs non connectés seront redirigés vers `/commander` ; les abonnés connectés gardent exactement leur comportement actuel.

## 5. Emails prospects

Tous les liens d'offre des fonctions d'emailing pointeront vers `https://www.ebookstudio.fr/commander?src=email`, avec le code affilié transmis quand il existe.

## 6. Vérifications avant de communiquer

- Test carte en mode test, puis test PayPal réel à 1 € (le bouton admin existe déjà) pour confirmer que PayPal est bien actif sur votre compte d'encaissement.
- Test d'un paiement en 3 fois : accès ouvert dès la 1re échéance.
- Contrôle qu'aucun lien d'email ne mène plus à un écran de connexion ni à 1TPE.

## Point à confirmer

Pour les paiements en plusieurs fois sur 59 €, je propose **2 × 32 €** et **3 × 22 €** (léger supplément couvrant les frais bancaires). Vous préférez sans supplément (2 × 29,50 € / 3 × 19,67 €) ?
