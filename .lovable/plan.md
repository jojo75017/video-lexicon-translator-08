
# Plan final V3 — derniers points à valider avant test

Objectif : passer en revue tout ce qui doit être vérifié / corrigé avant que tu testes la V3 de bout en bout. Rien de nouveau à créer — uniquement du verrouillage, du nettoyage et de la validation.

---

## 1. Verrouillage & mode contemplation
- Confirmer `V3_LAUNCH_UNLOCKED = false` dans `src/config/v3Launch.ts` (état actuel : OK).
- Re-tester que **admin bypass** fonctionne sur toutes les routes V3 (les corrections récentes de `V3LockedGate` et `V3ContemplationMode`).
- Vérifier les routes autorisées en mode contemplation : `/v3`, `/v3/offre`, `/v3/pourquoi`, `/v3/script-heygen`, `/v3/nouveautes`. Ajouter/retirer si besoin.
- Contrôler qu'aucun lien du header/sidebar ne provoque de toast "contemplation" pour un admin connecté.

## 2. Page de vente `/v3/offre` (passerelle V2 → V3)
- Relire le hero, la section "détails de l'offre" et la FAQ pour vérifier le message : "V2 tout de suite à tarif avantageux, V3 offerte le 1er octobre".
- Vérifier que **tous les CTA** pointent bien vers `V2_PURCHASE_LINK` (trafic-affiliation) et non vers un ancien lien Stripe.
- Vérifier le compte à rebours (`V3_LAUNCH_DATE_ISO`) : 1er octobre 2026, 08:00 Europe/Paris.
- Formulaire pré-inscription → `funnel_leads` avec `lead_magnet = 'v3_launch_notify'` : tester un envoi.

## 3. Emails & prospects
- Vérifier qu'il ne reste **0 destinataire** en attente de correction pour l'ancien template cassé.
- Confirmer que `track-email-click` redirige encore `ebookstudio.fr/v3/*` vers le domaine Lovable fonctionnel (test curl).
- S'assurer qu'aucune future séquence n'utilise encore l'URL `ebookstudio.fr/v3/...` en dur (grep dans `supabase/functions`).

## 4. Paiements
- PayPal Live : ID/Secret/Webhook ID enregistrés → faire **un vrai test 1 €** via `V3ForfaitsPage` en mode admin.
- Stripe : vérifier que PayPal est activé comme méthode dans le dashboard Stripe (côté user, pas côté code).
- Bouton "Tester PayPal 1 €" toujours réservé aux admins.

## 5. Parcours de création (routes admin uniquement pendant contemplation)
- `/v3/create` : wizard 4 étapes, sauvegarde `ebook_projects`, reprise brouillon.
- `/v3/livres/kids` : livre illustré maternelle (couverture pleine page, pas de bandes).
- `/v3/livres/univers` : sagas multi-volumes.
- `/v3/livres/bd`, `/documentaire`, `/atlas`, `/cuisine`, `/voyage` : gating plan Éditeur pour la version Pro.

## 6. Outils gratuits & recherche
- `/v3/outils/offerts` : 4 outils marketing accessibles à tous.
- `/v3/recherche` : hub KDP Pilot + Espion ASIN + catégories + keywords.
- Vérifier bannière Firecrawl si la clé n'est pas active.

## 7. Communauté & contenu
- `/v3/communaute` : 220 posts seed présents, création/réponse fonctionnelle.
- `/v3/nouveautes` : liens vers Royalties, Humanizer, Mockup, Audiobook, Editor.
- `/v3/script-heygen` : version 15 sections à jour.
- Sidebar : ordre final validé (Recherche KDP en haut, Blog externe avec badge, Pourquoi, Offre).

## 8. Nettoyage final
- Passer `bun run build` (ou équivalent) mentalement pour repérer les imports orphelins signalés récemment.
- Vérifier qu'aucune page supprimée (`V3SpecialBookPage`, etc.) n'est encore référencée dans les routes.
- Meta `<title>` / `<meta description>` sur `/v3/offre` et `/v3/pourquoi` cohérentes avec la campagne email.

## 9. Sécurité & monitoring
- Lancer un `security--run_security_scan` avant publication.
- Vérifier RLS/GRANT sur les tables récentes (`funnel_leads`, `paypal_subscriptions`, `forum_*`).

## 10. Checklist Jour J (1er octobre) — à ne PAS exécuter maintenant
1. Basculer `V3_LAUNCH_UNLOCKED = true`.
2. Republier.
3. Envoyer les emails de lancement (V2 + prospects).
4. Surveiller `edge_function_logs` + premiers checkouts.

---

## Détails techniques
- Flag unique de bascule : `src/config/v3Launch.ts`.
- Gate composant : `src/components/v3/V3LockedGate.tsx` (redirige vers `/v3/offre`).
- Interception clic globale : `src/components/v3/V3ContemplationMode.tsx`.
- Redirection anti-404 email : `supabase/functions/track-email-click/index.ts`.
- Page pivot : `src/pages/v3public/V3OffrePage.tsx`.

---

## Livrables de ce plan
Aucun développement neuf — uniquement :
1. Une passe de vérification/validation guidée sur les 9 axes ci-dessus.
2. Les micro-corrections détectées pendant la revue (imports morts, textes, liens résiduels).
3. Un go/no-go clair pour la bascule du 1er octobre.

Dis-moi si tu veux que je démarre la revue axe par axe (je peux commencer par le §1 verrouillage + §2 page de vente, qui sont les plus critiques avant tes tests).
