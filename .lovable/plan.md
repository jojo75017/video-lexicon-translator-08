# Plan immédiat : emails transactionnels avec Hostinger

## Pourquoi c'est devenu compliqué

Avant, vous utilisiez **Brevo** avec votre propre clé API (`BREVO_API_KEY` est encore dans les secrets). Lovable a ensuite ajouté **Lovable Emails**, qui est géré en interne et demande une délégation NS sur un sous-domaine. Cette délégation NS n’est pas supportée par Hostinger, d’où le blocage actuel.

**La bonne nouvelle :** Brevo fonctionne toujours. Vous n’êtes pas obligé de passer par Lovable Emails.

## Options possibles

### Option A — Utiliser Brevo (recommandée si vous voulez éviter la DNS)

Avantage : vous gardez Hostinger, pas de NS à ajouter, c’est ce que vous connaissez.

Étapes :
1. Vérifier que votre domaine/sender est validé dans Brevo.
2. Utiliser la clé `BREVO_API_KEY` déjà stockée.
3. Adapter le moteur d’envoi pour passer par Brevo au lieu de Lovable Emails.
4. Garder le mode « zéro envoi » jusqu’à ce que le sender Brevo soit confirmé actif.
5. Tester un email à vous-même.

### Option B — Déléguer via Cloudflare

1. Créer un compte gratuit Cloudflare.
2. Transférer la gestion DNS de `ebookstudio.fr` de Hostinger vers Cloudflare.
3. Ajouter les NS Lovable pour `notify.ebookstudio.fr` dans Cloudflare.
4. Valider et passer à Lovable Emails.

### Option C — Transférer le domaine dans Lovable

Lovable gère la DNS et la délégation email automatiquement. Plus de manipulation chez Hostinger.

### Option D — Ne rien faire / rester bloqué

Conserver le mode « zéro envoi ». Les emails ne partent pas, les clients peuvent perdre leurs codes d’accès.

## Ce que je recommande

Si Brevo marchait bien avant, reprenons **Option A**. C’est la plus rapide, la moins risquée pour votre site, et ça ne touche pas à Hostinger.

## Question immédiate

Voulez-vous que je reprenne le moteur d’emails avec **Brevo** (Option A) ?

- **Oui** → je configure le moteur pour envoyer via Brevo, je teste un email, puis on réactive les envois indispensables.
- **Non** → je détaille la marche à suivre pour Cloudflare (Option B) ou le transfert Lovable (Option C).

Répondez **Oui** ou **Non**, pas besoin de faire autre chose.
