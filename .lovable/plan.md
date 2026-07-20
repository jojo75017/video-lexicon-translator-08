## Constat

Les séquences actuelles (`email-sequence-cron`) tournent toujours avec l'ancien discours :
- Prix **67€** (et **147€** barré) sur toutes les étapes des 3 séquences
- Cadeau de bienvenue = **10 Niches PDF 40 pages**
- Ton "prix de lancement temporaire"

Or aujourd'hui : offre à **59€** (jusqu'à nouvel ordre, peut s'arrêter), et tu veux offrir **5 niches** en bienvenue + le **guide EbookStudio**.

Bonne nouvelle, les 2 PDF sont déjà dans le projet :
- `public/lead-magnets/5-niches-rentables-2026.pdf` ✅
- `public/lead-magnets/guide-generateur-ebookstudio-principal.pdf` ✅

## Mon avis (ce que je te recommande)

**1. Offrir les 2 PDF dès l'email 1, pas un seul.**
Le guide EbookStudio explique *ce que fait l'outil* (utile pour convertir), les 5 niches donnent une *valeur immédiate concrète*. Combinés = "je t'aide tout de suite ET je te montre l'outil". Meilleur taux d'ouverture des mails suivants.

**2. Garder 5 niches (pas 10).**
Tu as déjà offert "10 niches" comme bonus VIP aux cliqueurs récents. Redonner 10 à tout le monde dévalue ce bonus. **5 niches en bienvenue + 10 niches réservées aux cliqueurs/acheteurs** = hiérarchie claire.

**3. Passer les 3 séquences à 59€, sans barré artificiel.**
Ton offre actuelle est *déjà* à 59€ sur `/offres`. Barrer 197€ → 59€ dans un email d'automation qui tourne pendant des semaines créerait de la dissonance quand le prospect arrive sur la page. Je propose : « **59€ à vie — offre limitée, peut s'arrêter d'un jour à l'autre** » (cohérent avec ton dernier email cliqueurs).

**4. Ne pas toucher aux prospects déjà en séquence.**
Les 5 personnes actives (`promo_funnel` steps 1-3) continuent à recevoir la suite avec les nouveaux templates automatiquement dès la prochaine étape (le cron lit les templates à l'envoi). Aucune action manuelle requise.

## Plan d'action

### Séquence `promo_funnel` (6 emails sur 14 jours)
| Étape | J+ | Sujet (nouveau) |
|---|---|---|
| 0 | 0 | 🎁 Vos 2 cadeaux : Guide EbookStudio + 5 Niches KDP rentables 2026 |
| 1 | 1 | Comment j'écris un livre complet en 2 heures (démo) |
| 2 | 3 | 150 pages en 2 jours — mon dernier résultat KDP |
| 3 | 5 | "C'est trop beau pour être vrai ?" Ma réponse honnête |
| 4 | 7 | ⏰ Offre 59€ à vie — elle peut s'arrêter d'un jour à l'autre |
| 5 | 14 | 🎯 Dernière relance : 59€ + garantie 30 jours |

### Séquence `expat_funnel` (6 emails)
Même refonte, ton "expatrié" conservé, prix mis à jour à 59€. Le PDF cadeau reste "publier depuis l'étranger" (existant).

### Séquence `expat_reactivation` (2 emails de relance)
Sujets ajustés à 59€.

### Fichier modifié
- `supabase/functions/email-sequence-cron/index.ts` : réécriture des `PROMO_STEPS/PROMO_EMAILS`, `EXPAT_STEPS/EXPAT_EMAILS`, `EXPAT_REACT_*`. Bouton unique « Je profite de l'offre 59€ » vers `https://www.ebookstudio.fr/offres`. Ajout des 2 liens de téléchargement (5 niches + guide EbookStudio) dans l'email 0.
- Déploiement de la fonction.

### Ce que je NE fais pas (sauf si tu dis oui)
- ❌ Renvoyer manuellement l'email 1 aux prospects déjà passés par l'étape 0 (ils l'ont déjà reçu avec l'ancien contenu). Si tu veux qu'ils reçoivent les 2 nouveaux PDF, je peux créer un envoi ponctuel séparé.
- ❌ Modifier les emails "one-shot" déjà envoyés (openers, cliqueurs) — c'est déjà fait à 59€.
- ❌ Toucher aux prix affichés sur le site (déjà à 59€).

## Questions rapides
1. **OK pour 5 niches en bienvenue + 10 niches réservées aux cliqueurs/acheteurs** ? (Ma reco)
2. **Renvoyer les 2 nouveaux PDF** aux ~15 prospects actuellement en séquence (qui n'ont eu que les anciens) ? Oui/Non.
3. Sur le CTA email, on garde **« 59€ à vie »** sec, ou tu veux **« 59€ au lieu de 197€ »** malgré la dissonance avec la page ?
