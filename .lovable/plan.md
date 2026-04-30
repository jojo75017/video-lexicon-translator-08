## Corrections de la page `/offres` avant lancement

### 1. Fusion finale des encarts tarifs (1 SEUL bloc)

Aujourd'hui, la page contient encore **3 zones de prix** :
- `<BlackPackHero>` (L441) — hero sombre avec prix
- `<PriceComparison />` (L625) — bloc comparatif qui se termine par un encart prix
- Section `#pricing` (L678) — bloc prix unifié final

**Action :**
- **Garder uniquement** la section `#pricing` (L678) comme encart prix officiel.
- **Modifier `<BlackPackHero>`** : retirer l'affichage du prix et le CTA prix → remplacer par un CTA neutre type "Découvrir l'offre" qui scrolle vers `#pricing`. (Le hero garde son rôle de bannière premium sans dupliquer le tarif.)
- **Modifier `<PriceComparison>`** : tronquer le composant après le grid des comparatifs concurrents (services freelance, ghostwriter, etc.) et **supprimer la carte "EbookStudio Pro" finale** avec son prix 67€/CTA. Remplacer par un simple lien "Voir notre offre ↓" qui scrolle vers `#pricing`.

Résultat : un seul prix affiché, en bas de page, dans `#pricing`.

### 2. Verrouillage des outils Audit + Mots-clés (réservés abonnés)

- Le bandeau orange "Outils KDP exclusifs" (L320-349) est déjà conditionné à `hasSubscriberAccess || hasAdminSession` — **OK, rien à faire ici**.
- Vérifier qu'il n'existe pas d'autres CTA publics vers `/kdp-keywords` ou `/audit-pilot` ailleurs sur la page (`grep` confirmera, sinon retirer).
- Confirmer que les routes `/kdp-keywords` et `/audit-pilot` sont bien protégées par `<SubscriberGate>` dans `App.tsx`.

### 3. Suppression des avis fake (risque légal)

Dans le JSON-LD de la page (L254-265) :
- Supprimer le bloc `"review": [...]` avec Marie D., Thomas L., Sophie R. (faux noms, faux chiffres).
- Supprimer également `"aggregateRating"` avec `reviewCount: 47` et la note moyenne fictive.
- Garder le reste du schema (Product, Offer, FAQPage) qui est factuel.

### 4. Cohérence garantie / essai

Aujourd'hui : on parle à la fois de **"Garantie 30 jours satisfait ou remboursé"** et **"Essai gratuit 7 jours"** (L523, L709, L749). C'est ambigu pour le visiteur.

**Décision proposée** : conserver **uniquement la garantie 30 jours satisfait ou remboursé** (cohérent avec la mémoire "free trial" qui mentionne un workflow manuel mais sur la page de vente publique on garde une promesse claire et juridiquement solide).
- Retirer toutes les mentions "Essai gratuit 7 jours" / "7 jours sans carte" sur SalesPage.
- La FAQ mentionne déjà la garantie 30 jours → cohérent.

### 5. Nettoyage code mort

Dans `src/pages/SalesPage.tsx` :
- Retirer les imports inutilisés : `BonusStack` (L22), `BlackPackPricing` (L31), `OffresKdpRocket` (L33).
- Retirer les commentaires obsolètes "BonusStack supprimé", "BlackPackPricing supprimé", "OffresKdpRocket retiré".

### Fichiers modifiés

- `src/pages/SalesPage.tsx` (le principal)
- `src/components/sales/BlackPackHero.tsx` (retrait prix + CTA neutre)
- `src/components/sales/PriceComparison.tsx` (suppression card finale)

### Hors scope (à publier ensuite)

Une fois ces 4 corrections faites, **vous devrez recliquer "Publish" / "Update"** dans Lovable pour que `ebookstudio.fr` reflète la nouvelle version (les modifs frontend ne sont pas auto-déployées).