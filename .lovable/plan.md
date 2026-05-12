
## Plan complet — Affiliation visible + kit de promo

### 1. Corriger le discours lifetime sur `/promo/affilie`
- Supprimer "récurrente", "abonnement", "par mois récurrent"
- Hero : "Gagnez 20,10€ par vente (paiement unique 67€ à vie)"
- Calculateur : "ventes par mois" → "revenus mensuels potentiels" (pas récurrent)
- FAQ : "sur la vente principale + bonus" au lieu de "abonnement"

### 2. Footer global du tunnel
- Dans `FunnelLayout.tsx`, ajouter lien discret "Programme d'affiliation — 30%" → `/promo/affilie`
- Visible sur toutes les pages `/promo/*`

### 3. Encart post-achat sur `/promo/merci`
- Bloc "Vous adorez EbookStudio ? Recommandez-le et gagnez 20€ par vente"
- CTA → `/promo/affilie`

### 4. Lien dans `/promo/decouverte`
- Petit lien footer "Vous êtes blogueur / créateur ? Devenez affilié (30%)"

### 5. Onglet Affiliation de `/promo/espace`
- Bouton "Voir / partager la page publique" → ouvre `/promo/affilie` dans nouvel onglet
- Bouton "Accéder au kit de promotion" → scrolle vers la nouvelle section sur `/promo/affilie`

### 6. Section "Kit de promotion" sur `/promo/affilie` (visible une fois connecté)

**a) Liens préfillés avec son `?ref=CODE`** (boutons "Copier") :
- Page de vente principale
- Page bonus
- Page formation

**b) Argumentaires prêts à copier** (3 onglets, copier-coller) :
- **Email** : objet + corps prêt
- **Post LinkedIn / Facebook** : 800 caractères
- **Tweet / X** : 280 caractères
- **Story Instagram / Reel** : script court

**c) Visuels** (placeholder pour cette étape — vrais visuels générés ensuite) :
- 3 vignettes 1200x630, 1080x1080, 1080x1920
- Bouton "Télécharger" (lien direct vers fichiers dans bucket Supabase)

**d) Mini-FAQ "réponses aux objections"** que l'affilié peut copier pour répondre à ses prospects (prix, garantie, support, formation).

## Découpage technique

| # | Fichier | Modification |
|---|---------|-------------|
| 1 | `src/pages/promo/PromoAffiliePage.tsx` | Réécrire copy lifetime + ajouter section Kit |
| 2 | `src/components/funnel/FunnelLayout.tsx` | Lien footer affiliation |
| 3 | `src/pages/promo/PromoMerciPage.tsx` | Encart post-achat |
| 4 | `src/pages/promo/PromoDecouvertePage.tsx` | Lien footer |
| 5 | `src/pages/promo/PromoEspacePage.tsx` | 2 boutons dans onglet Affiliation |

## Hors scope (étape suivante)
- Génération réelle des visuels via `imagegen`
- Email broadcast aux clients existants pour annoncer le programme
- Système d'auto-paiement des commissions PayPal

Je peux implémenter cela d'un seul coup.
