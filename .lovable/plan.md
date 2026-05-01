# Plan de corrections pré-lancement — Audit complet

## ✅ Décision tarifaire confirmée
**67€ paiement unique, accès À VIE, AUCUNE récurrence.**
Bannir partout : "67€/an", "abonnement", "annuel", "récurrent", "/an".
Wording autorisé : "Accès à vie", "Paiement unique", "Pro Lifetime", "Garantie 30 jours".

---

## 🔧 Bugs à corriger (par ordre de priorité)

### 1. 🚨 BLOQUANT — `/dashboard` inaccessible aux abonnés payants
La route principale du générateur 15-Agents est protégée par `<AdminGate>` au lieu de `<SubscriberGate>`. Aucun client payant ne peut entrer.
- **Fichier** : `src/App.tsx`
- **Action** : remplacer `AdminGate` par `SubscriberGate` (mêmes props que `/ebook-planner`).

### 2. 🚨 CRITIQUE — Wording prix incohérent ("67€/an" vs "à vie")
Audit complet pour retirer toute mention "67€/an", "abonnement annuel", "récurrent" → remplacer par "Accès à vie" / "Paiement unique" / "Garantie 30 jours".
- **Fichiers** : `src/pages/SalesPage.tsx`, composants dans `src/components/sales/`, `src/pages/SubscriptionPage.tsx`, `src/pages/PaiementManuelPage.tsx`, `src/pages/UpsellPage.tsx`, `src/pages/FaqAssistancePage.tsx`.
- **Vérifier** : badges `lifetime-badge`, footer, CTA, FAQ.

### 3. 🚨 CRITIQUE — Contraste illisible sur `/audiobook-demo`
Texte sombre sur fond sombre (titre livre, label "Écouter l'extrait", sous-texte audio).
- **Fichier** : `src/pages/AudiobookEmbedPage.tsx` (et page démo associée)
- **Action** : forcer classes contrastées via tokens (`text-foreground` sur fond clair, ou inverse).

### 4. 🚨 CRITIQUE — Contraste cassé sur `/upsell`
Sur fond violet, les noms cartes (Gemini 3 Flash, Imagen 3, Azure Speech), prix barré "147€" et label "Cliquez à VIP" sont invisibles.
- **Fichier** : `src/pages/UpsellPage.tsx`
- **Action** : passer en classes tokens haute lisibilité.

### 5. ⚠️ MOYEN — Blog annonce "6 Articles" mais n'en contient que 3
- **Fichier** : `src/pages/BlogPage.tsx`
- **Action** : remplacer la stat statique "6 Articles" par `{blogArticles.length}` dynamique → affichera "3" automatiquement.

### 6. 🎨 UX — Bloc "Connexion Admin" intrusif sur `/ebook-planner`
Quand un abonné non-connecté arrive sur `/ebook-planner`, il voit en grand un bloc "Administrateur ?" avant le formulaire abonné. Confus pour un client lambda.
- **Fichier** : `src/components/SubscriptionAuth.tsx` (composant en amont du `SubscriberGate`)
- **Action** : afficher ce bloc admin uniquement via toggle discret (lien "Espace admin →" en bas), ou via `?admin=1`.

### 7. 🪶 COSMÉTIQUE — Warning meta tag deprecated
- **Fichier** : `index.html`
- **Action** : ajouter `<meta name="mobile-web-app-capable" content="yes" />` à côté de `apple-mobile-web-app-capable`.

---

## ✅ Routes confirmées OK (aucune modif)

`/blog`, `/blog/:slug`, `/demo`, `/faq`, `/formation`, `/formation-audio`, `/formation-videos`, `/communaute`, `/ebookbot`, `/cgv`, `/mentions-legales`, `/paiement-manuel`, `/confirmation-paiement`, `/paiement-succes`, `/audiobook-merci/:slug`, `/ebook-planner` (auth fonctionne), `/kdp-keywords`, `/seo-generator`, `/audit-pilot`, `/series-tomes`.

---

## ❌ Hors scope (post-lancement, validé par toi)

- ❌ Ajouter 3 articles blog supplémentaires pour atteindre "6 articles" (on garde 3, on corrige juste le compteur — bug #5).
- ❌ Refonte UX complète du `SubscriberGate` (au-delà de cacher le bloc admin — bug #6 limité à la cosmétique).
- ❌ Warning React `UNSAFE_componentWillMount` (provient d'une lib externe non maintenue par nous).

---

## 📦 Mise à jour mémoire (après build)

- `mem://business/pricing/subscription-model-2026` : remplacer "67€/an" par "67€ paiement unique à vie, aucune récurrence".
- `mem://index.md` : mettre à jour la ligne référence + ajouter règle Core "PRICING : 67€ à vie, jamais /an".

---

## 🚀 Après les 7 corrections

1. Build automatique Lovable.
2. Tu cliques **"Publier"** pour déployer sur `ebookstudio.fr`.
3. Hard refresh (Ctrl+Shift+R) pour vider le cache CDN.
4. Lancement demain ✨

---

**👉 Dis-moi "go" pour que je passe en mode build et lance les 7 corrections.**
