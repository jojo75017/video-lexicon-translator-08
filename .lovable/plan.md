# Plan immédiat : emails transactionnels avec Hostinger

## Problème constaté

Hostinger ne permet pas d’ajouter des enregistrements NS personnalisés pour un sous-domaine (`notify.ebookstudio.fr`).
Lovable Emails a besoin d’une délégation NS sur le sous-domaine d’envoi pour gérer SPF, DKIM et MX automatiquement. Il n’existe pas d’alternative CNAME, A ou TXT équivalente.

## Options possibles

### Option A — Déléguer `notify.ebookstudio.fr` via Cloudflare (recommandée, gratuite)

1. Créer un compte gratuit sur **Cloudflare**.
2. Ajouter le domaine `ebookstudio.fr` dans Cloudflare.
3. Récupérer les 2 serveurs DNS de Cloudflare (ex. `bob.ns.cloudflare.com`, `lara.ns.cloudflare.com`).
4. Dans Hostinger, remplacer les **NS du domaine racine** `ebookstudio.fr` par ceux de Cloudflare.
5. Attendre la propagation (jusqu’à 24h).
6. Une fois le domaine géré par Cloudflare, ajouter dans Cloudflare les enregistrements NS pour `notify.ebookstudio.fr` fournis par Lovable (affichés après avoir cliqué sur le bouton de configuration email).
7. Valider le domaine dans Lovable.

**Avantage :** Cloudflare gère bien les NS de sous-domaine, c’est gratuit, et cela ne casse pas l’hébergement web actuel. Les enregistrements A/TXT/CNAME existants peuvent être recréés dans Cloudflare si nécessaire.

### Option B — Transférer le domaine dans Lovable

1. Dans Lovable, ouvrir **Workspace settings → Workspace domains**.
2. Lancer le transfert de `ebookstudio.fr`.
3. Lorsque le domaine est géré par Lovable, la configuration email crée automatiquement la délégation NS sans manipulation DNS manuelle.
4. Configurer `notify.ebookstudio.fr` comme domaine d’envoi.

**Avantage :** aucune manipulation chez Hostinger, aucune propagation hasardeuse.  
**Inconvénient :** le domaine change de gestionnaire DNS, ce qui peut impacter d’autres services s’ils sont liés à Hostinger.

### Option C — Ne pas déléguer NS et garder le statu quo (non recommandée)

Continuer sans domaine email Lovable. Les emails transactionnels partiront alors depuis un domaine Lovable par défaut (moins personnalisé, moins de délivrabilité).  
Cela n’active pas la marque propre et peut renforcer le spam-score.

## Ce qu'il ne faut PAS faire

- Ne remplacez **pas** les NS de `ebookstudio.fr` par ceux de Lovable directement : cela casserait l’hébergement web actuel.
- N’essayez pas d’ajouter un CNAME ou un TXT à la place des NS : Lovable n’en a pas besoin et cela ne suffira pas.
- Ne continuez pas à payer des crédits pour des modifications techniques avant d’avoir choisi une option et validé la propagation.

## Prochaine décision

Quelle option préférez-vous ?

- **A** — Cloudflare (gratuit, simple, recommandé)  
- **B** — Transfert dans Lovable (zéro DNS, mais plus engageant)  
- **C** — Rester sans domaine dédié (solution de repli)

Dès que vous choisissez, je détaille les étapes suivantes sans action technique avant votre validation.
