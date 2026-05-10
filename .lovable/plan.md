## Objectif

Augmenter le taux de clic sur `/offres` **sans aucun chiffre fictif** (conformité légale + règle projet "no fake data"). 3 leviers honnêtes, déployés uniquement sur la page `/offres`.

---

## 1. Nettoyer `UrgencyBanner.tsx` (suppression du faux)

Le composant actuel contient 2 messages fictifs interdits :
- "3 personnes ont acheté dans la dernière heure" → **supprimé**
- "Rejoignez +5000 auteurs satisfaits" → **supprimé**

Remplacés par 6 messages **vrais et vérifiables** :
- "Pont Ascension : -30€ jusqu'au lundi 18 mai 23h59"
- "Garantie 30 jours — remboursé sans question"
- "Paiement unique 67€, pas d'abonnement"
- "Accès immédiat après paiement"
- "15 agents IA pour écrire ton ebook KDP"
- "Le prix passe à 97€ mardi 19 mai"

## 2. Countdown réel jusqu'au 18 mai 23h59

Nouveau composant `CountdownDeadline.tsx` placé **en haut de `/offres`** (sticky bandeau orange #FF9E2D) :
- Affiche `Jours : Heures : Minutes : Secondes` jusqu'au **18/05/2026 23h59**
- Texte : "Offre lancement -30€ se termine dans"
- Décrémente en temps réel (setInterval 1s)
- Quand expiré → masque le bandeau automatiquement (pas de fake reset)
- Cliquable → scroll vers la section CTA

## 3. Bandeau garantie 30 jours XL

Section visible **juste avant chaque CTA "Acheter maintenant"** sur `/offres` :
- Icône bouclier vert + titre gros : "Garantie satisfait ou remboursé 30 jours"
- Sous-titre : "Tu testes EbookStudio. Si tu n'es pas convaincu, tu écris 1 email, tu es remboursé. Aucune justification demandée."
- Bordure verte 2px, fond crème, padding généreux
- But : lever le frein "et si ça marche pas ?"

---

## Fichiers touchés (uniquement `/offres`)

```text
src/components/sales/UrgencyBanner.tsx        ← messages remplacés
src/components/sales/CountdownDeadline.tsx    ← NOUVEAU
src/components/sales/GuaranteeBlock.tsx       ← NOUVEAU
src/pages/SalesPage.tsx (ou page /offres)     ← intégration des 2 composants
```

Aucune autre page modifiée. Aucun changement backend, aucun changement de prix, aucune migration DB.

---

## Détails techniques

- Countdown : date cible en const `const DEADLINE = new Date('2026-05-18T23:59:00+02:00')`. Si `Date.now() > DEADLINE` → composant retourne `null`.
- Couleurs strictement via tokens existants (`bg-kdp-orange`, `text-foreground`, etc.) — respect charte Amazon KDP.
- Pas de localStorage, pas de tracking ajouté.
- Responsive mobile-first (le countdown passe en 2 lignes sous 640px).

## Hors scope (à voir plus tard si besoin)

- Vidéo démo 60s (besoin que tu fournisses la vidéo)
- PDF "ebook exemple gratuit" (besoin que tu fournisses le PDF)
- FAQ objections (à faire dans un 2e passage si le countdown ne suffit pas)
