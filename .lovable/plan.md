# Plan email simple

## Le problème
Les gens ne reçoivent pas bien les codes d'accès après paiement. Il faut un système d'email fiable.

## 3 options possibles

### Option A : Lovable s'en charge (recommandé, le plus simple)
- Lovable envoie les emails avec votre domaine `ebookstudio.fr`.
- Vous ne créez pas de boîte email Hostinger.
- Vous ne touchez pas à Amazon SES.
- Seul geste de votre part : copier 2 lignes dans Hostinger (je vous donne les lignes exactes).
- Coût : inclus dans votre plan Pro.
- Idéal pour : les codes d'accès et les confirmations de paiement.

### Option B : Hostinger
- Vous créez une boîte email `contact@ebookstudio.fr` dans Hostinger.
- Vous modifiez les DNS dans Hostinger pour remplacer Amazon SES.
- Je configure l'application pour envoyer via Hostinger.
- Coût : abonnement Hostinger Email.
- Risque : peut casser la réception actuelle si mal fait.

### Option C : Systeme.io pour tout
- On utilise Systeme.io pour les codes d'accès ET les campagnes marketing.
- Vous gérez vos listes et emails dans Systeme.io.
- Lovable n'envoie plus d'emails.
- Coût : votre abonnement Systeme.io actuel.
- Inconvénient : moins intégré à l'application.

## Ma recommandation
Choisir l'**Option A** (Lovable).
- Les codes d'accès arrivent automatiquement après paiement.
- Les campagnes marketing restent dans Systeme.io (déjà connecté).
- C'est le plus rapide et le moins risqué.

## Étapes si vous choisissez Option A
1. J'ouvre la configuration email dans Lovable.
2. Je vous donne 2 lignes à copier dans Hostinger.
3. Vous copiez ces 2 lignes (5 minutes).
4. J'attends que le domaine soit vérifié (10 min à 72h).
5. J'active les templates d'emails pour les codes d'accès.
6. Je teste un envoi de code d'accès.
7. Je vérifie que les campagnes Systeme.io fonctionnent toujours.

## Décision demandée
Dites-moi simplement : **A**, **B** ou **C**.
Je m'occupe de tout ensuite.
