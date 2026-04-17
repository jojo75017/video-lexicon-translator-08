

## Diagnostic

L'utilisateur veut deux choses :
1. **Vérifier que le plan de lancement est conforme** (état actuel après tous les nettoyages réalisés)
2. **Produire un script vidéo de 3 minutes** pour le lancement

Avant de planifier, je dois vérifier l'état réel du projet : composants morts encore présents, fichiers hors charte restants, cohérence du tunnel de paiement, et chiffres de social proof.

## Vérification de conformité — État actuel

D'après les modifications récentes :

✅ **Fait**
- Systeme.io entièrement supprimé (edge function, données, UI)
- 18 composants sales mis aux couleurs de la charte (primary teal, accent, kdp-orange)
- Pricing clarifié : 67€ en avant, essai gratuit en mention secondaire
- Popups intrusifs retirés (ExitIntentPopup, SocialProofToast, ProgressEngagement, SpotsCounter)
- Domaine `ebookstudio.fr` connecté
- Vidéo `/videos/ebookstudio-offre-fondatrice.mp4` présente sur le serveur

⚠️ **Reste à faire pour être 100% prêt le 1er mai**

| Priorité | Élément | Action |
|---|---|---|
| 🔴 Haute | 13 fichiers encore hors charte (DemoPage, KdpRoiCalculator, SuccessGallery, TrustBadges, AuthorQuiz, HeroVideoTeaser, etc.) | Remplacer cyan/emerald/violet/dark: par primary/accent |
| 🔴 Haute | Incohérence chiffres social proof (47 vs 127 avis dans JSON-LD) | Aligner partout sur une seule série |
| 🟠 Moyen | 10 composants morts non importés (bloat bundle) | Suppression |
| 🟠 Moyen | HeroVideoTeaser pas intégré dans SalesPage | Ajouter `<HeroVideoTeaser />` après hero |
| 🟢 Test | Tunnel paiement end-to-end | `/offres` → PayPal → `/confirmation-paiement` → email + code EBK-XXXXXX |
| 🟢 Test | Cron `email-sequence-cron` actif | Vérifier les 5 emails J+0 à J+7 |

**Verdict** : Le plan est globalement conforme, mais il reste **3-4 heures de travail technique** + tests end-to-end pour être totalement prêt le 1er mai.

---

## Plan d'action proposé

### Partie A — Finalisation technique pré-lancement (à exécuter en mode default)

1. **Mise en charte des 13 fichiers restants** (DemoPage + composants live/social/trust)
2. **Harmonisation des chiffres** : choisir 47 ou 89 partout (JSON-LD, hero, CTA final, footer)
3. **Suppression des 10 composants morts** du dossier `src/components/sales/`
4. **Intégration de HeroVideoTeaser** dans SalesPage (juste après le hero principal)
5. **Test end-to-end** du tunnel : `/offres` → CTA 67€ → PayPal → confirmation → email + code → `/subscription` → `/ebook-planner`
6. **Vérification** du cron `email-sequence-cron`

### Partie B — Script vidéo de lancement 3 minutes

Création du fichier `SCRIPT_VIDEO_LANCEMENT_1ER_MAI.md` structuré ainsi :

**[0:00 – 0:20] HOOK** — Accroche choc : "Publier un livre sur Amazon KDP en 47 minutes au lieu de 6 mois — voici l'outil que personne n'a vu venir."

**[0:20 – 0:50] LE PROBLÈME** — Coût d'une équipe édito (rédacteur, correcteur, designer = 500-10 000€), temps perdu, peur de l'IA détectable.

**[0:50 – 1:30] LA SOLUTION** — EbookStudio Pro : 15 agents IA (P1-P15), Gemini 3 Flash, Imagen 3 pour les couvertures, audiobooks Azure, anti-détection IA.

**[1:30 – 2:00] PREUVES & RÉSULTATS** — Démos écran : génération chapitre, score qualité, export KDP, couverture IA en live.

**[2:00 – 2:30] L'OFFRE** — 67€ accès à vie (vs 147€), votre clé Gemini gratuite, 30 centimes par ebook, garantie 30 jours.

**[2:30 – 2:50] BONUS LANCEMENT** — Disponible le 1er mai, parrainage qui rembourse l'accès en 3-4 filleuls, communauté privée.

**[2:50 – 3:00] CTA FINAL** — "Lien dans la description, 67€ accès à vie, premier ebook publié ce soir."

Inclura aussi : tableau des points-clés à afficher à l'écran avec timing, et checklist de tournage (capture d'écran à préparer pour chaque séquence).

---

## Question avant exécution

Voulez-vous que j'exécute :
- **A seul** (finalisation technique uniquement)
- **B seul** (script vidéo uniquement, en mode lecture sans toucher au code)
- **A + B** (les deux, dans l'ordre A puis B)

Si vous ne répondez pas, je fais **A + B** par défaut (le script vidéo sera créé en dernier).

## Fichiers concernés
- 13 fichiers à mettre en charte (DemoPage.tsx + 12 composants sales)
- 10 fichiers à supprimer (composants morts)
- `src/pages/SalesPage.tsx` (intégration HeroVideoTeaser + harmonisation chiffres)
- Nouveau : `SCRIPT_VIDEO_LANCEMENT_1ER_MAI.md`

